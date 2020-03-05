import React from 'react';
import AppMode from '../AppMode';

export default class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.emailInputRef = React.createRef();
        this.passwordInputRef = React.createRef();

        this.state = {loginBtnIcon: "fa fa-sign-in",
                      loginBtnLabel: "Log In"}
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
                        <a role="button" className="login-btn">
                            <img src="https://drive.google.com/uc?export=view&id=1YXRuG0pCtsfvbDSTzuM2PepJdbBpjEut" />
                        </a>
                        <a role="button" className="login-btn">
                            <img src="https://drive.google.com/uc?export=view&id=1ZoySWomjxiCnC_R4n9CZWxd_qXzY1IeL" />
                        </a>
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