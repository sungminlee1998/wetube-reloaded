import bcrypt from 'bcrypt'
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({ 
    email: {type: String, unique: true},
    userName: {type: String, required: true, unique: true },
    socialOnly: {type: Boolean, default: false},
    //github을 이용해서 account 만들었나? 를 위해socialOnly
    avatarUrl: {type: String},
    password: {type: String, required: false},
    name: { type: String, required: true},
    location: {type: String},
    videos: [{type: mongoose.Schema.Types.ObjectId, ref: 'Video'  }]
    //An user can have many videos in an array
<<<<<<< HEAD
})
=======
    }
)
>>>>>>> b75b1d29ec2d898ca3d9d3d8e80989e68692cf81

userSchema.pre('save', async function(){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 5);
    }
    //only if password is modified, hash the password
    //postUpload에서 user.videos.push(newVideo._id) 때문에 save가 일어나 hashing이 또 일어나는것을 방지
})

const User = mongoose.model('User', userSchema)
export default User