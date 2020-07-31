const express = require('express')
const router = express.Router()
const { SongItem } = require('../models')
const { ensureLoggedIn } = require('../authentication')


router.get('/', ensureLoggedIn, async(req, res) => {

})

module.exports = router
