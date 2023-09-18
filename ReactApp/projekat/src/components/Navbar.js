import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GetRole, GetToken, SetUser, userModel } from "../models/UserModel";
import { GetVerification } from '../models/VerificationModel';
import { AuthUser, GetUserFromBackend } from '../services/UserService';

const Navbar = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(GetToken() !== null);
    const [role, setRole] = useState(GetRole());
    const [isVerified, setIsVerified] = useState(false);
    const history = useNavigate();

    useEffect(() => {
      setIsLoggedIn(GetToken() !== null);
      if(isLoggedIn)
        getData();
      setRole(GetRole());
      if(role === "prodavac")
      {
        if(GetVerification() === 'Accepted')
        {
          setIsVerified(true);
        }
        else
          setIsVerified(false);
      }
    }, [role, isLoggedIn]);

    const getData = async () => {
      let user = userModel;
      try{
        const response = await GetUserFromBackend();
        user = response.data;
      }
      catch(e){
        if(e.response.status === 401 || e.response.status === 403)
        {
          localStorage.clear();
          history('/');
        }
      }

      const temp = user;
      if (user.type === 1)
        temp.type = 'Kupac';
      else if (user.type === 2) {
        temp.type = 'Prodavac'
      }
      else
        temp.type = 'Admin';

      temp.password = (user.password).slice(0, 10).split('').map(() => '*').join('');
      SetUser(temp);
    }

    return (
      <nav className="navbar">
        <h1>Online kupovina</h1>
        <div className="links">
          {isLoggedIn && <Link to="/">Home</Link>}
          {isLoggedIn && <Link to="/profil">Profil</Link>}
          {isLoggedIn && role === "kupac" && <Link to="/porudzbinaKupac">Nova porudzbina</Link>}
          {isLoggedIn && role === "kupac" && <Link to="/prethodnePorudzbine">Prethodne porudzbine</Link>}
          {isLoggedIn && role === "admin" && <Link to="/verifikacija">Korisnici</Link>}
          {isLoggedIn && role === "prodavac" && isVerified && <Link to="/artikli">Artikli</Link>}
          {isLoggedIn && role === "prodavac" && isVerified && <Link to="/noviArtikal">Dodaj artikal</Link>}
          {isLoggedIn && role === "prodavac" && isVerified && <Link to="/novePorudzbineProdavac">Nove porudzbine</Link>}
          {isLoggedIn && role === "prodavac" && isVerified && <Link to="/mojePorudzbine">Moje porudzbine</Link>}
          {isLoggedIn && role === "admin" && <Link to="/svePorudzbine">Sve porudzbine</Link>}
        </div>
      </nav>
    );
  };
 
export default Navbar;