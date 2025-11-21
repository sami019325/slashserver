import mongoose from "mongoose";

const orderDetails = new mongoose.Schema({
    total_amount: Number,
    currency: String,
    tran_date: Date,
    tran_id: String,
    success_url: String,
    fail_url: String,
    cancel_url: String,
    ipn_url: String,
    shipping_method: String,
    product_name: String,
    product_category: String,
    cus_name: String,
    cus_email: String,
    cus_add1: String,
    cus_add2: String,
    cus_country: String,
    cus_phone: String,
    cus_phone2: String,
    ship_name: String,
    ship_add1: String,
    ship_add2: String,
    ship_Contract: String,
    Customer_Note: String,
    Customer_Attach: String,
    Status: String,
    Order_note: String
});


export const OrderData = mongoose.model("Orders", orderDetails);
