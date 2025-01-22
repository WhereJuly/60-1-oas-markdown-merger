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
- Locally in `master` branch run `npm run package:build` and `npm run package:publish`.
  - Will test and build the package;
  - Pushes the subtree to the remote dedicated public repository;
- Merge the release branch to `master`; Push to remote;
  - Amend the merge commit message with `[markdown-merger] Release (package): vX.X.X`;
  - The commit to master will trigger the CI; Check its success;
  - The CI must create and push the `oas-markdown-merger@vX.X.X` tag to the monorepo;
  - The CI must publish test coverage;
