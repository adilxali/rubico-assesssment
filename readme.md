# Rubico Assessment

This is a React + TypeScript project for managing customers and invoices. It uses Vite for fast development, Tailwind CSS for styling, and includes custom hooks and components for state management and form handling.

## Features
- Customer management (add, edit, list)
- Invoice management (add, edit, list)
- Multi-step forms for customer details
- Quick actions for efficient workflow
- State management with custom hooks
- Form validation

## Tech Stack
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or bun

### Installation

```bash
npm install
# or
bun install
```

### Running the App

```bash
npm run dev
# or
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

### Building for Production

```bash
npm run build
# or
bun run build
```

## Project Structure
```
src/
  components/      # React components
    steps/         # Multi-step form components
  lib/             # Utility libraries (db, validation)
  store/           # Custom hooks for state management
  App.tsx          # Main app component
  main.tsx         # Entry point
  index.css        # Global styles
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
MIT
