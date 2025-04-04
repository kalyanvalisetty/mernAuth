import { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { AppContext } from "../context/AppContext";
import axios from "axios";

axios.defaults.withCredentials = true;

const StarRating = ({ rating, onRate }) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => {
        const ratingValue = i + 1;
        return (
          <label key={ratingValue} className="cursor-pointer">
            <input
              type="radio"
              name="rating"
              className="hidden"
              value={ratingValue}
              onClick={() => onRate(ratingValue)}
            />
            <i
              className="fa fa-star"
              style={{ color: ratingValue <= rating ? "gold" : "gray" }}
            ></i>
          </label>
        );
      })}
      <p className="ml-2">({rating})</p>
    </div>
  );
};

const Products = () => {
  const { backendUrl } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState({});
  const [showReviewForm, setShowReviewForm] = useState({}); // Tracks visibility of review form
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/${user.role}/products`);
      const productsData = response?.data?.allProducts || [];
      
      // Initialize states for reviews and visibility
      const initialReviews = productsData.reduce((acc, product) => {
        acc[product._id] = { rating: 0, comment: "" };
        return acc;
      }, {});
      
      const initialVisibility = productsData.reduce((acc, product) => {
        acc[product._id] = false; // Hide review form initially
        return acc;
      }, {});   

      setProducts(productsData);
      setReviews(initialReviews);
      setShowReviewForm(initialVisibility);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleRatingChange = (productId, rating) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], rating },
    }));
  };

  const handleCommentChange = (productId, comment) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], comment },
    }));
  };

  const handleSubmitReview = async (productId) => {
    const { rating, comment } = reviews[productId];

    if (!rating || !comment.trim()) {
      alert("Please select a rating and enter a comment.");
      return;
    }

    const reviewData = {
      productId,
      fromUserId: user._id,
      rating,
      comment,
    };

    try {
      await axios.post(`${backendUrl}/api/user/post-review`, reviewData);
      alert("Review submitted successfully!");

      // Reset form and hide it
      setReviews((prev) => ({
        ...prev,
        [productId]: { rating: 0, comment: "" },
      }));
      setShowReviewForm((prev) => ({
        ...prev,
        [productId]: false,
      }));

      fetchProducts(); // Refresh product list with new reviews
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
    }
  };

  const toggleReviewForm = (productId) => {
    setShowReviewForm((prev) => ({
      ...prev,
      [productId]: !prev[productId], // Toggle visibility
    }));
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[url('/bg_img.png')] bg-cover bg-center">
      <Navbar />
      <div className="container mt-10 mx-auto p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white p-5 rounded-lg shadow-lg">
            <img src={product.imageUrl} alt={product.title} className="w-full h-40 object-cover rounded-md" />
            <h2 className="text-xl font-semibold mt-2">{product.title}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-lg font-bold mt-1">₹{product.price}</p>

            <h3 className="mt-3 font-semibold">Reviews:</h3>
            {product.review.length > 0 ? (
              product.review.map((rev) => (
                <div key={rev._id} className="bg-gray-100 p-2 mt-2 rounded-md">
                  <p>
                    <strong>{rev.fromUserId?.userName || ""}</strong> :- {rev.comment} (⭐ {rev.rating})
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}

            {/* Add Review Section */}
                        {/* Hide Add Review Section for Admin */}
                        {user.role !== "admin" && !product.review.some((rev) => rev.fromUserId?._id === user._id) && (
              <>
                <button
                  onClick={() => toggleReviewForm(product._id)}
                  className="mt-4 text-blue-600 font-semibold cursor-pointer hover:underline"
                >
                  {showReviewForm[product._id] ? "Cancel Review" : "Add Review"}
                </button>

                {showReviewForm[product._id] && (
                  <div className="mt-2">
                    <StarRating
                      rating={reviews[product._id]?.rating || 0}
                      onRate={(rating) => handleRatingChange(product._id, rating)}
                    />
                    <textarea
                      className="w-full border p-2 mt-2 rounded"
                      placeholder="Write your review..."
                      value={reviews[product._id]?.comment || ""}
                      onChange={(e) => handleCommentChange(product._id, e.target.value)}
                    />
                    <button
                      onClick={() => handleSubmitReview(product._id)}
                      className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Submit Review
                    </button>
                  </div>
                )}
              </>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
