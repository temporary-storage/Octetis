
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , game = require('./routes/game')
  , http = require('http')
  , path = require('path')
  , fs = require('fs');

var app = express();




  app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// routes
app.get('/', routes.index);
app.get('/users', user.list);

app.get('/game_not_allowed/:id',game.data);
//todo remove on production to separate file

app.get('/game/:id',function(request, response)
{
    /*
     console.log(request.url);
     console.log(request.params);
     var urlQuery = url.parse(request.url,true).query;
     */
    var gameId = request.params.id;
    /*
    response.render('game', { title: 'Express',
                         gameId : gameId
    }); */
    // rooms are allowed only for 2 connections
    if (io.of(currentUrl).clients().length >1)  response.redirect('/game_not_allowed/'+gameId);
    fs.readFile('./views/game.html',function(err,data)
    {
        if (err) {throw new Error('template not found')}
        response.end(data)
    })
    //response.send("game namespace for sockets"+gameId );
    var currentUrl = '/game/'+gameId;


    createGameRoom(currentUrl);

    //console.log("number of peoples in " + currentUrl + " : " + io.of(currentUrl).clients().length);

})


var server = http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});


io = require('socket.io').listen(server);
io.set('log level',1);//disabling logging


var createGameRoom = function (currentUrl){
    if (!io.namespaces[currentUrl]) // check if server namespace not yet created
        io.of(currentUrl)
            .on('connection', function (socket) {

                socket.on('checkMarker', function (data) {
                    var msg = data.type;
                    socket.broadcast.emit('checkMarker',msg);
                });
                socket.on('message',function(msg)
                {
                    // get id for user
                    var socketID = (socket.id).toString().substr(0,5);

                    msg += "\t  "+(new Date()).toLocaleTimeString()+"\t\n by"+socketID;
                    console.log("Message received : "+ msg);
                    //console.log(io.sockets);
                    socket.broadcast.emit('message',msg);
                })
            });
}

