const express = require('express')
const router = express.Router()
const { Get, Insert, Detail } = require('../controller/users.controller')
// const { CheckPostReq } = require('../middleware/middleware')

router.post('/', Insert)
router.get('/', Get)
router.get('/:id', Detail)
module.exports = router