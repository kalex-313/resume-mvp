PDF pagination TS fix

Included:
- src/components/builder/pdf-download-button.tsx

What this fixes:
- Removes the unsupported CSSStyleDeclaration property that caused the build error
- Keeps the pagination-polish logic
- Safe full-file replacement
