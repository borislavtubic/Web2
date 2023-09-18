import { useNavigate, useParams } from "react-router-dom";
import { GetUser } from "../models/UserModel";
import { useEffect, useState } from "react";
import { CreateOrder } from "../services/OrderService";
import { itemModel } from "../models/ItemModel";
import { orderCreateModel } from "../models/OrderModel";

const MakeRequest = () => {
    const { items } = useParams();
    const [comment, setComment] = useState('');
    const [address, setAddress] = useState('');
    const [errors, setErrors] = useState({});
    const [cijena, setCijena] = useState(0);
    const [cijenaDostave, setCijenaDostave] = useState(0);

    let parsedItems = [itemModel];
    parsedItems = JSON.parse(decodeURIComponent(items));
    const postarina = 10;
    const buyerId = GetUser().id;

    const history = useNavigate();

    useEffect(() => {
        const uniqueSellerIds = new Set(parsedItems.map((item) => item.sellerId));
        setCijenaDostave(uniqueSellerIds.size * postarina);
        const totalPrice = parsedItems.reduce(
            (sum, item) => sum + item.price * item.amount,
             0
          );
          setCijena(totalPrice);
      }, [parsedItems]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        const validationErrors = {};

        if (comment.length > 30) {
          validationErrors.username = "Comment must be less than 30 characters.";
        }
        if (address.length < 3 || address.length > 30) {
          validationErrors.address = "Surname must be between 3 and 30 characters.";
        }
    
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }
        
        try {
            const currentTime = new Date().toLocaleString();

            const sellerIds = Array.from(new Set(parsedItems.map((item) => item.prodavac)));
            const requestPromises = sellerIds.map(async (sellerId) => {
                let sellerItems = itemModel;
                sellerItems = parsedItems.filter((item) => item.prodavac === sellerId);

                const ids = sellerItems.map((item) => item.id);
                const amounts = sellerItems.map((item) => item.amount);
                const price = postarina + sellerItems.reduce((sum, item) => sum + item.price * item.amount, 0);
                const sellerIdNumber = sellerItems.map((item) => item.sellerId);

                let order = orderCreateModel;
                order = { price, comment, address, sellerId : sellerIdNumber[0], buyerId, orderTime : currentTime, orderArriving : "", ids, amounts };

                const response = await CreateOrder(order);
            });

            await Promise.all(requestPromises);
            localStorage.removeItem('basket');
            alert("Uspjesno ste napravili narudzbinu!");
            history("/");
        } catch (e) {
            if(e.response.status === 401 || e.response.status === 403)
            {
              localStorage.clear();
              history('/');
            }
            alert("Desila se greska prilikom pravljenja narudzbine!");
        }
    }



    return ( 
        <div className="make-request-container">
            <div className="make-request-content">
                <h2>Narudzbina</h2>
                <table className="make-request-table">
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
                        {parsedItems.map(item => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.price} €</td>
                                <td>{item.amount}</td>
                                <td>{item.description}</td>
                                <td>{item.picture}</td>
                                <td>{item.prodavac}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <br />
                <label className="cijena">Ukupna cijena svih proizvoda je: {cijena} € + {cijenaDostave} € dostava.</label>
                <br />
                <form onSubmit={handleSubmit}>
                    <label>Dodatni komentar: </label>
                    <input
                        type="text"
                        required
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    {errors.comment && <p className="error">{errors.comment}</p>}
                    <label>Adresa stanovanja: </label>
                    <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    {errors.address && <p className="error">{errors.address}</p>}
                    <button>Naruci</button>
                </form>
            </div>
        </div>
     );
}
 
export default MakeRequest;