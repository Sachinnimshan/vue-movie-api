import mongoose from 'mongoose';


const postSchema = mongoose.Schema({
    Title:{type: String, required: true},
    Category:{type: String, required: true},
    Description: {type: String, required: true},
    Image: {type: String, required: true},
    Created: {type: Date, default: Date.now}
},{
    timestamps: true
});

const Post = mongoose.model("Post", postSchema);


export default Post;