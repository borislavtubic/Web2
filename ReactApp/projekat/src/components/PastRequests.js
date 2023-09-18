import { useEffect, useState } from "react";
import { GetUser, userModel } from "../models/UserModel";
import { DeleteOrder, GetOrdersByBuyerId, calculateRemainingTime } from "../services/OrderService";
import { GetItemsByOrderId } from "../services/ItemService";
import { GetUserById } from "../services/UserService";
import { orderModel } from "../models/OrderModel";
import { itemModel } from "../models/ItemModel";
import { useNavigate } from "react-router-dom";

const PastRequests = () => {
    const [orders, setOrders] = useState([]);
    const history = useNavigate();

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
          const updatedOrders = orders.map((order) => {
            const remainingTime = calculateRemainingTime(order.orderArriving);
            return {
              ...order,
              remainingTimeHours: remainingTime.hours,
              remainingTimeMinutes: remainingTime.minutes,
              remainingTimeSeconds: remainingTime.seconds
            };
          });
          setOrders(updatedOrders);
        }, 1000);
    
        return () => clearInterval(timer);
    }, [orders]);

    const getData = async () => {
        try {
            let user = userModel;
            user = GetUser();
            const response = await GetOrdersByBuyerId(user.id);
            let ordersResponse = [orderModel];
            ordersResponse = response.data;

            const ordersWithItems = [];
            for (const order of ordersResponse) {
                const itemsResponse = await GetItemsByOrderId(order.id);
                let itemsModel = [itemModel];
                itemsModel = itemsResponse.data;

                const updatedItems = [];
                for (const item of itemsModel) {
                    const { sellerId } = item;

                    try {
                        const sellerResponse = await GetUserById(sellerId);
                        let seller = userModel;
                        seller = sellerResponse.data;
                        const updatedItem = { ...item, seller: seller.username };
                        updatedItems.push(updatedItem);
                    } catch (error) {
                        if(error.response.status === 401 || error.response.status === 403)
                        {
                          localStorage.clear();
                          history('/');
                        }
                        console.error("Desila se greska:", error);
                        continue;
                    }
                }
                const remainingTime = calculateRemainingTime(order.orderArriving);
                const orderWithItems = { ...order, remainingTimeHours : remainingTime.hours, remainingTimeMinutes : remainingTime.minutes, remainingTimeSeconds : remainingTime.seconds, items: updatedItems };
                ordersWithItems.push(orderWithItems);
            }
            setOrders(ordersWithItems);
        } catch (e) {
            if(e.response.status === 401 || e.response.status === 403)
            {
              localStorage.clear();
              history('/');
            }
            alert("Desila se greska: " + e);
        }
    };

    const handleOtkazi = async (order) => {
        try{
            const response = await DeleteOrder(order.id, order);
            console.log(response.data);
            alert('Uspjesno ste otkazali porudzbinu!');
            window.location.reload();
        }
        catch(e){
            alert('Desila se greska: ', e);
        }
    };

    return (
        <div className="past-requests-container">
            <div className="past-requests-content">
                {orders.length > 0 && <h2 className="past-requests-title">Porudzbine</h2>}
                {orders.length === 0 && <h2 className="past-requests-title">Nemate porudzbine!</h2>}
                {orders.map((order) => (
                    <div key={order.id}>
                        <table className="past-requests-table-order">
                            <thead>
                                <tr>
                                    <th>Cijena</th>
                                    <th>Komentar</th>
                                    <th>Adresa</th>
                                    <th>Status</th>
                                    <th>Vrijeme narudzbe</th>
                                    <th>Vrijeme kada stize narudzba</th>
                                    <th>Vrijeme dostave</th>
                                    <th>Otkazivanje narudzbe</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{order.price} €</td>
                                    <td>{order.comment}</td>
                                    <td>{order.address}</td>
                                    {(order.status === 0 && <td><label>U slanju</label></td>)}
                                    {(order.status === 1 && <td><label>Dostavljeno</label></td>)}
                                    <td>{order.orderTime}</td>
                                    <td>{order.orderArriving}</td>
                                    {(order.status === 1 && <td><label>Dostavljeno</label></td>)}
                                    {(order.status === 0 && <td><label>{order.remainingTimeHours} sat, {order.remainingTimeMinutes} minuta, {order.remainingTimeSeconds} sekundi</label></td>)}
                                    <td>
                                        {order.cancel === 1 ? (
                                            <button className="past-requests-button" onClick={() => handleOtkazi(order)}>
                                                Otkazi
                                            </button>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="past-requests-table">
                            <thead>
                                <tr>
                                    <th>Naziv</th>
                                    <th>Cijena</th>
                                    <th>Kolicina</th>
                                    <th>Opis</th>
                                    <th>Slika</th>
                                    <th>Prodavac</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.price} €</td>
                                        <td>{item.amount}</td>
                                        <td>{item.description}</td>
                                        <td>
                                            <img src={item.picture} alt={item.name} />
                                        </td>
                                        <td>{item.seller}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <br />
                        <br />
                        <br />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PastRequests;