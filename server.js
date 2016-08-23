/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
require('./env.js');
var app = express();
  //lets require/import the mongodb native drivers.
  var mongodb = require('mongodb');
  

  //We need to work with "MongoClient" interface in order to connect to a mongodb server.
  var MongoClient = mongodb.MongoClient;

var COMMENTS_FILE = path.join(__dirname, 'tasks.json');
  // Connection URL. This is where your mongodb server is running.
  //var url = 'mongodb://localhost:27017/my_database_name';
  var url = process.env['MONGOCS'];
  console.log(url);

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});



app.get('/api/tasks', function(req, res){

  // Use connect method to connect to the Server
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      //HURRAY!! We are connected. :)
      var tasks = [];
      console.log('Connection established to', url);

                     // var cursor =db.collection('tasks').find( );
                     //   cursor.each(function(err, doc) {
                          
                     //      if (doc != null) {
                     //         console.dir(doc);
                     //         tasks.push(doc);
                     //      } else {
                     //         callback();
                     //      }
                     //   });

            var collectionTasks = db.collection("tasks");

             collectionTasks.find({}).toArray(function(err, tasks) {
               // so now, we can return all students to the screen.
               res.status(200).json(tasks);
            });
      //res.json(JSON.parse(tasks));
      //Close connection
      db.close();
    }
  });
});

app.put('/api/tasks/', function(req, res) {
  console.log(req.body);

      var task = {
      id: req.body.id,
      context: req.body.author,
      text: req.body.text
    };

      // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, db) {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
      } else {
        //HURRAY!! We are connected. :)
        console.log('Connection established to', url);
        console.log('update');

             db.collection('tasks').updateOne(
              { "context" : "12344"},
              {
                $set: { "text": "WHOOOOOO" }
              }, function(err, results) {
                console.log(err);
                console.log("ok:  " + results.ok);
                console.log("modified:  " + results.nModified);
              
           });

        // do some work here with the database.

        //Close connection
        db.close();
        }
    });
  });

app.post('/api/tasks', function(req, res) {

    var task = {
      id: Date.now(),
      context: req.body.author,
      text: req.body.text
    };

    // Use connect method to connect to the Server
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      //HURRAY!! We are connected. :)
      console.log('Connection established to', url);

                    db.collection('tasks').insertOne(task, function(err, result) {
                    //assert.equal(err, null);
                    if(err){
                      console.log(err);
                    }
                    console.log("Inserted a document into the restaurants collection.");
                    //callback();
                  });

      // do some work here with the database.


      //Close connection
      db.close();
    }
  });


});




app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
