const express=require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const config = require('./.inc/__config.js');
const mail =require('./mail.js')(config);
const cron=require('node-cron');



const app = express();
const port= process.env.PORT || 3000;



app.disable('x-powered-by');
//configure handlebar
/*app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts')
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));*/



app.use(express.json())
app.use(express.urlencoded({extended:false}))


app.use(express.static(path.join(__dirname,'public')))



app.get('/',(req,res)=>{
	 
/*cron.schedule("* * * * *", ()=>{	
})*/
	
	mail.send('ukuanovweogheneovo@gmail.com','node email',"index");
	
});




app.listen(port,()=>{
console.log("mailer set up");

})