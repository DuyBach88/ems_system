import mongoose from "mongoose";

const favouriteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const Favourite = mongoose.model("Favourite", favouriteSchema);
export default Favourite;
