const nodemailer= require('nodemailer');
const hbs = require('nodemailer-express-handlebars')
const path =require('path');

const email = (config)=>{
	 let recepientEmails =[];
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
  		
  		if(!recepientEmails.includes(to))
  		{
  		 recepientEmails.push(to);
  		}
  		 to = recepientEmails.toString();
  	 transporter.sendMail({
    from:from,
    to:to, 
    subject:sub, 
    template:template,
    context:context 
  },(err,info)=>{
  	if(err){
  	
  	if(res){
  	res.status(400).json({msg:'cron was not sucessfull'})
  	}}
  	
  		
  		if(res){
  		res.redirect('/success.html')
  	}
  });

  
  
}//end of send

}

}
module.exports =email;