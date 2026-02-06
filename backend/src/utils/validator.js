// here we validate the given information provided by the user/ whether all the required information is correct or not

const validator=require('validator');

// req.body->contains the data

const validate=(data)=>{

      const mandatoryField=['firstName','emailId','password'];

      const isAllowed=mandatoryField.every((k)=> Object.keys(data).includes(k));

      if(!isAllowed) throw new Error('some Field Missing');

     if(!validator.isEmail(data.emailId))
        throw new Error('Invalid email');
   
    if(!validator.isStrongPassword(data.password)) 
        throw new Error('weak passowrd');
}
module.exports=validate;