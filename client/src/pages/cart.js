import { useEffect, useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";

export const Cart = ( { updateBalance } ) => {
    const [savedProducts, setSavedProducts] = useState([]);
    const userID = useGetUserID();

    useEffect(() => {
        const fetchSavedProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/products/savedProducts/${userID}`);
                setSavedProducts(response.data.savedProducts);
            } catch (err) {
                console.error(err);
            }
        };

        fetchSavedProduct();
    }, [userID]);

    const removeFromSavedProducts = async (productID) => {
        try {
            await axios.delete(`http://localhost:3001/products/savedProducts/${userID}/${productID}`);
            // Fetch the updated saved products after the deletion
            const response = await axios.get(`http://localhost:3001/products/savedProducts/${userID}`);
            setSavedProducts(response.data.savedProducts);
        } catch (err) {
            console.error(err);
        }
    };

    const handlePurchase = async () => {
        try {
            // Make the purchase request
            await axios.post(`http://localhost:3001/purchase`, { userID });
            // Fetch the updated saved products after the purchase
            const response = await axios.get(`http://localhost:3001/products/savedProducts/${userID}`);
            setSavedProducts(response.data.savedProducts);
            updateBalance();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="cart">
            <h1>Cart</h1>
            <button className="purchase-all" onClick={handlePurchase}>
                        Purchase Items
                    </button>
            {savedProducts.length === 0 ? (
                <h3>Cart is empty</h3>
            ) : (
                <>
                    <ul>
                        {savedProducts.map((product) => (
                            <li key={product._id}  className="product-item">
                                <div className="image-container">
                                <img src={product.imageUrl} alt={product.name} /></div>
                                <div className="product-info">
                                <div>
                                    <h2>{product.name}</h2>
                                </div>
                                <div className="price">
                                    <p>{product.price}</p>
                                </div>
                                <div className="description">
                                    <p>{product.description}</p>
                                </div>
                                <div className="stock">
                                    <p>{product.stock}</p>
                                </div>
                                <button className="button" onClick={() => removeFromSavedProducts(product._id)}>
                                    Remove from Cart
                                </button></div>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};
