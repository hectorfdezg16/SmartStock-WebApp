import User from '../models/user';
import {Strategy, ExtractJwt, StrategyOptions} from 'passport-jwt';

const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'tokentest'
};

// export default new Strategy(opts, async(payload, done) =>{
//     try{
//         const user = await User.findById(payload._id);
//         if(user){
//             return done(null,user);
//         }
//         return done(null, false);
//     } catch(err){
//         console.log(err);
//     }
// });

export default new Strategy(opts, async(payload, next) =>{
    try{
        const user = await User.findById(payload._id);
        if(user){
            let _id = user._id;
            return next(null,_id);
        }
        console.log('error');
        return next(null, false, {message:"User not found"});
    } catch(err){
        console.log(err);
        return next(err);
    }
});