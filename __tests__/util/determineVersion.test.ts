import {determineVersion} from '../../src/util/determineVersion'

describe('util/determineVersion', () => {
  test('throws an error if the file is not present', () => {
    expect(determineVersion('notFound')).rejects.toThrow(
      `ENOENT: no such file or directory, open 'notFound'`
    )
  })

  test('works with a valid version', () => {
    expect(
      determineVersion(__dirname + '/.__test__.valid')
    ).resolves.toMatchSnapshot()
  })

  test('works with complex versions', () => {
    expect(
      determineVersion(__dirname + '/.__test__.complex')
    ).resolves.toMatchSnapshot()
  })

  test('throws an error if the version is not valid', () => {
    expect(determineVersion(__dirname + '/.__test__.invalid')).rejects.toThrow(
      'unable to parse semantic version "x"'
    )
  })
})
