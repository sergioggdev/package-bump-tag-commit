const core = require('@actions/core');
const semver = require('semver');
const github = require('@actions/github');
const { join } = require('path');

const PackageVersion = require('./package-version');
const GitCmd = require('./git-cmd');

const enabledLangs = ['rust', 'js'];
const defaultPAckages = { js: 'package.json', rust: 'Cargo.toml' };
const enabledbumpLvls = ['major', 'minor', 'patch', 'hotfix'];

const run = async () => {
  try {
    const lang = core.getInput('lang', { required: true });
    const workspacePath = process.env.GITHUB_WORKSPACE || './';
    const bumpLvl = core.getInput('bumpLvl') || 'patch';

    const inputPath = core.getInput('path') || defaultPAckages[lang];
    const saveOper = core.getInput('save') === 'true' || false;
    const ghToken = core.getInput('githubToken');

    if (!enabledLangs.includes(lang)) throw new Error(`Language ${lang} is not supported`);
    if (!workspacePath) throw new Error('GITHUB_WORKSPACE env variable is not set.');
    if (!enabledbumpLvls.includes(bumpLvl))
      throw new Error(`Bump level ${bumpLvl} is not supported`);

    if (!saveOper) {
      const path = join(workspacePath, inputPath);
      const Package = PackageVersion.fromFile(path, lang).bump(bumpLvl);
      core.exportVariable('version', Package.version);
    } else {
      if (!ghToken) throw new Error('githubToken is required for save operation');
      const Package = PackageVersion.fromFile(path, lang).bump(bumpLvl);
      const gitCmd = GitCmd.fromGhToken(ghToken);

      Package.save();
      await gitCmd.createTag(path, lang);
      await gitCmd.commit(path, lang);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
module.exports = run;
