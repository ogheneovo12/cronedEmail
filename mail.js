const nodemailer= require('nodemailer');

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

  const from= "node @ ukuanovweogheneovo@gmail.com";
  return{
  	
  	send:(to,sub,body)=>{
  	 transporter.sendMail({
    from:from,
    to:to, 
    subject:sub, 
    html:body,
    generateTextFromHtml:true
  },(err)=>{
  	if(err){
  	console.log(err)
  	}
  });

  
  
}//end of send

}

}
module.exports =email;