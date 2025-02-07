# obsidian-mock

Un ensemble complet de mocks pour faciliter les tests des plugins Obsidian.

## 📝 Description

This library provides implementations of Obsidian's core components for testing, making it easy to test plugins without depending on the actual Obsidian application.

### Core Components
- `View`: Base view implementation
- `ItemView`: Custom view implementation
- `MarkdownView`: Markdown view implementation
- `FileExplorerView`: File explorer implementation

## 🚀 Installation

```bash
npm install obsidian-mock --save-dev
# ou
pnpm add -D obsidian-mock
# ou
yarn add -D obsidian-mock
```

## 💡 Usage

The library provides drop-in replacements for Obsidian's classes. Use the same imports as you would with Obsidian, just change the package name:

```typescript
// In your plugin code
import { App, MarkdownView, Plugin } from 'obsidian';

// In your tests
import { App, MarkdownView, Plugin } from 'obsidian-mock';

// The API is exactly the same!
const app = new App();
const view = new MarkdownView(leaf);
```

## 📚 API Documentation

All components implement the same interface as their Obsidian counterparts. Refer to Obsidian's API documentation for the complete interface definitions.

### View

Base class for all views.

#### Properties
- `app`: Application instance
- `leaf`: Parent WorkspaceLeaf
- `containerEl`: Container DOM element
- `scope`: Event handler

#### Methods
- `onOpen()`: Called when view opens
- `onClose()`: Called when view closes
- `getViewType()`: Returns view type
- `getDisplayText()`: Returns display text
- `getIcon()`: Returns view icon

### ItemView

Extends `View` for custom views.

#### Additional Properties
- `contentEl`: Content DOM element
- `icon`: View icon
- `navigation`: Navigation state

#### Additional Methods
- `addAction()`: Add an action to the view
- `addChild()`: Add a child component
- `removeChild()`: Remove a child component

### MarkdownView

Extends `View` for markdown views.

#### Properties
- `editor`: Editor instance
- `previewMode`: Preview mode
- `currentMode`: Current mode

#### Methods
- `setMode()`: Change mode (source/preview)
- `getMode()`: Get current mode
- `showPreview()`: Show preview
- `showEdit()`: Show editor

## 🤝 Contributing

Contributions are welcome! Here's how to contribute:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation
- Create issues for bugs and discussions

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## 🙏 Acknowledgments

- Obsidian team for their excellent work
- Project contributors

## TypeScript Type System Limitations and Solutions

When implementing Obsidian's API types, we encountered several TypeScript type system limitations:

### 1. Recursive Workspace Types
Obsidian expects a strictly recursive structure where each container must have non-nullable Window references. This creates typing challenges in our mocks where we can't always guarantee this structure.

Example:
```typescript
// Type error: Window | undefined is not assignable to Window
getContainer().win
```

### 2. Multiple Inheritance
Some Obsidian classes need to implement multiple interfaces with sometimes conflicting constraints. For example, `WorkspaceTabs` must be both a `WorkspaceTabs` and a `WorkspaceMobileDrawer`.

### 3. Strict API Typing
Obsidian's API expects complete implementations of all methods and properties, even those not used in tests.

To work around these limitations, we adopted three approaches:

1. **Using `as any`**: For cases where strict typing isn't crucial for testing
2. **Intermediate Interfaces**: Like `WorkspaceParent` to relax certain type constraints
3. **Partial Implementations with Mocks**: To simulate only the functionality needed for tests

These compromises allow us to:
- Keep test code functional
- Maintain good test coverage
- Avoid implementing unnecessary functionality
- Stay compatible with Obsidian's API while keeping code simple

## Fonctionnalités

- Mocks complets pour l'API Obsidian
- Support TypeScript complet
- Tests unitaires inclus
- Facile à utiliser et à étendre

## API

### App

Mock de la classe `App` d'Obsidian.

```typescript
const app = new App();
```

### Events

Mock de la classe `Events` d'Obsidian.

```typescript
const events = new Events();
events.on('event', () => {});
events.trigger('event');
```

### FuzzySuggestModal

Mock de la classe `FuzzySuggestModal` d'Obsidian.

```typescript
class MyModal extends FuzzySuggestModal<string> {
    // Implémentation...
}
```