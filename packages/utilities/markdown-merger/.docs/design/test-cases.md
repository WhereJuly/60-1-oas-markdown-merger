**OAS Markdown Merger Utility**

## Test Cases

Contents

- [Test Cases](#test-cases)
  - [1. **OASMarkdownMergerFacade (Facade Class)**](#1-oasmarkdownmergerfacade-facade-class)
  - [2. **OASJSONSpecLoader (OAS Spec Loader Class)**](#2-oasjsonspecloader-oas-spec-loader-class)
  - [3. **MarkdownMergeProcessor (Merge Processor Class)**](#3-markdownmergeprocessor-merge-processor-class)
  - [4. **OASMergerException (Exception Class)**](#4-oasmergerexception-exception-class)
  - [Non-Class Functionality (e.g., File Operations)](#non-class-functionality-eg-file-operations)

---

### 1. **OASMarkdownMergerFacade (Facade Class)**

- **Test Case 1: `merge` method - Valid Input**
  - Description: Test the `merge` method with valid OAS JSON spec and valid Markdown files.
  - Expected Result: The OAS spec should be updated with the merged content from the Markdown files and saved to the specified output file.
- **Test Case 2: `merge` method - Invalid JSON Spec**
  - Description: Test the `merge` method with an invalid OAS JSON spec file.
  - Expected Result: The method should throw an error or handle it gracefully, possibly via `OASMergerException`.
- **Test Case 3: `merge` method - Missing Description Fields**

  - Description: Test the `merge` method with a valid OAS spec but no description fields with merge commands.
  - Expected Result: The method should skip merging and write the spec as is to the output file.

- **Test Case 4: `writeOutputToFile` method - Valid File Write**
  - Description: Test the `writeOutputToFile` method with a valid file path and content.
  - Expected Result: The content should be correctly written to the specified file.
- **Test Case 5: `writeOutputToFile` method - Invalid File Path**
  - Description: Test the `writeOutputToFile` method with an invalid file path (e.g., missing directories).
  - Expected Result: The method should check the directory existence and create the necessary directories if required.
- **Test Case 6: `checkDirectoryExistence` method - Directory Exists**
  - Description: Test `checkDirectoryExistence` with a valid directory path that exists.
  - Expected Result: The method should return true, indicating the directory exists.
- **Test Case 7: `checkDirectoryExistence` method - Directory Does Not Exist**
  - Description: Test `checkDirectoryExistence` with a non-existent directory path.
  - Expected Result: The method should return false, indicating the directory does not exist.
- **Test Case 8: `createDirectory` method - Directory Creation**
  - Description: Test the `createDirectory` method with a valid directory path that does not exist.
  - Expected Result: The directory should be created successfully.
- **Test Case 9: `merge` method - File Operation Error (Permission Issues)**

  - Description: Test the `merge` method where there are file permission issues (e.g., read/write access).
  - Expected Result: The method should handle the file permission error gracefully or throw an `OASMergerException`.

- **Test Case 10: `merge` method - Missing Markdown File**
  - Description: Test the `merge` method when the Markdown file mentioned in the merge command does not exist.
  - Expected Result: The method should throw an error or handle the missing file gracefully.

### 2. **OASJSONSpecLoader (OAS Spec Loader Class)**

- **Test Case 1: `loadSpec` method - Valid Spec**

  - Description: Test the `loadSpec` method with a valid OAS JSON spec file.
  - Expected Result: The method should load the spec into a JavaScript object successfully.

- **Test Case 2: `loadSpec` method - Invalid Spec Format**

  - Description: Test the `loadSpec` method with an invalid OAS JSON spec (e.g., malformed JSON).
  - Expected Result: The method should throw an `OASMergerException` for invalid JSON format.

- **Test Case 3: `validateSpec` method - Valid OAS 3.1 Spec**

  - Description: Test the `validateSpec` method with a valid OAS 3.1 spec.
  - Expected Result: The method should return true, indicating the spec is valid.

- **Test Case 4: `validateSpec` method - Invalid OAS Spec**

  - Description: Test the `validateSpec` method with an invalid OAS spec (e.g., missing required fields or incorrect structure).
  - Expected Result: The method should return false, indicating the spec is invalid.

- **Test Case 5: `extractDescriptionFields` method - Extract Description Fields**

  - Description: Test `extractDescriptionFields` to ensure it correctly identifies and extracts description fields with merge commands.
  - Expected Result: The method should return an array of description fields with merge commands.

- **Test Case 6: `extractDescriptionFields` method - No Merge Command**
  - Description: Test `extractDescriptionFields` on a spec that does not contain any description fields with merge commands.
  - Expected Result: The method should return an empty array.

### 3. **MarkdownMergeProcessor (Merge Processor Class)**

- **Test Case 1: `processDescriptions` method - Valid OAS Spec**

  - Description: Test `processDescriptions` with a valid OAS spec that contains description fields with merge commands.
  - Expected Result: The method should process the descriptions and prepare them for merging with content from the respective Markdown files.

- **Test Case 2: `processDescriptions` method - No Description Fields**

  - Description: Test `processDescriptions` with a spec that has no description fields containing merge commands.
  - Expected Result: The method should skip the merging process and return the spec as is.

- **Test Case 3: `mergeContent` method - Valid Merge**

  - Description: Test `mergeContent` with a valid description and a valid Markdown file.
  - Expected Result: The content from the Markdown file should be merged into the description successfully.

- **Test Case 4: `mergeContent` method - Invalid Markdown File**
  - Description: Test `mergeContent` with a description and an invalid or missing Markdown file.
  - Expected Result: The method should handle the error gracefully and throw an `OASMergerException`.

### 4. **OASMergerException (Exception Class)**

- **Test Case 1: `OASMergerException` - Exception Handling**
  - Description: Test throwing and catching an `OASMergerException` with a custom message.
  - Expected Result: The exception should carry the provided error message and original error if applicable.

---

### Non-Class Functionality (e.g., File Operations)

- **Test Case 1: File Directory Check - Directory Exists**

  - Description: Test if the directory exists before writing to it.
  - Expected Result: If the directory exists, return true.

- **Test Case 2: File Directory Check - Directory Does Not Exist**

  - Description: Test if the directory does not exist and needs to be created.
  - Expected Result: The directory should be created, or an exception should be thrown if creation fails.

- **Test Case 3: File Writing - Permission Denied**

  - Description: Test file writing operation where permissions to write are denied.
  - Expected Result: Handle permission error gracefully and throw an exception.

- **Test Case 4: File Writing - Invalid Path**
  - Description: Test writing to an invalid path (e.g., missing directories).
  - Expected Result: Handle the error gracefully by creating directories or throwing an exception.

---

These test cases cover all key functionalities, ensuring robust unit tests and coverage for all critical paths and edge cases in the OAS Markdown Merger package.
