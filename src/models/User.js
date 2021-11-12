import bcrypt from 'bcrypt'
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({ 
    email: {type: String, unique: true},
    userName: {type: String, required: true, unique: true },
    socialOnly: {type: Boolean, default: false},
    //github을 이용해서 account 만들었나? 를 위해socialOnly
    avatarUrl: String,
    password: {type: String, required: false},
    name: { type: String, required: true},
    location: {type: String}
    }
)

userSchema.pre('save', async function(){
    this.password = await bcrypt.hash(this.password, 5);
})

const User = mongoose.model('User', userSchema)
export default User