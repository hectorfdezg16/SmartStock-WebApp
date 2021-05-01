import morgan from 'morgan';
import express from 'express';
import cors from 'cors';
import router from './routes/users.routes';

//Bcrypt ---> researching...
//also we research in the swagger for endpoints o

const app = express();

app.set('port', process.env.PORT || 4000);

app.use(morgan('dev'));

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:4200'
}));
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", router);

export default app;