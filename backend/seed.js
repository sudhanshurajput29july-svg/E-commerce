import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Category from './models/Category.js';
import Order from './models/Order.js';
import Review from './models/Review.js';
import Cart from './models/Cart.js';
import Wishlist from './models/Wishlist.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const seedData = async () => {
  try {
    // Clear all previous data
    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    await Cart.deleteMany();
    await Wishlist.deleteMany();

    console.log('Database cleared.');

    // Seed Categories
    const categories = await Category.insertMany([
      { name: 'Electronics', slug: 'electronics', description: 'Gadgets, phones, laptops, accessories' },
      { name: 'Fashion', slug: 'fashion', description: 'Clothing, footwear, bags, accessories' },
      { name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Furniture, kitchenware, decor' },
      { name: 'Beauty & Health', slug: 'beauty-health', description: 'Cosmetics, skincare, supplements' }
    ]);

    console.log('Categories seeded.');

    // Seed Users (passwords hashed by pre-save middleware)
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    const customerUser = await User.create({
      name: 'John Doe',
      email: 'customer@example.com',
      password: 'customer123',
      role: 'customer'
    });

    console.log('Users seeded.');

    // Init Cart & Wishlist
    await Cart.create({ user: adminUser._id, items: [] });
    await Wishlist.create({ user: adminUser._id, products: [] });

    const customerCart = await Cart.create({ user: customerUser._id, items: [] });
    const customerWishlist = await Wishlist.create({ user: customerUser._id, products: [] });

    // Extract categories
    const elec = categories[0]._id;
    const fash = categories[1]._id;
    const home = categories[2]._id;
    const beau = categories[3]._id;

    // Seed Products
    const productsData = [
      {
        name: 'Quantum Wireless Headphones',
        description: 'Experience high-fidelity audio with active noise cancellation, 40-hour battery life, and comfortable memory foam ear cups.',
        brand: 'Quantum',
        category: elec,
        price: 129.99,
        discountPrice: 99.99,
        stockQuantity: 25,
        ratings: 4.5,
        numReviews: 2,
        featured: true,
        images: ['/uploads/headphones.png']
      },
      {
        name: 'Apex Smartwatch Series 5',
        description: 'Track your fitness, heart rate, sleep quality, and stay connected with calls and notification alerts right on your wrist.',
        brand: 'ApexTech',
        category: elec,
        price: 249.99,
        discountPrice: 199.99,
        stockQuantity: 15,
        ratings: 4.8,
        numReviews: 1,
        featured: true,
        images: ['/uploads/smartwatch.png']
      },
      {
        name: 'Ergonomic Office Chair',
        description: 'Maximize your productivity and posture with adjustable lumbar support, 3D armrests, and high-density breathable mesh back.',
        brand: 'NordicHome',
        category: home,
        price: 299.99,
        discountPrice: 249.99,
        stockQuantity: 8,
        ratings: 4.6,
        numReviews: 0,
        featured: true,
        images: ['/uploads/chair.png']
      },
      {
        name: 'Pro-Level Mechanical Keyboard',
        description: 'A premium mechanical keyboard with hot-swappable switches, dynamic RGB backlighting, and heavy-duty aluminum chassis.',
        brand: 'Quantum',
        category: elec,
        price: 149.99,
        discountPrice: 119.99,
        stockQuantity: 20,
        ratings: 4.4,
        numReviews: 0,
        featured: false,
        images: ['/uploads/keyboard.png']
      },
      {
        name: 'Apex Ultra-HD Action Camera 4K',
        description: 'Capture your adventures in stunning 4K resolution. Waterproof up to 30m, features electronic image stabilization and a 170-degree wide-angle lens.',
        brand: 'ApexTech',
        category: elec,
        price: 199.99,
        discountPrice: 149.99,
        stockQuantity: 40,
        ratings: 4.5,
        numReviews: 0,
        featured: true,
        images: ['/uploads/action_camera.png']
      },
      {
        name: 'Aura Minimalist Leather Wallet',
        description: 'Handcrafted from full-grain leather, this minimalist card holder features RFID blocking technology and holds up to 8 cards plus cash.',
        brand: 'AuraFashion',
        category: fash,
        price: 39.99,
        discountPrice: 29.99,
        stockQuantity: 60,
        ratings: 4.7,
        numReviews: 0,
        featured: false,
        images: ['/uploads/wallet.png']
      },
      {
        name: 'Nordic Stainless Steel Kettle',
        description: 'Boil water rapidly with this sleek 1.7L stainless steel electric kettle. Features auto-shutoff, boil-dry protection, and a cool-touch handle.',
        brand: 'NordicHome',
        category: home,
        price: 59.99,
        discountPrice: 44.99,
        stockQuantity: 35,
        ratings: 4.4,
        numReviews: 0,
        featured: false,
        images: ['/uploads/kettle.png']
      },
      {
        name: 'Organic Lavender Essential Oil',
        description: '100% pure therapeutic grade lavender essential oil. Perfect for aromatherapy, diffusers, skincare, and promoting deep, restful sleep.',
        brand: 'GlowOrganics',
        category: beau,
        price: 19.99,
        discountPrice: 14.99,
        stockQuantity: 120,
        ratings: 4.8,
        numReviews: 0,
        featured: true,
        images: ['/uploads/lavender_oil.png']
      },
      {
        name: 'Quantum Rugged Bluetooth Speaker',
        description: 'Take your music anywhere with this IPX7 waterproof portable speaker. Delivers rich, clear sound with up to 24 hours of playtime on a single charge.',
        brand: 'Quantum',
        category: elec,
        price: 79.99,
        discountPrice: 59.99,
        stockQuantity: 55,
        ratings: 4.6,
        numReviews: 0,
        featured: false,
        images: ['/uploads/speaker.png']
      },
      // 20 NEW SEEDED PRODUCTS
      {
        name: 'Quantum True Wireless Earbuds',
        description: 'Premium wireless earbuds with active noise cancellation, deep bass response, and 30 hours of battery life with case.',
        brand: 'Quantum',
        category: elec,
        price: 49.99,
        discountPrice: 39.99,
        stockQuantity: 50,
        ratings: 4.5,
        numReviews: 0,
        featured: true,
        images: ['/uploads/headphones.png']
      },
      {
        name: 'Apex Smart Fitness Band',
        description: 'Sleek smart band with heart rate monitor, sleep tracking, step counter, and smart notifications.',
        brand: 'ApexTech',
        category: elec,
        price: 34.99,
        discountPrice: 29.99,
        stockQuantity: 75,
        ratings: 4.3,
        numReviews: 0,
        featured: false,
        images: ['/uploads/smartwatch.png']
      },
      {
        name: 'Quantum 6-in-1 USB-C Hub',
        description: 'Expand your device connectivity with HDMI, USB 3.0 ports, SD card readers, and USB-C power delivery input.',
        brand: 'Quantum',
        category: elec,
        price: 24.99,
        discountPrice: 19.99,
        stockQuantity: 90,
        ratings: 4.6,
        numReviews: 0,
        featured: false,
        images: ['/uploads/keyboard.png']
      },
      {
        name: 'Apex 10000mAh Slim Power Bank',
        description: 'Ultra-thin, light power bank supporting fast charging for smartphones, tablets, and wireless devices.',
        brand: 'ApexTech',
        category: elec,
        price: 19.99,
        discountPrice: 14.99,
        stockQuantity: 110,
        ratings: 4.4,
        numReviews: 0,
        featured: false,
        images: ['/uploads/action_camera.png']
      },
      {
        name: 'Aura Smart RGB LED Desk Lamp',
        description: 'Dimmable LED reading light with adjustable brightness, multi-color ambient modes, and built-in USB charging port.',
        brand: 'AuraFashion',
        category: elec,
        price: 29.99,
        discountPrice: 24.99,
        stockQuantity: 30,
        ratings: 4.5,
        numReviews: 0,
        featured: true,
        images: ['/uploads/speaker.png']
      },
      {
        name: 'Classic Men Denim Jacket',
        description: 'Timeless denim jacket made from high-grade cotton denim with metal button closure and classic pocket design.',
        brand: 'AuraFashion',
        category: fash,
        price: 49.99,
        discountPrice: 39.99,
        stockQuantity: 40,
        ratings: 4.7,
        numReviews: 0,
        featured: true,
        images: ['/uploads/wallet.png']
      },
      {
        name: 'Premium Women Leather Handbag',
        description: 'Elegant satchel purse crafted from genuine top-grain leather with spacious compartments and adjustable shoulder strap.',
        brand: 'AuraFashion',
        category: fash,
        price: 79.99,
        discountPrice: 64.99,
        stockQuantity: 25,
        ratings: 4.8,
        numReviews: 0,
        featured: true,
        images: ['/uploads/wallet.png']
      },
      {
        name: 'Nordic Running Shoes Sports',
        description: 'Ultra-lightweight mesh upper running shoes with responsive cushioning and non-slip durable rubber sole.',
        brand: 'NordicHome',
        category: fash,
        price: 59.99,
        discountPrice: 49.99,
        stockQuantity: 45,
        ratings: 4.4,
        numReviews: 0,
        featured: false,
        images: ['/uploads/chair.png']
      },
      {
        name: 'Unisex Polarized Sunglasses',
        description: 'Classic frame sunglasses with UV400 protective polarized lenses to reduce glare and protect your eyes.',
        brand: 'AuraFashion',
        category: fash,
        price: 14.99,
        discountPrice: 11.99,
        stockQuantity: 150,
        ratings: 4.5,
        numReviews: 0,
        featured: false,
        images: ['/uploads/wallet.png']
      },
      {
        name: 'Aura Casual Cotton Slim Shirt',
        description: 'Comfortable button-down shirt made from breathable organic cotton, perfect for casual and semi-formal wear.',
        brand: 'AuraFashion',
        category: fash,
        price: 24.99,
        discountPrice: 19.99,
        stockQuantity: 80,
        ratings: 4.3,
        numReviews: 0,
        featured: false,
        images: ['/uploads/wallet.png']
      },
      {
        name: 'Nordic Ceramic Cookware Set',
        description: 'Complete 10-piece non-stick cookware set including frying pans and saucepans with heat-resistant handles.',
        brand: 'NordicHome',
        category: home,
        price: 119.99,
        discountPrice: 99.99,
        stockQuantity: 15,
        ratings: 4.6,
        numReviews: 0,
        featured: true,
        images: ['/uploads/kettle.png']
      },
      {
        name: 'Nordic Insulated Coffee Mug',
        description: 'Double-wall stainless steel vacuum insulated travel tumbler that keeps beverages hot for 6 hours or cold for 12 hours.',
        brand: 'NordicHome',
        category: home,
        price: 12.99,
        discountPrice: 9.99,
        stockQuantity: 140,
        ratings: 4.7,
        numReviews: 0,
        featured: false,
        images: ['/uploads/kettle.png']
      },
      {
        name: 'Plush Cotton Bath Towels',
        description: 'Set of 4 soft, highly absorbent towels made from 100% Turkish combed cotton with luxurious ribbed border.',
        brand: 'NordicHome',
        category: home,
        price: 18.99,
        discountPrice: 14.99,
        stockQuantity: 65,
        ratings: 4.5,
        numReviews: 0,
        featured: false,
        images: ['/uploads/chair.png']
      },
      {
        name: 'Memory Foam Sleeping Pillow',
        description: 'Ergonomic neck support contour pillow designed to relieve back, shoulder, and neck pain for side and back sleepers.',
        brand: 'NordicHome',
        category: home,
        price: 24.99,
        discountPrice: 19.99,
        stockQuantity: 35,
        ratings: 4.4,
        numReviews: 0,
        featured: false,
        images: ['/uploads/chair.png']
      },
      {
        name: 'Aromatic Soy Candle Gift Set',
        description: 'Set of 4 relaxing scented candles (Lavender, Rose, Lemon, Fig) hand-poured in decorative tins.',
        brand: 'NordicHome',
        category: home,
        price: 15.99,
        discountPrice: 12.99,
        stockQuantity: 85,
        ratings: 4.8,
        numReviews: 0,
        featured: true,
        images: ['/uploads/kettle.png']
      },
      {
        name: 'Glow Vitamin C Face Serum',
        description: 'Powerful anti-aging facial serum containing Vitamin C, Hyaluronic Acid, and Vitamin E to brighten skin tone and reduce dark spots.',
        brand: 'GlowOrganics',
        category: beau,
        price: 14.99,
        discountPrice: 11.99,
        stockQuantity: 95,
        ratings: 4.6,
        numReviews: 0,
        featured: true,
        images: ['/uploads/lavender_oil.png']
      },
      {
        name: 'Glow Mineral Sunscreen SPF 50',
        description: 'Broad-spectrum physical sunscreen containing zinc oxide and titanium dioxide for lightweight, non-greasy sun protection.',
        brand: 'GlowOrganics',
        category: beau,
        price: 9.99,
        discountPrice: 7.99,
        stockQuantity: 120,
        ratings: 4.5,
        numReviews: 0,
        featured: false,
        images: ['/uploads/lavender_oil.png']
      },
      {
        name: 'Glow Moisturizing Aloe Gel',
        description: 'Organic cooling gel formulated with 99% pure aloe vera extract to soothe sunburn, hydrate skin, and calm irritation.',
        brand: 'GlowOrganics',
        category: beau,
        price: 5.99,
        discountPrice: 4.99,
        stockQuantity: 200,
        ratings: 4.7,
        numReviews: 0,
        featured: false,
        images: ['/uploads/lavender_oil.png']
      },
      {
        name: 'Glow Premium Beard Oil',
        description: 'All-natural grooming oil with argan, jojoba, and almond oil to soften coarse hair, hydrate the skin, and promote healthy beard growth.',
        brand: 'GlowOrganics',
        category: beau,
        price: 7.99,
        discountPrice: 5.99,
        stockQuantity: 70,
        ratings: 4.4,
        numReviews: 0,
        featured: false,
        images: ['/uploads/lavender_oil.png']
      },
      {
        name: 'Glow Coffee Body Scrub',
        description: 'Exfoliating body scrub made with organic kona coffee grounds, sweet almond oil, and sea salt to reduce cellulite and soften skin.',
        brand: 'GlowOrganics',
        category: beau,
        price: 8.99,
        discountPrice: 6.99,
        stockQuantity: 90,
        ratings: 4.5,
        numReviews: 0,
        featured: true,
        images: ['/uploads/lavender_oil.png']
      },
      // 15 MORE PRODUCTS ADDED
      {
        name: 'Quantum Multi-Device Bluetooth Mouse',
        description: 'Sleek and silent wireless mouse connecting to up to 3 devices via Bluetooth or USB receiver, with adjustable DPI and long-lasting rechargeable battery.',
        brand: 'Quantum',
        category: elec,
        price: 34.99,
        discountPrice: 27.99,
        stockQuantity: 80,
        ratings: 4.5,
        numReviews: 0,
        featured: false,
        images: ['/uploads/keyboard.png']
      },
      {
        name: 'Apex Dual-Lens Dash Camera',
        description: 'High-definition front and cabin dash camera featuring super night vision, G-sensor collision detection, and loop recording.',
        brand: 'ApexTech',
        category: elec,
        price: 89.99,
        discountPrice: 74.99,
        stockQuantity: 45,
        ratings: 4.4,
        numReviews: 0,
        featured: false,
        images: ['/uploads/action_camera.png']
      },
      {
        name: 'Quantum Portable SSD 1TB',
        description: 'Ultra-fast external solid-state drive with read/write speeds up to 1050MB/s, shock-resistant aluminum casing, and secure encryption.',
        brand: 'Quantum',
        category: elec,
        price: 109.99,
        discountPrice: 89.99,
        stockQuantity: 50,
        ratings: 4.8,
        numReviews: 0,
        featured: true,
        images: ['/uploads/headphones.png']
      },
      {
        name: 'Apex Ergonomic Laptop Stand',
        description: 'Adjustable aluminum laptop riser with multi-angle height options, non-slip silicone pads, and heat dissipation airflow design.',
        brand: 'ApexTech',
        category: elec,
        price: 29.99,
        discountPrice: 24.99,
        stockQuantity: 65,
        ratings: 4.6,
        numReviews: 0,
        featured: false,
        images: ['/uploads/smartwatch.png']
      },
      {
        name: 'Classic Canvas Backpack',
        description: 'Durable vintage-style canvas laptop backpack with spacious main compartment, multiple pockets, and padded shoulder straps for daily travel.',
        brand: 'AuraFashion',
        category: fash,
        price: 45.99,
        discountPrice: 34.99,
        stockQuantity: 55,
        ratings: 4.5,
        numReviews: 0,
        featured: false,
        images: ['/uploads/wallet.png']
      },
      {
        name: 'Unisex Wool Winter Scarf',
        description: 'Luxuriously soft and warm knit wool scarf, perfect for cold weather layering and stylish winter outfits.',
        brand: 'AuraFashion',
        category: fash,
        price: 24.99,
        discountPrice: 19.99,
        stockQuantity: 110,
        ratings: 4.7,
        numReviews: 0,
        featured: false,
        images: ['/uploads/wallet.png']
      },
      {
        name: 'Aura Lightweight Bomber Jacket',
        description: 'Modern casual windbreaker bomber jacket featuring a water-resistant shell, ribbed cuffs, and multiple utility pockets.',
        brand: 'AuraFashion',
        category: fash,
        price: 69.99,
        discountPrice: 54.99,
        stockQuantity: 40,
        ratings: 4.6,
        numReviews: 0,
        featured: true,
        images: ['/uploads/wallet.png']
      },
      {
        name: 'Nordic Lightweight Athletic Socks',
        description: 'Pack of 6 breathable, moisture-wicking cushion sole crew socks, ideal for running, gym workouts, and daily wear.',
        brand: 'NordicHome',
        category: fash,
        price: 19.99,
        discountPrice: 15.99,
        stockQuantity: 130,
        ratings: 4.4,
        numReviews: 0,
        featured: false,
        images: ['/uploads/chair.png']
      },
      {
        name: 'Nordic Bamboo Cutting Board Set',
        description: 'Set of 3 eco-friendly bamboo kitchen boards with juice grooves and easy-grip handles, perfect for prep and serving.',
        brand: 'NordicHome',
        category: home,
        price: 29.99,
        discountPrice: 22.99,
        stockQuantity: 70,
        ratings: 4.6,
        numReviews: 0,
        featured: false,
        images: ['/uploads/kettle.png']
      },
      {
        name: 'Nordic Double-Wall Glass Coffee Mugs',
        description: 'Set of 2 heat-insulated borosilicate glass mugs, keeps your cappuccino hot while staying cool to the touch.',
        brand: 'NordicHome',
        category: home,
        price: 24.99,
        discountPrice: 19.99,
        stockQuantity: 85,
        ratings: 4.7,
        numReviews: 0,
        featured: true,
        images: ['/uploads/kettle.png']
      },
      {
        name: 'Minimalist Ceramic Flower Vase',
        description: 'Elegant matte-finished ceramic vase for tabletop decor, adding a modern geometric look to any living space.',
        brand: 'NordicHome',
        category: home,
        price: 18.99,
        discountPrice: 14.99,
        stockQuantity: 90,
        ratings: 4.5,
        numReviews: 0,
        featured: false,
        images: ['/uploads/chair.png']
      },
      {
        name: 'Nordic Digital Kitchen Scale',
        description: 'Precision electronic scale with auto-tare function, clear LCD screen, and easy-to-clean tempered glass surface.',
        brand: 'NordicHome',
        category: home,
        price: 15.99,
        discountPrice: 12.99,
        stockQuantity: 120,
        ratings: 4.6,
        numReviews: 0,
        featured: false,
        images: ['/uploads/kettle.png']
      },
      {
        name: 'Glow Hydrating Lip Balm Pack',
        description: 'Set of 3 nourishing lip balms enriched with organic shea butter, coconut oil, and natural fruit extracts for chapped lip repair.',
        brand: 'GlowOrganics',
        category: beau,
        price: 8.99,
        discountPrice: 6.99,
        stockQuantity: 160,
        ratings: 4.8,
        numReviews: 0,
        featured: true,
        images: ['/uploads/lavender_oil.png']
      },
      {
        name: 'Glow Tea Tree Facial Cleanser',
        description: 'Gentle purifying foaming cleanser formulated with organic tea tree oil to balance oily skin and target blemishes without drying.',
        brand: 'GlowOrganics',
        category: beau,
        price: 12.99,
        discountPrice: 9.99,
        stockQuantity: 105,
        ratings: 4.5,
        numReviews: 0,
        featured: false,
        images: ['/uploads/lavender_oil.png']
      },
      {
        name: 'Glow Charcoal Face Mask',
        description: 'Deep-cleansing peel-off mask with activated charcoal and bentonite clay to extract blackheads, reduce pores, and absorb excess oil.',
        brand: 'GlowOrganics',
        category: beau,
        price: 11.99,
        discountPrice: 8.99,
        stockQuantity: 90,
        ratings: 4.4,
        numReviews: 0,
        featured: false,
        images: ['/uploads/lavender_oil.png']
      }
    ];

    const seededProducts = await Product.insertMany(productsData);
    console.log('Products seeded.');

    // Seed some reviews
    const review1 = await Review.create({
      user: customerUser._id,
      product: seededProducts[0]._id,
      name: customerUser.name,
      rating: 5,
      comment: 'Absolutely love these! The noise cancellation is premium and battery life is incredible.'
    });

    const review2 = await Review.create({
      user: adminUser._id,
      product: seededProducts[0]._id,
      name: adminUser.name,
      rating: 4,
      comment: 'Very good sound quality, but the ear cups get a bit warm after wearing them for hours.'
    });

    const review3 = await Review.create({
      user: customerUser._id,
      product: seededProducts[1]._id,
      name: customerUser.name,
      rating: 5,
      comment: 'Excellent smart watch. Tracking metrics are spot on and UI is super fast.'
    });

    const review4 = await Review.create({
      user: customerUser._id,
      product: seededProducts[7]._id,
      name: customerUser.name,
      rating: 5,
      comment: 'My skin feels so smooth and glowing after using this for a week. Highly recommend.'
    });

    console.log('Reviews seeded.');

    // Seed some orders to restore dashboard stats
    const harshUser = await User.create({
      name: 'Harsh',
      email: 'harsh@gmail.com',
      password: 'customer123',
      role: 'customer'
    });
    await Cart.create({ user: harshUser._id, items: [] });
    await Wishlist.create({ user: harshUser._id, products: [] });

    await Order.create({
      user: customerUser._id,
      orderItems: [
        {
          name: seededProducts[0].name,
          quantity: 1,
          image: seededProducts[0].images[0],
          price: seededProducts[0].discountPrice || seededProducts[0].price,
          product: seededProducts[0]._id
        }
      ],
      shippingAddress: {
        address: '123 Main St',
        city: 'New York',
        postalCode: '10001',
        country: 'United States',
        phone: '+15550192834'
      },
      paymentMethod: 'Stripe',
      paymentResult: {
        id: 'Stripe-TXN-11111111',
        status: 'success',
        update_time: new Date().toISOString(),
        email_address: customerUser.email
      },
      itemsPrice: 99.99,
      taxPrice: 18.00,
      shippingPrice: 0.00,
      totalPrice: 117.99,
      isPaid: true,
      paidAt: Date.now(),
      isDelivered: true,
      deliveredAt: Date.now(),
      orderStatus: 'Delivered'
    });

    await Order.create({
      user: harshUser._id,
      orderItems: [
        {
          name: seededProducts[1].name,
          quantity: 1,
          image: seededProducts[1].images[0],
          price: seededProducts[1].discountPrice || seededProducts[1].price,
          product: seededProducts[1]._id
        }
      ],
      shippingAddress: {
        address: 'Ghaziabad',
        city: 'Delhi',
        postalCode: '201001',
        country: 'India',
        phone: '+919368957850'
      },
      paymentMethod: 'COD',
      paymentResult: {
        id: 'COD-1782062631768',
        status: 'Completed',
        update_time: new Date().toISOString(),
        email_address: 'harsh@gmail.com'
      },
      itemsPrice: 199.99,
      taxPrice: 36.00,
      shippingPrice: 0.00,
      totalPrice: 235.99,
      isPaid: true,
      paidAt: Date.now(),
      isDelivered: true,
      deliveredAt: Date.now(),
      orderStatus: 'Delivered'
    });

    console.log('Orders seeded.');
    console.log('Database Seeding Completed Successfully.');
    process.exit(0);
  } catch (error) {
    console.error(`Error Seeding Data: ${error.message}`);
    process.exit(1);
  }
};

seedData();
