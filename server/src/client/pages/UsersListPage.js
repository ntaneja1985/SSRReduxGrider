import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fetchUsers} from "../actions";

class UserListPage extends Component {
    componentDidMount() {
        this.props.fetchUsers();
    }

    renderUsers(){
        return this.props.users.map(user => {
            return <li key={user.id}>{user.name}</li>
        })
    }
    render() {
        return (
            <div>
                Here is a big list of users:
                <ul>{this.renderUsers()}</ul>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        users: state.users,
    };
}

//Returns a promise
function loadData(store){
    // console.log('Trying to load some data');
    return store.dispatch(fetchUsers());

}


export default{
    component: connect(mapStateToProps,{fetchUsers})(UserListPage),
    loadData: loadData,
};