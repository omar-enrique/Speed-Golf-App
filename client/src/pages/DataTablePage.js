import React from 'react';
import AppMode from '../AppMode';

export default class DataTablePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {confirmDelete: false}; 
    }

    //renderTable -- render an HTML table displaying the rounds logged
    //by the current user and providing buttons to view/edit and delete each round.
    renderTable = () => {
        let table = [];
        console.log('Render Data Table', this.props.rounds);
        for (const r in this.props.rounds) {
            table.push(
                <tr key={r}>
                    <td>{this.props.rounds[r].date}</td>
                    <td>{this.props.rounds[r].course}</td>
                    <td>{(Number(this.props.rounds[r].strokes) + 
                            Number(this.props.rounds[r].minutes)) +
                            ":" + this.props.rounds[r].seconds + " (" + 
                            this.props.rounds[r].strokes + 
                            " in " + this.props.rounds[r].minutes + ":" + 
                            this.props.rounds[r].seconds + ")"}
                    </td>
                    <td>
                        <button className="btn" onClick={() => this.editRound(r)}>
                            <span className="fa fa-edit"></span></button>
                        <button className="btn"  onClick={() => this.confirmDelete(r)}>
                                <span className="fa fa-trash"></span></button>
                    </td>
                </tr> 
            );
        }
        return table;
    }

    editRound = (id) => {
        this.props.setEditId(id);
        this.props.changeMode(AppMode.EDIT_DATA);
    }
    
    confirmDelete = (id) => {
        this.props.deleteRound(id);
    }

    //render--render the entire rounds table with header, displaying a "No
    //Rounds Logged" message in case the table is empty.
    render() {
        return(
        <div className="padded-page">
            <h1></h1>
            <table className="table table-hover">
                <thead className="thead-light">
                    <tr>
                        <th>Date</th>
                        <th>Course</th>
                        <th>Score</th>
                        <th>Edit/Delete Item</th>
                    </tr>
                </thead>
                <tbody>
                {Object.keys(this.props.rounds).length === 0 ? 
                    <tr>
                        <td colSpan="5" style={{fontStyle: "italic"}}>No rounds logged</td>
                    </tr> : this.renderTable()
                }
                </tbody>
            </table>
        </div>
        );
    }

}