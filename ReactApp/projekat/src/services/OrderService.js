import axios from "axios";
import { config } from "./UserService";

export const CreateOrder = async (order) =>
{
    return await axios.post(process.env.REACT_APP_API_URL + '/api/orders/create', order, config);
}

export const GetOrdersByBuyerId = async (buyerId) =>
{   
    return await axios.get(process.env.REACT_APP_API_URL + '/api/orders/buyer/' + buyerId, config);
}

export const DeleteOrder = async (id, order) =>
{   
    return await axios.put(process.env.REACT_APP_API_URL + '/api/orders/' + id, order, config);
}

export const GetNewOrdersBySellerId = async (sellerId) =>
{   
    return await axios.get(process.env.REACT_APP_API_URL + '/api/orders/newOrders/' + sellerId, config);
}

export const GetPastOrdersBySellerId = async (sellerId) =>
{   
    return await axios.get(process.env.REACT_APP_API_URL + '/api/orders/pastOrders/' + sellerId, config);
}

export const GetAllOrders = async () =>
{   
    return await axios.get(process.env.REACT_APP_API_URL + '/api/orders/all', config);
}

export const calculateRemainingTime = (timeOfDelivery) => {
    timeOfDelivery = new Date(timeOfDelivery);
    const difference = timeOfDelivery.getTime() - new Date().getTime();

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds
    };
};