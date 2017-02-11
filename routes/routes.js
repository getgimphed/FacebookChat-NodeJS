// var express = require('express');
// var router = express.Router();
// var passport = require('passport');
// var config =  require('./../config/config.js');
module.exports = function (router,express,rooms,passport,config){
  router.get('/',function(req,res,next){
    res.render('index',{
      title:"FB Login"
    });
  });
  function securePages(req,res,next) {
    if(req.isAuthenticated()){
      next();
    }
    else {
      res.redirect('/');
    }
  }
  router.get('/chatrooms',securePages,function(req,res,next){
    res.render('chatrooms',{
      title:"Chatrooms",
      user:req.user,
      config:config
    });
  });

  router.get('/room/:id',function(req,res,next){
    var room_name = findTitle(req.params.id);
    res.render('room',{user:req.user,room_name:room_name,room_number:req.params.id,config:config});
  });
  function findTitle(room_number) {
    var n = 0;
    while (n<rooms.length) {
      if(rooms[n].room_number == room_number){
        return rooms[n].room_name;
        break;
      }
      else {
          n++;
          continue;
      }
    }
  }
  router.get('/auth/facebook',passport.authenticate('facebook'));
  router.get('/auth/facebook/callback',passport.authenticate('facebook',{
    successRedirect:'/chatrooms',
    failureRedirect:'/'
  }));

  router.get('logout',function(req,res,next){
    req.logout();
    res.redirect('/');
  });
  // router.get('/setcolor',function(req,res,next){
  //   req.session.favColor = "Red";
  //   res.send('Setting favorite color');
  // });
  // router.get('/getcolor',function(req,res,next){
  //   res.send('Fav color' + (req.session.favColor===undefined ? "Not found" : req.session.favColor));
  // });
  // router.get('/clearcolor',function(req,res,next){
  //   delete req.session.favColor;
  //   res.send('Fav color' + (req.session.favColor===undefined ? "Not found" : req.session.favColor));
  // });
}
// module.exports = router;
