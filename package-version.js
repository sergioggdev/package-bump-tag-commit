const fs = require('fs');
const TOML = require('@ltd/j-toml');
const semver = require('semver');

module.exports = class PackageVersion {
  constructor(file, version, lang, path) {
    this.version = version;
    this.file = file;
    this.lang = lang;
    this.path = path;
  }

  static fromFile(path, lang) {
    if (lang === 'js') {
      fs.accessSync(path);
      const versionFile = fs.readFileSync(path);
      const data = JSON.parse(versionFile);
      return new PackageVersion(data, data.version, lang, path);
    } else if (lang === 'rust') {
      fs.accessSync(path);
      const cargo = fs.readFileSync(path);
      const data = TOML.parse(cargo);
      return new PackageVersion(data, data.package.version, lang, path);
    } else {
      throw new Error(`Language ${lang} is not supported`);
    }
  }

  bump(rawLvl) {
    const lvl = rawLvl === 'hotfix' ? 'prerelease' : rawLvl;
    const version = semver.valid(this.version);
    if (!version) throw new Error(`Version ${version} is not valid semver`);
    if (rawLvl !== 'none') {
      this.version = semver.inc(this.version, lvl, 'hotfix');
    }
    return this;
  }

  save() {
    if (this.lang === 'js') {
      this.file.version = this.version;
      const file = JSON.stringify(this.file, null, 2);
      fs.writeFileSync(this.path, file + '\n');
    } else if (this.lang === 'rust') {
      this.file.package.version = this.version;
      const file = TOML.stringify(this.file, {
        newline: '\n',
        newlineAround: 'section',
      });
      fs.writeFileSync(this.path, file + '\n');
    }
  }
};
