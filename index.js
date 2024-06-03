const core = require('@actions/core');
const semver = require('semver');
const github = require('@actions/github');
const { join } = require('path');

const PackageVersion = require('./package-version');

const enabledLangs = ['rust', 'js'];
const defaultPAckages = { js: 'package.json', rust: 'Cargo.toml' };
const enabledbumpLvls = ['major', 'minor', 'patch', 'hotfix'];

const run = async () => {
  try {
    const ghToken = core.getInput('githubToken');
    const bumpLvl = core.getInput('bumpLvl', {}) || 'patch';
    const lang = core.getInput('lang', {}) || 'rust';
    const inputPath = core.getInput('path', {}) || defaultPAckages[lang];
    const workspacePath = process.env.GITHUB_WORKSPACE || './';

    if (!enabledLangs.includes(lang)) throw new Error(`Language ${lang} is not supported`);
    if (!enabledbumpLvls.includes(bumpLvl))
      throw new Error(`Bump level ${bumpLvl} is not supported`);
    if (!workspacePath) {
      throw new Error('GITHUB_WORKSPACE env variable is not set.');
    }

    const path = join(workspacePath, inputPath);
    const Package = PackageVersion.fromFile(path, lang).bump(bumpLvl);
    Package.save(Package.version);

    const octokit = github.getOctokit(ghToken);
    octokit.rest.git.createTag({
      ...github.context.repo,
      tag: `v${Package.version}`,
      message: 'CI: automating versioning',
      object: github.context.sha,
      type: 'commit',
    });
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
module.exports = run;
