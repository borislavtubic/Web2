import { useState } from "react";
import { Link, useNavigate  } from "react-router-dom";
import { AddUser } from "../services/UserService";
import { userModel } from "../models/UserModel";

const Register = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [date, setDate] = useState('');
    const [address, setAddress] = useState('');
    const [buyer, setBuyer] = useState(true);
    const [seller, setSeller] = useState(false);
    const [type, setType] = useState(1);
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
        user = { username, email, password, name, surname, date, address, type, picture : pictureName }

        console.log(user);
        try{
            const response = await AddUser(user);
            console.log(response.data);
            alert('Uspjesno ste se registrovali! Loginujte se za pristup sajtu.')
            history("/");      
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

    const handleCheckBox = (checkBoxNumber) => {
        if(checkBoxNumber === 1){
            setBuyer(true);
            setSeller(false);
            setType(1);
        }
        else{
            setBuyer(false);
            setSeller(true);
            setType(2);
        }
    }

    const handlePicture = (e) => {
        setPicture(e.target.files[0]);
        setPictureName(e.target.files[0].name);
    }

    return ( 
        <div className="register">
            <h2>Registracija</h2>
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
                <label className="typeLabel" >Izaberite tip korisnika: </label>
                <div className="type">
                    <label style={{marginLeft: "110px"}}>Kupac:</label>
                    <input
                        className="inputType"
                        type="checkbox"
                        checked={buyer}
                        value={buyer}
                        onChange={(e) => handleCheckBox(1)}
                    />
                    <label style={{marginLeft: "-50px"}}>Prodavac:</label>
                    <input
                        className="inputType"
                        type="checkbox"
                        checked={seller}
                        value={seller}
                        onChange={(e) => handleCheckBox(2)}
                    />
                </div>
                <Link to="/registracijaGmail">Registruj se preko gmaila putem ovog linka.</Link>
                <br/>
                <br/>
                <Link to="/login">Ako ste vec registrovani, pritisnite ovaj link za login.</Link>
                <br/>
                <button>Registruj se</button>
            </form>
        </div>
     );
}
 
export default Register;