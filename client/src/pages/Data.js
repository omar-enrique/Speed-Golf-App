import React from 'react';
import AppMode from '../AppMode';
import AddDataPage from './AddDataPage';
import DataTablePage from './DataTablePage';
import FloatingButton from '../components/FloatingButton';

export default class DataPage extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
			rounds: [],
			roundCount: 0,
			deleteId: "",
			editId: ""
		};
		this.fetchRounds();

        // let data = JSON.parse(localStorage.getItem("speedgolfUserData")); 
        console.log(this.props.user.id);
        
	}
	
	fetchRounds = async () => {
        let url = "/rounds/" + this.props.user.id;
		let res = await fetch(url, {method: 'GET'});
		let body = await res.json();
		
		let rounds = JSON.parse(body);

		console.log('RESPONSE TO FETCH',res,body, rounds);

        if (res.status != 200) {
			alert('Failure to retrieve user data.')
			return;
		}

		this.setState({
			rounds: rounds,
			roundCount: rounds.length,
			deleteId: "",
			editId: ""
		});
	}

    addRound = async (newData) => {
        const url = '/rounds/' + this.props.user.id;

		const res = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            method: 'POST',
            body: JSON.stringify(newData)
		}); 
		
		let newRounds = this.state.rounds;

		newRounds = newRounds.concat(newData);

        this.setState({rounds: newRounds, roundCount: newRounds.length});
        this.props.changeMode(AppMode.TABLE);
    }

    editRound = async (newData) => {
		const url = '/rounds/' + this.props.user.id + '/' + this.state.rounds[this.state.editId]["_id"];

		const res = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            method: 'PUT',
            body: JSON.stringify(newData)
		}); 
		
		let newRounds = this.state.rounds;
		newRounds[this.state.editId] = newData;
        this.setState({rounds: newRounds, roundCount: newRounds.length});
        this.props.changeMode(AppMode.TABLE);
  	}

    setEditId = (val) => {
      	this.setState({editId: val});
    }

    deleteRound = async (id) => {
		const url = '/rounds/' + this.props.user.id + '/' + this.state.rounds[id]["_id"];

		const res = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            method: 'DELETE'
		}); 
		
		let newRounds = this.state.rounds;
		delete newRounds[id];
		this.setState({rounds: newRounds, roundCount: newRounds.length});
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