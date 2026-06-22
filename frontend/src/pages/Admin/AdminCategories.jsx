import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit, Trash2, X } from 'lucide-react';
import api from '../../services/api.js';
import { toast } from 'react-toastify';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [formOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCatId, setCurrentCatId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddForm = () => {
    setEditMode(false);
    setCurrentCatId(null);
    setName('');
    setDescription('');
    setFormOpen(true);
  };

  const openEditForm = (cat) => {
    setEditMode(true);
    setCurrentCatId(cat._id);
    setName(cat.name);
    setDescription(cat.description || '');
    setFormOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!name) return toast.error('Category name is required');

    setSubmitting(true);
    try {
      if (editMode) {
        await api.put(`/categories/${currentCatId}`, { name, description });
        toast.success('Category updated');
      } else {
        await api.post('/categories', { name, description });
        toast.success('Category created');
      }
      setFormOpen(false);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (catId) => {
    if (window.confirm('Are you sure you want to delete this category? All products under this category might become uncategorized.')) {
      try {
        await api.delete(`/categories/${catId}`);
        toast.success('Category deleted');
        fetchCategories();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error deleting category');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-100 pb-5 mb-5 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Product Categories</h2>
          <p className="text-xs text-slate-400">Add, edit, or delete catalog category tags</p>
        </div>
        <button
          onClick={openAddForm}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center transition shadow-sm"
        >
          <Plus className="h-4 w-4 mr-1.5" /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden dark:bg-slate-800 dark:border-slate-700/60 shadow-2xs">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No categories found. Create one to classify products.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider dark:bg-slate-900/50 dark:border-slate-700">
                  <th className="p-4">Category Name</th>
                  <th className="p-4">URL Slug</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition">
                    <td className="p-4 font-bold text-slate-850 dark:text-slate-100">{cat.name}</td>
                    <td className="p-4 font-mono text-indigo-600 dark:text-indigo-400">{cat.slug}</td>
                    <td className="p-4 text-slate-500 max-w-xs truncate dark:text-slate-400">{cat.description || 'No description provided'}</td>
                    <td className="p-4 flex items-center justify-center space-x-2">
                      <button
                        onClick={() => openEditForm(cat)}
                        className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-900"
                        title="Edit category"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat._id)}
                        className="p-1.5 border border-slate-200 rounded-lg text-rose-500 hover:bg-rose-50 dark:border-slate-700 dark:hover:bg-rose-950/20"
                        title="Delete category"
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

      {/* Drawer Form Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setFormOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white dark:bg-slate-950 p-6 shadow-2xl flex flex-col h-full">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5 dark:border-slate-850">
              <div className="flex items-center space-x-2">
                <Layers className="h-5 w-5 text-indigo-600" />
                <span className="font-extrabold text-sm text-slate-850 dark:text-white">
                  {editMode ? 'Edit Category Details' : 'Add New Category'}
                </span>
              </div>
              <button onClick={() => setFormOpen(false)} className="text-slate-400 hover:text-slate-500">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form inputs */}
            <form onSubmit={handleSaveCategory} className="space-y-4 flex-grow">
              <div>
                <label className="block text-3xs font-bold text-slate-500 uppercase mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Home Decor"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-3xs font-bold text-slate-500 uppercase mb-1">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe categories characteristics..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-2xl text-xs transition mt-6"
              >
                {submitting ? 'Saving category...' : 'Save Category Details'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
