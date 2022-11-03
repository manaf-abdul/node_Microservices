import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import UserRoutes from '../backend/routes/user.Routes.js'

const app=express()

dotenv.config()

mongoose.connect(process.env.DB_CONNECT,{useNewUrlParser: true, useUnifiedTopology: true})
let db = mongoose.connection;
db.once("open", () => console.log("Connected to MongoDB"));
db.on("disconnected", () => console.log("Disonnected to MongoDB"));
db.on("reconnected", () => console.log("Reconnected to MongoDB"));
db.on("error", (err) => console.log(err));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/user',UserRoutes)

app.listen(process.env.PORT,()=>console.log(`Server started in Port ${process.env.PORT}`))