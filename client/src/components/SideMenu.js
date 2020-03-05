import React from 'react';
import AppMode from '../AppMode';

export default class SideMenu extends React.Component {
    constructor (props) {
        super(props);
    }

    renderModeMenuItems = () => {
        switch (this.props.mode) {
            case AppMode.FEED:
                return(
                <div>
                    <a className="sidemenu-item">
                        <span className="fa fa-users"></span>&nbsp;Followed Users
                    </a>
                    <a className="sidemenu-item">
                        <span className="fa fa-search"></span>&nbsp;Search Feed
                    </a>
                </div>
                );
                break;
            
            case AppMode.ROUNDS:
                return(
                <div>
                    <a className="sidemenu-item">
                        <span className="fa fa-plus"></span>&nbsp;Log New Round
                    </a>
                    <a className="sidemenu-item">
                        <span className="fa fa-search"></span>&nbsp;Search Rounds
                    </a>
                </div>
                );
            
            break;
            
            case AppMode.COURSES:
                return(
                <div>
                    <a className="sidemenu-item">
                        <span className="fa fa-plus"></span>&nbsp;Add a Course
                    </a>
                    <a className="sidemenu-item">
                        <span className="fa fa-search"></span>&nbsp;Search Courses
                    </a>
                </div>
                );
            
            default:
                return null;
        }
    }

    render () {
        return (
        <div className= {"sidemenu " +
            (this.props.menuOpen ? "sidemenu-open" : "sidemenu-closed")} >
            {/* SIDE MENU TITLE */}
            <div className="sidemenu-title">
                <img src='http://tiny.cc/chrisprofilepic' height='50' width='50' />
                <span className="sidemenu-userID">&nbsp;{this.props.userId}</span>
            </div>

            {/* MENU CONTENT */}
            {/*Mode-based menu items */}
            {/* {this.renderModeMenuItems()} */}
            <a className="sidemenu-item" onClick={this.props.showAbout}>
                <span className="fa fa-info-circle"></span>&nbsp;About</a>

            <a className="sidemenu-item" onClick={() => this.props.changeMode(AppMode.LOGIN)}>
                <span className="fa fa-sign-out"></span>&nbsp;Log Out</a>
        </div>
        );
    }
}