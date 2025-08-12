const mongoose = require("mongoose")

const { Schema } = mongoose;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
}, {timestamps: true}); // salva a data de criacao e atualização

const Category = mongoose.model("Category", categorySchema)

module.exports = {
    Category,
    categorySchema
}