**OAS Markdown Merger Utility**

**Contents**

- [Implementation](#implementation)
  - [Design](#design)
  - [Construction](#construction)
    - [Refactoring](#refactoring)
  - [Testing](#testing)
    - [Development](#development)
    - [Usage](#usage)
- [Release](#release)
- [Manage Public Version with Git Subtree](#manage-public-version-with-git-subtree)

## Implementation

### Design

- [Rationale and Motivation](.docs/rationale-and-motivation.md)

- [The Flowchart](.docs/design/flowchart.md)
- [The Class Diagram](.docs/design/class-diagram.uml.md)
- [Usages](.docs/design/usages.md)
- [Classes and Responsibilities](.docs/design/classes-and-responsibilities.md)
- [Transform Markdown to HTML](.docs/design/transform-markdown-to-html.md)
- [Logging and Exceptions](.docs/design/logging-and-exceptions.md)
- [Test Cases](.docs/design/test-cases.md)

### Construction

#### Refactoring

- OASJSONDefinitionsRetrieveService
  So far it is just copied here from the [Generic Adapter Package](packages/adapters/generic/readme.md);
  Will have to extract the service as a separate package to be used here an in the original package.

### Testing

#### Development

Basic testing:

```bash
npm run test:foundation
```

Including code coverage (find coverage in `tests/foundation/.coverage`):

```bash
npm run test:foundation -- --coverage
```

#### Usage

Before running usage tests build the package with `npm run package:build` and install it in the `.usage` folder.`:

```bash
cd .usage
npm install

# Now run the usage tests in the .usage folder
npm run test:usage
```

## Release

The release workflow on the monorepo.

- Merge finished feature branch to `develop` branch.
- Branch out from `develop` to `release/markdown-merger/vX.X.X` branch (keep the name standard as it triggers the CI).
  - Prepare the release: bump up version; later, when released, push tag and create release notes on Github;
- Merge the release branch back to `develop`; Push to remote.
  - The commit to `develop` will trigger the CI;
  - Check its success;
  - No release tagging for `develop` branch;
  - No test coverage publish;
- Merge the release branch into `master`;
  - Locally in `master` branch run `npm run package:build` and `npm run package:publish`.
  - Will test and build the package;
  - Push to remote.
  - Pushes the [subtree](#manage-public-version-with-git-subtree) to the remote dedicated public repository;
- Merge the release branch to `master`; Push to remote;
  - The commit to master will trigger the CI; Check its success;
  - The CI must create and push the `oas-markdown-merger@vX.X.X` tag to the monorepo;
  - The CI must publish test coverage;

## Manage Public Version with Git Subtree

Use Git Subtree to be able to expose code publicly and accept the OSS contributions.

Separate the package-subfolder-only commits to a dedicated temporary branch:

```bash
git subtree split --prefix=packages/utilities/markdown-merger -b split/markdown-merger
```

Create the remote repository and push the temp branch content there:

```bash
git push https://github.com/WhereJuly/60-1-oas-markdown-merger.git split/markdown-merger:master
```

Remove the temp branch; Conduct the development as usual committing and pushing to the remote monorepo as usual;

When need to update the subtree repository from local repository make:

```bash
git subtree push --prefix=packages/utilities/markdown-merger https://github.com/WhereJuly/60-1-oas-markdown-merger.git master
```

When need to pull the subtree repository changes (e.g. if it is exposed as open source) make:

```bash
git subtree pull --prefix=packages/utilities/markdown-merger https://github.com/WhereJuly/60-1-oas-markdown-merger.git master
```
