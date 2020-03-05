import React from 'react';
import AppMode from '../AppMode.js';

export default class ModeBar extends React.Component {
    constructor (props) {
        super(props);
    }

    handleModeBtnClick = (newMode) => {
        if (this.props.mode != newMode) {
            this.props.changeMode(newMode);
        }
    }

    render () {
        return (
            <div id ="bottomBar" className={"modebar" + (this.props.mode === AppMode.LOGIN ?
                " invisible" : " visible")}>
                <a className={"modebar-btn" + (this.props.mode === AppMode.TABLE ? " modebar-item-selected" : "")}
                    onClick={this.props.menuOpen ? null :
                        () => this.handleModeBtnClick(AppMode.TABLE)}>
                    <span className="modebar-icon fa fa-th-list"></span>
                    <span className="modebar-text">Data Table Mode</span>
                </a>
            </div>
        );
    }
}