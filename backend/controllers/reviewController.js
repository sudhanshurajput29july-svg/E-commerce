import Review from '../models/Review.js';
import Product from '../models/Product.js';

// Helper to update average rating and number of reviews for a product
const updateProductRatings = async (productId) => {
  const reviews = await Review.find({ product: productId });
  const numReviews = reviews.length;
  
  let ratings = 0;
  if (numReviews > 0) {
    const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
    ratings = Number((totalRating / numReviews).toFixed(1));
  } else {
    ratings = 0;
  }

  await Product.findByIdAndUpdate(productId, {
    ratings,
    numReviews,
  });
};

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
export const addProductReview = async (req, res) => {
  const { rating, comment, productId } = req.body;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed by this user' });
    }

    const review = new Review({
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
      product: productId,
    });

    await review.save();
    await updateProductRatings(productId);

    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product reviews
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Authorized user: Admin or the review owner
    if (req.user.role === 'admin' || review.user.toString() === req.user._id.toString()) {
      const productId = review.product;
      await Review.findByIdAndDelete(req.params.id);
      
      // Update product ratings cache
      await updateProductRatings(productId);
      
      res.json({ message: 'Review deleted successfully' });
    } else {
      res.status(403).json({ message: 'Not authorized to delete this review' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews (Admin only)
// @route   GET /api/reviews
// @access  Private/Admin
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate('user', 'name email')
      .populate('product', 'name price')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
