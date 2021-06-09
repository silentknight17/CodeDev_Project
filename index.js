const express=require('express');
const env=require('./config/environment');
const logger=require('morgan');
const cookieParser=require('cookie-parser');
const app=express();
const port=8000;

const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');

//Used for session cookie
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');


//Google Authentication
const passportGoogle=require('./config/passport-google-oauth2-strategy');

//Using MongoStore now to prevent from automatically signing out

const MongoStore = require('connect-mongodb-session')(session);

//For creating flash messages
const flash=require('connect-flash');
const customMware=require('./config/middleware');

const chatServer=require('http').Server(app);
const chatSockets=require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');


const path=require('path');

//only use saas files to be executed  when in development mode 
if(env.name=='development'){
    //telling app to use it
    app.use(sassMiddleware({
            /*
            src - Source directory used to find .scss or .sass files.
            dest - Destination directory used to output .css files. 
            */ 
        src:path.join(__dirname,env.asset_path,'scss'),
        dest:path.join(__dirname,env.asset_path,'css'),
        debug:true,
        outputStyle:'extended',
        prefix:'/css'

    }));
}
const { Server } = require('http');
//Sass-Middleware library is not getting installed in my system
/*const sassMiddleware=require('node-sass');
   app.use(sassMiddleware({
   src: './assets/scss',
   dest: './assets/css',
    debug:true,
    outputStyle: 'extended',
    prefix:'/css'
}));
*/
app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static('/public'));

//make the uploads path available to the browser
app.use('/uploads',express.static(__dirname+'/uploads'));


//const expressLayouts=require('express-ejs-layouts');
app.use(express.static(env.asset_path));
app.use(expressLayouts);
app.set('Layout extractStyles',true);
app.set('layout extractScripts',true);



//Setting up the view engine
app.set('view engine','ejs');
app.set('views','./views');

//Mongo store is used to store the session cookie in the Database.
app.use(session({
    name:'CodeDev',

    //ToDo change the secret before deployment in production state
    secret:'AllIsWell',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store: new MongoStore({
        
           mongooseConnection : db,
           autoRemove:'disabled'
        
    },
    function(err){
        console.log(err ||'connect-mongodb setup ok');
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

//Should be used after passport because flash uses session cookies.

app.use(flash());
app.use(customMware.setFlash);


//Use express router
app.use('/',require('./routes'));

app.listen(port,function(err){
    if(err)
    {
        console.log('Error:', err);
        // The same code can be written as---> console.log('Error:',err);
      
    }
    console.log('Server is running on port',port);
});








