```mermaid
classDiagram
    class OASMarkdownMergerFacade {
        +OASJSONDefinitionsRetrieveService definitionsRetrieve
        +MarkdownMergeProcessor mergeProcessor
        +String inputFilePath
        +String outputFilePath
        +OASMarkdownMergerFacade(definitionsRetrieve: OASJSONDefinitionsRetrieveService, mergeProcessor: MarkdownMergeProcessor)
        +static create(definitionsRetrieve: OASJSONDefinitionsRetrieveService, mergeProcessor: MarkdownMergeProcessor): OASMarkdownMergerFacade
        +merge(sourceFile: String, destinationFile: String): void
        +writeOutputToFile(filePath: String, content: String): void
        +checkDirectoryExistence(filePath: String): Boolean
        +createDirectory(filePath: String): void
    }
    
    class OASJSONDefinitionsRetrieveService {
        +retrieve(source: string): Promise<OpenAPIV3_1.Document>
    }

    class MarkdownMergeProcessor {
        +String markdownFilePath
        +processDescriptions(spec: Object): Object
        +mergeContent(description: String, filePath: String): String
    }

    class OASDBCException {
        +String message
        +Error originalError
        +constructor(message: String, originalError: Error)
    }

    OASMarkdownMergerFacade --> OASJSONDefinitionsRetrieveService : uses
    OASMarkdownMergerFacade --> MarkdownMergeProcessor : uses
    MarkdownMergeProcessor --> OASDBCException : throws
    OASJSONDefinitionsRetrieveService --> OASDBCException : throws

    note for OASJSONDefinitionsRetrieveService "So far copied from `dcoupld/oas/adapters/generic` package."
    note for OASDBCException "So far copied from `dcoupld/oas/adapters/generic` package."
```