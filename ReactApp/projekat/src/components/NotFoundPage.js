import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return ( 
        <div className="not-found">
            <h1>Ova stranica ne postoji!</h1>
            <Link to='/'>Povratak na pocetnu stranicu</Link>
        </div>
     );
}
 
export default NotFoundPage;