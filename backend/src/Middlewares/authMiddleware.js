import jwt from 'jsonwebtoken';
import User from '../Models/User.js';

export const protectedRoute = async (req, res, next) =>{
    try{
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader?.split(" ")[1];
        if(!token){
            return res.status(401).json({message: "AccessToken not found !!!"})
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async(err, decoded)=>{
            if(err){
                console.log(err)
                return res.status(403).json({message: "Invalid AccessToken !!!"})
            }
            const user = await User.findById(decoded.userId).select("-hashedPassword");
            if(!user){
                return res.status(404).json({message: "User not found !!!"})
            }

            req.user = user;
            next();
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({message: "Internal Server Error !!!"})
    }
}

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
};