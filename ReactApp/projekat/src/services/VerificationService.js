import { config } from "./UserService";
import axios from "axios";

export const GetVerificationFromBackend = async (userId, token) =>
{   
    const firstConfig = {  headers: {"Authorization" : `Bearer ${token}`} };
    return await axios.get(process.env.REACT_APP_API_URL + '/api/verifications/' + userId, firstConfig);
}

export const GetAllVerifications = async () =>
{   
    return await axios.get(process.env.REACT_APP_API_URL + '/api/verifications/all', config);
}

export const UpdateVerification = async (id, verification) =>
{
    return await axios.put(process.env.REACT_APP_API_URL + '/api/verifications/' + id, verification, config);
}