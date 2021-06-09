const express=require('express');
const router=express.Router();

// For checking that any random person cannot comment without logging in
const passport=require('passport');

const postController= require('../controllers/posts_controller');

router.post('/create',passport.checkAuthentication,postController.create);
router.get('/destroy/:id', passport.checkAuthentication,postController.destroy);



module.exports=router;
 