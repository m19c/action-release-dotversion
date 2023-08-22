import * as core from '@actions/core'

/**
 * The final configuration object.
 */
interface Options {
  versionFile: string
  token: string
  body: string
}

/**
 * InvalidConfigError indicates that a configuration is invalid or
 * missing.
 */
export class InvalidConfigError extends Error {}

/**
 * Read the current configuration using the `@actions/core` implementation
 * of GitHub.
 *
 * @throws InvalidConfigError if the versionFile is empty
 * @throws InvalidConfigError if the token is empty
 * @returns Options
 */
export function read(): Readonly<Options> {
  const options: Options = {
    versionFile: '',
    token: '',
    body: ''
  }

  options.token = core.getInput('token')
  if (options.token.length === 0) {
    throw new InvalidConfigError(``)
  }

  options.versionFile = core.getInput('versionFile')
  if (options.versionFile.length === 0) {
    throw new InvalidConfigError(``)
  }

  options.body = core.getInput('body')
  if (options.body.length === 0) {
    throw new InvalidConfigError(``)
  }

  // finally, freeze the object to avoid changes
  Object.freeze(options)

  return options
}
