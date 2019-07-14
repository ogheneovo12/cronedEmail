const express=require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const config = require('./.inc/__config.js');
const mail =require('./mail.js')(config);
const cron=require('node-cron');
const {check, validationResult,checkSchema} = require('express-validator')


const app = express();
const port= process.env.PORT || 3000;

function cronjob (time, Task,limit){
	
  function call(){
    clearTimeout(timeout)
    timeout = setTimeout(call,time)
    Task()
  }
  let timeout=setTimeout(call,time)
}




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



app.post('/mail',[
//validate and sanitise inputs
check('email').isEmail().withMessage({msg:'not a valid email'}).normalizeEmail(),
check('limit').isNumeric().withMessage('limit is valid'),
check('name').isAlpha().withMessage({msg:'must contain only letters'}).trim().escape(),

check('frequency').isNumeric().withMessage({msg:'must be a number'}).trim().escape()

],(req,res)=>{
	let email = req.body.email, frequency=parseInt(req.body.frequency) || 0,
	name=req.body.name;
	//set counter to 1 to determine how many time cron job will run based on limit passed
	
	let limit =req.body.limit, counter=1;
	
	//checks if limit is valid
	if(limit == 0 || limit == 'undefined'){
		 res.send({msg:'limit not set cron job wont start please choose a limit from one and above'})
	}
	
	//check for errors in validation
	let errors = validationResult(req);
	
	if(!errors.isEmpty()){
		return res.status(422).json({msg:'input are not correct'})
	}

	
	/*cronjob(frequency*1000,()=>{
 mail.send(email,'cronedEmail app',"index",{
		name:name,
		email:email
	},res);
	
})*/



//START CRON JOB
let task = cron.schedule(`*/${frequency} * * * * *`,()=>{
	
	  
	  
	  //send mail
	mail.send(email,'cronedEmail app',"index",{
		name:name,
		email:email
	},res);
	if(counter >= limit){
	  	//Destroys Cron job
	  	task.destroy()
	  
	  }
	  //increment counter
	counter++
})



	});
	
	
app.get('/mail/:freq/:limit/:email',
checkSchema({
	freq:{
		in:['params','query'],
		errorMessage:'frequency is not valid',
		isInt:true,
		toInt:true
		
	},
	limit:{
		in:['params','query'],
		errorMessage:'limit not set cron job wont start please choose a limit from one(1) and above',
		isInt:true,
		toInt:true
	},
	email:{
		in:['params','query'],
		errorMessage:'email is not valid',
		isEmail:true,
	}
}),(req,res)=>{

	let email = req.params.email, frequency=parseInt(req.params.freq),
	name=req.params.name;
	let limit =req.params.limit,
	//set counter to 1 to determine how many time cron job will run based on limit passed
	 counter=1;
	 
	//checks if limit is valid
	if(limit == 0 || limit == 'undefined'){
		 res.send({msg:'limit not set cron job wont start please choose a limit from one and above'});
	}
	
	let errors = validationResult(req);
	
	if(!errors.isEmpty()){
		return res.status(422).json({msg:'input are not correct'});
	}



//START CRON JOB
let task = cron.schedule(`*/${frequency} * * * * *`,()=>{
	
	  
//SEND MAIL
	mail.send(email,'cronedEmail app',"index",{
		name:name,
		email:email
	},res);
	
	if(counter >= limit){
	  	//Destroys Cron job
	     	task.destroy()
	     	
	  }
	//increment counter
	counter++
});

	
});




app.listen(port,()=>{


})