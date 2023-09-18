import { useEffect, useState } from 'react';
import { DeleteItem, GetItemsBySellerId } from '../services/ItemService';
import { GetUser } from '../models/UserModel';
import { useNavigate } from 'react-router-dom';
import { SetItem, itemModel } from '../models/ItemModel';

const Items = () => {
    const [items, setItems] = useState([]);
    const history = useNavigate();

    useEffect(() => {
      getItems();
    }, []);
  
    const getItems = async () => {
      try {
        const response = await GetItemsBySellerId(GetUser().id);
        let itemsResponse = [itemModel];
        itemsResponse = response.data;

        const filteredItems = itemsResponse.filter(item => item.amount > 0);
        setItems(filteredItems);
      } catch (error) {
        console.log(error);
      }
    };

    const handleEdit = (item) => {
        SetItem(item);
        history('/izmjenaArtikla');
    };
    
    const handleDelete = async (itemId) => {
        try {
            const response = await DeleteItem(itemId);
            console.log(response.data);
          } catch (error) {
            if(error.response.status === 401 || error.response.status === 403)
            {
              localStorage.clear();
              history('/');
            }
          }
        getItems();
    };
  
    return (
        <div className="items-container">
        <div className="items-content">
            <h2 className="items-title">Artikli</h2>
            <table className="items-table">
            <thead>
                <tr>
                <th>Naziv</th>
                <th>Cijena</th>
                <th>Kolicina</th>
                <th>Opis</th>
                <th>Slika</th>
                <th>Izmjeni</th>
                <th>Obrisi</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item) => (
                <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.price} €</td>
                    <td>{item.amount}</td>
                    <td>{item.description}</td>
                    <td>{item.picture}</td>
                    <td>
                    <button className="items-button" onClick={() => handleEdit(item)}>Izmjeni</button>
                    </td>
                    <td>
                        <button className="items-button" onClick={() => handleDelete(item.id)}>Obrisi</button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
            </div>
        </div>
    );
}
 
export default Items;