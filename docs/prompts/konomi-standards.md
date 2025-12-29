<!--
@udt file/1.0
uuid: eom-prompt-konomi-f8a9b0c1
version: 0.1.0
tokens: 250
path: /docs/prompts/konomi-standards.md
parent: /docs/prompts
tags: [core, udt]
-->
# Konomi Standards Reference

Self-defining industrial standards compression.

## Layer 0: Meta-Standard

```
STD={id,scope,udt,hierarchy,states,entities,relations,rules,crosswalk}
UDT={name,base,fields,methods,constraints}
```

## Base UDTs

```
UUID: global identifier
PATH: hierarchical "A/B/C/D"
TAG: equipment "Area_Unit_Point"
Timestamp: ISO8601 or EPOCH_MS
Quality: GOOD(192)|BAD(0)|UNCERTAIN(64)
Value: {v,q,t,unit}
```

## Usage Pattern

```javascript
// Parse human standard → compressed
KS.parse("ISA-95", sourceDoc)

// Expand compressed → implementation
KS.expand("ISA-95", { target: "python" })

// Validate implementation
KS.validate(impl, "ISA-95")

// Map between standards
KS.crosswalk(entity, "ISA-95", "ISA-88")
```

## Key Principles

- UDT-first design
- Max info, min tokens
- Self-describing structure
- Cross-standard mapping
