import {FETCH_CURRENT_USER} from "../actions";

export default (state = null, action) => {
    switch(action.type) {
        case FETCH_CURRENT_USER:
            console.log(action.payload.data);
            return action.payload.data || false;
        default:
            return state;
    }
}