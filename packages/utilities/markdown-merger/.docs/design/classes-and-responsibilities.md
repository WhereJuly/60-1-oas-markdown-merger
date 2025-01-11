## Classes and Responsibilities

- [Classes and Responsibilities](#classes-and-responsibilities)
  - [Classes](#classes)
  - [Process Flow](#process-flow)

---

Here is the updated version of the description reflecting the markdown-to-HTML translation requirement:

### Classes

1. **OASMarkdownMergerFacade**

   - **Responsibility:** The main orchestrator class that handles the entire process of merging descriptions from Markdown files into the OAS 3.1 JSON specification. This class interacts with the other components to load the spec, process descriptions, and write the updated OAS spec to a new file.
   - **Methods:**
     - `merge(sourceFile: String, destinationFile: String)`: Orchestrates the entire merge process. It loads the OAS spec, processes the descriptions by merging the content from the specified Markdown files (after translating them to HTML), and then writes the updated spec to the destination file.
     - `writeOutputToFile(filePath: String, content: String)`: Writes the merged OAS spec to the destination file.
     - `checkDirectoryExistence(filePath: String)`: Checks if the specified directory exists.
     - `createDirectory(filePath: String)`: Creates the directory if it doesn't exist.
     - **Static Method:**
       - `create(specLoader: OASJSONSpecLoader, mergeProcessor: MarkdownMergeProcessor)`: Static factory method that initializes the `OASMarkdownMergerFacade` with the necessary dependencies.

2. **OASJSONSpecLoader**

   - **Responsibility:** Loads and validates the OAS 3.1 JSON spec file. It is also responsible for extracting the description fields that contain merge commands.
   - **Methods:**
     - `loadSpec()`: Loads the OAS JSON spec from the specified file path.
     - `validateSpec(spec: Object)`: Validates that the loaded spec is compliant with OAS 3.1 format.
     - `extractDescriptionFields(spec: Object)`: Extracts the fields from the spec that contain descriptions requiring merging.

3. **MarkdownMergeProcessor**

   - **Responsibility:** Processes the description fields in the OAS spec and performs the merging operation with the content from external Markdown files, translating the content to HTML before merging.
   - **Methods:**
     - `processDescriptions(spec: Object)`: Iterates over the description fields in the OAS spec and processes them for merging.
     - `mergeContent(description: String, filePath: String)`: Merges the content of the description field with the HTML-translated content from the respective Markdown file.

4. **OASMarkdownMergerException**
   - **Responsibility:** A custom exception class that is thrown when errors occur during the OAS merging process (e.g., missing files, invalid spec format).
   - **Properties:**
     - `message`: The error message.
     - `originalError`: The original error (if any) that caused the exception.

---

### Process Flow

1. **Initiating the Process:**

   - The user interacts with the `OASMarkdownMergerFacade` class by calling the `merge` method. They provide the source file (OAS 3.1 JSON specification) and the destination file (where the merged OAS spec should be written).

2. **Loading the OAS Spec:**

   - The `OASMarkdownMergerFacade` calls the `OASJSONSpecLoader` to load the OAS spec from the source file.
   - The `OASJSONSpecLoader` validates that the spec is a valid OAS 3.1 document.

3. **Extracting Description Fields:**

   - The `OASJSONSpecLoader` extracts all the description fields in the OAS spec that contain merge commands (e.g., `merge('./docs/example.md')`).

4. **Processing the Descriptions:**

   - The `OASMarkdownMergerFacade` then passes the spec to the `MarkdownMergeProcessor`.
   - The `MarkdownMergeProcessor` iterates through each description field and checks if a merge command exists.
   - For each description with a merge command, the `MarkdownMergeProcessor` loads the corresponding Markdown file, translates its content to HTML, and merges it with the description.

5. **Handling Errors:**

   - If any errors occur (e.g., invalid spec format, missing Markdown file), the `OASMergerException` is thrown.

6. **Writing the Output:**

   - Once the descriptions are processed and merged, the `OASMarkdownMergerFacade` writes the updated OAS spec to the destination file.

7. **File Operations:**
   - If the output directory does not exist, the `OASMarkdownMergerFacade` will check and create it if necessary.

---

This class hierarchy ensures that each component has a clear responsibility, follows the single responsibility principle, and allows for easy unit testing by decoupling the functionalities into separate classes. The facade (`OASMarkdownMergerFacade`) orchestrates the entire workflow, while the individual classes (`OASJSONSpecLoader`, `MarkdownMergeProcessor`) handle the loading, processing, and merging tasks. Additionally, markdown content is now translated to HTML before being merged into the OAS spec.