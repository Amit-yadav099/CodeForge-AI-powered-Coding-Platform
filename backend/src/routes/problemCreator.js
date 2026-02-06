const express = require('express');

const problemRouter =  express.Router(); // here we create the routes with the help of express router
const adminMiddleware=require('../middleware/adminMiddleware'); //as prorblem creation only via admin
// to create problem controller
const {createProblem,updateProblem, deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser,submittedProblem} = require('../controllers/userProblem');
const userMiddleware= require('../middleware/userMiddleware');

// Create
problemRouter.post("/create", adminMiddleware, createProblem);
problemRouter.put("/update/:id",adminMiddleware ,updateProblem);
problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem);


problemRouter.get("/problemById/:id",userMiddleware,getProblemById);
problemRouter.get("/getAllProblem",userMiddleware ,getAllProblem);
problemRouter.get("/problemSolvedByUser",userMiddleware,solvedAllProblembyUser);
problemRouter.get("/submittedProblem/:id",userMiddleware,submittedProblem);


module.exports=problemRouter;

// these problems can be done by the user 
// fetch
// update
// delete 
