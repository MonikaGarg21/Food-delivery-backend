import mongoose from "mongoose";


// Schema for food-model:
const foodSchema = new mongoose.Schema({
    name: {type:String, required:true},
    description: {type:String, required:true},
    price: {type:Number, required:true},
    image: {type:String, required: true},
    category: {type:String, required:true}
})


// food-model for project:
const foodModel = mongoose.models.food || mongoose.model("food", foodSchema)

export default foodModel;