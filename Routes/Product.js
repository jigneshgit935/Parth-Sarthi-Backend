import express from 'express';
import jwt from 'jsonwebtoken';
import authTokenHandler from '../Middlewares/checkAuthTokenMiddleware.js';
import Product from '../Models/ProductSchema.js';
import User from '../Models/UserSchema.js';

const router = express.Router();

router.get('/test', authTokenHandler, async (req, res) => {
  res.json({ message: 'Test api work for Products', userId: req.userId });
});

// If user is authenticated he or she can Create a Product
router.post('/', authTokenHandler, async (req, res) => {
  try {
    const { title, description, image } = req.body;
    const product = new Product({
      title,
      description,
      image,
      owner: req.userId,
    });
    await product.save();

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.products.push(product._id);
    await user.save();

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// If user is authenticated he or she can Create a Product
// If user is authenticated he or she can Create a Product
// If user is authenticated he or she can Create a Product
// If user is authenticated he or she can Create a Product

export default router;
