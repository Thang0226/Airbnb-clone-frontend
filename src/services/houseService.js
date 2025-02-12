import axios from "axios";
import { BASE_URL, APi_ENDPOINTS } from ".../constants/api";
import {API_ENDPOINTS} from "../constants/api";

export const getHouserForRent = async () => {
    try {
        const response =await axios.get(`${BASE_URL}${API_ENDPOINTS.GET_HOUSES_FOR_RENTED}`)
        return response.data;

    } catch (error) {
        throw error.response ? error.response.date : "Lỗi mạng";

    }
};
