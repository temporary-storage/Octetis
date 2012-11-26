
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {
      title: 'Entrance',
      link : req.headers.host +"/game/integer_value_of_the_room"
  });
};