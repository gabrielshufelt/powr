<!-- Source-File AI Declaration -->
<!-- AI contribution: 50% or more AI-generated -->

# Repository Instructions

## Source-File AI Declaration

Every AI agent must maintain an AI-contribution declaration in each applicable source file to which it adds substantive content. Treat this as a completion requirement: work is not finished until every applicable file created or substantively modified by the agent has a valid declaration.

### Applicable source files

This policy covers hand-maintained files containing application code, tests, scripts, database definitions or migrations, infrastructure-as-code, Dockerfiles, CI workflows, and executable configuration.

It does not cover prose documentation, licenses, dependency lockfiles, generated or vendored files, binaries, or pure data fixtures. A format that has no legal comment syntax, such as strict JSON, is exempt because adding a comment would invalidate it. Do not simulate a declaration with a data property. When a comment-capable generator or template produces an exempt file, apply the declaration to the generator or template.

An entirely empty source file may remain declaration-free. Add a declaration when an AI first adds substantive content. Do not backfill declarations into unrelated untouched files.

### Required form

Use exactly two consecutive comment lines in the file's native comment syntax:

```text
<comment> Source-File AI Declaration
<comment> AI contribution: <level>
```

`<level>` must be exactly one of:

- `No substantial AI-generated code`
- `Below 50% AI-generated`
- `50% or more AI-generated`

For example, in Python:

```python
# Source-File AI Declaration
# AI contribution: Below 50% AI-generated
```

Place the declaration at the first legal comment location, after any required shebang, encoding marker, or language directive. Maintain one declaration per file and update it when necessary.

### Classification

Classify the substantive content of the entire resulting file, not only the latest diff:

- Use `No substantial AI-generated code` when no substantive AI-authored code remains, such as after a purely mechanical edit or when applying human-authored content verbatim.
- Use `Below 50% AI-generated` when substantive AI-authored content remains but makes up less than half of the file.
- Use `50% or more AI-generated` when AI-authored content makes up at least half of the file. A new or formerly empty file populated by an AI belongs at this level unless the agent can establish that most substantive content was supplied by a human.

Substantive content includes program logic, tests, queries, schema definitions, infrastructure behavior, and executable configuration. Whitespace-only edits and purely mechanical formatting are not substantive.

When authorship or a boundary is uncertain, choose the higher level. Preserve a credible existing declaration, raise its level when the resulting file requires it, and never lower it without explicit human confirmation.

### Completion audit

Before finishing a task:

1. Review every file created or changed during the task.
2. Identify each applicable source file receiving substantive AI-authored content.
3. Add or update its declaration using the exact form and appropriate level above.
4. Confirm that empty files remain untouched unless the task requires content and that commentless formats remain syntactically valid.
