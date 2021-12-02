import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: {type: String,required:true, uppercase: true, trim:true, maxLength:80},
    fileUrl : { type: String, required: true },
    thumbUrl: { type: String, required: true },
    description: {type: String, required: true, maxlength: 140, minLength:20},
    createdAt: {type: Date, required: true, default: Date.now},
    hashtags: [{type: String}],
    meta: {
        views: {type: Number, default:0, required: true},
        rating: {type: Number, default:0, required: true}
    },
    owner: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'  }
    //ref 는 어떤 schema의 id인지를 알려주기 위해 있음
}); 


videoSchema.static('formatHashtags', function(hashtags){
    return hashtags
    .split(',')
    .map((word) => word.startsWith('#') ?  word : `#${word}`)
})


const Video = mongoose.model('Video', videoSchema)

export default Video

