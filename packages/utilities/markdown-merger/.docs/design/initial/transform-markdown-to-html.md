## Transform Markdown to HTML

To convert markdown files to HTML in a GitHub-style format, a commonly used package in the Node.js ecosystem is **`marked`**. It is widely adopted, fast, and produces HTML that is compatible with GitHub-style rendering.

### Suggested package:
- **`marked`**: This package supports GitHub-flavored Markdown (GFM), which is exactly what you need for your use case.

### How it works:
1. **Installation**:
   ```bash
   npm install marked
   ```

2. **Usage** (Example code):
   ```typescript
   import { marked } from 'marked';

   const markdown = '# Hello World\nThis is a markdown file.';
   const html = marked(markdown);

   console.log(html);  // Will output HTML corresponding to the markdown content
   ```

### Why `marked`?
- It supports GitHub Flavored Markdown (GFM) out of the box, including features like tables, strikethrough, and task lists.
- It's fast and widely used in the Node.js ecosystem.
- It is easy to integrate and provides full control over rendering via customizable options.

You can use `marked` to convert the content of markdown files into HTML before inserting them into the OAS description fields. If you need further customization, `marked` also allows hooks and custom rendering functions.