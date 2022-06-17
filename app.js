
const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()

// Format of token:
// Authorization: Bearer <access_token>

// Verify Token, middleware 
const verifyToken = (req, res, next) => {
  // Get the bearer header token from the request 
  const bearerHeader = req.headers['authorization']
  // Check if bearer is undefined, if not extract the token from bearer header
  // otherwise send 403 forbidden 
  if(typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1]
    req.token = bearerToken
    next()
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}


app.get('/api', (req, res) => {
  res.json({ message: 'Api running'})
})

// protected route using verifyToken middleware 
app.post('/api/posts', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', () => (err, authData) => {
    if(err) { 
      res.sendStatus(403) 
    } else { 
      res.json({ message: 'Post Created'}, authData )
    }
  })
  res.json({ message: 'Post created'})
})

// how to get a token in order to make a request to a protected route: 
app.post('/api/login', (req, res) => {
  // Mock user, would be a database call
  const user = {
    id: 1,
    username: 'rob',
    email: 'rwatso@gmail.com'
  }
  // takes a user payload and a secret key and returns a token 
  jwt.sign({ user }, 'secretkey', (err, token) => {
    res.json({ token } )
  })
})



app.listen(5002, () => console.log('Server Started on Port 5002')) 

