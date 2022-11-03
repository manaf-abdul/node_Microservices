import User from '../Models/user.Model.js'
import jwt from "jsonwebtoken";


export const signIn = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { phone, otp } = req.body
        let user = await User.findOne({ phone: phone,phoneOtp:otp })
        if (!user) return res.status(200).json({ errorcode: 2, status: false, msg: "Incorrect Otp", data: null });
            user.phoneOtp=0;
            await user.save()
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "300d" });
            user = { ...user._doc, password: null, token };
            return res.status(200).json({ errorcode: 0, status: true, msg: "Logged In successfully.", data: user });
    } catch (e) {
        console.log(e)
        return res.status(200).json({ errorcode: 5, status: false, msg: e, data: e });
    }
};

export const signUp = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { name, email, phone } = req.body;
        if (!name || !email || !phone) return res.status(200).json({ errorcode: 2, status: false, msg: "Fill all the fields", data: null })

        const existingUser = await User.findOne({ phone: phone,signUpStatus:"completed" })
        console.log(existingUser);
        if (existingUser) return res.status(200).json({ errorcode: 3, status: false, msg: "User/Mobile No. already Present.Please Login", data: null })
        let otp = getRandomDigits()
        let newUser = await User.create({
            name, email, phone, phoneOtp: otp
        })
        // if (newUser) {
        //     const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "300d" });
        //     newUser = { ...newUser._doc, password: null, token };
        //     return res.status(200).json({ errorcode: 0, status: true, msg: "User SignUp Successfull", data: newUser });
        // }
        const smsSend = await sendOTPSMS({ otp, numbers: phone })
        return res.status(200).json({ errorcode: 0, status: true, msg: "An OTP is sent to your mobile Number", data: smsSend });
    } catch (e) {
        return res.status(200).json({ status: false, msg: e.message, data: null });
    }
}

export const verifySignUp = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { otp, phone } = req.body;
        if (!otp || !phone) return res.status(200).json({ errorcode: 2, status: false, msg: "Fill all the fields", data: null })

        let existingUser = await User.findOne({ phone: phone, phoneOtp: otp })

        if (!existingUser) return res.status(200).json({ errorcode: 3, status: false, msg: "Incorrect Otp", data: null })
        existingUser.signUpStatus="completed";
        existingUser.phoneOtp=0
        await existingUser.save()
        const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "300d" });
        existingUser = { ...existingUser._doc, password: null, token };
        return res.status(200).json({ errorcode: 0, status: true, msg: "User SignUp Successfull", data: existingUser });
} catch (e) {
        return res.status(200).json({ status: false, msg: e.message, data: null });
    }
}

export const resendOtp = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { phone } = req.body;
        if ( !phone) return res.status(200).json({ errorcode: 2, status: false, msg: "Fill all the fields", data: null })

        let existingUser = await User.findOne({ phone: phone})

        if (!existingUser) return res.status(200).json({ errorcode: 3, status: false, msg: "User Not found..Please SignUp", data: null })
        let otp=getRandomDigits()
        existingUser.phoneOtp=otp
        await existingUser.save()
        const smsSend = await sendOTPSMS({ otp, numbers: phone })
        return res.status(200).json({ errorcode: 0, status: true, msg: "Otp Sent", data: smsSend });
} catch (e) {
        return res.status(200).json({ status: false, msg: e.message, data: null });
    }
}



export const updateProfile = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { userid, name, email, number,
            occupation, education,parentNumber,dob,gender,
            schoolOrCollege, state, address } = req.body
        console.log("userid", req.body)
        let user = await User.findOne({ _id: userid })
        if (!user) return res.status(200).json({ errorcode: 1, status: false, msg: "User Not Found", data: null })
        user.name = name ? name : user.name
        user.email = email ? email : user.email
        user.number = number ? number : user.number
        user.parentNumber = parentNumber ? parentNumber : user.parentNumber
        user.dob = dob ? dob : user.dob
        user.gender = gender ? gender : user.gender
        user.occupation = occupation ? occupation : user.occupation
        user.education = education ? education : user.education
        user.schoolOrCollege = schoolOrCollege ? schoolOrCollege : user.schoolOrCollege
        user.state = state ? state : user.state
        user.address = address ? address : user.address
        user.image = req.file && req.file.location ? req.file.location : user.image
        user = await user.save()
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "300d" });
        user = { ...user._doc, password: null, token };
        return res.status(200).json({ errorcode: 0, status: true, msg: "Profile Updated Successfully", data: user });
    } catch (e) {
        return res.status(200).json({ errorcode: 0, status: false, msg: e.message, data: null });
    }
}

export const sendOtpforForgotPssword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { email } = req.body;
        console.log(email)
        // let user=await User.findOne({email:email})
        // if(!user) return res.status(200).json({ errorcode: 2,status: false, msg:"User not Present", data: null });
        let otp = getRandomDigits()
        // user.emailOtp=otp;
        // user=await user.save();
        // let html = `
        //     <h3>OTP for change password request</h3>
        //     <p>Your OTP is : <b>${otp} </b> </p>
        //     `;
        //     const resp = await sendMail({ email:user.email, name:user.name , subject: "Forgot Password", html });
        //     console.log("resp",resp)
        const Sem = await sendOTPSMS({ otp, numbers: email });
        console.log(Sem)
        return res.status(200).json({ errorcode: 0, status: true, msg: "An OTP is sent to your email", data: Sem });
    } catch (e) {
        return res.status(200).json({ status: false, msg: e.message, data: null });
    }
}

export const confirmOtpforForgotPssword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { email, otp } = req.body;
        let user = await User.findOne({ email: email })
        if (!user) return res.status(200).json({ errorcode: 2, status: false, msg: "User not Present", data: null });
        if (user.emailOtp !== otp) return res.status(200).json({ errorcode: 2, status: false, msg: "Incorrect OTP", data: null });
        user.emailOtp = 0;
        await user.save();
        return res.status(200).json({ errorcode: 0, status: true, msg: "Verified Successfully", data: null });
    } catch (e) {
        return res.status(200).json({ status: false, msg: e.message, data: null });
    }
}
