import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import NotFoundPage from './components/NotFoundPage';
import Profile from './components/Profile';
import NewRequestBuyer from './components/NewRequestBuyer';
import PastRequests from './components/PastRequests';
import Verification from './components/Verification';
import NewRequestsSeller from './components/NewRequestsSeller';
import MyRequests from './components/MyRequests';
import AllRequests from './components/AllRequests';
import Register from './components/Register';
import Login from './components/Login';
import ProfileChange from './components/ProfileChange';
import Items from './components/Items';
import AddItem from './components/AddItem';
import ChangeItem from './components/ChangeItem';
import MakeRequest from './components/MakeRequest';
import EmptyRequest from './components/EmptyRequest';
import { AuthUser } from './services/UserService';

function App() {

  const user  = AuthUser();
  
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/registracija" element={!user ? <Register /> : <Navigate to="/" />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/profil" element={user ? <Profile /> : <Navigate to="/" />} />
            <Route path="/izmjenaProfila" element={user ? <ProfileChange /> : <Navigate to="/" />} />
            <Route path="/artikli" element={(user === "Accepted") ? <Items /> : <Navigate to="/" />} />
            <Route path="/noviArtikal" element={(user === "Accepted") ? <AddItem /> : <Navigate to="/" />} />
            <Route path="/izmjenaArtikla" element={(user === "Accepted") ? <ChangeItem /> : <Navigate to="/" />} />
            <Route path="/porudzbinaKupac" element={(user === "kupac") ? <NewRequestBuyer /> : <Navigate to="/" />} />
            <Route path="/napraviPorudzbinu/:items" element={(user === "kupac") ? <MakeRequest /> : <Navigate to="/" />} />
            <Route path="/napraviPorudzbinu/[]" element={(user === "kupac") ? <EmptyRequest /> : <Navigate to="/" />} />
            <Route path="/prethodnePorudzbine" element={(user === "kupac") ? <PastRequests /> : <Navigate to="/" />} />
            <Route path="/verifikacija" element={(user === "admin") ? <Verification /> : <Navigate to="/" />} />
            <Route path="/novePorudzbineProdavac" element={(user === "Accepted") ? <NewRequestsSeller /> : <Navigate to="/" />} />
            <Route path="/mojePorudzbine" element={(user === "Accepted") ? <MyRequests /> : <Navigate to="/" />} />
            <Route path="/svePorudzbine" element={(user === "admin") ? <AllRequests /> : <Navigate to="/" />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;