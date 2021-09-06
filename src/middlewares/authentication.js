const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler')
const userModel = require('../components/user/userModel');
const config = require('../configuration/config')

preProcessToken = asyncHandler(async (req,res,next) => {
    try{
        let token = req.header('Authorization');
        const decoded = jwt.verify(token, config.auth.jwtSecret);
        req.user = decoded;
        next()
    }catch(err){
        console.log(err);
        res.status(401).json('Authentication failed!')
    }
});

exports.authenticateUser = [preProcessToken,
    asyncHandler(async (req,res,next) => {
        try{
            const user = await userModel.findOne({_id: req.user._id});
            // if(!user){
            //     throw new Error('Token invalid!')
            // }
            req.user = user;
            next()
        }catch(err){
            console.log(err)
            res.status(401).json('Authentication of User failed!')
        }
    })
];
