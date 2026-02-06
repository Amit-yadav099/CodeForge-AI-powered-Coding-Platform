const express= require('express');

const submitRouter=express.Router();
const rateLimiter=require('../middleware/rateLimiter');

const userMiddleware = require('../middleware/userMiddleware');
const {submitCode,runCode}=require('../controllers/userSubmission');

submitRouter.post('/submit/:id',userMiddleware,rateLimiter,submitCode);
submitRouter.post('/run/:id' , userMiddleware , runCode);

module.exports = submitRouter;
