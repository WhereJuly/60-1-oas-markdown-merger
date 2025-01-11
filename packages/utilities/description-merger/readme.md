## Description Merger Utility

**Preamble**

The key idea of this approach is to design code alongside the OpenAPI contract. By maintaining the OpenAPI Specification (OAS) as the central contract, you ensure consistency across the system, while writing detailed code design documents directly alongside the API contract. This approach helps you manage both the API structure and design considerations in parallel. By using a tool to merge the design documents into the OAS, you can conveniently view the complete design within the OpenAPI specification itself.

**Single Source of Truth**: The OAS remains the single source of truth, with code design details pulled from external documents and included in the specification. This maintains consistency and makes it easier to manage both code design docs and API docs.

**Code-Contract Co-Design**: Define the API contract in OAS first and design the code in parallel, making it convenient.

**Convenient Writing of Design Docs**: Write the code design documents in a separate format (e.g., Markdown) and include them within the OAS to avoid clutter. This keeps the design details close to the contract without overloading it with text.

**Scalability and Maintainability**: As the API and its design evolve, you can update the contract and code design separately without redundancy, improving maintainability and scalability.

**Tool Integration**: Use a custom build tool or script to merge external documentation into the OAS JSON definition. This tool resolves {% include %} placeholders and integrates the design documents into the final API spec, making it seamless to view and maintain the complete design.

**Approach Implementation**

Tool for Merging Docs:

A custom TypeScript tool (or a similar preprocessor) is required to process the OAS JSON file. It should:

Parse the JSON.

Find {% include %} placeholders.

Replace them with the content of the referenced external Markdown files.

Output the final, merged JSON OpenAPI definition.

Example OAS Spec (JSON format) with include:

```json
{
 "openapi": "3.1.0",
 "info": {
  "title": "Example API",
  "version": "1.0.0"
 },
 "paths": {
  "/example": {
   "post": {
    "summary": "Create an example",
    "description": "{% include './docs/example.md' %}"
   }
  }
 }
}
```

In this example, the tool will replace {% include './docs/example.md' %} with the content of the example.md file during preprocessing, merging the detailed code design into the OpenAPI specification while keeping the core API structure clean and focused.
