const express = require('express')
const router = express.Router()
const usersRoute = require('./users.route')
const bankAccountsRoute = require('./bank_accounts.route')
const transactionsRoute = require('./transactions.route')
// const morgan = require('morgan')

// router.use(morgan('dev'))

router.use('/api/v1/users', usersRoute)
router.use('/api/v1/accounts', bankAccountsRoute)
router.use('/api/v1/transactions', transactionsRoute)


module.exports = router