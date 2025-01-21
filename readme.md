# OAS Markdown Merger Utility

- [Implementation](#implementation)
  - [Design](#design)
  - [Construction](#construction)
    - [Refactoring](#refactoring)

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
