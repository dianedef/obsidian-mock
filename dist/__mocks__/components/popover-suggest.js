import { vi } from 'vitest';
export var PopoverState;
(function (PopoverState) {
    PopoverState["Closed"] = "closed";
    PopoverState["Open"] = "open";
    PopoverState["Loading"] = "loading";
})(PopoverState || (PopoverState = {}));
export class MockPopoverSuggest {
    constructor(app, scope) {
        this.isOpen = false;
        this.state = PopoverState.Closed;
        this.app = app;
        this.scope = scope || {
            register: vi.fn(),
            unregister: vi.fn()
        };
        this.suggestEl = document.createElement('div');
        this.suggestEl.addClass('suggestion-container');
    }
    open() {
        if (!this.isOpen) {
            document.body.appendChild(this.suggestEl);
            this.isOpen = true;
            this.state = PopoverState.Open;
        }
    }
    close() {
        if (this.isOpen) {
            this.suggestEl.detach();
            this.isOpen = false;
            this.state = PopoverState.Closed;
        }
    }
}
