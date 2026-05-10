import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    hashedPassword: {
        type: String,
        required: false
    },
    firstName:{
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
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
    },
    providers: [
  {
    type: { type: String }, // "github", "google"
    providerId: String
  }
]
},{
    timeseries: true
})
const User = mongoose.model("User", userSchema)
export default User;