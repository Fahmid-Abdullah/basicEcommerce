// In NavBar component
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useGetUserID } from "../hooks/useGetUserID";

export const NavBar = ({ updateBalance }) => {
    const [cookies] = useCookies(["access_token"]);
    const [userBalance, setUserBalance] = useState("null");
    const userID = useGetUserID();

    const fetchBalance = async () => {
        try {
            const response = await fetch(`http://localhost:3001/auth/balance/${userID}`);
            if (response.ok) {
                const userBalance = await response.json();
                setUserBalance(userBalance);
            }
        } catch (err) {
            console.error("Error fetching balance: ", err.message);
        }
    };

    useEffect(() => {
        if (cookies.access_token) {
            fetchBalance();
        }
    }, [cookies.access_token, fetchBalance, updateBalance]); // Include fetchBalance and updateBalance in the dependency array

    return (
        <div className="sidebar">
            <Link to="/">Dashboard</Link>

            {!cookies.access_token ? (
                <Link to="/auth">Register</Link>
            ) : (
                <>
                    <Link to="/add-item">Add Product</Link>
                    <Link to="/cart">Cart</Link>
                    <Link to="/profile">Profile</Link>
                    <h2>${Math.round(userBalance.balance * 100) / 100}</h2>
                </>
            )}
        </div>
    );
};
