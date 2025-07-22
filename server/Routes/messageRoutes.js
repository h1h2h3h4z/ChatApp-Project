const express = require('express')
const router = express.Router();
const {createMessage, getMessages} = require('../Controllers/MessageControllers')
router.post('/', createMessage);
router.get('/:chatid', getMessages);
module.exports = router