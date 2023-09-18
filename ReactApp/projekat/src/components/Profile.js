import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import tiger from '../tiger.jpg'
import { GetUser, userModel } from "../models/UserModel";
import { GetVerification } from "../models/VerificationModel";

const Profile = () => {

  const [user, setUser] = useState(userModel)

  const [isSeller, setIsSeller] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const verification = GetVerification();

  useEffect(() => {
    let temp = userModel;
    temp = GetUser();
    setUser(temp);
    if(user.type === "Prodavac")
    {
      setIsSeller(true)
      if(GetVerification() === "Accepted")
        setIsVerified(true);
      else
        setIsVerified(false);
    }  
  }, [user.type])

  return (
    <div className="profile-container">
      <h2>Profil: </h2>
      <div className="profile-picture">
        <img src={tiger} alt="Profilna slika:" />
      </div>
      <div className="user-info">
        <div>
          <strong>Korisnicko ime:</strong> {user.username}
        </div>
        <div>
          <strong>Lozinka:</strong> {user.password}
        </div>
        <div>
          <strong>Email:</strong> {user.email}
        </div>
        <div>
          <strong>Ime:</strong> {user.name}
        </div>
        <div>
          <strong>Prezime:</strong> {user.surname}
        </div>
        <div>
          <strong>Datum rodjenja:</strong> {user.date}
        </div>
        <div>
          <strong>Adresa:</strong> {user.address}
        </div>
        <div>
          <strong>Tip korisnika:</strong> {user.type}
        </div>
        {(!isSeller || isVerified) && <Link className="buttonProfile" to="/izmjenaProfila">Izmjena profila</Link>}
      </div>
      { isSeller &&
      <>
      <div className="verification-box">
        <h2>Verification status</h2>
        <p>{verification}</p>
      </div>
      </>}
    </div>
  );
}
 
export default Profile;