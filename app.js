var express = require("express");
var app = express();
var path = require('path');
// var cookieParser = require('cookie-parser');
var session = require('express-session');
var port = process.env.PORT || 8080;
var mode = process.env.NODE_ENV || "development";
var config = require("./config/config.js");
var MongoStore = require ('connect-mongo')(session);
var mongoose = require('mongoose').connect(config.dbUrl);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() { console.log("Mongo DB connected!"); });
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var rooms=[];

app.use(express.static("views/static"));
console.log("Mode : " + mode);
app.use(function(req,res,next){
  console.log(`${req.method}  request for ${req.url}`);
  next();
});
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

// app.use(cookieParser()); Not requied with new express-session

if(mode == "production"){
  app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store : new MongoStore({
      // url : config.dbUrl,
      mongoose_connection:mongoose.connections[0],
      stringify:true
    })
  }));
}
else{
  app.use(session({
    secret:'FacebookChat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));
}

// var userSchema = mongoose.Schema({
//   username:String,
//   password:String,
//   fullname:String
// });
//
// var Person = mongoose.model('users',userSchema);
// var John = new Person({
//   username:'john',
//   password:'jjp',
//   fullname:'John Doe'
// });
// John.save(function(err){
//   console.log("Done ! Err if any :" + err);
// });

app.use(passport.initialize());
app.use(passport.session());
require('./auth/passportAuth.js')(passport,FacebookStrategy,config,mongoose);
require('./routes/routes')(app,express,rooms,passport,config);

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
require('./socket/socket.js')(io,rooms);
server.listen(port,function(){
  console.log(`listening on port ${port}`);
});



// app.get('/', function (req, res) {
//     res.render('index',{
//       title:"TITILE"
//     });
// });

// mongodb://<getgimphed>:<learning>@ds143449.mlab.com:43449/chatdb
// App ID = 298821093854656
// App Secret = eb1e78fbb724b271855853424d373697
