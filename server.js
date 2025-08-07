const express  = require('express');
const connection = require('./helpers/db');
const cors = require('cors');
// const authMiddleware = require('./middlewares/authMiddleware');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());


app.use(express.urlencoded({ extended: true }) );

app.use(cors({origin: process.env.CORS_ORIGIN || '*'}))

app.use('/', require('./routes/route'));

app.use('/api/notepad/',require('./routes/notepadRoute'));


app.listen(process.env.PORT || 3000, () => {

});