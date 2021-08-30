// BUILD YOUR SERVER HERE
const express = require('express');
const User = require('./users/model.js')
const server = express();

server.use(express.json())

server.post('/api/users', (request, response) => {
    const newUser = request.body;
    if (!newUser.name || !newUser.bio) {
        response.status(400).json({ message: "Please provide name and bio for the user" })
    } else {
        User.insert(newUser)
            .then(user => {
                response.status(201).json(user);
            })
            .catch(error => {
                console.log(error)
                response.status(500).json({ message: "There was an error while saving the user to the database" })
            })
    }
})

server.get('/api/users', (request, response) => {
    User.find()
        .then(users => {
            response.status(200).json(users);
        })
        .catch(error => {
            console.log(error)
            response.status(500).json({ message: "The users information could not be retrieved" });
        })
})

server.get('/api/users/:id', (request, response) => {
    User.findById(request.params.id)
        .then(user => {
            if(user) {
                response.status(200).json(user);
            } else {
                response.status(404).json({ message: "The user with the specified ID does not exist" });
            }
        }) 
        .catch(error => {
            response.status(500).json({ message: "The user information could not be retrieved" });
        })
})

server.delete('/api/users/:id', (request, response) => {
    User.remove(request.params.id)
        .then(deletedUser => {
            if(deletedUser) {
                response.status(200).json(deletedUser);
            } else {
                response.status(404).json({ message: "The user with the specified ID does not exist" });
            }
        })
        .catch(error => {
            response.status(500).json({ message: "The user could not be removed" })
        })
})

server.put('/api/users/:id', (request, response) => {
    const updatedInfo = request.body;

    if(!updatedInfo.name || !updatedInfo.bio) {
        response.status(400).json({ message: "Please provide name and bio for the user" });
    } else {
        User.update(request.params.id, updatedInfo)
            .then(updatedUser => {
                if(updatedUser) {
                    response.status(200).json(updatedUser);
                } else {
                    response.status(404).json({ message: "The user with the specified ID does not exist" });
                }
            })
            .catch(error => {
                response.status(500).json({ message: "The user information could not be modified" });
            })
    }
})

module.exports = server; // EXPORT YOUR SERVER instead of {}
