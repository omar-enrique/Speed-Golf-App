import React from 'react';
import AppMode from '../AppMode';
import AddDataPage from './AddDataPage';
import DataTablePage from './DataTablePage';
import FloatingButton from '../components/FloatingButton';

export default class DataPage extends React.Component {
    constructor(props) {
        super(props);
        let data = JSON.parse(localStorage.getItem("speedgolfUserData")); 
        console.log(this.props.user.id);
        this.state = {
			rounds: data[this.props.user.id].rounds,
			roundCount: data[this.props.user.id].roundCount,
			deleteId: "",
			editId: ""
		};     
    }

    addRound = (newData) => {
        console.log('ADD ROUND', newData);
        let data = JSON.parse(localStorage.getItem("speedgolfUserData"));
        let newRounds = this.state.rounds;
        newData.roundNum = this.state.roundCount + 1;
        newRounds[this.state.roundCount + 1] = newData;
        data[this.props.user.id].rounds = newRounds;
        data[this.props.user.id].roundCount = this.state.roundCount + 1;
        localStorage.setItem("speedgolfUserData",JSON.stringify(data));
        this.setState({rounds: newRounds, roundCount: newData.roundNum});
        this.props.changeMode(AppMode.TABLE);
    }

    editRound = (newData) => {
		let data = JSON.parse(localStorage.getItem("speedgolfUserData")); 
		let newRounds = this.state.rounds;
		newRounds[this.state.editId] = newData;
		data[this.props.user.id].rounds = newRounds;
		localStorage.setItem("speedgolfUserData",JSON.stringify(data));
		this.setState({rounds: newRounds, editId: ""});
		this.props.changeMode(AppMode.TABLE);
  	}

    setEditId = (val) => {
      	this.setState({editId: val});
    }

    deleteRound = (id) => {
		let data = JSON.parse(localStorage.getItem("speedgolfUserData"));
		let newRounds = this.state.rounds;
		delete newRounds[id];
		data[this.props.user.id].rounds = newRounds;
		data[this.props.user.id].roundCount = this.state.roundCount - 1;
		localStorage.setItem("speedgolfUserData",JSON.stringify(data));
		this.setState({rounds: newRounds, roundCount: (this.state.roundCount - 1)});
    }

    render () {
        switch(this.props.mode) {
            case AppMode.TABLE:
                return (
                  <React.Fragment>
                  <DataTablePage 
                    rounds={this.state.rounds}
                    changeMode={this.props.changeMode}
                    menuOpen={this.props.menuOpen}
                    setEditId={this.setEditId}
                    deleteRound={this.deleteRound} /> 
                  <FloatingButton
                      handleClick={() => 
                        this.props.changeMode(AppMode.ADD_DATA)}
                      menuOpen={this.props.menuOpen}
                      icon={"fa fa-plus"} />
                  </React.Fragment>
                );
            case AppMode.ADD_DATA:
                return (
                    <AddDataPage
                      mode={this.props.mode}
                      startData={""} 
                      saveRound={this.addRound} />
                );
            case AppMode.EDIT_DATA:
                return (
                    <AddDataPage
                      mode={this.props.mode}
                      startData={this.state.rounds[this.state.editId]} 
                      saveRound={this.editRound} />
                );
        }
    }
}