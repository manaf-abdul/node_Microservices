// const fetch = require("node-fetch");
import fetch from "node-fetch"
const { FAST_TO_SMS_API_KEY } = process.env;

const checkWalletBalance = async () => {
    try {
        let response = await fetch(`https://www.fast2sms.com/dev/wallet?authorization=${FAST_TO_SMS_API_KEY}`);
        let apiData = await response.json();
        return { status: true, msg: "Wallet Balance Fetched", balance: apiData && apiData.wallet ? apiData.wallet : 0 }
    } catch (e) {
        return { status: false, msg: e.message, balance: 0 }
    }
}

const sendOTPSMS = async ({ otp, numbers }) => {
    try {
        let walletBalance = await checkWalletBalance();
        if(walletBalance >= 0) return { status: false, msg: "Low Wallet Balance", data: null }
        let reqBody = {
            variables_values : otp,
            route : "otp",
            numbers
        };
        let response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
            method: "POST",    
            headers: {
                    "Content-Type": "application/json",
                    "Authorization" : FAST_TO_SMS_API_KEY
                },
            body: JSON.stringify(reqBody)
        });
        let apiData = await response.json();
        return { status: true, msg: "Message Sent", data: apiData }
    } catch (e) {
        return { status: false, msg: e.message, data: null }
    }
}

module.exports = { sendOTPSMS, checkWalletBalance }