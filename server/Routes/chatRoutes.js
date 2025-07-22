const express = require('express')
const router = express.Router();
const {createChat, findUserChat, findChat} = require('../Controllers/ChatControllers')
router.post('/', createChat);
router.get('/:userid', findUserChat);
router.get('/find/:firstid/:secondid', findChat);
module.exports = router
