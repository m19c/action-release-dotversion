<p align="center">
  <a href="https://github.com/m19c/action-release-dotversion/actions"><img alt="typescript-action status" src="https://github.com/m19c/action-release-dotversion/workflows/build-test/badge.svg"></a>
</p>

# action-release-dotversion

A GitHub action to create releases based on a version file (e.g. .version).

## Usage

```yaml
on:
  push:
    branches:
      - master

name: Release

jobs:
  build:
    name: Release
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - id: release
        uses: m19c/action-release-dotversion@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          versionFile: '.version'
```

## Development

### Test

```bash
$ npm test

 PASS  ./index.test.js
  ✓ throws invalid number (3ms)
  ✓ wait 500 ms (504ms)
  ✓ test runs (95ms)
...
```

## Release

Actions are run from GitHub repos so it is required to checkin the packed dist folder.

To do so follow the steps below:

```bash
$ npm run package
$ git add dist
$ git commit -a -m "prod dependencies"
$ git push origin releases/v1
```
