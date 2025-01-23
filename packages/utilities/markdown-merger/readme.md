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
    - [Merging using Files](#merging-using-files)
    - [In-Memory Merge](#in-memory-merge)
      - [Merge Pieces of JSON](#merge-pieces-of-json)
      - [Merge in Single Descriptions](#merge-in-single-descriptions)
      - [In-Memory Merge Usage](#in-memory-merge-usage)
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

Not only [CLI](#cli) but also [Programmatic Usage](#programmatic-usage) is available.

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

#### Merging using Files

The usage similar to the CLI above with files containing OAS definitions, but now programmatically.

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

#### In-Memory Merge

The package does not restrict the source and destination to be files only. For consumers desiring to build the markdown merge into their code it is possible to use memory variables for source and destination.

There are several scenarios for this use case. They assume using the [above](#overview) folders structure and content. Importing some dependencies omitted in the following examples.

##### Merge Pieces of JSON

Merge the entire OAS definitions document or just a piece of JSON potentially containing `description` fields with "merge" tags. Note that the merge operation **mutates the source in-place**.

**Example 1: Default `mergesBasePath`**

Note `OASMarkdownMergerFacade.create` method's `mergesBasePath` parameter is omitted and it defaults to the project working directory (`project.cwd()`).

Note the "merge" tag contains `./docs/one.md` filename providing the file location in `./docs` folder.

```typescript
import { OASMarkdownMergerFacade } from 'oas-markdown-merger';

const oas = { field: 'something', tags: [{ description: "{% merge './docs/one.md' %}" }] };
const merger = OASMarkdownMergerFacade.create();
merger.mergeInMemory(oas); // Mutates the source in-place
```

**Example 2: Custom `mergesBasePath`**

It assumes the merged files will be located in a specific merge files base directory `./docs`.

Note the first "merge" tag now contains `./one.md` and the second filename providing the file location in `./docs` folder.

```typescript
import { OASMarkdownMergerFacade } from 'oas-markdown-merger';

const oas = {
 field: 'something',
 tags: [{ description: "{% merge './one.md' %}" }, { description: "{% merge './nested/two.md' %}" }]
};
const merger = OASMarkdownMergerFacade.create('./docs');
merger.mergeInMemory(oas);
```

##### Merge in Single Descriptions

You could use the in-memory merge even more granularly, for a single `description` value.

**Example 3: Custom `mergesBasePath`**

Here `merged` variable will contain `keyValue` merged with the HTML-translated markdown from `./docs/one.md`

```typescript
import { MergeableDescriptionVO } from 'oas-markdown-merger';

const key = 'description';
const jsonPath = ['tags', '0', 'description'];
const keyValue = `Everything about your Pets {% merge './one.md' %}`;
const mergesBasePath = './docs';

const mergeable = MergeableDescriptionVO.create(key, jsonPath, keyValue, mergesBasePath);
const merged = mergeable.merged(); 
```

Note the `jsonPath` (see (JSON Path Segments)(https://www.rfc-editor.org/rfc/rfc9535#section-1.4.2)) parameter / argument is not essential in this particular example and can be set to `[]`.

But in real life it allows to decouple the OAS / JSON traversing from merging by keeping the location in JSON document where the mergeable value should be assigned to along with the value itself (hence one of the `MergeableDescriptionVO` value object reasons to exist).

##### In-Memory Merge Usage

In-memory merge can be useful in scenarios where the consumer code e.g. bundles OpenAPI `$ref`'ed files into single OAS definitions bundle like [swagger-cli](https://www.npmjs.com/package/swagger-cli) `bundle` command does.

Note, however `swagger-cli` is mentioned here just as an OAS bundler example, it does implement using `oas-markdown-merger`. Nevertheless you can use both `oas-markdown-merger` in your OAS definitions build pipelines on earlier bundled files.

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
