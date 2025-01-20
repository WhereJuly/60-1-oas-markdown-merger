## Logging and Exceptions

Contents

- [Logging and Exceptions](#logging-and-exceptions)
  - [1. **Logging Levels**](#1-logging-levels)
  - [2. **Logging Based on Usage Context (CLI vs Programmatic)**](#2-logging-based-on-usage-context-cli-vs-programmatic)
    - [**CLI Usage**](#cli-usage)
    - [**Programmatic Usage**](#programmatic-usage)
  - [3. **Making Logging Decisions (CLI vs Programmatic)**](#3-making-logging-decisions-cli-vs-programmatic)
  - [4. **Configuring Log Level Dynamically**](#4-configuring-log-level-dynamically)
  - [5. **Error Handling and Logging for Exceptions**](#5-error-handling-and-logging-for-exceptions)
  - [**Summary of CLI vs Programmatic Logging:**](#summary-of-cli-vs-programmatic-logging)

---

Here’s a refined approach based on your preference to avoid using a logging package in programmatic usage while keeping the flexibility for the CLI version:

### 1. **Logging Levels**

You can maintain structured logging levels for both the programmatic and CLI usages. The log level will guide how much information you want to display or log:

- **Info**: Basic operation flow (e.g., start of merging, file reading).
- **Warning**: Potential issues but not necessarily failures (e.g., missing files, unexpected data).
- **Error**: Critical errors that interrupt the operation.
- **Debug**: Detailed information useful for debugging (can be turned on/off via environment variable).

### 2. **Logging Based on Usage Context (CLI vs Programmatic)**

This approach avoids a dedicated logging package but provides flexibility by conditionally deciding where and how to log messages:

#### **CLI Usage**

For CLI usage, you can:

- **Console Output**: Log to the console directly using `console.log`, `console.error`, or `console.warn` for each level.
- **Log File**: Optionally, you can log errors to a file (like `error.log`) to help with debugging.

In this case:

- `console.log()` would handle **Info** and **Debug** logs.
- `console.warn()` would handle **Warnings**.
- `console.error()` would handle **Errors**.

**Example**:

```ts
// CLI-specific logging
if (process.env.NODE_ENV === 'production') {
 console.log('Starting OAS Markdown Merger...');
} else {
 console.debug('Debugging details...');
}
```

#### **Programmatic Usage**

For programmatic usage (i.e., when used as part of a larger system):

- Avoid using logging packages like `winston` or similar.
- Instead, rely on **returning** error messages or **throwing exceptions** with full details.
- You can use `console.log()` for **info-level messages** but only when debugging or testing.

This would ensure that programmatic flows are more silent unless explicitly called to log something.

**Example**:

```ts
// Programmatic usage (no logging package)
if (someCondition) {
 console.log('Processing successful...');
} else {
 throw new Error('Something went wrong.');
}
```

### 3. **Making Logging Decisions (CLI vs Programmatic)**

You can create a simple logging utility that checks if the environment is CLI or programmatic and directs logs accordingly. Here’s how it could look:

- If **CLI**: Log to the console, possibly with timestamps and structured output.
- If **Programmatic**: Only print minimal info to the console or redirect errors via exception handling.

**CLI Logging Example**:

```ts
// Log message to console and file in CLI
function logMessage(level: 'info' | 'warn' | 'error', message: string) {
 const timestamp = new Date().toISOString();
 const formattedMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
 if (level === 'error') {
  console.error(formattedMessage); // Log errors to console
  // Optionally, append to a file, e.g., error.log (not using external libraries)
 } else if (level === 'warn') {
  console.warn(formattedMessage); // Log warnings to console
 } else {
  console.log(formattedMessage); // Log info to console
 }
}
```

**Programmatic Logging**:

```ts
// Programmatic logs just return errors or minimal info
function logMessageForProgrammaticUsage(level: 'info' | 'error', message: string) {
 if (level === 'info') {
  console.log(`INFO: ${message}`); // Print minimal logs to the console
 } else if (level === 'error') {
  throw new Error(`ERROR: ${message}`); // Throw errors as exceptions
 }
}
```

### 4. **Configuring Log Level Dynamically**

For flexibility in both the CLI and programmatic contexts:

- Use environment variables to control the log level (`process.env.LOG_LEVEL = 'debug'`).
- This allows you to toggle between different log levels without modifying the code.

**Example**:

```ts
function logMessage(level: 'info' | 'warn' | 'error' | 'debug', message: string) {
 const logLevel = process.env.LOG_LEVEL || 'info';

 if (['info', 'warn', 'error', 'debug'].indexOf(logLevel) >= 0) {
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;

  if (logLevel === 'debug') {
   console.debug(formattedMessage); // Only show if log level is debug
  } else if (logLevel === 'info') {
   console.log(formattedMessage);
  } else if (logLevel === 'warn') {
   console.warn(formattedMessage);
  } else if (logLevel === 'error') {
   console.error(formattedMessage);
  }
 }
}
```

### 5. **Error Handling and Logging for Exceptions**

Since you don’t want to use a logging package for programmatic usage, you can rely on exceptions to track issues.

For example, the `OASMergerException` would be logged manually in the CLI, but for programmatic use, it would be thrown:

**For CLI:**

```ts
try {
 // Main merge process
} catch (error) {
 logMessage('error', `OAS Merge failed: ${error.message}`);
}
```

**For Programmatic:**

```ts
try {
 // Main merge process
} catch (error) {
 throw new OASMergerException('OAS Merge failed', error);
}
```

---

### **Summary of CLI vs Programmatic Logging:**

- **CLI**: Use `console.log()`, `console.warn()`, and `console.error()` for output, including logging errors to a file when needed.
- **Programmatic**: Rely on exceptions or simple console messages for debugging info (no logging package).
- **Log Level Control**: Use environment variables to control the log level (e.g., `LOG_LEVEL`).
