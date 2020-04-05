import React from 'react';
import ReactDOM from 'react-dom';

import './styles/main.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap-social/bootstrap-social.css';

import AppMode from './AppMode';

import NavBar from './components/NavBar';
import SideMenu from './components/SideMenu';
import ModeBar from './components/ModeBar';
import FloatingButton from './components/FloatingButton';

import LoginPage from './pages/LoginPage';
import AddDataPage from './pages/AddDataPage';
import DataPage from './pages/Data';

// import RoundForm from './RoundForm';

const modeTitle = {};
modeTitle[AppMode.LOGIN] = "Welcome to SpeedScore";
modeTitle[AppMode.TABLE] = "Data Table Page";
modeTitle[AppMode.ADD_DATA] = "Add Data Page";
modeTitle[AppMode.EDIT_DATA] = "Edit Data Page";

const modeToPage = {};
modeToPage[AppMode.LOGIN] = LoginPage;
modeToPage[AppMode.TABLE] = DataPage;
modeToPage[AppMode.ADD_DATA] = DataPage;
modeToPage[AppMode.EDIT_DATA] = DataPage;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {mode: AppMode.LOGIN, menuOpen: false, showAbout: false, authenticated: false, user: {}};
    }

    componentDidMount() {
        window.addEventListener("click",this.handleClick);
        if (!this.state.authenticated) { 
            //Use /auth/test route to re-test authentication and obtain user data
            fetch("/auth/test")
                .then((response) => response.json())
                .then((obj) => {
                    if (obj.isAuthenticated) {
                        let data = JSON.parse(localStorage.getItem("speedgolfUserData"));
                        if (data == null) {
                            data = {}; //create empty database (localStorage)
                        }
                        if (!data.hasOwnProperty(obj.user.id)) {
                            //create new user with this id in database (localStorage)
                            data[obj.user.id] = {
                                accountInfo: {
                                    provider: obj.user.provider,
                                    password: '',
                                    securityQuestion: '',
                                    securityAnswer: ''
                                },
                                rounds: {}, 
                                roundCount: 0
                            };
                            //Commit to localStorage:
                            localStorage.setItem("speedgolfUserData",JSON.stringify(data));
                        } 
                        
                        //Update current user
                        this.setState({
                            authenticated: true,
                            user: obj.user,
                            mode: AppMode.TABLE //We're authenticated so can get into the app.
                        });
                    }
                })
        }
    }

    componentWillUnmount() {
        window.removeEventListener("click",this.handleClick);
    }

    handleChangeMode = (newMode) => {
        this.setState({mode: newMode});
    }

    setUserId = (Id) => {
        this.setState({userId: Id});
    }

    openMenu = () => {
        this.setState({menuOpen : true});
    }
        
    closeMenu = () => {
        this.setState({menuOpen : false});
    }
        
    toggleMenuOpen = () => {
        console.log('TOGGLE MENU');
        console.log(this.state.menuOpen);
        this.setState(prevState => ({menuOpen: !prevState.menuOpen}));
        console.log(this.state.menuOpen);
    }

    handleClick = (event) => {
        if (this.state.menuOpen) {
            this.closeMenu();
        }
        event.stopPropagation();
    }

    setUser = (userObj) => {
        this.setState({user: userObj});
    }
    
    //setAuthenticated -- Given auth (true or false), update authentication state.
    setAuthenticated = (auth) => {
        this.setState({authenticated: auth});
    }

    toggleAbout = () => {
        this.setState(prevState => ({showAbout: !prevState.showAbout}));
    }

    renderAbout = () => {
        console.log('render about');
        return (
          <div className="modal" role="dialog">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title"><b>About SpeedScore</b>
                    <button className="close-modal-button" onClick={this.toggleAbout}>
                      &times;</button>
                  </h3>
                </div>
                <div className="modal-body">
                  <img
                  src="https://dl.dropboxusercontent.com/s/awuwr1vpuw1lkyl/SpeedScore4SplashLogo.png"
                  height="200" width="200"/>
                  <h3>The World's First and Only Suite of Apps for
                  Speedgolf</h3>
                  <p>Version CptS 489 Sp20, Build W06C2 (React)<br/>
                  &copy; 2017-20 The Professor of Speedgolf. All rights
                  reserved.
                  </p>
                  <div style={{textAlign: "left"}}>
                    <p>SpeedScore apps support</p>
                    <ul>
                    <li>live touranment scoring (<i>SpeedScore Live&reg;</i>)</li>
                    <li>tracking personal speedgolf rounds and sharing results
                    (<i>SpeedScore Track&reg;</i>)</li>
                    <li>finding speedgolf-friendly courses, booking tee times, and
                    paying to play speedgolf by the minute (<i>SpeedScore
                    Play&reg;</i>)</li>
                    </ul>
                    <p>SpeedScore was first developed by Dr. Chris Hundhausen,
                    associate professor of computer science at Washington State
                    University and the <i>Professor of Speedgolf</i>, with support
                    from Scott Dawley, CEO of Speedgolf USA, LLC. It leverages
                    Google server-side technologies.</p>
                    <p>For more information on SpeedScore, visit <a
                    href="http://speedscore.live" target="_blank">SpeedScore's web
                    site</a>. For more information on speedgolf, visit <a
                    href="http://playspeedgolf.com"
                    target="_blank">playspeedgolf.com</a> and <a
                    href="http://usaspeedgolf.com" target="_blank">Speedgolf
                    USA</a>.</p>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary btn-color-theme"
                    onClick={this.toggleAbout}>OK</button>
                  </div>
              </div>
            </div>
          </div>
        );
    }

    render() {
        const ModePage = modeToPage[this.state.mode];
        console.log('SHOW ABOUT', this.state.showAbout);
        return (
            <div onClick={this.handleClick}>
                <NavBar title={modeTitle[this.state.mode]} mode={this.state.mode}
                    changeMode={this.handleChangeMode}
                    menuOpen={this.state.menuOpen}
                    toggleMenuOpen={this.toggleMenuOpen}/>
                <SideMenu mode={this.state.mode}
                    menuOpen={this.state.menuOpen}
                    changeMode={this.handleChangeMode}
                    showAbout={this.toggleAbout}
                    user={this.state.user}
                    setUser={this.setUser}/>
                <ModeBar mode={this.state.mode}
                    changeMode={this.handleChangeMode}
                    menuOpen={this.state.menuOpen}
                    />
                <ModePage 
                    mode={this.state.mode} 
                    menuOpen={this.state.menuOpen}
                    changeMode={this.handleChangeMode}
                    user={this.state.user}/>
                {this.state.showAbout ? this.renderAbout() : null}
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));