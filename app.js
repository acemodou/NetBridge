var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongo = require('mongodb');
var session = require('express-session');

var index = require('./routes/index');
var users = require('./routes/users');
var mustacheExpress = require('mustache-express');

var _ = require('underscore');
var PORT = process.env.PORT || 3000;

// --> dependency for firebase database
var firebase = require("firebase");

  var config = {
    apiKey: "AIzaSyCopE3i8lSqk7bMZJBOml7uV223XExfYe8",
    authDomain: "unagifinal.firebaseapp.com",
    databaseURL: "https://unagifinal.firebaseio.com",
    projectId: "unagifinal",
    storageBucket: "",
    messagingSenderId: "784732129608"
  };
firebase.initializeApp(config);


// --> instantiating database
var database = firebase.database();


var app = express();

var mentorMap = {};

var collection = {"name": "La bestia",
                  "last": "Tran"}
//var user = {"name":"", "last":""};
var listUsers = [];


app.get('/signup', function(req, res){
    res.render('signup.html', {"yourname": "Modu"});
});

// app.post('/signup', function(req, res){
//     //name, email, company, password, age, biography, role

//     var myname = req.body.user_name;
//     var myemail = req.body.user_email;
//     var mycompany = req.body.user_company;
//     var myethnicity = req.body.user_ethnicity;
//     var mypassword = req.body.user_password;
//     var myage = req.body.user_age;
//     var mybiography = req.body.user_bio;
//     var myrole = req.body.user_job;
    
//     addUser(myname, myemail, mycompany, myethnicity, mypassword, myage, mybiography, myrole);
//     console.log(listUsers);
//     //res.send(req.body.user_job);
//     var myNewData = { users: listUsers};

     
//      // ---> Adding it to Firebase
//     var emailJSON = _.pick(req.body, 'user_email');
//     var username = getUsernameFromEmail(emailJSON['email']);
//     var userdata = _.pick(req.body, 'user_name', 'user_email', 'user_company', 'user_ethnicity', 'user_password', 'user_age', 'user_bio', 'user_job');  
//     createNewAccount(username, mentorData, userdata['user_job']);

//     res.render('netfeed.html', myNewData);
// });



app.get('/profile', function(req, res){
    var usuario =  {
            userid: 'tito',
            name: "Tito",
            gender: 'straight',
            ethnicity: "Puerto Rican",
            company: "Apple",
            role: "Product Development",
            description: "I am passionate about international development and poverty alleviation and want to apply my research skills in economics to global challenges.",
            accomplishments: "Code 2040 Fellow, NASA astrounaut, Nobel Prize in Frizbee",
          };
    res.render('profile.html', usuario);
});

app.get('/login', function(req, res){

    res.render('login.html', {"yourname": "Modu"});
});

app.get('/index2', function(req, res){
    res.render('index2.html', {"yourname": "Modu"});
});


// -> Creates a new acccount in Firebase
function createNewAccount(username, data, group = "student") {
  firebase.database().ref(group+ '/' + username).set(data);
}




function authMiddleware(req, res, next) {
	var user = firebase.auth().currentUser;
	if( user !== null) {
		//--> here you can read more data from db and put it into the
		// the request
		req.user = user;
		next();
	} else{
		res.redirect('/login');
	}
}


  var data = {
      users: [
          {
            
            name: "Gema",
            ethnicity: "Cuban",
            email: "abc@gmail.com",
            gender: 'Agender',
            company: "Salesforce",
            role: "FinTech consultant",
            description: "Analytical consultant with 10+ years of experience advising clients in management consulting, market research and investment banking. Expertise in applying math and analytics to solve business problems.",
            accomplishments: "Rho Theta Kappa, Olympic Medals twice",
          },
          {
            
            name: "Ricardo",
            company: "Intel",
            email: "def@gmail.com",
            gender: 'Androgyne',
            ethnicity: "Ghanian",
            role: "Data Analitics",
            description: "From software engineering internships at LinkedIn and Intel, to academic research fellowships and positions at Stanford, MIT, and FBK in Italy, to my current work as Investment Associate Intern at Bridgewater Associates",
             accomplishments: "Boy Scouts Eagle, NSA Medal of Honor",
          },
          {
            
            name: "Alicia",
            ethnicity: "Dominican",
            gender: 'queer',
            email: "geh@gmail.com",
            company: "Facebook",
            role: "Software Engineering",
            description: "I'm a software engineer. I'm interested in cybersecurity, civic technology, the intersection of design and tech, and user experiences.",
            accomplishments: "President Award, PDX University Fellow",
          },
          {
            
            name: "Tito",
            ethnicity: "Puerto Rican",
            gender: "Amicagender",
            email: "ijk@gmail.com",
            company: "Apple",
            role: "Product Development",
            description: "I am passionate about international development and poverty alleviation and want to apply my research skills in economics to global challenges.",
            accomplishments: "Code 2040 Fellow, NASA astrounaut, Nobel Prize in Frizbee",
          },
      ]
  };

app.get('/netfeed', function(req, res){
    res.render('netfeed.html', data);
});







//listUsers.push(user);


function addUser(name, email, company, ethnicity ,password, age, biography, role, urlphoto){
  var id = listUsers.length;
  listUsers.push({"id": id, "name": name, "email": email, "company": company, "ethnicity": ethnicity ,"password": password, "age": age, "biography": biography, "role": role, "urlphoto": urlphoto});
}

addUser("Pedro", "pedro@gmail.com", "Apple", "Mexico","1111", "40", "Good with iOS", "Mentor","/assets/img/img2.jpg");
//addUser("hhh", "ttt", "mentor");
//addUser("dd", "aaa", "mentor");

var listOfMessage = [];

function addMessage(mentor, sender, text){
  listOfMessage.push({"mentor": mentor, "sender": sender, "text": text});
}

addMessage("pedro", "pepe", "Hola pepe como estas");
addMessage("tomas", "alina", "Hola pepe como estas");
// find all messages for a mentor
function findMessage(name){
  var listPrivateMessage = [];

  listOfMessage.forEach(function(element){
      if(element.mentor == name){
        listPrivateMessage.push(element);
      }
  }, this);
    return listPrivateMessage; 
}

function findUser(name){
  var myUserFromList = null;

  listUsers.forEach(function(element) {
    if(element.id == name){
      myUserFromList = element; 
    }
  }, this);
  return myUserFromList;
}


// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// Register '.html' extension with The Mustache Express
app.engine('html', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000, saveUninitialized: false  }}))
//app.use('/', index);
//app.use('/users', users);

app.get('/', function(req, res){
    res.render('index.html', {"yourname": "Modu"});
});


app.post('/login', function(req, res){

  // --> Comment this code if you want to turn off firebase
	var email = _.pick(req.body, 'email')['email'];
	var password =  _.pick(req.body, 'password')['password'];

	firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
	
		return res.redirect('/netfeed');
	
	}).catch(function(error) {
  		// Handle Errors here.
  		var errorCode = error.code;
  		var errorMessage = error.message;

  		return res.status(404).send({message: errorMessage});
	});


    //res.render('login.html', {"yourname": "Modu"});
});

app.get('/sendMessage', function(req, res){
    res.render('sendMessage.html', {"yourname": "Modu"});
});

app.get('/contactus', function(req, res){
    res.render('contactus.html', {"yourname": "Modu"});
});

// TODO: change to the right html to render
app.get('/mentordashboard', function(req, res){
	var response = { message: 'success' };
	res.status(200).send(response);
    // res.render('contactus.html', {"yourname": "Modu"});
});

// TODO: change to the right html to render
app.get('/studentdashboard', function(req, res){
	var response = { message: 'success' };
	res.status(200).send(response);
    // res.render('contactus.html', {"yourname": "Modu"});
});



// -> obtains te username from the user's email
function getUsernameFromEmail(email){
	console.log('Email inside the function -- ' + email);
	var index = email.indexOf("@");
	console.log('INDEX  ' + index);
    var username= email.substring(0,index);
    console.log('username   ' + username);
    return username;

}

// -> creates a mentor's account
app.post('/newmentor', function(req, res){
	// TODO: do some data sanitazion before adding to database
	var emailJSON = _.pick(req.body, 'email');
	var username = getUsernameFromEmail(emailJSON['email']);
	var mentorData = _.pick(req.body, 'fullname', 'email', 'password', 'role', 'gender', 'age', 'hometown');	
	createNewAccount(username, mentorData, "mentors"); 
	return res.redirect('/mentordashboard');
});

// -> creates a student's account
app.post('/newstudent', function(req, res){
	// TODO: do some data sanitazion before adding to database
	var email = _.pick(req.body, 'email')['email'];
	var password =  _.pick(req.body, 'password')['password'];
	var username = getUsernameFromEmail(email);
	var studentData = _.pick(req.body, 'fullname', 'email', 'gender', 'age', 'hometown', 'school', 'major');
	createNewAccount(username, studentData, "students"); 
	
	firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
		return res.redirect('/studentdashboard');
	}
	).catch(function(error) {
  		// Handle Errors here.
  		var errorCode = error.code;
  		var errorMessage = error.message;

  		return res.status(404).send(errorMessage);
	});

	
});



app.get('/indexFeed', function(req, res){
    res.render('indexFeed.html', data);
});

app.post('/passdata', function(req, res){
    req.session.mydata = "tochi";
    res.send(req.body);
});


app.get('/getList', function(req, res){
    
    res.jsonp(listUsers);
});

app.get('/getAllMessage', function(req, res){
    //save username for the session
    var mentorRequest = req.query.name;
    var listOfPrivateMessages = findMessage(mentorRequest);
    res.jsonp(listOfPrivateMessages);
});

app.get('/getUser', function(req, res){
    var nameParams = req.query.name;
    console.log(nameParams);
    var result = findUser(nameParams);
    res.jsonp(result);
});

app.get('/mentor/:id', function(req, res){
    var myId = Number(req.params.id);
    if(typeof(myId) == 'number'){
      console.log('It is a number');
    }else{
      console.log('Not a number');
    }

    var resultTemp = findUser(myId);
    console.log(resultTemp);
    //res.send(req.params);
    res.render('profile.html', resultTemp);
});

// send message to mentor
app.post('/sendMessage', function(req, res){
    //req.session.mydata = "tochi";
    var tempMentor = req.body.mentor;
    var studentName = req.body.student;
    var tempText = req.body.text;
    console.log(tempMentor, studentName, tempText);
    addMessage(tempMentor, studentName, tempText);

    res.send(`${tempMentor} sent to ${studentName}`);

});

app.post('/newuser', function(req, res){
    req.session.mydata = "tochi";
    //name, email, company, password, age, biography, role

    var myname = req.body.user_name;
    var myemail = req.body.user_email;
    var mycompany = req.body.user_company;
    var myethnicity = req.body.user_ethnicity;
    var mypassword = req.body.user_password;
    var myage = req.body.user_age;
    var mybiography = req.body.user_bio;
    var myrole = req.body.user_job;
    
    addUser(myname, myemail, mycompany, myethnicity, mypassword, myage, mybiography, myrole);
    console.log(listUsers);
    //res.send(req.body.user_job);
    var myNewData = { users: listUsers};

    var email = _.pick(req.body, 'user_email')['user_email'];
    var password = _.pick(req.body, 'user_password')['user_password'];

    var username = getUsernameFromEmail(email);
    console.log('-------- ')
    var userdata = _.pick(req.body, 'user_name', 'user_email', 'user_company', 'user_ethnicity', 'user_password', 'user_age', 'user_bio', 'user_job');  
    createNewAccount(username, userdata, userdata['user_job']);

    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
      return res.render('netfeed.html', myNewData);
    }
    ).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      return res.status(404).send(errorMessage);
    });

    
});

app.listen(PORT, function () {
  console.log('Example app listening on port 3000!')
});



