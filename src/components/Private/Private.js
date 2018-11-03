import React, { Component } from 'react';
import './Private.css'
import { connect } from 'react-redux';
import { getUserInfo } from './../../ducks/user';
import { Link } from 'react-router-dom';

class Private extends Component {
    
    componentDidMount() {
        this.props.getUserInfo();
    }

    render() {
        const loginJSX = (
            Object.keys(this.props.user).length > 0 ?
                <div className='info-container'>
                    <h1>Community Bank</h1><hr />
                    <h4>Account information:</h4>
                    <img alt='' className='avatar' src={this.props.user.img} />
                    <p>Username: {this.props.user.user_name}</p>
                    <p>Email: {this.props.user.email}</p>
                    <p>ID: {this.props.user.auth_id}</p>
                    <h4>Available balance: {'$' + Math.floor((Math.random() + 1) * 100) + '.00'} </h4>
                    <a href={process.env.REACT_APP_LOGOUT}><button>Log out</button></a>
                </div>
            :
                <div className='info-container'>
                    <h1>Community Bank</h1><hr />
                    <h4>Please log in to view bank information.</h4>
                    <Link to='/'><button>Log in</button></Link>
                </div> 
        )

        return (
            <div>
                { loginJSX }
            </div> 
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

export default connect( mapStateToProps, { getUserInfo })(Private);