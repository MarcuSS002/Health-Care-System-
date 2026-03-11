import Razorpay from 'razorpay'
import crypto from 'crypto'
import appointmentModel from '../models/appointmentModel.js'

const getRazorpayInstance = () => {
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
        throw new Error('Razorpay keys are missing in backend .env')
    }

    return new Razorpay({
        key_id: keyId,
        key_secret: keySecret
    })
}

export const createOrder = async (req, res) => {
    try {
        const razorpayInstance = getRazorpayInstance()
        const { amount, currency = 'INR', receipt } = req.body
        if (!amount || isNaN(amount)) return res.status(400).json({ success: false, message: 'Invalid amount' })

        const options = {
            amount: Number(amount) * 100,
            currency,
            receipt: receipt || `rcpt_${Date.now()}`
        }

        const order = await razorpayInstance.orders.create(options)
        return res.json({ success: true, order, key: process.env.RAZORPAY_KEY_ID })
    } catch (err) {
        console.error('createOrder error:', err)
        return res.status(500).json({ success: false, message: err && err.message ? err.message : String(err) })
    }
}

export const verifyPayment = async (req, res) => {
    try {
        if (!process.env.RAZORPAY_KEY_SECRET) {
            return res.status(500).json({ success: false, message: 'Razorpay secret is missing in backend .env' })
        }

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId } = req.body
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Missing payment fields' })
        }

        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex')

        if (generated_signature === razorpay_signature) {
            // if appointmentId is provided, mark appointment as paid
            if (appointmentId) {
                try {
                    await appointmentModel.findByIdAndUpdate(appointmentId, {
                        payment: true,
                        paymentDetails: {
                            razorpay_order_id,
                            razorpay_payment_id,
                            razorpay_signature
                        }
                    })
                } catch (e) {
                    console.log('Failed to update appointment payment:', e.message)
                }
            }
            return res.json({ success: true, message: 'Payment verified' })
        } else {
            return res.status(400).json({ success: false, message: 'Invalid signature' })
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
}
