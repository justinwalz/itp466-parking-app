exports.index = function(req, res){
  var vars = { 
    title: 'Welcome to Parq',
    session: ''
  };
  res.render('index', vars);
};