const express=require('express');
const router=express.Router();

// For checking that any random person cannot comment without logging in
const passport=require('passport');

const commentsController= require('../controllers/comments_controller');

router.post('/create',passport.checkAuthentication,commentsController.create);


//creating route for deleting a comment
router.get('/destroy/:id',passport.checkAuthentication,commentsController.destroy);
module.exports=router;
