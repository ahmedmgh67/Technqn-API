//hospital management
var mongoose = require('mongoose');
var express = require('express'),app = express(), port = 5000;
var bodyParser = require('body-parser');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Connect to MongoDB
mongoose.Promise = global.Promise;
mongoose
  .connect(
    'mongodb://mongo-db:27017/technqn',
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
//starting the app
app.listen(
  port, () => console.log(
    'Hasel RESTful API server started on: ' + port
  )
);
//schema
var RequestSchema = new Schema({
  user:{
    type: String,
    required: true
  },
  type:{
    type: String,
    required: true
  },
  address:{
    type: String,
    required: true
  },
  status:{
    type: String,
    default: "Waiting to Open"
  },
  date:{
    type: Date,
    default: Date.now
  }
});
mongoose.model("requests", RequestSchema);
var Request = mongoose.model("requests");
listRequests = function(req, res){
  Request.find({user: req.params.userId}, function(err, requests) {
    if (err)
      res.send(err);
    res.json(requests);
  });
}
listAllRequests = function(req, res){
  Request.find({}, function(err, requests) {
    if (err)
      res.send(err);
    res.json(requests);
  });
}
createRequest= function(req, res) {
  var newRequest = new Request(req.body);
  newRequest.save(function(err, request) {
    if (err)
      res.send(err);
    res.json(request);
  });
};

updateRequest = function(req, res) {
  Request.findOneAndUpdate({_id: req.params.request}, req.body, {new: true}, function(err, request) {
    if (err)
      res.send(err);
    res.json(request);
  });
};
deleteRequest = function(req, res) {
  Request.remove({
    _id: req.params.request
  }, function(err, request) {
    if (err)
      res.send(err);
    res.json({ message: 'Request successfully deleted' });
  });
};

// handling the routes
app.route('/api/requests/:userId')
  .get(listRequests)
app.route('/api/requests')
  .post(createRequest)
  .get(listAllRequests);
app.route('/api/requests/:request')
  .put(updateRequest)
  .delete(deleteRequest);

//the user
//schema
var UserSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true,
    unique: true
  },
  password:{
    type: String,
    required: true
  },
  address:{
    type: [{type: String}],
    required: false
  },
});
UserSchema.plugin(uniqueValidator);
mongoose.model("users", UserSchema);
var User = mongoose.model("users");
login = function(req, res) {
  User.find({email: req.body.email, password: req.body.password}, function(err, requests) {
    if (err)
      res.send(err);
    res.json(requests);
  });
};
register = function(req, res) {
  var newUser = new User(req.body);
  newUser.save(function(err, request) {
    if (err)
      res.send(err);
    res.json(request);
  });
};
app.route("/api/login")
  .post(login)
app.route("/api/register")
  .post(register)