import { Link, useNavigate } from "react-router-dom";
import { GetToken } from "../models/UserModel";

const Home = () => {
    const history = useNavigate();
    const isLoggedIn = GetToken() !== null;

    const handleLogout = () => {
      localStorage.clear();
      history("/");
      window.location.reload();
    };

    return (
      <div className="home">
        <h1>Dobrodosli na pocetnu stranicu!</h1>
        {!isLoggedIn && (
          <>
            <p>Za pristup kupovini i prodaji, molimo Vas da se ulogujete.</p>
            <Link to="/registracija">Ukoliko nemate profil, pritisnite ovaj link za registraciju.</Link>
            <Link className="button" to="/login">Prijavi se</Link>
          </>
        )}
        {isLoggedIn && (
          <>
            <p>Pritiskom na dugme ispod mozete se izlogovati sa nase stranice.</p>
            <button className="button" onClick={() => handleLogout()}>Odjavi se</button>
          </>
        )}
      </div>
    );
  };
 
export default Home;