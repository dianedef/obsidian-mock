# obsidian-mock

A comprehensive mocking library for testing Obsidian plugins.

[![npm version](https://badge.fury.io/js/obsidian-mock.svg)](https://badge.fury.io/js/obsidian-mock)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📝 Description

`obsidian-mock` provides a complete set of mocks for Obsidian's API, making it easy to test your plugins without depending on the actual Obsidian application. All mocks implement the same interfaces as their Obsidian counterparts, ensuring type safety and API compatibility.

### Why Mock Obsidian's API?

When developing Obsidian plugins, you'll use Obsidian's API in your code:
```typescript
import { App, Plugin } from 'obsidian';
ok 
export default class MyPlugin extends Plugin {
    async onload() {
        // Your plugin needs real Obsidian objects here
        const file = this.app.workspace.getActiveFile();
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    }
}
```

However, testing this code presents several challenges:

1. **Runtime Dependencies**: Obsidian's API requires a running Obsidian instance
2. **DOM Dependencies**: Many Obsidian objects depend on DOM elements and window objects
3. **Complex State**: Obsidian maintains complex internal state that's hard to replicate in tests
4. **Async Operations**: File operations and UI updates are asynchronous

This is where `obsidian-mock` comes in. In your tests, simply change the import:
```typescript
// In tests
import { App, Plugin } from 'obsidian-mock';

describe('MyPlugin', () => {
    it('should handle files', () => {
        const app = new App();
        // Now you can test without Obsidian running!
        const file = app.workspace.getActiveFile();
        expect(file).toBeDefined();
    });
});
```

### Key Features

- ✨ Complete TypeScript support
- 🔄 Drop-in replacements for Obsidian classes
- 🧪 Built-in test utilities
- 📦 Zero runtime dependencies
- 🛠️ Easy to extend and customize

## 🚀 Quick Start

```bash
# npm
npm install obsidian-mock --save-dev

# pnpm
pnpm add -D obsidian-mock

# yarn
yarn add -D obsidian-mock
```

## 💡 Usage Examples

### Testing a Plugin

```typescript
import { App, Plugin, MarkdownView } from 'obsidian-mock';

describe('MyPlugin', () => {
    let app: App;
    let plugin: MyPlugin;

    beforeEach(() => {
        app = new App();
        plugin = new MyPlugin(app);
    });

    it('should handle markdown files', () => {
        const view = new MarkdownView(app.workspace.activeLeaf);
        expect(view.getViewType()).toBe('markdown');
    });
});
```

### Testing Views

```typescript
import { ItemView, WorkspaceLeaf } from 'obsidian-mock';

class CustomView extends ItemView {
    getViewType() {
        return 'custom-view';
    }
}

describe('CustomView', () => {
    it('should render correctly', () => {
        const leaf = new WorkspaceLeaf(app);
        const view = new CustomView(leaf);
        expect(view.containerEl).toBeDefined();
    });
});
```

## 📚 API Documentation

### Core Components

#### View
Base class for all views.

**Properties**:
- `app`: Application instance
- `leaf`: Parent WorkspaceLeaf
- `containerEl`: Container DOM element
- `scope`: Event handler

**Methods**:
- `onOpen()`: Called when view opens
- `onClose()`: Called when view closes
- `getViewType()`: Returns view type
- `getDisplayText()`: Returns display text
- `getIcon()`: Returns view icon

#### ItemView
Extends `View` for custom views.

**Additional Properties**:
- `contentEl`: Content DOM element
- `icon`: View icon
- `navigation`: Navigation state

**Additional Methods**:
- `addAction()`: Add an action to the view
- `addChild()`: Add a child component
- `removeChild()`: Remove a child component

#### MarkdownView
Extends `View` for markdown views.

**Properties**:
- `editor`: Editor instance
- `previewMode`: Preview mode
- `currentMode`: Current mode

**Methods**:
- `setMode()`: Change mode (source/preview)
- `getMode()`: Get current mode
- `showPreview()`: Show preview
- `showEdit()`: Show editor

### UI Components

- `Modal`: Modal window mock
- `Notice`: Notification mock
- `Menu`: Menu mock
- `Setting`: Settings mock
- `FuzzySuggestModal`: Fuzzy search mock

### File System

- `Vault`: File system mock
- `TFile`: File mock
- `TFolder`: Folder mock
- `FileManager`: File operations mock

## 🔧 Technical Details

### TypeScript Type System Limitations

When implementing Obsidian's API types, we encountered and solved several TypeScript type system limitations:

1. **Recursive Workspace Types**: Handled Window reference requirements through careful type casting
2. **Multiple Inheritance**: Resolved interface conflicts using intermediate interfaces
3. **Strict API Typing**: Implemented smart partial mocks for testing efficiency

Our solutions include:
- Using type assertions only when necessary
- Creating intermediate interfaces for type flexibility
- Implementing partial mocks that focus on tested functionality

## 🤝 Contributing

Contributions are welcome! Here's how to contribute:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build
pnpm build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Obsidian team for their excellent API
- All contributors who have helped with code, documentation, and bug reports

## ⚠️ Known Limitations

Some Obsidian API features have limitations in the mock environment:

- File system operations are simulated
- Some UI interactions may behave differently
- Window and Document objects are mocked

For detailed information about limitations and workarounds, see our [Wiki](../../wiki).

### Plugin Data Management

Obsidian's `Plugin` class provides built-in methods for data persistence with `loadData` and `saveData`. Here's how to use them with proper typing:

```typescript
interface MyPluginData {
    setting1: string;
    setting2: number;
}

class MyPlugin extends Plugin {
    private settings: MyPluginData;

    async onload() {
        // Load settings with type safety
        this.settings = await this.loadData() ?? {
            setting1: 'default',
            setting2: 42
        };
    }

    async saveSettings() {
        // Save settings with type safety
        await this.saveData(this.settings);
    }
}
```

The mock implementation in this library provides the same API, making it easy to test your plugin's data management:

```typescript
describe('MyPlugin', () => {
    it('should load default settings', async () => {
        const plugin = new MyPlugin(app, manifest);
        await plugin.onload();
        expect(plugin.settings).toEqual({
            setting1: 'default',
            setting2: 42
        });
    });

    it('should save settings', async () => {
        const plugin = new MyPlugin(app, manifest);
        await plugin.onload();
        plugin.settings.setting1 = 'new value';
        await plugin.saveSettings();
        
        // Verify saved data
        const loadedData = await plugin.loadData();
        expect(loadedData.setting1).toBe('new value');
    });
});
```