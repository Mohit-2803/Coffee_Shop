/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { auth } from "../../config/firebaseConfig";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../Loading/LoadingSpinner";

const RatingComponent = ({ productId }) => {
  const [ratings, setRatings] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [isEligible, setIsEligible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewsToShow, setReviewsToShow] = useState(5);

  // Fetch ratings, check eligibility, and get user details when productId changes
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_FRONTEND_URL
          }/api/ratings/getRatings/${productId}`
        );
        setRatings(response.data);
      } catch (error) {
        console.error("Error fetching ratings:", error);
        toast.error("Error loading reviews.");
      }
    };

    const checkEligibilityAndFetchUser = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const token = await user.getIdToken();
          // Fetch user details to get the name by sending email in the request body
          const userDetailsResponse = await axios.get(
            `${
              import.meta.env.VITE_FRONTEND_URL
            }/api/user/details?email=${encodeURIComponent(user.email)}`
          );
          setName(userDetailsResponse.data.name);

          const eligibilityResponse = await axios.post(
            `${
              import.meta.env.VITE_FRONTEND_URL
            }/api/ratings/check-eligibility`,
            { productId, email: user.email },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setIsEligible(eligibilityResponse.data.isEligible);
        } catch (error) {
          console.error(
            "Error checking eligibility or fetching user details:",
            error
          );
        }
      }
      setLoading(false);
    };

    fetchRatings();
    checkEligibilityAndFetchUser();
  }, [productId]);

  // Handle review submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      toast.error("You must be signed in to submit a review.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await user.getIdToken();
      await axios.post(
        `${import.meta.env.VITE_FRONTEND_URL}/api/ratings/createRating`,
        {
          productId,
          rating: userRating,
          comment,
          email: user.email,
          name, // send the user's name as part of the data
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Review submitted successfully!");
      setUserRating(0);
      setComment("");

      // Refresh ratings after submission
      const response = await axios.get(
        `${
          import.meta.env.VITE_FRONTEND_URL
        }/api/ratings/getRatings/${productId}`
      );
      setRatings(response.data);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <LoadingSpinner />
      </div>
    );
  }

  // Separate the current user's review from others
  const currentUser = auth.currentUser;
  const myReview = currentUser
    ? ratings.find((rating) => rating.UserEmail === currentUser.email)
    : null;
  const otherReviews = currentUser
    ? ratings.filter((rating) => rating.UserEmail !== currentUser.email)
    : ratings;

  // Determine the review list to paginate:
  let reviewList = [];
  if (currentUser) {
    reviewList = myReview ? otherReviews : ratings;
  } else {
    reviewList = ratings;
  }

  return (
    <div className="mt-10 p-6 bg-white border-t border-gray-300">
      <h2 className="text-2xl font-semibold text-gray-800 mb-8">
        Customer Reviews
      </h2>

      {currentUser ? (
        <>
          {myReview ? (
            <div className="p-6 bg-gray-50 rounded-xl shadow-inner">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Your Review
              </h3>
              <ReviewCard rating={myReview} />
            </div>
          ) : (
            <>
              {isEligible ? (
                <ReviewForm
                  userRating={userRating}
                  comment={comment}
                  setUserRating={setUserRating}
                  setComment={setComment}
                  handleSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              ) : (
                <div className="p-6 bg-gray-100 rounded-lg text-center text-gray-600">
                  <p className="mb-2 font-medium">
                    You must purchase this product to leave a review.
                  </p>
                </div>
              )}
            </>
          )}

          {reviewList.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Other Reviews
              </h3>
              <div className="space-y-6">
                {reviewList.slice(0, reviewsToShow).map((rating) => (
                  <ReviewCard key={rating.RatingID} rating={rating} />
                ))}
              </div>
              {reviewList.length > reviewsToShow && (
                <button
                  onClick={() => setReviewsToShow(reviewsToShow + 5)}
                  className="mt-4 text-blue-500 hover:underline"
                >
                  View More Reviews
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="p-6 bg-gray-100 rounded-lg text-center text-gray-600">
            <p className="mb-2">Please sign in to leave a review.</p>
          </div>
          {reviewList.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Other Reviews
              </h3>
              <div className="space-y-6">
                {reviewList.slice(0, reviewsToShow).map((rating) => (
                  <ReviewCard key={rating.RatingID} rating={rating} />
                ))}
              </div>
              {reviewList.length > reviewsToShow && (
                <button
                  onClick={() => setReviewsToShow(reviewsToShow + 5)}
                  className="mt-4 text-blue-500 hover:underline"
                >
                  View More Reviews
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* If no reviews exist */}
      {ratings.length === 0 && (
        <div className="mt-8 p-6 text-center font-medium text-gray-500 border-dashed border-2 border-gray-300 rounded-lg">
          <p>Be the first to share your thoughts about this product.</p>
        </div>
      )}
    </div>
  );
};

const ReviewForm = ({
  userRating,
  comment,
  setUserRating,
  setComment,
  handleSubmit,
  isSubmitting,
}) => (
  <form
    onSubmit={handleSubmit}
    className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200"
  >
    <h3 className="text-xl font-semibold text-gray-800 mb-6">Write a Review</h3>
    <div className="flex items-center space-x-4 mb-5">
      <span className="text-lg text-gray-700">Your Rating:</span>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setUserRating(star)}
            className={`text-3xl transition-colors ${
              userRating >= star
                ? "text-yellow-400 hover:text-yellow-500"
                : "text-gray-300 hover:text-gray-400"
            }`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
    <textarea
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      placeholder="How was your experience with this product? What did you like or dislike?"
      className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 resize-none"
      rows="4"
    />
    <button
      type="submit"
      disabled={isSubmitting || !userRating}
      className={`w-full mt-5 py-3 px-6 rounded-lg font-semibold transition-colors ${
        isSubmitting
          ? "bg-blue-400 cursor-wait"
          : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
      } ${!userRating ? "opacity-50 cursor-not-allowed" : "text-white"}`}
    >
      {isSubmitting ? "Submitting..." : "Submit Review"}
    </button>
  </form>
);

const ReviewCard = ({ rating }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const commentLimit = 300;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const isLongComment = rating.Comment.length > commentLimit;
  const displayComment =
    !isExpanded && isLongComment
      ? rating.Comment.slice(0, commentLimit) + "..."
      : rating.Comment;

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-sm mb-4 last:mb-0">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-xl ${
                star <= rating.Rating ? "text-orange-400" : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
        </div>
        <span className="text-sm text-gray-500 ml-2 font-medium">
          {rating.Rating}.0
        </span>
      </div>
      <p className="text-gray-700 mb-4 whitespace-pre-wrap">{displayComment}</p>
      {isLongComment && (
        <button
          onClick={toggleExpanded}
          className="text-blue-500 hover:underline focus:outline-none cursor-pointer"
        >
          {isExpanded ? "View Less" : "View More"}
        </button>
      )}
      <div className="flex items-center text-sm text-gray-500 mt-4">
        <span className="font-medium text-gray-800">
          {rating.Name || rating.UserEmail.split("@")[0]}
        </span>
        <span className="mx-2 font-medium">•</span>
        <span className="text-xs font-medium">
          {new Date(rating.CreatedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
  );
};

export default RatingComponent;
