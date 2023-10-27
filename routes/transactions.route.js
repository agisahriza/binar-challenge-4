const express = require('express')
const router = express.Router()
const { Get, Transfer } = require('../controller/transactions.controller')

router.post('/', Transfer)
router.get('/', Get)

module.exports = router