**Package Status**

![npm version](https://img.shields.io/npm/v/oas-markdown-merger.svg)
![npm downloads](https://img.shields.io/npm/dm/oas-markdown-merger.svg)
![npm bundle size](https://img.shields.io/bundlephobia/min/oas-markdown-merger)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/oas-markdown-merger)
[![codecov](https://codecov.io/gh/WhereJuly/60-1-oas-markdown-merger/branch/master/graph/badge.svg?token=WYEMY7V466)](https://codecov.io/gh/WhereJuly/60-1-oas-markdown-merger)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# OAS Markdown Merger

Allows to expand the [OpenAPI JSON specification](https://spec.openapis.org/#openapi-specification) `description` fields with the arbitrary markdown files translated to HTML.

- [Overview](#overview)
- [Usage](#usage)
  - [Installation](#installation)
  - [CLI](#cli)
  - [Programmatic Usage](#programmatic-usage)
  - [Documentation](#documentation)
- [Maintenance](#maintenance)
  - [Contributions](#contributions)
  - [License](#license)

## Overview

Assume we have the OpenAPI specification definitions in `contract/definitions/my-api-definitions.oas.json` file in the project with this folder structure.

```
contract
├── definitions
│   └── my-api-definitions.oas.json
├── merged
│   └── my-api-definitions-merged.oas.json
└── docs
    ├── one.md
    └── nested
        └── two.md
```

In the desired places of the specification in the `description` fields we add the merge tags of the kind `{% merge 'path/file.md' %}`.

```json
{
 "tags": [
  {
   "name": "pet",
   "description": "Everything about your Pets\n\r{% merge './one.md' %}"
  }
 ],
 "id": {
  "description": "{% merge './nested/two.md' %}",
  "type": "integer"
 }
}
```

We can combine tags with inlined description text as for the first example. Then the merged content is added into the existing `description` field preserving the content outer to the merge tag. This way you can insert the merged markdown content within the `description` field content.

Or you can use "merge" tag alone in a `description` field as for the second example.

Using `oas-markdown-merger` you wil get the content of the markdown files merged into the `description` fields like this:

```bash
npx oas-markdown-merger --source ./definitions/my-api-definitions.oas.json \
  --destination ./merged/my-api-definitions-merged.oas.json \
  --merges-base ./docs
```

The destination file `./merged/my-api-definitions-merged.oas.json` will have the `description` fields containing the content of the respective markdown files translated to HTML (sanitized).

## Usage

### Installation

```bash
npm install oas-markdown-merger
```

### CLI

```bash
# Output CLI help
npx oas-markdown-merger --help

# Use the project root as the base path for markdown files mentions in "merge" tags.
npx oas-markdown-merger --source source.json --destination destination.json

# Use the desired folder as the markdown files base path
npx oas-markdown-merger --source source.json --destination destination.json --merges-base ./docs
```

Using optional `--merge-base` parameter we can place our markdown documents into a separated location for better modularization (the latter CLI example above). Using different sub-folders in "merge" tags we can further separate different docs in their own locations like shown in the [Overview](#overview).

### Programmatic Usage

The usage similar to the CLI above but now programmatically.

```typescript
// Import the package and assign arguments for brevity.
import { OASMarkdownMergerFacade } from 'oas-markdown-merger';

const source = './definitions/my-api-definitions.oas.json';
const destination = './merged/my-api-definitions-merged.oas.json';
```

Use the project root as the base path for markdown files mentions in "merge" tags.

```typescript
const facade = OASMarkdownMergerFacade.create();
await facade.merge(source, destination);
```

Use the desired folder as the markdown files base path. The optional parameter for `.create()` method denotes the merging markdown files base path.

```typescript
const facade = OASMarkdownMergerFacade.create('./docs');
await facade.merge(source, destination);
```

### Documentation

The package is written in TypeScript with the careful JSDoc blocks available on hover for public interface (e.g. in VS Code).

## Maintenance

### Contributions

Potentially valuable use cases / functionality suggestions are welcome either in [Discussions](https://github.com/WhereJuly/60-1-oas-markdown-merger/discussions) or as [pull requests](https://github.com/WhereJuly/60-1-oas-markdown-merger/pulls).

If there is a Pull Request contribution, I would receive it on `integration` branch for discussion and manual merge.

### License

This project is licensed under the MIT License - see the LICENSE file for details.

---

The [implementation](./implementation.md) documentation is here.
