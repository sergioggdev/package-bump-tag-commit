# CI Conecta Turismo

This action bump version from file, save, create release and publish

## Inputs

### `bumpLvl`

The bumped semver version type. Default `"patch"`.
options: `major | minor | patch | hotfix | none`

### `lang`

The type of programing language

### `save`

Boolean to indicate if persist the bumped version. Default `"false"`.

### `githubToken`

The github secret, required to commit changes

### `path`

The path to the package file, Default `"./"`.

## Outputs

### `version`

The bumped version

## Example usage

```yaml
- name: Read version and bump
  uses: sergioggdev/package-bump-tag-commit@feature/test
  id: bump
  with:
    bumpLvl: patch # major | minor | patch | hotfix
    lang: 'js' # js | rust
    save: true # boolean
    githubToken: ${{ secrets.GITHUB_TOKEN }}
    path: ./package.json
```
