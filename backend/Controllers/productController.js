const Product = require('../model/Product');
const cloudinary = require('../config/cloudinary');

const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        return res.json(products);
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            return res.json(product);
        }
        return res.status(404).json({ message: 'Product not found' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

const createProduct = async (req, res) => {
    const { name, description, price, category, stock} = req.body;
    let imageUrl = req.body.imageUrl || '';

    try {
        if (!name || !description || price === undefined || !category || stock === undefined) {
            return res.status(400).json({ message: 'Please provide all product details' });
        }

        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'shopnest/products',
            });
            imageUrl = uploadResult.secure_url;
        }

        if (!imageUrl) {
            return res.status(400).json({ message: 'A product image is required' });
        }

        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            imageUrl,
        });

        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        return res.status(500).json({ message: 'Unable to create product' });
    }
};



const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const { name, description, price, category, stock, imageUrl } = req.body;

        if (name !== undefined) product.name = name;
        if (description !== undefined) product.description = description;
        if (price !== undefined) product.price = price;
        if (category !== undefined) product.category = category;
        if (stock !== undefined) product.stock = stock;
        if (imageUrl !== undefined) product.imageUrl = imageUrl;

        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'shopnest/products',
            });
            product.imageUrl = uploadResult.secure_url;
        }

        const updatedProduct = await product.save();
        return res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({ message: 'Unable to update product' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.deleteOne();
        return res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ message: 'Unable to delete product' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
