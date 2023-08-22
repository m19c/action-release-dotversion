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

    try {
      core.info(`read ${version.raw} of ${owner}/${repo}`)
      const existingRelease = await ok.rest.repos.getReleaseByTag({
        owner,
        repo,
        tag: version.raw
      })

      release = existingRelease.data
      core.info(
        `${version.raw} in ${owner}/${repo} found (${JSON.stringify(release)})`
      )
    } catch (err) {
      core.info(`${version.raw} in ${owner}/${repo} not found`)
    }

    if (!release) {
      core.info(`creating ${version.raw} in ${owner}/${repo}...`)
      const createdRelease = await ok.rest.repos.createRelease({
        owner,
        repo,
        tag_name: version.raw,
        body: options.body,
        prerelease: version.prerelease.length > 0
      })

      if (createdRelease.status === 201) {
        core.info(
          `successfully created version ${version.raw} in ${owner}/${repo}...`
        )
        release = createdRelease.data
      }
    }

    if (!release) {
      core.error(
        `unable to create version ${version.raw} in ${owner}/${repo}...`
      )
      throw new Error('Unable to create release')
    }

    core.setOutput('id', release.id)
    core.setOutput('tag_name', release.tag_name)
    core.setOutput('upload_url', release.upload_url)
    core.setOutput('html_url', release.html_url)
  } catch (err: unknown) {
    if (err instanceof config.InvalidConfigError) {
      core.setFailed(`invalid configuration: ${err.message}`)
    } else if (err instanceof Error) {
      core.setFailed(err.message)
    } else {
      core.setFailed(String(err))
    }
  }
}

run()
