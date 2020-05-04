const Todo = require('../models/todo.model');
const loadTodos = (res) => {
    Todo.find()
    .then(todos => {
        res.send(todos)
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occured while retrieving Todos."
        })
    })
}

exports.create = (req, res) => {
    if(!req.body.title) {
        return res.status(400).send({
            message: 'Todo title can not be empty'
        });
    }

    const todo = new Todo({
        title: req.body.title || "Untitled Todo",
        completed: req.body.completed
    });

    todo.save()
    .then(data => {
        res.send(data);
    }).catch(err=> {
        res.status(500).send({
            message: err.message || "some error occured while creating the TOdo"
        });
    })
};

exports.findAll = (req, res) => {
    loadTodos(res);
};

exports.update = (req, res) => {
    if(!req.body.title) {
        return res.status(400).send({
            message: "Todo content can not be empty"
        })
    }
    
    Todo.findByIdAndUpdate(req.params.todoId, {
        title: req.body.title || "Untitled Note"
    })
    .then(todo => {
        if(!todo) {
            return res.status(404).send({
                message: "Todo not found with id " + req.params.todoId
            })
        }

        loadTodos(res);

    }).catch(err => {
        if(err.kind === "ObjectId") {
            return res.status(404).send({
                message: "Todo not found with id "+ req.params.todoId
            })
        }
        return res.status(500).send({
            message: "Error updating todo with id " + req.params.todoId
        })
    })
}

exports.delete = (req, res) => {
    Todo.findByIdAndRemove(req.params.todoId)
    .then(todo => {
        if(!todo) {
            return res.status(400).send({
                message: "Todo not found with id " + req.params.todoId
            })
        }

        loadTodos(res);

    }).catch(err => {
        if(err.kind === "ObjectId" || err.name === "NotFound") {
            return res.status(400).send({
                message: "Todo not found with id " + req.params.todoId
            })
        }
        return res.status(500).send({
            message: "Could not delete todo with id " + req.params.todoId
        })
    })
}
