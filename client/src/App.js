import { useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/home";
import { Auth } from "./pages/auth";
import { AddItem } from "./pages/add-item";
import { Cart } from "./pages/cart";
import { Profile } from "./pages/profile"
import { NavBar } from './components/navBar';
import { useGetUserID } from "./hooks/useGetUserID";
import './App.css';

function App() {
  const [balance, setBalance] = useState(0);
  const userID = useGetUserID();

  const fetchBalance = useCallback(async () => {
    try {
        const response = await fetch(`http://localhost:3001/auth/balance/${userID}`);
        if (response.ok) {
            const userBalance = await response.json();
            setBalance(userBalance.balance);
        }
    } catch (err) {
        console.error("Error fetching balance: ", err.message);
    }
}, [userID]);

  const updateBalance = async (callback) => {
    try {
      const response = await fetch(`http://localhost:3001/auth/balance/${userID}`);
      if (response.ok) {
        const userBalance = await response.json();
        setBalance(userBalance.balance);
        console.log(userBalance.balance);
        callback();
      }
    } catch (err) {
      console.error("Error fetching balance: ", err.message);
    }
  };

  return (
    <Router>
    <div className="App">
        <NavBar updateBalance={() => updateBalance(fetchBalance)} />
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/add-item" element={<AddItem />} />
            <Route path="/cart" element={<Cart updateBalance={() => updateBalance(fetchBalance)} />} />
            <Route path="/profile" element={<Profile />} />
        </Routes>
    </div>
</Router>
  );
}

export default App;
