import { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useGetUserID } from "../hooks/useGetUserID";

export const AddItem = () => {
    const userID = useGetUserID();
    const [cookies, _] = useCookies(["access_token"]);
    const [product, setProduct] = useState({
        name: "",
        price: 0,
        description: "",
        imageUrl: "",
        stock: 0,
        userOwner: userID,
    });

    const navigate = useNavigate();
    
    const handleChange = (event) => {
        const { name, value } = event.target;
        setProduct( { ...product, [name]: value } );
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post("http://localhost:3001/products", product,
            { headers: { authorization: cookies.access_token }});
            alert("Product Added.");
            navigate("/");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="add-item">
            <h1>Add New Product</h1>
            <form onSubmit={ onSubmit }>
                <div className="product-element">
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" onChange={handleChange}/></div>
                <div className="product-element">
                <label htmlFor="name">Price:</label>
                <input type="text" id="price" name="price" onChange={handleChange}/></div>
                <div className="product-element">
                <label htmlFor="name">Description:</label>
                <textarea type="text" id="description" name="description" onChange={handleChange}/></div>
                <div className="product-element">
                <label htmlFor="name">Stock:</label>
                <input type="text" id="stock" name="stock" onChange={handleChange}/></div>
                <div className="product-element">
                <label htmlFor="name">Image URL:</label>
                <input type="text" id="imageUrl" name="imageUrl" onChange={handleChange}/></div>
                <button type="submit">Add</button>
            </form>
        </div>
    )
};