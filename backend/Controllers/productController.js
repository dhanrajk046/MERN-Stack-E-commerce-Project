const Product =require('../model/Product')
const cloudinary = require('../config/cloudinary');

const getProducts = async (req, res) =>{
    try{
        const products = await Procduct.find({});
        res.join(products);
    } catch (error) {
        res.status(500).json({message: 'Server error' });
    }
};

const getProductId = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(product) {
            res.join(product);
        }
        else {
            res.status(400).json({message: 'Product not found'});
        }
    } catch(error) {
        res.status(500).json({ message: 'Server error'});
    }
};

