import {
    FETCH_USER_PROFILE,
    FETCH_USER_PROFILE_SUCCESS,
    FETCH_USER_PROFILE_FAILURE,
    UPDATE_USER_PROFILE,
    UPDATE_USER_PROFILE_SUCCESS,
    UPDATE_USER_PROFILE_FAILURE,
} from "../actions/UserAction";

const initialState = {
    userProfile: null,
    loading: false,
    error: null,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USER_PROFILE:
        case UPDATE_USER_PROFILE:
            return { ...state, loading: true, error: null }; // Reset error when fetching/updating

        case FETCH_USER_PROFILE_SUCCESS:
        case UPDATE_USER_PROFILE_SUCCESS:
            return { ...state, userProfile: action.payload, loading: false, error: null };

        case FETCH_USER_PROFILE_FAILURE:
        case UPDATE_USER_PROFILE_FAILURE:
            return { ...state, error: action.payload, loading: false };

        default:
            return state;
    }
};

export default userReducer;
