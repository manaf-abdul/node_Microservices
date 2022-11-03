import  express  from "express";
const router=express.Router()
import {signUp,signIn,sendOtpforForgotPssword,confirmOtpforForgotPssword} from '../Controllers/User.Controller.js'
// import {s3UserStorage} from '../../Middlewares/s3BucketMulter.js'

router.post("/signup", signUp)
router.post("/signin", signIn)
router.post("/send-otp-forgotpassword", sendOtpforForgotPssword)
router.post("/confirm-otp-forgotpassword", confirmOtpforForgotPssword)
// router.post("/changePassword", changePassword)
// router.post("/edit-profile",s3UserStorage.single("image"),updateProfile)
// router.get("/profile/:id",getProfile)

export default router