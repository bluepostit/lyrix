const path = require('path')
const { execSync } = require('child_process')
const { exit } = require('process')

const MIGRATE_COMMAND = 'knex migrate:latest'
const TEST_COMMAND = 'mocha --exit --recursive'
const TEST_PATH_PREFIX = 'test'
const DEFAULT_TARGET = 'behavior'

const debug = (() => {
  const debugModule = require('debug')
  const testNamespace = 'lyrix:test'
  const debug = debugModule(testNamespace)
  debug.color = 12 // blue; see https://github.com/visionmedia/debug/issues/761

  if (process.env['VERBOSE']) {
    debugModule.enable(`lyrix:*,${testNamespace}`)
  } else {
    debugModule.enable(testNamespace)
  }
  return debug
})()

const run = (command) => {
  debug(command)
  execSync(command, { stdio: 'inherit' })
}

const test = (target, args = '') => {
  try {
    run(MIGRATE_COMMAND)
    run(`${TEST_COMMAND} ${target} ${args}`)
  } catch (e) {
    console.log(e.message)
    exit(-1)
  }
  debug('Tests complete.')
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
