const express = require('express')
const router = express.Router();
const {RegisterUser, LoginUser,FindUser, GetUsers} = require('../Controllers/UserController')
router.get('/',GetUsers)
router.post('/register',RegisterUser)
router.post('/login',LoginUser);
router.get('/find/:userid',FindUser);
module.exports = router