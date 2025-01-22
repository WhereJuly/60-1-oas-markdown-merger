## Usages

We can indeed consider two main usage modes for the **OAS Markdown Merger** package: **programmatic usage** and **CLI (Command-Line Interface) usage**. Let’s discuss both approaches and their potential implementation.

### 1. **Programmatic Usage**

The user would import the package, instantiate the `OASMarkdownMergerFacade`, and then interact with it via code. This approach offers more flexibility and control to the user, allowing integration into larger applications or workflows.

#### Example Flow:

- The user calls the static factory method `create` on the facade to instantiate it.
- The user calls the `merge` method on the facade, passing in the source and destination file paths.

#### Pros:

- **Flexibility**: The user can integrate this functionality into any existing codebase.
- **Customization**: The user can pass additional configuration (e.g., file paths) dynamically.
- **No Dependency on CLI**: It’s ideal for back-end services or automation scripts.

#### Example Usage:

```typescript
import { OASMarkdownMergerFacade } from 'oas-markdown-merger';

const sourceFilePath = './path/to/source.oas.json';
const destinationFilePath = './path/to/output.oas.json';

try {
  const facade = OASMarkdownMergerFacade.create(sourceFilePath, destinationFilePath);
  facade.merge(source: string, destinationFile: string); // Perform the merge process
} catch (error) {
  console.error('Error merging OAS spec:', error);
}
```

---

### 2. **CLI (Command-Line Interface) Usage**

This approach would allow users to run the functionality directly from the terminal, making it easy to use the tool as a standalone utility. The user would pass arguments (e.g., source file and output file) as command-line options.

#### Example Flow:

- The user installs the package globally or as a local dependency.
- The user runs the tool via the command line, providing the necessary arguments.

#### Pros:

- **Simplicity**: Quick and easy for developers who want to merge OAS specs without writing custom code.
- **Stand-Alone**: The tool can be used in scripts or automation without writing a full application.

#### CLI Arguments Example:

```bash
oas-markdown-merger --input ./path/to/source.oas.json --output ./path/to/output.oas.json
```

#### CLI Tool Implementation:

For the CLI, we can use a package like `commander`, `yargs`, or `oclif` to handle command-line arguments.

#### Example CLI Implementation Using `commander`:

```typescript
import { Command } from 'commander';
import { OASMarkdownMergerFacade } from 'oas-markdown-merger';

const program = new Command();

program
 .option('-i, --input <input>', 'Input OAS file path')
 .option('-o, --output <output>', 'Output file path')
 .action((options) => {
  try {
   const facade = OASMarkdownMergerFacade.create(options.input, options.output);
   facade.merge(); // Perform the merge process
   console.log('Merge complete');
  } catch (error) {
   console.error('Error merging OAS spec:', error);
  }
 });

program.parse(process.argv);
```

#### CLI Arguments and Options:

- `-i, --input <input>`: The source OAS JSON file to be merged.
- `-o, --output <output>`: The destination OAS JSON file to store the merged result.

---

### Deciding Between Programmatic and CLI Usage

**Considerations:**

- If the primary user base will be developers integrating the package into their applications, **programmatic usage** will be ideal.
- If the package is intended to be a standalone tool, particularly for use in build or deployment processes, **CLI usage** would be beneficial.
- You can also provide both options. Many tools allow you to use the package programmatically and via CLI, providing flexibility for different use cases.

#### Hybrid Approach:

A hybrid approach can allow users to use the tool both programmatically and through CLI. This would mean exposing a **programmatic API** as well as a **command-line interface**. This is a common design in many utility packages.

The facade method `merge` can still be the core functionality in both cases, ensuring consistency across both usage patterns. The CLI would essentially invoke the same methods as the programmatic version but in response to command-line arguments.

### Summary of Options:

1. **Programmatic Usage**:

   - Ideal for integration into larger systems, automation, or application-specific workflows.
   - Users instantiate the facade and call its methods programmatically.

2. **CLI Usage**:

   - Ideal for quick, one-off tasks from the terminal.
   - Users run the tool as a standalone utility via command-line arguments.

3. **Hybrid Approach**:
   - A combination of both, enabling flexibility for different use cases.

Do you have a preference for one of these options, or would you like to proceed with both?
