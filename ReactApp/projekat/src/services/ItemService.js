import axios from "axios";
import { config } from "./UserService";

export const AddItemBackend = async (item) =>
{
    return await axios.post(process.env.REACT_APP_API_URL + '/api/items/create', item, config);
}

export const GetItemsBySellerId = async (sellerId) =>
{   
    return await axios.get(process.env.REACT_APP_API_URL + '/api/items/' + sellerId, config);
}

export const DeleteItem = async (id) =>
{   
    return await axios.delete(process.env.REACT_APP_API_URL + '/api/items/' + id, config);
}

export const UpdateItem = async (id, item) =>
{
    return await axios.put(process.env.REACT_APP_API_URL + '/api/items/' + id, item, config);
}

export const GetAllItems = async () =>
{   
    return await axios.get(process.env.REACT_APP_API_URL + '/api/items/all', config);
}

export const GetItemsByOrderId = async (orderId) =>
{   
    return await axios.get(process.env.REACT_APP_API_URL + '/api/items/byOrder/' + orderId, config);
}