process.env.NODE_ENV = 'development'

console.log(`DB info for env ### ${process.env.NODE_ENV} ###:`)

const db = require('../models')

Object.keys(db).forEach(async (key) => {
  const count = await db[key].query().count()
  console.log(count)
})
