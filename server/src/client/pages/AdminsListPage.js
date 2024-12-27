import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fetchAdmins} from "../actions";
import requireAuth from "../components/HOCs/requireAuth";

class AdminsListPage extends Component {
    componentDidMount() {
        this.props.fetchAdmins();
    }

    renderAdmins(){
        return this.props.admins.map(admin => {
            return <li key={admin.id}>{admin.name}</li>
        })
    }
    render() {
        return (
            <div>
                <h3>Here is a protected list of admins:</h3>
                <ul>{this.renderAdmins()}</ul>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        admins: state.admins,
    };
}

//Returns a promise
function loadData(store){
    // console.log('Trying to load some data');
    return store.dispatch(fetchAdmins());

}

export default{
    component: connect(mapStateToProps,{fetchAdmins})(requireAuth(AdminsListPage)),
    loadData: loadData,
};