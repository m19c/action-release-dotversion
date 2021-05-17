import * as core from '@actions/core'
import * as github from '@actions/github'

import * as util from './util'
import * as config from './config'

async function run(): Promise<void> {
  try {
    const options = config.read()
    const ok = github.getOctokit(options.token)

    const version = await util.determineVersion(options.versionFile)

    const release = await ok.rest.repos.createRelease({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      tag_name: version.raw,
      prerelease: version.prerelease.length > 0
    })

    core.setOutput('id', release.data.id)
    core.setOutput('tag_name', release.data.tag_name)
    core.setOutput('upload_url', release.data.upload_url)
    core.setOutput('html_url', release.data.html_url)
  } catch (err) {
    if (err instanceof config.InvalidConfigError) {
      core.setFailed(`invalid configuration: ${err.message}`)
    } else {
      core.setFailed(err.message)
    }
  }
}

run()
