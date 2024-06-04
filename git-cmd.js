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
    const { data: pull } = await octokit.rest.pulls.get({ repo, owner, pull_number });
    console.log(pull);
    console.log('=====================================');

    const { data: commit } = await this.octokit.rest.git.getCommit({
      ...github.context.repo,
      commit_sha: github.context.sha,
    });
    console.log(commit);
    console.log('=====================================');

    const { data: newCommit } = await this.octokit.rest.git.createCommit({
      ...github.context.repo,
      message: 'CI: automating commit',
      tree: commit.tree.sha,
    });
    console.log(newCommit);
    console.log('=====================================');

    const ref = await this.octokit.rest.git.updateRef({
      ...github.context.repo,
      ref,
      sha: newCommit.sha,
    });
    console.log(ref);
    console.log('=====================================');

    if (newCommit.status !== 201)
      throw new Error(`Failed to create commit: ${JSON.stringify(newCommit)}`);
  }
};
