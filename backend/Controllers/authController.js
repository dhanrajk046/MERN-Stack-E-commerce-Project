const User = require("../Model/User.js");

//Register a new user
const registerUser = async (req, res) => {
    const {name, email, password}= req.body;
    try{
        const existingUser = await User.findOne({email});
        if(existingUser){   
            return res.status(400).json({message: 'User already exists'});

       }
       const  newUser = new User({name, email, password});
       await newUser.save();
       res.status(201).json({message: 'User registered successfully'});
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};