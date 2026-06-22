import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { isCloudinaryConfigured, cloudinary } from '../config/cloudinary.js';
import fs from 'fs';

// Helper to upload a single file (to Cloudinary if configured, else fallback to static path)
const uploadToStorage = async (file) => {
  if (isCloudinaryConfigured) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'e-commerce',
      });
      // Remove local temp file
      fs.unlinkSync(file.path);
      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error, falling back to local path:', error.message);
      return `/uploads/${file.filename}`;
    }
  }
  return `/uploads/${file.filename}`;
};

// @desc    Get all products (with filters, search, and sorting)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice, rating, search, sort } = req.query;
    
    // Construct query object
    let query = {};

    // Search filter (name/description matching)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter
    if (category) {
      // Find category by slug/name/id
      const foundCategory = await Category.findOne({
        $or: [
          { _id: category.match(/^[0-9a-fA-F]{24}$/) ? category : null },
          { slug: category },
          { name: category }
        ].filter(Boolean)
      });
      if (foundCategory) {
        query.category = foundCategory._id;
      } else {
        // Return empty if category requested but not found
        return res.json({ products: [], page: 1, pages: 0, total: 0 });
      }
    }

    // Brand filter
    if (brand) {
      query.brand = { $regex: `^${brand}$`, $options: 'i' };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Rating filter (greater than or equal to value)
    if (rating) {
      query.ratings = { $gte: Number(rating) };
    }

    // Sort definition
    let sortQuery = { createdAt: -1 }; // default: newest first
    if (sort) {
      switch (sort) {
        case 'price-asc':
          sortQuery = { price: 1 };
          break;
        case 'price-desc':
          sortQuery = { price: -1 };
          break;
        case 'rating':
          sortQuery = { ratings: -1 };
          break;
        case 'newest':
          sortQuery = { createdAt: -1 };
          break;
        default:
          sortQuery = { createdAt: -1 };
      }
    }

    // Run query
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortQuery);

    res.json({
      products,
      total: products.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get related products (same category)
// @route   GET /api/products/:id/related
// @access  Public
export const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find products in same category, excluding current product
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    })
      .limit(4)
      .populate('category', 'name slug');

    res.json(related);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const { name, price, discountPrice, description, brand, category, stockQuantity, featured } = req.body;

    // Handle files upload
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToStorage(file);
        imageUrls.push(url);
      }
    } else {
      // Default placeholder image if none uploaded
      imageUrls.push('/uploads/placeholder.png');
    }

    const product = new Product({
      name,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      description,
      brand,
      category,
      stockQuantity: Number(stockQuantity),
      featured: featured === 'true' || featured === true,
      images: imageUrls,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { name, price, discountPrice, description, brand, category, stockQuantity, featured, existingImages } = req.body;
    
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Parse existing images (sent back as JSON string or array)
    let imageUrls = [];
    if (existingImages) {
      try {
        imageUrls = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
      } catch (e) {
        imageUrls = Array.isArray(existingImages) ? existingImages : [existingImages];
      }
    }

    // Append new uploaded images if any
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToStorage(file);
        imageUrls.push(url);
      }
    }

    product.name = name || product.name;
    product.price = price !== undefined ? Number(price) : product.price;
    product.discountPrice = discountPrice !== undefined ? Number(discountPrice) : product.discountPrice;
    product.description = description || product.description;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.stockQuantity = stockQuantity !== undefined ? Number(stockQuantity) : product.stockQuantity;
    product.featured = featured !== undefined ? (featured === 'true' || featured === true) : product.featured;
    product.images = imageUrls.length > 0 ? imageUrls : product.images;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // If locally stored images, we could clean them up here
      // But keeping simple to avoid permission errors
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
