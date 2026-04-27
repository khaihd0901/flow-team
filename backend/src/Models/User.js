import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    firstName:{
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
    },
    avatarUrl:{
        type: String
    },
    avatarId: {
        type: String    
    },
    bio:{
        type: String,
        maxLength: 500
    },
    phone: {
        type: String,
        sparse: true
    },
    isAdmin:{
        type: Boolean,
        default: false
    }
},{
    timeseries: true
})
const User = mongoose.model("User", userSchema)
export default User;