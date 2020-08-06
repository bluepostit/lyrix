const repl = require('repl')
const debugModule = require('debug')
const db = require('../models')
const util = require('../util')

const debug = debugModule('lyrix:cli')
debugModule.enable('lyrix:cli')

console.log('--- Lyrix console ---')
console.log(`
You can use \`await\` with promises, eg.
\`let artist = await db.Artist.query().findOne('name ', 'ilike', '%coldplay%')\`
`)

// Start the REPL
const replServer = repl.start({})
replServer.context.db = db
replServer.context.util = util
replServer.context.debug = debug
