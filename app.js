
var bodyParser = require("body-parser");

var http = require('http');
var express = require('express');
var app = express();



var server = http.createServer(app);
// Pass a http.Server instance to the listen method
var io = require('socket.io').listen(server);
io.origins('*:*');

// The server should start listening
function startWebServer(port){
  console.log("Server started on port " + port);
  server.listen(port);
};

app.use(express.static('public'));
app.use(express.static('node_modules'))
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Routes management
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/sendInformation', function(req,res){
    if(req.body.token === "LEPX510CESTGENIAL") // Poor protection but ok for the demo
    {
        sendInformationToAll(req.body.tag, req.body.text);
        res.statusCode = 200;
        res.send("Ok");
        console.log("OK -- Data Received");
    }
    else
    {
        res.statusCode = 403;
        res.send('FORBIDDEN');
        console.log("Forbidden");
    }

});


app.post('/register', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;

    console.log(username)
    console.log(password)
    /*var url = "https://demo.yubico.com/wsapi/u2f/enroll?username=" + username + "&password=" + password;
    var request = require('request');
    request(url, function(error, __, body) {
        console.log(body);
        response.send(body + "<script> alert(\"coucou\") </script>");
    });*/


}); 

// Sockets management
io.on('connection', function (client) {
    console.log("Client connected" + client.handshake.address);
    client.emit('update', {tag: "Server", text: "Welcome " + client.request.connection.remoteAddress})
});

// Pour émettre des infos à tous les spectateurs, on utilise la fonction suivante
//    io.sockets.emit('update', {tag: "Server", text: "Welcome " + client.handshake.address });

function sendInformationToAll(tag,text)
{
    io.sockets.emit('update', {tag: tag, text: text});
}


startWebServer(process.env.PORT);
