PDF pagination balance fix

Included:
- src/components/builder/pdf-download-button.tsx

What this fixes:
- Stops treating every page as already "full" during pagination measurement
- Allows multiple small sections/cards to stay on the same PDF page
- Keeps the centered A4 export and better page-break logic

Why the previous version failed visually:
- The inner page wrapper had height: 100%, so its scrollHeight was basically a full page
  even before several sections were added
- That made the paginator think almost every extra card needed a new page
