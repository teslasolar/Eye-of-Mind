<!--
@udt file/1.0
uuid: eom-docs-udt-e7f8a9b0
version: 0.1.0
tokens: 150
path: /docs/udt-system.md
parent: /docs
tags: [udt]
-->
# UDT System

User Defined Types for self-describing files.

## Header Format

```html
<!--
@udt file/1.0
uuid: eom-xxx-xxx-xxxx
version: 0.1.0
tokens: 150
path: /path/to/file
parent: /parent
deps: [dep1.js, dep2.js]
tags: [tag1, tag2]
-->
```

## Templates

- **file** - Any file with metadata
- **directory** - Folder with index
- **tag** - Categorization labels
- **instance** - Instantiated template

## Auto-Generated Fields

- `uuid` - Unique identifier
- `path` - File location
- `tokens` - Approximate token count
- `created`/`modified` - Timestamps

## Usage

Templates in `/.udt/templates/` define schemas.
Tags in `/.tags/provider.json` hold instances.
