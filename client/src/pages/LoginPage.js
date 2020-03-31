import React from 'react';
import AppMode from '../AppMode';

export default class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.emailInputRef = React.createRef();
        this.passwordInputRef = React.createRef();

        this.state = {  
                        loginBtnIcon: "fa fa-sign-in",
                        loginBtnLabel: "Log In",
                        githubIcon: "fa fa-github",
                        githubLabel: "Sign in with GitHub"
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
            data[this.emailInputRef.current.value] = {
                rounds: {}, 
                roundCount: 0
            };
            localStorage.setItem("speedgolfUserData",JSON.stringify(data));
        }
        else if (!data.hasOwnProperty(this.emailInputRef.current.value)) {
            data[this.emailInputRef.current.value] = {
                rounds: {}, 
                roundCount: 0
            };
            localStorage.setItem("speedgolfUserData",JSON.stringify(data));
        }
        
        this.setState({loginBtnIcon: "fa fa-sign-in",
                    loginBtnLabel: "Log In"});
        //Set current user
        
        this.props.setUserId(this.emailInputRef.current.value);
        //Trigger switch to FEED mode (default app landing page)
        this.props.changeMode(AppMode.TABLE);
        console.log('LOGGED IN', AppMode.TABLE);
    }

    handleLoginSubmit = (event) => {
        event.preventDefault();
        this.setState({loginBtnIcon: "fa fa-spin fa-spinner",
                        loginBtnLabel: "Logging In..."});
        //Initiate spinner for 1 second
        setTimeout(this.handleLogin,1000);
    }

    componentDidMount() {
        this.emailInputRef.current.focus();
    }

    render() {
        return (
            <div id="login-mode-div" className="padded-page">
                <center>
                    <h1>Login Page</h1>
                    <form id="loginInterface" onSubmit={this.handleLoginSubmit}>
                        <label htmlFor="emailInput" style={{ padding: 0, fontSize: 24 }}>
                            Email:
                            <input className="form-control login-text" type="email" placeholder="Enter Email Address"
                                id="emailInput" pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
                                ref={this.emailInputRef} required={true} />
                        </label>
                        <p />
                        <label htmlFor="passwordInput" style={{ padding: 0, fontSize: 24 }}>
                            Password: 
                            <input className="form-control login-text" ref={this.passwordInputRef} type="password" placeholder="Enter Password" pattern="[A-Za-z0-9!@#$%^&*()_+\-]+" required={true} />
                        </label>
                        <p className="bg-danger" id="feedback" style={{ fontSize: 16 }} />
                        <button type="submit" className="btn-color-theme btn btn-primary btn-block login-btn">
                            <span className={this.state.loginBtnIcon}/>
                                &nbsp;{this.state.loginBtnLabel}
                        </button>
                        <br />
                        <button type="button" className="btn btn-github"
                            onClick={() => this.handleOAuthLoginClick("github")}>
                            <span className={this.state.githubIcon}></span>&nbsp;
                            {this.state.githubLabel}
                        </button>
                        <p>
                            <i>Version CptS 489 Sp20</i>
                        </p>
                        <p>
                            <i>© 2020 Professor of Speedgolf. All rights reserved.</i>
                        </p>
                    </form>
                </center>
            </div>
        );
    }
}