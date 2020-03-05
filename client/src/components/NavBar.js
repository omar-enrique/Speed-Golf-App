import React from 'react';
import AppMode from '../AppMode.js';

export default class NavBar extends React.Component {
    constructor (props) {
        super(props);
    }

    handleMenuBtnClick = () => {
        if (this.props.mode === AppMode.ADD_DATA || 
            this.props.mode === AppMode.EDIT_DATA) {
            this.props.changeMode(AppMode.TABLE);
        } else if (this.props.mode !== AppMode.LOGIN) {
            this.props.toggleMenuOpen();
        }
    }

    getMenuBtnIcon = () => {
        if (this.props.mode === AppMode.ADD_DATA ||
            this.props.mode === AppMode.EDIT_DATA)
            return "fa fa-arrow-left";
        if (this.props.menuOpen)
            return "fa fa-times";
        return "fa fa-bars";
    }

    render() {
        return (
            <div className="navbar">  
                <span className="navbar-items">
                <button className={"sidemenu-btn" + (this.props.mode === AppMode.LOGIN ?
                " invisible" : " visible")} onClick={this.handleMenuBtnClick}>
                    <span id="sidemenu-btn-icon" 
                    className={"sidemenu-btn-icon " + this.getMenuBtnIcon()}>
                    </span>
                </button>
                <img src="http://tiny.cc/sslogo" alt="Speed Score Logo" height="38px"
                width="38px" />
                <span id="topBarTitle" className="navbar-title">
                    &nbsp;{this.props.title}
                </span>
                </span>
            </div>
        ); 
    }
}