const github = require('@actions/github');
const exec = require('@actions/exec');

module.exports = class GitCmd {
  constructor(ghToken) {
    this.octokit = github.getOctokit(ghToken);
  }

  static fromGhToken(ghToken) {
    return new GitCmd(ghToken);
  }

  async createTag(version) {
    const tagRsp = await this.octokit.rest.repos.createRelease({
      ...github.context.repo,
      tag_name: `v${version}`,
    });

    if (tagRsp.status !== 201) throw new Error(`Failed to create tag: ${JSON.stringify(tagRsp)}`);
  }

  async commit() {
    console.log('context', github.context);
    console.log('context', github.context.repo);
    await exec('git', ['add', '-A']);
    // await exec('git', [ '-C', workingDirectory, 'config', '--local', 'user.name', authorName ])
    // await exec('git', [ '-C', workingDirectory, 'config', '--local', 'user.email', authorEmail ])
    // await exec('git', [ '-C', workingDirectory, 'commit', '--no-verify', '-m', commitMessage ])
    // await exec('git', [ '-C', workingDirectory, 'rev-parse', 'HEAD' ], { listeners: { stdout: buffer => sha += buffer.toString() }})
  }
};
