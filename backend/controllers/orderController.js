import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  try {
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Check stock quantities first
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }
      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.name}. Available: ${product.stockQuantity}`,
        });
      }
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    // If Cash on Delivery, mark payment result as COD pending
    if (paymentMethod === 'COD') {
      order.paymentResult = {
        id: `COD-${Date.now()}`,
        status: 'Pending',
        update_time: new Date().toISOString(),
        email_address: req.user.email,
      };
    }

    const createdOrder = await order.save();

    // Deduct stock quantity
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stockQuantity: -item.quantity },
      });
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify authorized user (admin or owner)
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied to this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order to paid (Stripe / Razorpay mock verification)
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id || `MOCK-${Date.now()}`,
        status: req.body.status || 'success',
        update_time: req.body.update_time || new Date().toISOString(),
        email_address: req.body.email_address || req.user.email,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (delivery tracking)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  const { status, processingAt, shippedAt, deliveredAt, cancelledAt } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      if (status !== undefined) {
        order.orderStatus = status;

        // Auto-assign dates on status change if not set and not explicitly overridden
        if (status === 'Processing' && !order.processingAt && processingAt === undefined) {
          order.processingAt = Date.now();
        } else if (status === 'Shipped' && !order.shippedAt && shippedAt === undefined) {
          order.shippedAt = Date.now();
        } else if (status === 'Delivered' && !order.deliveredAt && deliveredAt === undefined) {
          order.deliveredAt = Date.now();
        } else if (status === 'Cancelled' && !order.cancelledAt && cancelledAt === undefined) {
          order.cancelledAt = Date.now();
        }
      }

      // Explicitly update individual status dates if provided
      if (processingAt !== undefined) {
        order.processingAt = processingAt || null;
      }
      if (shippedAt !== undefined) {
        order.shippedAt = shippedAt || null;
      }
      if (deliveredAt !== undefined) {
        order.deliveredAt = deliveredAt || null;
      }
      if (cancelledAt !== undefined) {
        order.cancelledAt = cancelledAt || null;
      }

      if (status === 'Delivered') {
        order.isDelivered = true;
        if (!order.deliveredAt) {
          order.deliveredAt = Date.now();
        }
        // If COD, mark paid on delivery
        if (order.paymentMethod === 'COD' && !order.isPaid) {
          order.isPaid = true;
          order.paidAt = Date.now();
          order.paymentResult.status = 'Completed';
        }
      } else if (status === 'Cancelled') {
        if (!order.cancelledAt) {
          order.cancelledAt = Date.now();
        }
        // Restock products if order is cancelled
        for (const item of order.orderItems) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stockQuantity: item.quantity },
          });
        }
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard analytics (Admin only)
// @route   GET /api/orders/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments({});
    const totalOrders = await Order.countDocuments({});
    
    // Sum revenue for all PAID orders (and COD orders that are Delivered, which counts as paid)
    const paidOrders = await Order.find({ isPaid: true });
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalPrice, 0);

    // Sales by category count (useful graph metric)
    const orders = await Order.find({}).populate({
      path: 'orderItems.product',
      populate: { path: 'category' }
    });

    const categorySales = {};
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        if (item.product && item.product.category) {
          const catName = item.product.category.name;
          categorySales[catName] = (categorySales[catName] || 0) + (item.price * item.quantity);
        }
      });
    });

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      categorySales
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
