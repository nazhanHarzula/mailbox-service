const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const sworm = require('sworm');

dotenv.config(); // Harus dipaling atas sebelum code lain jalan, karena Environment Variable bisa tidak terbaca oleh code lain.
const getDbConfig = require('./service/getDbConfig');
const routes = require('./router');

const app = express();
const PORT = process.env.PORT || 8990;

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(express.json());
app.use(morgan('tiny'));
// app.use([morgan('dev'), verifyToken, logging]);

app.get('/config', (req,res,next)=>{
    const dbConfig = getDbConfig();
    console.log(dbConfig)
    console.log(process.env.DB_USER_DEV);
    return res.json(dbConfig);
})

app.get('/connect', async (req,res,next)=>{
    const dbConfig = getDbConfig();
    try {
        const db = sworm.db(dbConfig);
        const rows = await db.query('SELECT * from GGGG_MB_DOWN_DATA_MAILBOX_V');
        console.log(rows);
        return res.json({rows});
    }
    catch(err){
        console.log(err);

return res.status(500).json({status :false,message:'error database'})
    }
})

app.use('/v1/api', routes);
app.all('*',(req,res,next) => {
    return res.status(404).json({status:'fail',message:'Route is not exists!'});
  })
  
app.listen(PORT, () => { console.log(`Application is running on PORT: ${PORT}`) });