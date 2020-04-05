import React from 'react';
import AppMode from '../AppMode';

export default class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.userNameInputRef = React.createRef();
        this.passwordInputRef = React.createRef();

        this.createUsernameRef = React.createRef();
        this.createPasswordRef = React.createRef();
        this.securityQuestionRef = React.createRef();
        this.securityAnswerRef = React.createRef();

        this.state = {  
            loginBtnIcon: "fa fa-sign-in",
            loginBtnLabel: "Log In",
            githubIcon: "fa fa-github",
            githubLabel: "Login with Github",
            loginShow: true,
            createShow: false
        }
    }

    //handleOAuthLogin -- Callback function that initiates contact with OAuth
    //provider

    handleOAuthLogin = (provider) => {
        window.open(`/auth/${provider}`,"_self");
    }
        
    //handleOAuthLoginClick -- Called whent the user clicks on button to
    //authenticate via a third-party OAuth service. The name of the provider is
    //passed in as a parameter.
    handleOAuthLoginClick = (provider) => {
        this.setState({[provider + "Icon"] : "fa fa-spin fa-spinner",
        [provider + "Label"] : "Connecting..."});
        setTimeout(() => this.handleOAuthLogin(provider),0);
    }

    handleLogin = () => {
        //Stop spinner
        let data = JSON.parse(localStorage.getItem("speedgolfUserData"));
        //Create fresh user data object for new user
        if (data == null) {
            data = {}; //create empty data object
            data[this.userNameInputRef.current.value] = {
                rounds: {}, 
                roundCount: 0
            };
            localStorage.setItem("speedgolfUserData",JSON.stringify(data));
        }
        else if (!data.hasOwnProperty(this.userNameInputRef.current.value)) {
            data[this.userNameInputRef.current.value] = {
                rounds: {}, 
                roundCount: 0
            };
            localStorage.setItem("speedgolfUserData",JSON.stringify(data));
        }
        
        this.setState({loginBtnIcon: "fa fa-sign-in",
                    loginBtnLabel: "Log In"});
        //Set current user
        
        this.props.setUserId(this.userNameInputRef.current.value);
        //Trigger switch to FEED mode (default app landing page)
        this.props.changeMode(AppMode.TABLE);
        console.log('LOGGED IN', AppMode.TABLE);
    }

    handleLoginSubmit = async (event) => {
        event.preventDefault();
        this.setState({loginBtnIcon: "fa fa-spin fa-spinner",
                        loginBtnLabel: "Logging In..."});

        const url = "auth/login?username=" + this.userNameInputRef.current.value +
            "&password=" + this.passwordInputRef.current.value;
        const res = await fetch(url, {method: 'POST'});

        if (res.status == 200) { //successful login!
            window.open("/","_self");
        } 

        else { //Unsuccessful login
            const resText = await res.text();
            this.setState({loginBtnIcon: "fa fa-sign-in",
            loginBtnLabel: "Log In",
            loginMsg: resText}, () => setTimeout(this.hideErrorMsg,3000));
        }

        //Initiate spinner for 1 second
        setTimeout(this.handleLogin,1000);
    }

    handleCreateAccount = async (event) => {
        event.preventDefault();
        const url = '/users/' + this.createUsernameRef.current.value;
        const accountInfo = {password: this.createPasswordRef.current.value,
                           securityQuestion: this.securityQuestionRef.current.value,
                           securityAnswer: this.securityAnswerRef.current.value};
        const res = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            method: 'POST',
            body: JSON.stringify(accountInfo)
        }); 
        if (res.status == 200) {
            alert("Your account has been succesfully created! Please enter your username and password again to login to your new account.");
            this.returnToLogin();
        } 
        else {
            //Grab textual error message
            const resText = await res.text();
            alert(resText); //most likely the username is already taken
        }
    }

    handleLookUpAccount = async (event) => {
        event.preventDefault();
        let url = "/users/" + this.accountEmailRef.current.value;
        let res = await fetch(url, {method: 'GET'});
        let body;
        if (res.status != 200) {
            alert("Sorry, there is no account associated with that email address.");
            this.accountEmailRef.current.focus();
            return;
        }
        
        body = await res.json();
        //if here, account exists -- user account info and push to state vars
        this.setState({resetEmail: this.accountEmailRef.current.value,
        resetQuestion: body.securityQuestion,
        resetAnswer: body.securityAnswer,
        showLookUpAccountDialog: false,
        showSecurityQuestionDialog: true});
        this.userNameInputRef.current.value = ""; //clear out field
    }

    handleSecurityQuestionResponse = async(event) => {
        event.preventDefault();

        if (this.securityAnswerRef.current.value != this.state.resetAnswer) {
            alert("Sorry, that is not the correct answer to the security question.");
            this.securityAnswerRef.current.select();
            return;
        }

        this.setState({showSecurityQuestionDialog: false,
        showPasswordResetDialog: true});
        this.securityAnswerRef.current.value = ""; //clear out field
    }

    handleResetPassword = async(event) => {
        event.preventDefault();
        
        if (this.resetPasswordRef.current.value != this.resetPasswordRepeatRef.current.value) {
            alert("Sorry, The passwords you entered do not match. Please try again.");
            this.resetPasswordRepeatRef.current.select();
            return;
        }
        
        const url = '/users/' + this.state.resetEmail;
        const resetInfo = {password: this.resetPasswordRef.current.value};
        const res = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(resetInfo)
        });
        
        const text = await res.text();
        alert(text);
        this.resetPasswordRef.current.value = "";
        this.resetPasswordRepeatRef.current.value = "";
        this.setState({showPasswordResetDialog: false});
    }

    hideErrorMsg = () => {
        this.userNameInputRef.current.value = "";
        this.passwordInputRef.current.value = "";
        this.setState({loginMsg: ""});
    }

    componentDidMount() {
        this.userNameInputRef.current.focus();
    }

    showCreateAccount = () => {
        this.setState({
            createShow: true,
            loginShow: false
        });

        this.createUsernameRef.current.value = this.userNameInputRef.current.value ? this.userNameInputRef.current.value : "";
        this.createPasswordRef.current.value = "";
        this.securityQuestionRef.current.value = "";
        this.securityAnswerRef.current.value = "";
    }

    returnToLogin = () => {
        this.userNameInputRef.current.value = "";
        this.passwordInputRef.current.value = "";
        this.setState({
            createShow: false,
            loginShow: true
        });
    }

    forgotPassword = () => {
        alert('Sorry! In the interest of time, this will remain unimplemented for now.');
    }

    render() {
        return (
                <div id="login-mode-div" className="login-page">
                    <div className={"login-form " + (this.state.loginShow ? "" : "create-state")}>
                        <img className="speedgolf-logo" src="http://tiny.cc/sslogo" />
                        
                        <h1 className="form-heading">Welcome to SpeedScore</h1>
                        <form id="loginInterface" className="login-interface" onSubmit={this.handleLoginSubmit}>
                            <div className="input-text">
                                <input className="form-control" placeholder="Enter Username"
                                    id="usernameInput"
                                    ref={this.userNameInputRef} required={true} />
                            </div>
                            <p />
                            <div className="input-text">
                                <input className="form-control" ref={this.passwordInputRef} type="password" placeholder="Enter Password" pattern="[A-Za-z0-9!@#$%^&*()_+\-]+" required={true} />
                            </div>
                            <span className="forgot-password" onClick={this.forgotPassword}>Forgot Password?</span>
                            <button type="submit" className="btn-color-theme btn btn-primary btn-block login-btn">
                                <span className={this.state.loginBtnIcon}/>
                                    &nbsp;{this.state.loginBtnLabel}
                            </button>
                            <span className="clear-btn" onClick={this.showCreateAccount}>Create Account</span>
                            <button type="button" className="btn btn-github"
                                onClick={() => this.handleOAuthLoginClick("github")}>
                                <span className={this.state.githubIcon}></span>&nbsp;
                                {this.state.githubLabel}
                            </button>
                            <button type="button" className="btn btn-facebook"
                                onClick={() => this.handleOAuthLoginClick("facebook")}>
                                <span className="fa fa-facebook"></span>&nbsp;
                                Login with Facebook
                            </button>
                            <p>
                                <i>Version CptS 489 Sp20</i>
                            </p>
                            <p>
                                <i>© 2020 Professor of Speedgolf. All rights reserved.</i>
                            </p>
                        </form>
                    </div>
                    <div className={"login-form " + (this.state.createShow ? "" : "login-state")}>
                        <h1 className="form-heading">Create an Account</h1>
                        <form id="createInterface" className="login-interface" onSubmit={this.handleCreateAccount}>
                            <div className="input-text">
                                <input className="form-control" placeholder="Enter Username"
                                    id="createUsernameInput"
                                    ref={this.createUsernameRef} required={true} />
                            </div>
                            <p />
                            <div className="input-text">
                                <input className="form-control" ref={this.createPasswordRef} type="password" placeholder="Enter Password" pattern="[A-Za-z0-9!@#$%^&*()_+\-]+" required={true} />
                            </div>
                            <p />
                            <div className="input-text">
                                <input className="form-control" placeholder="Enter Security Question"
                                    id="securityQuestion"
                                    ref={this.securityQuestionRef} required={true} />
                            </div>
                            <p />
                            <div className="input-text">
                                <input className="form-control" placeholder="Enter Security Answer"
                                    id="securityAnswer"
                                    ref={this.securityAnswerRef} required={true} />
                            </div>
                            <p />
                            <button type="submit" className="btn-color-theme btn btn-primary btn-block login-btn">
                                Sign Up
                            </button>
                            <span className="clear-btn" onClick={this.returnToLogin}>Go Back</span>
                        </form>
                    </div>
                </div>
        );
    }
}