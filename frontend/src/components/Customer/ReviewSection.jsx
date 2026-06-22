import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Star, Trash2 } from 'lucide-react';
import api from '../../services/api.js';
import { toast } from 'react-toastify';

const ReviewSection = ({ productId, onReviewAdded }) => {
  const { userInfo } = useSelector((state) => state.auth);
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const [isEligible, setIsEligible] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/product/${productId}`);
      setReviews(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error.message);
      setLoading(false);
    }
  };

  const checkEligibility = async () => {
    if (!userInfo) {
      setCheckingEligibility(false);
      return;
    }
    try {
      const res = await api.get('/orders/myorders');
      const orders = res.data;
      const hasDeliveredOrder = orders.some(
        (order) =>
          order.orderStatus === 'Delivered' &&
          order.orderItems.some((item) => (item.product?._id || item.product) === productId)
      );
      setIsEligible(hasDeliveredOrder);
    } catch (error) {
      console.error('Error checking review eligibility:', error);
    } finally {
      setCheckingEligibility(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    checkEligibility();
  }, [productId, userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      return toast.error('Please add a comment');
    }

    setSubmitting(true);
    try {
      await api.post('/reviews', {
        rating: Number(rating),
        comment,
        productId,
      });
      toast.success('Review submitted successfully!');
      setComment('');
      setRating(5);
      fetchReviews();
      if (onReviewAdded) onReviewAdded(); // Refresh parent rating summary
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await api.delete(`/reviews/${reviewId}`);
        toast.success('Review deleted');
        fetchReviews();
        if (onReviewAdded) onReviewAdded();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete review');
      }
    }
  };

  // Check if current user already submitted a review
  const userHasReviewed = reviews.some(
    (review) => review.user?._id === userInfo?._id || review.user === userInfo?._id
  );

  return (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
      <h3 className="text-xl font-bold text-slate-800 dark:text-white">Customer Reviews ({reviews.length})</h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Review Submission Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs dark:bg-slate-800 dark:border-slate-700 h-fit">
          <h4 className="text-sm font-bold text-slate-700 mb-4 dark:text-slate-200">Write a Review</h4>
          {userInfo ? (
            checkingEligibility ? (
              <p className="text-xs text-slate-400">Checking eligibility...</p>
            ) : !isEligible ? (
              <p className="text-xs text-rose-500 bg-rose-50/50 p-3.5 rounded-xl border border-rose-100/50 dark:bg-rose-950/10 dark:border-rose-900/30">
                You can only review this product after it has been successfully purchased and delivered to you.
              </p>
            ) : userHasReviewed ? (
              <p className="text-xs text-indigo-500 bg-indigo-50/50 p-3 rounded-lg dark:bg-indigo-950/20">
                You have already submitted a review for this product.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-2xs font-semibold text-slate-500 uppercase mb-1 dark:text-slate-400">Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                  >
                    <option value={5}>5 Stars - Excellent</option>
                    <option value={4}>4 Stars - Very Good</option>
                    <option value={3}>3 Stars - Average</option>
                    <option value={2}>2 Stars - Poor</option>
                    <option value={1}>1 Star - Terrible</option>
                  </select>
                </div>

                <div>
                  <label className="block text-2xs font-semibold text-slate-500 uppercase mb-1 dark:text-slate-400">Comment</label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this product..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2 rounded-lg transition"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )
          ) : (
            <p className="text-xs text-slate-500">
              Please <a href="/login" className="text-indigo-600 hover:underline">sign in</a> to leave a customer review.
            </p>
          )}
        </div>

        {/* Right: Reviews List */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="space-y-3">
              <div className="h-20 bg-slate-100 rounded-xl animate-pulse dark:bg-slate-800"></div>
              <div className="h-20 bg-slate-100 rounded-xl animate-pulse dark:bg-slate-800"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-slate-50 p-8 rounded-2xl text-center text-xs text-slate-400 dark:bg-slate-900">
              No reviews yet. Be the first to review this product!
            </div>
          ) : (
            reviews.map((review) => {
              const reviewUserObj = review.user;
              const reviewUserId = reviewUserObj?._id || reviewUserObj;
              const isOwner = userInfo && (userInfo._id === reviewUserId);
              const isAdmin = userInfo?.role === 'admin';

              return (
                <div key={review._id} className="bg-white p-5 rounded-2xl border border-slate-100/60 shadow-2xs dark:bg-slate-800 dark:border-slate-700/50 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-100">{review.name}</span>
                      <div className="flex text-amber-400 my-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < review.rating ? 'fill-current' : 'text-slate-200 dark:text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-slate-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                      {(isOwner || isAdmin) && (
                        <button
                          onClick={() => handleDelete(review._id)}
                          className="text-slate-400 hover:text-rose-500 transition p-1"
                          title="Delete review"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed dark:text-slate-300">
                    {review.comment}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
