import axios from "axios";
import { BASE_URL } from "../../constants/api";

export const FETCH_USER_PROFILE = "FETCH_USER_PROFILE";
export const FETCH_USER_PROFILE_SUCCESS = "FETCH_USER_PROFILE_SUCCESS";
export const FETCH_USER_PROFILE_FAILURE = "FETCH_USER_PROFILE_FAILURE";
export const UPDATE_USER_PROFILE = "UPDATE_USER_PROFILE";
export const UPDATE_USER_PROFILE_SUCCESS = "UPDATE_USER_PROFILE_SUCCESS";
export const UPDATE_USER_PROFILE_FAILURE = "UPDATE_USER_PROFILE_FAILURE";

export const fetchUserProfile = (username) => {
    return async (dispatch) => {
        dispatch({ type: FETCH_USER_PROFILE }); // Set loading state
        try {
            const response = await axios.get(`${BASE_URL}/api/users/profile/${username}`);
            dispatch({
                type: FETCH_USER_PROFILE_SUCCESS,
                payload: response.data,
            });
        } catch (error) {
            dispatch({
                type: FETCH_USER_PROFILE_FAILURE,
                payload: error.response?.data?.message || "Error retrieving profile data!",
            });
        }
    };
};

export const updateUserProfile = (formData) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_USER_PROFILE });
        try {
            const response = await axios.put(
                `${BASE_URL}/api/users/profile/update`, formData
            );
            dispatch({
                type: UPDATE_USER_PROFILE_SUCCESS,
                payload: response.data,
            });
        } catch (error) {
            dispatch({
                type: UPDATE_USER_PROFILE_FAILURE,
                payload: error.response?.data?.message || "Error updating profile!",
            });
        }
    };
};
