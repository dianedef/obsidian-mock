detach(): void {
    if (this.parent) {
        this.workspace.detachLeaf(this);
    }
} 