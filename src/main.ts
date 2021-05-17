import * as core from '@actions/core'
import * as github from '@actions/github'

import * as util from './util'
import * as config from './config'

interface Release {
  id: number
  tag_name: string
  upload_url: string
  html_url: string
}

async function run(): Promise<void> {
  try {
    const options = config.read()
    const ok = github.getOctokit(options.token)

    const owner = github.context.repo.owner
    const repo = github.context.repo.repo
    const version = await util.determineVersion(options.versionFile)

    let release: null | Release = null

    const existingRelease = await ok.rest.repos.getReleaseByTag({
      owner,
      repo,
      tag: version.raw
    })
    if (existingRelease.status === 200) {
      release = existingRelease.data
    }

    if (!release) {
      const createdRelease = await ok.rest.repos.createRelease({
        owner,
        repo,
        tag_name: version.raw,
        prerelease: version.prerelease.length > 0
      })

      if (createdRelease.status === 201) {
        release = createdRelease.data
      }
    }

    if (!release) {
      throw new Error('Unable to create release')
    }

    core.setOutput('id', release.id)
    core.setOutput('tag_name', release.tag_name)
    core.setOutput('upload_url', release.upload_url)
    core.setOutput('html_url', release.html_url)
  } catch (err) {
    if (err instanceof config.InvalidConfigError) {
      core.setFailed(`invalid configuration: ${err.message}`)
    } else {
      core.setFailed(err.message)
    }
  }
}

run()
