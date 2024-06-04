const github = require('@actions/github');

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

    // const tagRsp = await this.octokit.rest.git.createTag({
    //   ...github.context.repo,
    //   tag: `v${version}`,
    //   message: 'CI: automating versioning',
    //   object: github.context.sha,
    //   type: 'commit',
    // });
    if (tagRsp.status !== 201) throw new Error(`Failed to create tag: ${JSON.stringify(tagRsp)}`);
  }

  async commit() {
    const commitRsp = await this.octokit.rest.git.createCommit({
      ...github.context.repo,
      message: 'CI: automating commit',
      object: github.context.sha,
      type: 'commit',
    });
    if (commitRsp.status !== 201)
      throw new Error(`Failed to create commit: ${JSON.stringify(commitRsp)}`);
  }
};
