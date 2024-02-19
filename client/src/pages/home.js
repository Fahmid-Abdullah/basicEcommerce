import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useGetUserID } from "../hooks/useGetUserID";
import { useNavigate } from "react-router-dom";

export const Home = () => {
    const [products, setProducts] = useState([]);
    const [savedProducts, setSavedProducts] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // New state for the search term
    const [cookies, _] = useCookies(["access_token"]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userID = useGetUserID();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get("http://localhost:3001/products");
                setProducts(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const fetchSavedProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/products/savedProducts/ids/${userID}`);
                setSavedProducts(response.data.savedProducts);
            } catch (err) {
                console.error(err);
            }
        };

        setLoading(true);
        fetchProduct();
        if (cookies.access_token) fetchSavedProduct();
    }, [userID, cookies.access_token]);

    const saveProduct = async (productID) => {
        try {
            const response = await axios.put("http://localhost:3001/products", { productID, userID },
                { headers: { authorization: cookies.access_token } });
            setSavedProducts(response.data.savedProducts);
        } catch (err) {
            console.error(err);
        }
    };

    const isProductSaved = (id) => savedProducts.includes(id);

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/search?query=${searchTerm}`);
                setSearchResults(response.data.results);
            } catch (err) {
                console.error(err);
            }
        };

        // Fetch search results when the search term changes
        if (searchTerm !== "") {
            fetchSearchResults();
        } else {
            // Reset search results if the search term is empty
            setSearchResults([]);
        }
    }, [searchTerm]);

    if (loading) {
        // Render loading state while data is being fetched
        return <div>Loading...</div>;
    }

    return (
        <div className="home">
            <h1>Products</h1>

            {/* Search bar */}
            <input
                type="text"   
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Display search results or all products */}
            <ul className="items">
                {searchTerm !== "" ? (
                    searchResults.map((result) => (
                        <li key={result._id} className="product-item">
                            <div className="image-container">
                            <img src={result.imageUrl} alt={result.name} /></div>
                            <div className="product-info">
                            <div><h2>{result.name}</h2></div>
                            <div className="price"><p>${result.price}</p></div>
                            <div className="description"><p>{result.description}</p></div>
                            <div className="stock"><p>{result.stock} left</p></div>
                            <button className="button"
                                onClick={() => {
                                    if (!cookies.access_token) {
                                        navigate("/auth");
                                    } else {
                                        saveProduct(result._id);
                                    }
                                }}
                                disabled={isProductSaved(result._id)}
                            >
                                {isProductSaved(result._id) ? "In Cart" : "Add to Cart"}
                            </button></div>
                        </li>
                    ))
                ) : (
                    products.map((product) => (
                        <li key={product._id} className="product-item">
                            <div className="image-container">
                            <img src={product.imageUrl} alt={product.name} /></div>
                            <div className="product-info">
                            <div><h2>{product.name}</h2></div>
                            <div className="price"><p>${product.price}</p></div>
                            <div className="description"><p>{product.description}</p></div>
                            <div className="stock"><p>{product.stock} left</p></div>
                            <button className="button"
                                onClick={() => {
                                    if (!cookies.access_token) {
                                        navigate("/auth");
                                    } else {
                                        saveProduct(product._id);
                                    }
                                }}
                                disabled={isProductSaved(product._id)}
                            >
                                {isProductSaved(product._id) ? "In Cart" : "Add to Cart"}
                            </button></div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};
