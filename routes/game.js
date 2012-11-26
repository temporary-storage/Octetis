
var url = require('url');
//var app = require('../app');
//console.log (app);
//var io = require('socket.io').listen(app);

exports.data = function(request, response){
    /*
    console.log(request.url);
    console.log(request.params);
    var urlQuery = url.parse(request.url,true).query;
    */
    var gameId = request.params.id;

    response.render('game', {
        title: 'Access denied',
        gameId : gameId
    });
};

