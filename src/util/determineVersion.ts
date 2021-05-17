import {promises} from 'fs'
import {SemVer} from 'semver'
import parse from 'semver/functions/parse'

/**
 * Tries to open the obtained file to parse the underlying version.
 *
 * @param file a file containing the actual version
 * @returns SemVer
 */
export async function determineVersion(file: string): Promise<SemVer> {
  const raw = await promises.readFile(file, {encoding: 'utf8'})
  const version = raw.replace(/^\s+|\s+$/g, '')

  const details = parse(version)
  if (!details) {
    throw new Error(`unable to parse semantic version "${raw}"`)
  }

  return details
}
