import { useEffect, useState } from "react";
import { GetItemsByOrderId } from "../services/ItemService";
import { GetUserById } from "../services/UserService";
import { GetUser, userModel } from "../models/UserModel";
import { GetPastOrdersBySellerId } from "../services/OrderService";
import { orderModel } from "../models/OrderModel";
import { itemModel } from "../models/ItemModel";
import { useNavigate } from "react-router-dom";

const MyRequests = () => {
    const [orders, setOrders] = useState([]);
    const history = useNavigate();

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            let ordersResponse = orderModel;
            let user = userModel;
            user = GetUser();

            const response = await GetPastOrdersBySellerId(user.id);
            ordersResponse = response.data;

            let ordersWithItems = [];

            for (const order of ordersResponse) {
                const responseItem = await GetItemsByOrderId(order.id);
                let itemsResponse = itemModel;
                itemsResponse = responseItem.data;

                const { buyerId } = order;
                try {
                    let buyer = userModel;
                    const buyerResponse = await GetUserById(buyerId);
                    buyer = buyerResponse.data;

                    const updatedOrder = { ...order, buyer: buyer.username };
                    const orderWithItems = { ...updatedOrder, items: itemsResponse };
                    ordersWithItems.push(orderWithItems);
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
            console.log(ordersWithItems);
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
    return ( 
        <div className="past-requests-container">
        <div className="past-requests-content">
            {orders.length > 0 && <h2 className="past-requests-title">Stare porudzbine</h2>}
            {orders.length === 0 && <h2 className="past-requests-title">Nemate starih porudzbina!</h2>}
            {orders.length > 0 && orders.map((order) => (
                <div key={order.id}>
                    <table className="past-requests-table-order">
                        <thead>
                            <tr>
                                <th>Cijena</th>
                                <th>Komentar</th>
                                <th>Adresa</th>
                                <th>Vrijeme narudzbe</th>
                                <th>Vrijeme dostave</th>
                                <th>Kupac</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{order.price} €</td>
                                <td>{order.comment}</td>
                                <td>{order.address}</td>
                                <td>{order.orderTime}</td>
                                <td>{order.orderArriving}</td>
                                <td>{order.buyer}</td>
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
 
export default MyRequests;