const path = require('path')
const { execSync } = require('child_process')
const debugModule = require('debug')
const debug = debugModule('lyrix:test')
debug.color = 12 // blue; see https://github.com/visionmedia/debug/issues/761
debugModule.enable('lyrix:test')

const MIGRATE_COMMAND = 'knex migrate:latest'
const TEST_COMMAND = 'mocha --exit --recursive'
const TEST_PATH_PREFIX = 'test'
const DEFAULT_TARGET = 'behavior'

const run = (command) => {
  debug(command)
  execSync(command, { stdio: 'inherit' })
}

const test = (target, args = '') => {
  try {
    run(MIGRATE_COMMAND)
    run(`${TEST_COMMAND} ${target} ${args}`)
    debug('Tests complete.')
  } catch (error) {
    debug(error.message)
  }
}


const main = () => {
  const args = process.argv.slice(2)
  if (args.length < 1) {
    return test(path.join(TEST_PATH_PREFIX, DEFAULT_TARGET))
  }

  let [target, ...rest] = args
  target = path.join(TEST_PATH_PREFIX, target)
  rest = rest.map(r => r.replace(/\s/g, '\\ ')).join(' ')
  test(target, rest)
}

main()
