import { describe, it, expect, beforeEach } from 'vitest';
import { Canvas } from '../../__mocks__/ui/canvas';
import type { AllCanvasNodeData, CanvasEdgeData } from 'obsidian/canvas';

describe('Canvas', () => {
    let canvas: Canvas;

    beforeEach(() => {
        canvas = new Canvas();
    });

    describe('Initialisation', () => {
        it('should create an empty canvas', () => {
            expect(canvas.data.nodes).toHaveLength(0);
            expect(canvas.data.edges).toHaveLength(0);
        });

        it('should create a container element', () => {
            expect(canvas.containerEl).toBeDefined();
            expect(canvas.containerEl.classList.contains('canvas-wrapper')).toBe(true);
        });
    });

    describe('Node operations', () => {
        const mockNode: AllCanvasNodeData = {
            id: 'test-node',
            type: 'text',
            text: 'Test Node',
            x: 0,
            y: 0,
            width: 100,
            height: 50
        };

        it('should add a node', () => {
            canvas.addNode(mockNode);
            expect(canvas.data.nodes).toHaveLength(1);
            expect(canvas.data.nodes[0]).toEqual(mockNode);
        });

        it('should get a node by id', () => {
            canvas.addNode(mockNode);
            const node = canvas.getNodeById('test-node');
            expect(node).toEqual(mockNode);
        });

        it('should remove a node', () => {
            canvas.addNode(mockNode);
            canvas.removeNode('test-node');
            expect(canvas.data.nodes).toHaveLength(0);
        });
    });

    describe('Edge operations', () => {
        const mockEdge: CanvasEdgeData = {
            id: 'test-edge',
            fromNode: 'node1',
            fromSide: 'right',
            toNode: 'node2',
            toSide: 'left'
        };

        it('should add an edge', () => {
            canvas.addEdge(mockEdge);
            expect(canvas.data.edges).toHaveLength(1);
            expect(canvas.data.edges[0]).toEqual(mockEdge);
        });

        it('should get an edge by id', () => {
            canvas.addEdge(mockEdge);
            const edge = canvas.getEdgeById('test-edge');
            expect(edge).toEqual(mockEdge);
        });

        it('should remove an edge', () => {
            canvas.addEdge(mockEdge);
            canvas.removeEdge('test-edge');
            expect(canvas.data.edges).toHaveLength(0);
        });
    });

    describe('Component lifecycle', () => {
        it('should handle load and unload', () => {
            canvas.load();
            expect(canvas.onload).toHaveBeenCalled();

            canvas.unload();
            expect(canvas.onunload).toHaveBeenCalled();
        });
    });

    describe('View operations', () => {
        it('should return correct view type and display text', () => {
            expect(canvas.getViewType()).toBe('canvas');
            expect(canvas.getDisplayText()).toBe('Canvas');
            expect(canvas.getIcon()).toBe('document');
        });

        it('should handle zoom operations', () => {
            expect(canvas.getZoom()).toBe(1);
            expect(canvas.getViewport()).toEqual({ x: 0, y: 0, width: 800, height: 600 });
        });
    });

    describe('Node validation', () => {
        it('should validate text nodes', () => {
            const textNode: AllCanvasNodeData = {
                id: 'text-node',
                type: 'text',
                text: 'Test Text',
                x: 0,
                y: 0,
                width: 100,
                height: 50
            };
            canvas.addNode(textNode);
            expect(canvas.data.nodes[0]).toEqual(textNode);
        });

        it('should validate file nodes', () => {
            const fileNode: AllCanvasNodeData = {
                id: 'file-node',
                type: 'file',
                file: 'test.md',
                x: 0,
                y: 0,
                width: 100,
                height: 50
            };
            canvas.addNode(fileNode);
            expect(canvas.data.nodes[0]).toEqual(fileNode);
        });

        it('should validate link nodes', () => {
            const linkNode: AllCanvasNodeData = {
                id: 'link-node',
                type: 'link',
                url: 'https://example.com',
                x: 0,
                y: 0,
                width: 100,
                height: 50
            };
            canvas.addNode(linkNode);
            expect(canvas.data.nodes[0]).toEqual(linkNode);
        });

        it('should validate group nodes', () => {
            const groupNode: AllCanvasNodeData = {
                id: 'group-node',
                type: 'group',
                x: 0,
                y: 0,
                width: 100,
                height: 50
            };
            canvas.addNode(groupNode);
            expect(canvas.data.nodes[0]).toEqual(groupNode);
        });
    });

    describe('Group operations', () => {
        it('should create a group', () => {
            const nodes: AllCanvasNodeData[] = [
                {
                    id: 'node1',
                    type: 'text',
                    text: 'Node 1',
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 50
                },
                {
                    id: 'node2',
                    type: 'text',
                    text: 'Node 2',
                    x: 100,
                    y: 0,
                    width: 100,
                    height: 50
                }
            ];
            canvas.createGroup(nodes);
            expect(canvas.data.nodes).toHaveLength(1);
            expect(canvas.data.nodes[0].type).toBe('group');
        });
    });

    describe('Selection operations', () => {
        it('should handle selection operations', () => {
            canvas.selectElement();
            expect(canvas.selectElement).toHaveBeenCalled();

            canvas.deselectElement();
            expect(canvas.deselectElement).toHaveBeenCalled();

            canvas.clearSelection();
            expect(canvas.clearSelection).toHaveBeenCalled();

            const selection = canvas.getSelection();
            expect(selection).toEqual([]);
        });
    });

    describe('History operations', () => {
        it('should handle undo/redo operations', () => {
            expect(canvas.canUndo()).toBe(false);
            expect(canvas.canRedo()).toBe(false);

            canvas.undo();
            expect(canvas.undo).toHaveBeenCalled();

            canvas.redo();
            expect(canvas.redo).toHaveBeenCalled();
        });
    });

    describe('Component methods', () => {
        it('should handle child components', () => {
            const mockComponent = { containerEl: document.createElement('div') };
            const added = canvas.addChild(mockComponent);
            expect(added).toBe(mockComponent);

            const removed = canvas.removeChild(mockComponent);
            expect(removed).toBe(mockComponent);
        });

        it('should handle event registration', () => {
            const callback = () => {};
            canvas.register(callback);
            expect(canvas.register).toHaveBeenCalledWith(callback);

            const eventRef = { id: 'test' };
            canvas.registerEvent(eventRef);
            expect(canvas.registerEvent).toHaveBeenCalledWith(eventRef);

            const intervalId = canvas.registerInterval(123);
            expect(intervalId).toBe(123);
        });
    });
}); 