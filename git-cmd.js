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

    if (tagRsp.status !== 201) throw new Error(`Failed to create tag: ${JSON.stringify(tagRsp)}`);
  }

  async commit() {
    console.log(github.context);
    const {
      data: { tree },
    } = await this.octokit.rest.git.getCommit({
      ...github.context.repo,
      commit_sha: github.context.sha,
    });

    const commitRsp = await this.octokit.rest.git.createCommit({
      ...github.context.repo,
      message: 'CI: automating commit',
      tree: tree.sha,
    });
    if (commitRsp.status !== 201)
      throw new Error(`Failed to create commit: ${JSON.stringify(commitRsp)}`);
  }
};
