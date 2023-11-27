import express from 'express';
import authTokenHandler from '../Middlewares/checkAuthTokenMiddleware.js';
import Product from '../Models/ProductSchema.js';
import User from '../Models/UserSchema.js';

const router = express.Router();

// check product ownership
const checkProductOwnership = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product post not found' });
    }

    if (product.owner.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: 'Permission denied: You do not own this Product' });
    }

    req.product = product;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a specific product by ID
router.put(
  '/:id',
  authTokenHandler,
  checkProductOwnership,
  async (req, res) => {
    try {
      const { title, description, image } = req.body;
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { title, description, image },
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res
        .status(200)
        .json({ message: 'Product updated successfully', updatedProduct });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

router.delete(
  '/:id',
  authTokenHandler,
  checkProductOwnership,
  async (req, res) => {
    try {
      // Find the product post by ID and delete it
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);

      if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Remove the deleted product ID from the user's products array
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const productIndex = user.products.indexOf(req.params.id);
      if (productIndex !== -1) {
        user.products.splice(productIndex, 1);
        await user.save();
      }

      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;
