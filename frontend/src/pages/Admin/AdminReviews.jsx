import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, Trash2 } from 'lucide-react';
import api from '../../services/api.js';
import { toast } from 'react-toastify';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews');
      setReviews(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin reviews:', error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await api.delete(`/reviews/${reviewId}`);
        toast.success('Review deleted');
        fetchReviews();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error deleting review');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-5 mb-5 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Customer Reviews</h2>
        <p className="text-xs text-slate-400">Inspect comments, buyer scores, and delete inappropriate reviews</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden dark:bg-slate-800 dark:border-slate-700/60 shadow-2xs">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No customer reviews recorded.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider dark:bg-slate-900/50 dark:border-slate-700">
                  <th className="p-4">Product</th>
                  <th className="p-4">Reviewer</th>
                  <th className="p-4">Score</th>
                  <th className="p-4">Comment</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {reviews.map((rev) => (
                  <tr key={rev._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition">
                    <td className="p-4 font-bold text-slate-850 dark:text-slate-100 max-w-[120px] truncate">
                      {rev.product?.name || 'Deleted Product'}
                    </td>
                    <td className="p-4 font-semibold text-slate-705 dark:text-slate-300">{rev.user?.name || rev.name}</td>
                    <td className="p-4">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3.5 w-3.5 ${i < rev.rating ? 'fill-current' : 'text-slate-200 dark:text-slate-750'}`} />
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 max-w-xs truncate dark:text-slate-400">{rev.comment}</td>
                    <td className="p-4 text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDeleteReview(rev._id)}
                        className="p-1.5 border border-slate-200 rounded-lg text-rose-500 hover:bg-rose-50 dark:border-slate-700 dark:hover:bg-rose-950/20"
                        title="Delete review"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
