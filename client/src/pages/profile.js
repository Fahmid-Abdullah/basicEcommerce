import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useGetUserID } from "../hooks/useGetUserID";

export const Profile = () => {
    const [cookies, setCookies] = useCookies(["access_token"]);
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const userID = useGetUserID();

    const logOut = () => {
        setCookies("access_token", "");
        window.localStorage.removeItem("userID");
        navigate("/auth");
    }

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://localhost:3001/auth/profile/${userID}`);
                if (response.ok) {
                    const userData = await response.json();
                    setUserData(userData);
                } else {
                    console.error(`Failed to fetch profile. Status: ${response.status}`);
                }
            } catch (err) {
                console.error("Error fetching profile:", err.message);
            }
        };
            

        // Check if the "access_token" cookie exists
        if (!cookies.access_token) {
            // If not, navigate to the "/auth" route
            navigate("/auth");
        } else {
            fetchProfile();
        }
    }, [cookies.access_token, navigate]);

    // Render the profile component
    return (
        <div className="profile">
            <h1>Profile</h1>
            {userData && (
                <div className="profile-info"> 
                    <p> <strong>First Name:</strong> {userData.firstName}</p>
                    <p><strong>Last Name:</strong> {userData.lastName}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Balance:</strong> ${ Math.round(userData.balance * 100) / 100 }</p>
                </div>
            )}
            <button className="profile-button" onClick={logOut}>Logout</button>
        </div>
    );
};
