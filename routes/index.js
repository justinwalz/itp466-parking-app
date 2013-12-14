
/*
 * GET home page.
 */

exports.index = function(req, res){
  var vars = { 
    title: 'Welcome to Parq' 
  };
  res.render('index', vars);
};