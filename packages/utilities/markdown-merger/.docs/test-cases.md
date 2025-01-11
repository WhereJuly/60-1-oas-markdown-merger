**OAS Markdown Merger Utility**

## Test Cases

Contents

- [Test Cases](#test-cases)
  - [**Group 1: File Handling and Format Validation**](#group-1-file-handling-and-format-validation)
  - [**Group 2: Parsing and Command Handling**](#group-2-parsing-and-command-handling)
  - [**Group 3: File Merging and Content Replacement**](#group-3-file-merging-and-content-replacement)
  - [**Group 4: Error Handling**](#group-4-error-handling)
  - [**Group 5: Output Handling**](#group-5-output-handling)
  - [**Group 6: Boundary and Edge Cases**](#group-6-boundary-and-edge-cases)

---

Here are the test case descriptions for your **TDD approach**, grouped by logical categories based on the flowchart:

### **Group 1: File Handling and Format Validation**

1. **Test Case: Validate OAS File Format**

   - **Description**: Ensure that the input file is a valid JSON format.
   - **Expected Outcome**: If the file is not valid JSON, throw an error `Not JSON`.

2. **Test Case: Validate OAS Version**

   - **Description**: Verify that the provided OAS file is of version 3.1.
   - **Expected Outcome**: If the file is not OAS 3.1, throw an error `Not OAS 3.1`.

3. **Test Case: Check if File Exists**
   - **Description**: Test that the file to be merged (specified in the merge command) exists on the file system.
   - **Expected Outcome**: If the file does not exist, throw an error `File not found`.

### **Group 2: Parsing and Command Handling**

4. **Test Case: Identify Merge Commands in Descriptions**

   - **Description**: Traverse the OAS file and identify if any description field contains a merge command (e.g., `{% merge './docs/example.md' %}`).
   - **Expected Outcome**: Detect and extract the file path from the merge command if present.

5. **Test Case: Skip Description Fields Without Merge Commands**
   - **Description**: If a description does not contain a merge command, skip it and continue to the next description.
   - **Expected Outcome**: The script should not alter any description fields that do not contain a merge command.

### **Group 3: File Merging and Content Replacement**

6. **Test Case: Replace Merge Command with File Content**

   - **Description**: After extracting the file path from the merge command, replace the merge command in the description with the file's content.
   - **Expected Outcome**: The merge command should be replaced with the actual content from the specified file.

7. **Test Case: Verify File Content Integrity**
   - **Description**: Ensure that the content of the file being merged is correctly inserted into the description field without any formatting issues.
   - **Expected Outcome**: The content should be accurately and seamlessly merged into the description.

### **Group 4: Error Handling**

8. **Test Case: Handle Missing Merge Command Files**

   - **Description**: Test the behavior when the specified file in the merge command does not exist.
   - **Expected Outcome**: The process should throw a `File not found` error.

9. **Test Case: Handle Invalid Merge Command Syntax**
   - **Description**: Test the script’s ability to detect and throw an error when a merge command contains invalid syntax (e.g., incorrect file path format).
   - **Expected Outcome**: The script should throw an appropriate error (e.g., `Invalid merge command syntax`).

### **Group 5: Output Handling**

10. **Test Case: Write Updated OAS File**
    - **Description**: Ensure that after merging all the description fields, the updated OAS JSON is written to a new file.
    - **Expected Outcome**: The updated OAS file should be correctly written to disk.

### **Group 6: Boundary and Edge Cases**

11. **Test Case: Handle Empty Description Fields**

    - **Description**: Test how the script handles empty description fields (i.e., no merge command or content).
    - **Expected Outcome**: The script should either leave the field empty or skip it without errors.

12. **Test Case: Handle Non-existent Paths in Merge Command**
    - **Description**: Test the behavior when the path in the merge command points to a non-existent file or directory.
    - **Expected Outcome**: The script should throw a `File not found` error.

---

These test cases cover the main functionality of your tool, ensuring both successful scenarios and proper error handling. Each test case aligns with the steps in the flowchart, providing a structured approach to validate the functionality and robustness of your `oas-description-merger` tool.
