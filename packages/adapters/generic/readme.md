## The OAS DbC Generic Adapter Package

- [The OAS DbC Generic Adapter Package](#the-oas-dbc-generic-adapter-package)
  - [Public Interface](#public-interface)
    - [Convenience](#convenience)
      - [HTTP Statuses](#http-statuses)
  - [Documenting](#documenting)
  - [Construction](#construction)
    - [Meaning \& Naming](#meaning--naming)
    - [Testing](#testing)
    - [Refactor](#refactor)
  - [Publish Package](#publish-package)

### [Public Interface](#public-interface)

#### [Convenience](#convenience)

##### [HTTP Statuses](#http-statuses)

The package exports the convenience `EHTTPCodes` enum and `THTTPStatuses` typed object. Here is the basic usage.

```typescript
import { EHTTPStatusCodes, THTTPStatuses } from '@dcoupld/oas-generic-adapter';

console.log(EHTTPStatusCodes.ACCEPTED); // 202
console.log(THTTPStatuses.CREATED); // { code: 200, message: 'Operation successful' }
```

You can also add HTTP codes and statuses if you need any. See the [example-extend-http-statuses.d.ts](src/core/types/example-extend-http-statuses.d.ts)

### Documenting

UML Class Diagram

[in mermaid](./.docs/class-diagram.md)

[quick in png](./.docs/quick-class-diagram.png)

The public interface code is documented (or in process of documenting) with [TypeDoc](https://typedoc.org/guides/overview/). The build destination is [./.delivery/.builds/typedoc](./.delivery/.builds/typedoc/index.html).

Later I will decide where to publish it.

The build commands available:

```bash
npm run typedoc:build # For basic theme
npx typedoc src --plugin typedoc-github-theme # For a little more structured theme
```

### Construction

#### Meaning & Naming

`OASGenericAdapter` does convey the intended meaning that it is a programmatic object wrapper designed to serve as an intermediary between OpenAPI Specification (OAS) JSON definitions and the consumer. Here's how it communicates that:

- OAS: Clearly indicates that the adapter is related to OpenAPI Specifications, making it evident what type of definitions it works with.
- Generic: Suggests that the adapter is versatile and can handle a range of use cases, which aligns with your intention of it being universal.
- Adapter: Implies that it serves to bridge the gap between the OAS definitions and the consumers, transforming or facilitating interaction with the underlying data.

#### Testing

The good [source](https://github.com/readmeio/oas-examples) of OAS 3.1 JSON definitions examples. The [dereferenced](https://editor-next.swagger.io/) (references resolved) petstore [fixture](./tests/foundation/.ancillary/fixtures/definitions/petstore.oas.json) used in tests is taken from there.

#### Refactor

- The service `OASJSONDefinitionsRetrieveService` is also used in [OAS Markdown Merger Utility](packages/utilities/markdown-merger/readme.md). Will have to extract the service as a separate package to be used here and there.

### Publish Package

To publish the package to the specific registry other than `npmjs` <u>from the build folder</u> with the npm scripts like

```bash
"package:publish": "cd ./.delivery/.builds/dist && npm publish"
```

the `npm publish` command has to find the `.npmrc` file. Thus it is mandatory the to set the respective env variable to for the `.npmrc` file to be found.

```bash
# Linux bash
export NPM_CONFIG_USERCONFIG=/path/to/custom/.npmrc
# Windows PowerShell
$env:NPM_CONFIG_USERCONFIG="<the-full-actual-path-to-repository-root>\.npmrc"
```

The `package.json` `publishConfig` key is mostly for an information in this case.

```json
    "publishConfig": {
        "registry": "https://npm.pkg.github.com"
    },
```
