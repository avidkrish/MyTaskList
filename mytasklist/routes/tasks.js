var express = require('express');
var router = express.Router();

// router.get('/tasks', function (req, res, next) {
//     res.send('TASK API 2');
// });

// //dummy records
// router.get('/tasks', function (req, res, next) {
//     res.writeHead(200, { 'Content-Type': 'application-json' });
//     var myObj={
//         id:'1',
//         title:'test',
//         isDone:'false'
//     }
//     res. end(JSON.stringify(myObj));
// });

var mongojs = require('mongojs');
//var db = mongojs('mongodb+srv://isolve:isolve@cluster0-vn92f.mongodb.net/test?retryWrites=true&w=majority', 'tasks');
//var db = mongojs('mongodb+srv://isolve:isolve@cluster0-vn92f.mongodb.net/test?retryWrites=true&w=majority', { dbName: 'dbMyTaskList' });

//working
var db = mongojs('mongodb+srv://isolve:isolve@cluster0-vn92f.mongodb.net/dbMyTaskList', ['tasks']);
//var db = mongojs('mongodb+srv://isolve:isolve@cluster0-vn92f.mongodb.net/dbMyTaskList?keepAlive=true&poolSize=30&socketTimeoutMS=360000&connectTimeoutMS=360000', ['tasks']);

//isolve:isolve – DB username:password
//dbMyTaskList – DB name
//tasks – collection name

// Get All Tasks
router.get('/tasks', function(req, res, next){
    db.tasks.find(function(err, tasks){
        if(err){
            res.send(err);
        }
        res.json(tasks);
    });
});

// Get Single Task
router.get('/task/:id', function(req, res, next){
    db.tasks.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, task){
        if(err){
            res.send(err);
        }
        res.json(task);
    });
});

//Save Task
router.post('/task', function(req, res, next){
    var task = req.body;
    if(!task.title || !(task.isDone + '')){
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    } else {
        db.tasks.save(task, function(err, task){
            if(err){
                res.send(err);
            }
            res.json(task);
        });
    }
});

// Delete Task
router.delete('/task/:id', function(req, res, next){
    db.tasks.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, task){
        if(err){
            res.send(err);
        }
        res.json(task);
    });
});

// Update Task
router.put('/task/:id', function(req, res, next){
    var task = req.body;
    var updTask = {};
    
    if(task.isDone){
        updTask.isDone = task.isDone;
    }
    
    if(task.title){
        updTask.title = task.title;
    }
    
    if(!updTask){
        res.status(400);
        res.json({
            "error":"Bad Data"
        });
    } else {
        db.tasks.update({_id: mongojs.ObjectId(req.params.id)},updTask, {}, function(err, task){
        if(err){
            res.send(err);
        }
        res.json(task);
    });
    }
});

module.exports = router;
