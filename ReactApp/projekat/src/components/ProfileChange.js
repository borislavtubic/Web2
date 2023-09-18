import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { UpdateUser } from "../services/UserService";
import { GetUser, SetUser, userModel } from "../models/UserModel";

const ProfileChange = () => {
    const [id, setId] = useState();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [date, setDate] = useState('');
    const [address, setAddress] = useState('');
    const [pictureName, setPictureName] = useState('');
    const [picture, setPicture] = useState();
    const [errors, setErrors] = useState({});
    let user = userModel;

    const history = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        const validationErrors = {};

        if (username.length < 3 || username.length > 20) {
          validationErrors.username = "Username must be between 3 and 20 characters.";
        }
        if (!validateEmail(email)) {
          validationErrors.email = "Invalid email address.";
        }
        if (name.length < 3 || name.length > 20) {
          validationErrors.name = "Name must be between 3 and 20 characters.";
        }
        if (surname.length < 3 || surname.length > 20) {
          validationErrors.surname = "Surname must be between 3 and 20 characters.";
        }
        if (address.length < 3 || address.length > 20) {
          validationErrors.address = "Address must be between 3 and 20 characters.";
        }
        if (password.length < 3 || password.length > 20) {
          validationErrors.password = "Password must be between 3 and 20 characters.";
        }
        if (password !== repeatPassword) {
          validationErrors.repeatPassword = "Passwords do not match.";
        }
        if (new Date(date) > new Date()) {
            validationErrors.date = "Date cannot be in the future.";
          }
        if (pictureName === "") {
          validationErrors.pictureName = "Please select a profile picture.";
        }
    
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }

        //user = { username, email, password, name, surname, date, address, type, picture : pictureName, pictureFile : picture };
        user = { username, email, password, name, surname, date, address, picture : pictureName }
        console.log(user);
        try{
            let newUser = userModel;
            const response = await UpdateUser(id, user);
            newUser = response.data;
            alert('Uspjesno ste izmjenili profil!')

            let temp = userModel;
            temp = newUser;

            if (newUser.type === 1)
              temp.type = 'Kupac';
            else if (newUser.type === 2) {
              temp.type = 'Prodavac'
            }
            else
              temp.type = 'Admin';     
            temp.password = (newUser.password).slice(0, 10).split('').map(() => '*').join('');
            SetUser(temp);

            history("/profil");      
        }
        catch(e){
          if(e.response.status === 401 || e.response.status === 403)
          {
            localStorage.clear();
            history('/');
          }
            alert('Vec postoji korisnik sa tom email adresom! Unesite drugu email adresu!');
        }
    }

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
  useEffect ( () => {
    let account = userModel;
    account = GetUser();
    setId(account.id);
    setUsername(account.username);
    setEmail(account.email);
    setName(account.name);
    setSurname(account.surname);
    setDate(account.date);
    setAddress(account.address);
    setPicture(account.picture);
  }, [])

  const handlePicture = (e) => {
    setPicture(e.target.files[0]);
    setPictureName(e.target.files[0].name);
}

    return ( 
        <div className="register">
            <h2>Izmjena profila</h2>
            <form onSubmit={handleSubmit}>
                <label>Korisnicko ime: </label>
                <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                {errors.username && <p className="error">{errors.username}</p>}
                <label>Email: </label>
                <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="error">{errors.email}</p>}
                <label>Lozinka: </label>
                <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <p className="error">{errors.password}</p>}
                <label>Ponovljena lozinka: </label>
                <input
                    type="password"
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                />
                {errors.repeatPassword && <p className="error">{errors.repeatPassword}</p>}
                <label>Ime: </label>
                <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <p className="error">{errors.name}</p>}
                <label>Prezime: </label>
                <input
                    type="text"
                    required
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                />
                {errors.surname && <p className="error">{errors.surname}</p>}
                <label>Datum rodjenja: </label>
                <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                {errors.date && <p className="error">{errors.date}</p>}
                <label>Adresa stanovanja: </label>
                <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                {errors.address && <p className="error">{errors.address}</p>}
                <label>Izaberite sliku za vas profil:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePicture(e)}
                />
                {errors.pictureName && <p className="error">{errors.pictureName}</p>}
                <button>Izmjeni profil</button>
            </form>
        </div>
     );
}
 
export default ProfileChange;