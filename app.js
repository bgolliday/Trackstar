var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var http = require('http');
var multer=require('multer');
var csv =require('fast-csv');
var SerialPort  = require('serialport');
var portName = 'COM9';
var serialData = {}; 
var serialData1 = {};  
var parsers = SerialPort.parsers;

var parser = new parsers.Readline({
  delimiter: '\r\n'
})

var io = require('socket.io');

var sp = new SerialPort( // instantiate the serial port.
portName, { // portName is instatiated to be COM3, replace as necessary
   baudRate: 9600, // this is synced to what was set for the Arduino Code
   //parser: new serialport.parsers.Readline("\r\n")
   
});  


sp.pipe(parser);




mongoose.connect('mongodb://localhost/trackstar');
var db = mongoose.connection;




//sp.open('open',onOpen);
//sp.open('data',onData);
sp.on('open', () => {
  console.log('Port is open!');
});


/*sp.on('data', (data) => {

  console.log(' '+data);
});  */



var cleanData = ""; // this stores the clean data
var readData = "";  // this stores the buffer





/*function onOpen() {

  console.log("open connection");
} */

/*function onData (data) {

  console.log("on Data" +data);
}*/

var arr=[];
var arr2=[];


var routes = require('./routes/index');
var users = require('./routes/users');
var athletes = require('./routes/athletes');

// Init App
var app = express();



var fs = require('fs');
var util = require('util');
//var ws = fs.createWriteStream(Date.now() + '.csv', { flags: 'w' });
  // Or 'w' to truncate the file every time the process starts.
//var logStdout = process.stdout;

//console.log = function () {
  //logFile.write(util.format.apply(null, arguments) + '\n');
  //logStdout.write(util.format.apply(null, arguments) + '\n');
//}
//console.error = console.log;




// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout2'}));
app.set('view engine', 'handlebars');


//app.use(multer({dest:__dirname+'/uploads/'}).any());






var server = http.createServer(app);
io = io.listen(server);

//io.set('log level', 1);

require('events').EventEmitter.prototype._maxListeners = 100;

io.sockets.on('connection', function (socket) {
  // If socket.io receives message from the client browser then 
    // this call back will be executed.


     sp.on('data', (data) => {

     
readData= data.toString();
      //serialData.value = parser.on('data', console.log);

  if (readData.indexOf("D") >= 0 && readData.indexOf("C") >= 0) {
    serialData1.value = readData.substring(readData.indexOf("C") + 1, readData.indexOf("D"));
    readData = "";
     
    console.log(serialData1.value);
    
   socket.emit("serialEvent1", serialData1);
}
else if(readData.indexOf("B") >= 0 && readData.indexOf("A") >= 0)
{
    serialData.value = readData.substring(readData.indexOf("A") + 1, readData.indexOf("B"));
    readData = "";
    
    console.log(serialData.value);
    
    socket.emit("serialEvent", serialData);
}
});



});   






// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
    
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  res.locals.athlete = req.athlete || null;
  next();
});


//routes
app.use('/', routes);
app.use('/users', users);
app.use('/athletes',athletes);





// Set Port
app.set('port', (process.env.PORT || 3000));

server.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});