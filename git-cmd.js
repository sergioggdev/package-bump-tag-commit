const github = require('@actions/github');
const { exec } = require('@actions/exec');

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
    const branch = github.context.ref.split('/').slice(2).join('/');
    await exec('git', ['add', '-A']);
    await exec('git', ['config', '--local', 'user.name', 'Conecta Turismo CI']);
    await exec('git', ['config', '--local', 'user.email', 'sergio.garcia.seo@gmail.com']);
    await exec('git', ['commit', '--no-verify', '-m', 'CI: Publish new version']);
    await exec('git', ['push', 'origin', branch]);
  }
};
