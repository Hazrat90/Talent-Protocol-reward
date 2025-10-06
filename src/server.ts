import express from 'express';
import path from 'path';


const app = express();
app.use(express.json());


app.get('/merkle/:epoch', (req,res)=>{
const p = path.join(process.cwd(),'..','merkle-data', `epoch-${req.params.epoch}.json`);
try{
const data = require(p);
res.json(data);
}catch(e){
res.status(404).json({ error: 'not found' });
}
});


app.listen(4000, ()=> con
