import { useEffect, useState } from "react";
import { userModel } from "../models/UserModel";
import { GetAllOrders } from "../services/OrderService";
import { orderModel } from "../models/OrderModel";
import { itemModel } from "../models/ItemModel";
import { GetItemsByOrderId } from "../services/ItemService";
import { GetUserById } from "../services/UserService";
import { useNavigate } from "react-router-dom";

const AllRequests = () => {
    const [orders, setOrders] = useState([]);
    const history = useNavigate();

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const response = await GetAllOrders();
            let ordersResponse = [orderModel];
            ordersResponse = response.data;

            const ordersWithItems = [];
            for (const order of response.data) {
                const itemsResponse = await GetItemsByOrderId(order.id);
                let itemsModel = [itemModel];
                itemsModel = itemsResponse.data;

                const updatedItems = [];
                let updatedOrder;

                const { buyerId } = order;
                try {
                    let buyer = userModel;
                    const buyerResponse = await GetUserById(buyerId);
                    buyer = buyerResponse.data;

                    updatedOrder = { ...order, buyer: buyer.username };
                } catch (error) {
                    console.error("Desila se greska:", error);
                    continue;
                }

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

                const orderWithItems = { ...updatedOrder, items: updatedItems };
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
    return ( 
        <div className="past-requests-container">
        <div className="past-requests-content">
            <h2 className="past-requests-title">Porudzbine</h2>
            {orders.map((order) => (
                <div key={order.id}>
                    <table className="past-requests-table-order">
                        <thead>
                            <tr>
                                <th>Cijena</th>
                                <th>Komentar</th>
                                <th>Adresa</th>
                                <th>Kupac</th>
                                <th>Status</th>
                                <th>Vrijeme narudzbe</th>
                                <th>Vrijeme kada stize narudzba</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{order.price} €</td>
                                <td>{order.comment}</td>
                                <td>{order.address}</td>
                                <td>{order.buyer}</td>
                                {(order.status === 0 && <td><label>U slanju</label></td>)}
                                {(order.status === 1 && <td><label>Dostavljeno</label></td>)}
                                {(order.status === 2 && <td><label>Otkazano</label></td>)}
                                <td>{order.orderTime}</td>
                                <td>{order.orderArriving}</td>
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
 
export default AllRequests;