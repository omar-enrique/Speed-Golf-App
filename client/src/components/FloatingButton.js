import React from 'react';

export default class FloatingButton extends React.Component {
    constructor (props) {
        super(props);
    }

    render() {
        return(
          <div>
            <a className="floatbtn" onClick={(this.props.menuOpen ? null : 
               this.props.handleClick)}>
              <span className={"floatbtn-icon " + this.props.icon}></span>
            </a>
          </div>  
        );
    }
}