const mongoose = require("mongoose");

const { Schema } = mongoose;
const { categorySchema } = require("./Category")

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    category: {
        type: categorySchema,
        required: true
    }
}, { timestamps: true }); // salva a data de criação e atualização

const Product = mongoose.model("Product", productSchema);

module.exports = { Product };
