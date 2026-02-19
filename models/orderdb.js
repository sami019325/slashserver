import mongoose from "mongoose";

const orderDetails = new mongoose.Schema({
    total_amount: Number,
    currency: String,
    tran_date: Date,
    tran_id: String,
    order_id: String,
    shipping_method: String,
    product_name: String,
    cus_name: String,
    cus_email: String,
    cus_phone: String,
    cus_phone2: String,
    ship_add1: String,
    ship_country: String,
    Customer_Note: String,
    Customer_Attach: String,
    Status: String,
    Order_note: String
});


export const OrderData = mongoose.model("Orders", orderDetails);
