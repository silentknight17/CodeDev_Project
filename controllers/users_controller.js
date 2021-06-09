const User=require('../models/user');

const fs=require('fs');
const path=require('path');


module.exports.profile=function(req,res){
  User.findById(req.params.id, function(err,user){
    return res.render('user_profile',{
      title: 'User Profile',
      profile_user: user
  });
  
  }); 
}



//Updating the value
/*module.exports.update=function(req,res){
  if(req.user.id==req.params.id){
    User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
    return res.redirect('back');
    });
  }
  else{
    return res.status(401).send('Unauthorised');
  }
}
*/
//Updating using flash
/*module.exports.update = function(req, res){
  if(req.user.id == req.params.id){
      User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
          req.flash('success', 'Updated!');
          return res.redirect('back');
      });
  }else{
      req.flash('error', 'Unauthorized!');
      return res.status(401).send('Unauthorized');
  }
}*/

//Doing async await
module.exports.update = async function(req, res){
if(req.user.id==req.params.id){

  try{
      let user=await User.findById(req.params.id);
      User.uploadedAvatar(req,res,function(err){
        if(err){
          console.log('**** Multer Error :', err);
        }
        user.name=req.body.name;
        user.email=req.body.email;

        if(req.file){
          //checking if user already has a avatar  
          if(user.avatar){
              //if the file of that avatar exists
              if(fs.existsSync(path.join(__dirname,"..",user.avatar))){
                  //deleting the file (old avatar)
                  fs.unlinkSync(path.join(__dirname,"..",user.avatar));
              }
          }
          //saving the path of uploaded file in avatar field of user
          user.avatar=User.avatarPath + '/' + req.file.filename;
      }
        user.save();
        req.flash('success','Profile Updated Successfully!');
        return res.redirect('/');
      }); 

  }
  catch(err){
    req.flash('error',err);
    return res.redirect('back');
  }

}
else{
  req.flash('error','Unauthorized!');
  return res.status(401).send('Unauthorized');
}

}

//render the sign up page
module.exports.signUp=function(req,res){
 
  if(req.isAuthenticated()){
    return res.redirect('/user/profile');
  }
  
  return res.render('user_sign_up',{
    title:"CodeDev | Sign Up"
  });
}

//render the sign in page
module.exports.signIn=function(req,res){
  if(req.isAuthenticated()){
    return res.redirect('/user/profile');
  }
  

  return res.render('user_sign_in',{
    title:"CodeDev | Sign In"
  });
}

//get the sign up data
module.exports.create=function(req,res){
      if(req.body.password!=req.body.confirm_password){
        req.flash('error','Passwords do not match!!');
        return res.redirect('back');
      }

      User.findOne({email: req.body.email},function(err,user){
           
        if(err){
        req.flash('error',err);
        return;
        }
       if(!user){
         User.create(req.body, function(err,user){
          if(err)
          {
            req.flash('error',err);
            return;
          }
          req.flash('success','You have Signed Up, Login To Continue! ');
          return res.redirect('/user/sign-in');
         });

       }
       else{
        req.flash('error','User Already Exists! Please try to Sign In');
         return res.redirect('back');
         
       }

      });

      
}
//Displaying flash messages
/*module.exports.create = function(req, res){
  if (req.body.password != req.body.confirm_password){
      req.flash('error', 'Passwords do not match');
      return res.redirect('back');
  }

  User.findOne({email: req.body.email}, function(err, user){
      if(err){req.flash('error', err); return}

      if (!user){
          User.create(req.body, function(err, user){
              if(err){req.flash('error', err); return}

              return res.redirect('/user/sign-in');
          })
      }else{
          req.flash('success', 'You have signed up, login to continue!');
          return res.redirect('back');
      }

  });
}*/
 
//sign in and create a session for the user
module.exports.createSession=function(req,res){

  req.flash('success','Logged in Succesfully!');
return res.redirect('/');
}

module.exports.destroySession=function(req,res){
  
  req.logout();
  req.flash('success','You have been logged out!');
  
  return res.redirect('/');
}