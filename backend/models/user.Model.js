import mongoose from 'mongoose'
// import bcrypt from 'bcrypt'

const userModel = new mongoose.Schema(
    {
        username: {
            type: String,
            // required: true
        },
        phone: {
            type: String,
            required: true
        },
        password: {
            type: String,
            // required: true
        },
        occupation: {
            type: String,
            // required: true
        },
        signUpStatus: {
            type: String,
            required: true,
            enum: ["notCompleted", "completed"],
            default: "notCompleted"
        },
        gender: {
            type: String,
            enum: ["male", "female"],
            lowercase: true,
        },
        location:{
            type: String,
            default: null
        },
        qualification:{
            type: String,
            default: null
        },
        dateOfBirth:{
            type: String,
            default: null
        },
        profilePic:{},
    }
)

const User=mongoose.model("User",userModel)
export default User