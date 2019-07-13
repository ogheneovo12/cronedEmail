const nodemailer= require('nodemailer');
const hbs = require('nodemailer-express-handlebars')
const path =require('path');

const email = (config)=>{
	console.log(config)
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: config.gmail.user,
      pass: config.gmail.pass
    },
    tls:{
    	  rejectUnauthorized:false
    }
  });
  
  transporter.use('compile',hbs({
viewEngine:{
extName:'.hbs',
layoutsDir:path.join(__dirname,'views/layouts'),
defaultLayout:null,
partialsDir:path.join(__dirname,'views/partials'),

  }, viewPath:path.join(__dirname,'views'),
 extName:'.hbs'
  }))

  const from= "node @ ukuanovweogheneovo@gmail.com";
  return{
  	
  	send:(to,sub,template,context,res)=>{
  	 transporter.sendMail({
    from:from,
    to:to, 
    subject:sub, 
    template:template,
    context:context 
  },(err,info)=>{
  	if(err){
  	console.log(err)
  	if(res){
  	res.status(400).json({msg:'cron was not sucessfull'})
  	}}
  	
  		console.log('email sent successfully')
  		if(res){
  		res.redirect('/success.html')
  	}
  });

  
  
}//end of send

}

}
module.exports =email;