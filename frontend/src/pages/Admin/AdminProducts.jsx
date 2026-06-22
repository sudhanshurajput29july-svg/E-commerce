import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Edit, Trash2, X, UploadCloud, CheckCircle } from 'lucide-react';
import api, { getImageUrl } from '../../services/api.js';
import { toast } from 'react-toastify';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [editMode, setEditMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [featured, setFeatured] = useState(false);
  
  // Image files states
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data.products);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error.message);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
      if (res.data.length > 0 && !category) {
        setCategory(res.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const openAddForm = () => {
    setEditMode(false);
    setCurrentProductId(null);
    setName('');
    setPrice('');
    setDiscountPrice('');
    setDescription('');
    setBrand('');
    if (categories.length > 0) setCategory(categories[0]._id);
    setStockQuantity('');
    setFeatured(false);
    setImageFiles([]);
    setExistingImages([]);
    setFormOpen(true);
  };

  const openEditForm = (product) => {
    setEditMode(true);
    setCurrentProductId(product._id);
    setName(product.name);
    setPrice(product.price);
    setDiscountPrice(product.discountPrice || '');
    setDescription(product.description);
    setBrand(product.brand);
    setCategory(product.category?._id || product.category || '');
    setStockQuantity(product.stockQuantity);
    setFeatured(product.featured || false);
    setExistingImages(product.images || []);
    setImageFiles([]);
    setFormOpen(true);
  };

  const handleFileChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const handleDeleteExistingImage = (imgUrl) => {
    setExistingImages(existingImages.filter((img) => img !== imgUrl));
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!name || !price || !description || !brand || !category || stockQuantity === '') {
      return toast.error('Please complete all required fields');
    }

    setUploading(true);

    try {
      // Prepare multi-part FormData
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', Number(price));
      formData.append('discountPrice', discountPrice ? Number(discountPrice) : 0);
      formData.append('description', description);
      formData.append('brand', brand);
      formData.append('category', category);
      formData.append('stockQuantity', Number(stockQuantity));
      formData.append('featured', featured);
      
      // Append existing images JSON
      formData.append('existingImages', JSON.stringify(existingImages));

      // Append upload files
      for (let i = 0; i < imageFiles.length; i++) {
        formData.append('images', imageFiles[i]);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      if (editMode) {
        await api.put(`/products/${currentProductId}`, formData, config);
        toast.success('Product updated successfully!');
      } else {
        await api.post('/products', formData, config);
        toast.success('Product created successfully!');
      }

      setFormOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving product');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${productId}`);
        toast.success('Product deleted');
        fetchProducts();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error deleting product');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header toolbar */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-5 mb-5 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Manage Products</h2>
          <p className="text-xs text-slate-400">Add, modify, or remove products from catalog</p>
        </div>
        <button
          onClick={openAddForm}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center transition shadow-sm"
        >
          <Plus className="h-4 w-4 mr-1.5" /> Add New Product
        </button>
      </div>

      {/* Products table */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden dark:bg-slate-800 dark:border-slate-700/60 shadow-2xs">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading catalog...</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No products found. Add some to get started.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider dark:bg-slate-900/50 dark:border-slate-700">
                  <th className="p-4">Item Details</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Base Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition">
                    <td className="p-4 flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900 flex-shrink-0">
                        <img src={getImageUrl(prod.images?.[0])} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block dark:text-slate-100">{prod.name}</span>
                        <span className="text-3xs text-slate-400 uppercase font-semibold">{prod.brand}</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-700 dark:text-slate-350">{prod.category?.name || 'Uncategorized'}</td>
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-200">₹{prod.price.toFixed(2)}</td>
                    <td className={`p-4 font-bold ${prod.stockQuantity > 5 ? 'text-slate-700 dark:text-slate-350' : prod.stockQuantity > 0 ? 'text-amber-500' : 'text-rose-500'}`}>
                      {prod.stockQuantity} qty
                    </td>
                    <td className="p-4 flex items-center justify-center space-x-2">
                      <button
                        onClick={() => openEditForm(prod)}
                        className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-900"
                        title="Edit product"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod._id)}
                        className="p-1.5 border border-slate-200 rounded-lg text-rose-500 hover:bg-rose-50 dark:border-slate-700 dark:hover:bg-rose-950/20"
                        title="Delete product"
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

      {/* Slide-out Drawer Panel Form */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setFormOpen(false)}></div>
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-950 p-6 shadow-2xl flex flex-col h-full overflow-y-auto">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5 dark:border-slate-850">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5 text-indigo-600" />
                <span className="font-extrabold text-sm text-slate-850 dark:text-white">
                  {editMode ? 'Edit Product Details' : 'Create New Product'}
                </span>
              </div>
              <button onClick={() => setFormOpen(false)} className="text-slate-400 hover:text-slate-500">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProduct} className="space-y-4 flex-1">
              <div>
                <label className="block text-3xs font-bold text-slate-500 uppercase mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Quantum Headphones v2"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-3xs font-bold text-slate-500 uppercase mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Quantum"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-bold text-slate-500 uppercase mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-3xs font-bold text-slate-500 uppercase mb-1">Base Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="99.99"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-bold text-slate-500 uppercase mb-1">Discount Price (₹)</label>
                  <input
                    type="number"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    placeholder="79.99"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-bold text-slate-500 uppercase mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    placeholder="50"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-3xs font-bold text-slate-500 uppercase mb-1">Product Description *</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe key specs, warranty, features..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                ></textarea>
              </div>

              {/* Multi image upload inputs */}
              <div className="space-y-2">
                <label className="block text-3xs font-bold text-slate-500 uppercase mb-1">Upload Product Images</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-slate-200 border-dashed rounded-2xl cursor-pointer hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900/50">
                    <div className="flex flex-col items-center justify-center pt-2 pb-3">
                      <UploadCloud className="h-6 w-6 text-slate-400 mb-1" />
                      <p className="text-[10px] text-slate-500"><span className="font-bold">Click to upload</span> (Accepts up to 5 images)</p>
                    </div>
                    <input type="file" multiple onChange={handleFileChange} className="hidden" accept="image/*" />
                  </label>
                </div>

                {imageFiles.length > 0 && (
                  <div className="text-[10px] text-slate-500 bg-slate-50 p-2.5 rounded-lg dark:bg-slate-900">
                    <span className="font-bold text-slate-700 dark:text-slate-350">Files selected to upload:</span>
                    <ul className="list-disc pl-4 mt-1 space-y-0.5">
                      {imageFiles.map((file, i) => <li key={i} className="truncate">{file.name}</li>)}
                    </ul>
                  </div>
                )}

                {/* Display existing images for edit mode */}
                {editMode && existingImages.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <label className="block text-[10px] font-bold text-slate-500">Current Saved Images</label>
                    <div className="flex space-x-2 overflow-x-auto pb-1">
                      {existingImages.map((img, idx) => (
                        <div key={idx} className="relative h-16 w-16 border rounded-lg overflow-hidden flex-shrink-0">
                          <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleDeleteExistingImage(img)}
                            className="absolute top-0.5 right-0.5 bg-rose-500 text-white rounded-full p-0.5 hover:scale-105"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Featured toggle */}
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="featured" className="text-3xs font-bold text-slate-500 uppercase cursor-pointer dark:text-slate-400">Feature this product on the home banner</label>
              </div>

              {/* Action buttons */}
              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-2xl text-xs transition mt-6"
              >
                {uploading ? 'Uploading assets & saving...' : 'Save Product Listing'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
