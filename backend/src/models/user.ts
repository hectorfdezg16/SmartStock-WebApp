import mongoose, {Schema, model, Document} from 'mongoose';
//password cannot store in plaintext on database
import Message, { IChatMessage } from '../models/chatmessage';

import bcrypt from 'bcrypt-nodejs';

export interface IUser extends Document {
    userName: string,
    email: string,
    password: string,
    role?: string,
    bank?: string,
    signUpWithGoogle?: boolean,
    signUpWithFacebook?: boolean,
    location?: string,
    balance?: number,
    avatar?: string,
    avatarCloudBinary?: string,
    resetLink?: string,
    notifications: Array<any>;
    friends?: IUser[],
    messages?: IChatMessage[],
    clat?: number,
    clng?:number,
    validatePassword(password: string): Promise<boolean>
}

const userSchema = new Schema({
    userName: { type: String,required: true,  unique: true},
    email: { type: String, required: true, lowercase: true, trim: true, unique: true},
    password: { type: String, required: true},
    role: { type: String, required: false},
    bank: { type: String, required: false},
    signUpWithGoogle: { type: Boolean, required: false, default: false},
    signUpWithFacebook: { type: Boolean, required: false, default: false},
    location: { type: String, required: false},
    balance: { type: Number, required: false, default: '0'},
    clat: { type: Number, required: false, default: '0'},
    clng: { type: Number, required: false, default: '0'},
    //Guys we need a picture for the user! ---> location avatar
    avatar: { type: String, required: false},
    avatarCloudBinary: {type: String, required: false},
    //reset pass--->
    notifications: [{ type: Object, ref: 'Notification'}],
    resetLink: { type: String, required: false, default: 'link' },
    friends: [{ type: mongoose.Schema.Types.ObjectId, required: false}],
    messages: [{ type: Object, ref: Message, required: false}]
}, {
    //timestamps adds createDate and updateDate of the object
    timestamps: true,
    versionKey: false
});

//we hash the user's password on this function
userSchema.pre('save', function(next) {
    let user = <IUser>this;
    //salt factor of 12 is too safe! 
    var SALT_FACTOR = 12;

    if(!user.isModified('password')) return next();

    return bcrypt.genSalt(SALT_FACTOR, function(err, salt){
        if(err) return next(err);

        return bcrypt.hash(user.password, salt, null, function(err, hash){
            if(err) return next(err);
            user.password = hash;
            return next();
        });
    });
});

//validate the encrypted password
userSchema.methods.validatePassword = async function(password: string): Promise<boolean> {
    let user = <IUser>this;
    return await new Promise((resolve, reject)=>{
        bcrypt.compare(password , user.password, (err, isMatch) => {
        if(err) return reject(err);
        return resolve(isMatch);
        });
    });
};

//we will export our entity
export default model<IUser>('User', userSchema);
