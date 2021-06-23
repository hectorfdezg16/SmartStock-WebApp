 import mongoose from 'mongoose';
import { mongodb } from './keys';

mongoose.connect(mongodb.URI, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
.then(db => console.log("DB is connected!")) //if we connect correctly
.catch(err => console.error(err)); //elif (we don't connect correctly)

//we export this main function
export default mongoose;
