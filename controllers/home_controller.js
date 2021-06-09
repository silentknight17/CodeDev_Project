const Post=require('../models/post');

const User=require('../models/user');

const Comment=require('../models/comment');
//module.exports.home=function(req,res){
  // console.log(req.cookies);
  // res.cookie('user_id',25);
   
 /* Post.find({},function(err,posts){
   return res.render('home',{
      title:"Codemon | Home",
      posts: posts
  });
   });*/
//Populate the user of each post
//First Method---- Working
/*   Post.find({}).populate('user').populate({
      path: 'comments',
      populate:{
         path: 'user'
      }
   }).exec(function(err,posts){
    
      User.find({}, function(err,users){
         return res.render('home',{
            title:"Codemon | Home",
            posts: posts,
            all_users: users
      });


      
   });


   
});
}
*/

//Populating using async await
module.exports.home=async function(req,res){
   try{
      //populate the user of each post
      let posts=await Post.find({})
      .sort(-'createdAt')
      .populate('user')
      .populate({
         path: 'comments',
         populate:{
            path: 'user'
         },
         populate:{
            path: 'likes'
         }
      }).populate('likes');
      let users=await User.find({});
      return res.render('home',{
         title:"CodeDev | Home",
         posts: posts,
         all_users: users
   });
   }
   catch(err){
     console.log('Error',err);
     return;
   }
}

//module.exports.actionName=function(req,res){}