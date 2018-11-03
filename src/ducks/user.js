import axios from 'axios';

// Set up initial state
const initialState = {
    user: {}
};

// action types
const GET_USER_INFO = 'GET_USER_INFO';

// action creators
export function getUserInfo() {
    const userInfo = axios.get('/auth/me').then((res) => {
        return res.data
    })
    return {
        type: GET_USER_INFO,
        payload: userInfo
    }
}

// reducer function
export default function reducer(state = initialState, action) {
    switch (action.type) {
        // "_FULFILLED" is called when the action Promise is resolved
        case GET_USER_INFO + '_FULFILLED':
            return Object.assign({}, state, { user: action.payload });
        default:
            return state;
    }

}
