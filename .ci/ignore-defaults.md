## Ignore Some Defaults

Setting `defaultIgnores: false` in your `commitlint.config.js` means that **commitlint will no longer ignore any default Git commit messages**, including merge commits, revert commits, and other automatically generated messages. This setup can bring up a few considerations:

### 1. **Why Commitlint Ignores Automatic Messages by Default**
   Commitlint ignores auto-generated messages because:
   - **Merge and Revert Messages Are Typically Auto-Generated**: These messages often don’t follow the same structure as conventional commit messages, which can result in false positives (errors on messages you didn’t write yourself).
   - **Workflow Compatibility**: In a collaborative environment, auto-generated messages from pull requests, merges, or rebases are common and can vary depending on the Git tool or platform used. Linting them can lead to extra overhead if every merge or rebase operation results in linting errors.
   - **Focus on Developer Commit Quality**: The main intent of commitlint is to enforce consistency and clarity in the commit messages that developers write, not necessarily in the system-generated messages.

### 2. **Potential Issues with `defaultIgnores: false`**
   Setting `defaultIgnores: false` means that **all messages, including Git-generated ones, will be linted**. Here are potential issues you might encounter:
   - **Frequent Linting Errors on Merge Commits**: Every time a merge commit is created (e.g., `Merge branch 'feature-x'`), commitlint will attempt to enforce the same rules you apply to regular commit messages. This can be problematic unless you adjust the rules to accommodate merge patterns.
   - **Revert Commits**: Similar to merges, revert commits (e.g., `Revert "Add feature"`) will also be linted, and these messages often don’t follow conventional formats.
   - **CI/CD Workflow Breaks**: If you have a CI/CD pipeline that depends on commitlint passing, it could get disrupted due to non-compliant auto-generated messages unless you relax your rules for them.
   
### 3. **How to Use `defaultIgnores: false` Effectively**
   If you still prefer to lint all messages but want to avoid issues with automatic commits, you could:
   - **Customize Rules** for merge, revert, or other types of auto-generated commits in commitlint’s configuration to allow certain patterns. For example:
     ```javascript
     // commitlint.config.js
     module.exports = {
       extends: ['@commitlint/config-conventional'],
       defaultIgnores: false,
       rules: {
         'header-pattern': [2, 'always', /^Merge|Revert|chore:.*/],  // Example pattern for merge/revert
         // Add other rules as needed
       },
     };
     ```
   - **Use the `ignores` Array** selectively instead of `defaultIgnores: false`. This way, you can ignore only specific patterns (e.g., `Merge` commits) without ignoring everything by default.

### 4. **When It Makes Sense to Disable Default Ignores**
   - **Internal Projects or Solo Projects**: For solo or internal projects where commit history is tightly controlled, you might want to lint every commit to enforce consistency across the board.
   - **Specialized Workflows**: In cases where all contributors agree to format even merge and revert messages to match the standard, this setup can work. However, it does require more discipline and possibly more adjustments to commitlint configuration to handle different cases gracefully. 

In general, keeping `defaultIgnores` as true (the default) offers a smoother workflow for most projects, but if you’re aiming for strict consistency, disabling it can work with some additional configuration.