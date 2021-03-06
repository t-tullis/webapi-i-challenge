// implement your API here
const express = require('express')

//importing db
const db = require('./data/db.js')

//Server
const server = express();

server.use(express.json())

server.get('/', (req, res) => {
    res.send('Is the API Connected?')
})

//Get all users
server.get('/api/users', (req, res) => {
    db.find().then(users => {
        res.status(200).json(users)
    }).catch(error => {
        res.status(500).json({ message: "The users information could not be retrieved."})
    })
})

//Get a user by ID
server.get('/api/users/:id', (req, res) => {
    const  { id }  = req.params
    db.findById(id).then(user => {
        if(user.length === 0){
            res.status(404).json({message: "The user with the specified ID does not exist."})
            return;
        }
        res.status(200).json(user)
    }).catch(error => {
        res.status(500).json({ error: "The user information could not be retrieved." })
    })
})

//Create a new user
server.post('/api/users', (req, res) => {
    const {name, bio} = req.body
    if(!name || !bio){
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    }
    db.insert({ name, bio }).then(user => {
        res.status(201).json(user)
    }).catch(error => {
        res.status(500).json({ error: "There was an error while saving the user to the database" })
    })
})

//Update user info
server.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, bio} = req.body;

    db.update(id, {name, bio}).then(updated => {
        if(updated === 0){
            res.status(404).json({ message: "The user with the specified ID does not exist."})
        }
         if(!name || !bio){
             res.status(400).json({errorMessage: "Please provide name and bio for the user."})
            }
         res.status(200).json(updated)
    }).catch(error => {
        res.status(500).json({ error: "The user information could not be modified."  })
    })
})

//Remove user
server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params
    db.remove(id).then(removedUser => {
        if(removedUser === 0){
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        }
        res.status(204).end();
    }).catch(error => {
        res.status(500).json({ error: "The user could not be removed"})
    })
})



server.listen(4000, () => {
    console.log('Listening to port 4000')
})