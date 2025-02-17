import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { Notice, NoticeSpy } from '../../__mocks__/components/notice';

describe('Notice', () => {
    beforeEach(() => {
        // Réinitialiser les notices avant chaque test
        Notice.clearAll();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should create a notice with default timeout', () => {
        const notice = new Notice('Test message');
        expect(notice.getMessage()).toBe('Test message');
        expect(notice.getTimeout()).toBe(5000);
        expect(Notice.getActiveNotices()).toHaveLength(1);
    });

    it('should create a notice with custom timeout', () => {
        const notice = new Notice('Test message', 2000);
        expect(notice.getTimeout()).toBe(2000);
    });

    it('should update notice message', () => {
        const notice = new Notice('Initial message');
        notice.setMessage('Updated message');
        expect(notice.getMessage()).toBe('Updated message');
    });

    it('should hide notice after timeout', () => {
        new Notice('Test message', 1000);
        expect(Notice.getActiveNotices()).toHaveLength(1);
        
        vi.advanceTimersByTime(1000);
        expect(Notice.getActiveNotices()).toHaveLength(0);
    });

    it('should limit the number of active notices', () => {
        // Créer plus de notices que la limite
        for (let i = 0; i < Notice.maxNotices + 2; i++) {
            new Notice(`Notice ${i}`);
        }
        
        expect(Notice.getActiveNotices()).toHaveLength(Notice.maxNotices);
    });

    it('should track notice creation with spy', () => {
        NoticeSpy('Test message');
        expect(NoticeSpy).toHaveBeenCalledWith('Test message');
        expect(NoticeSpy).toHaveBeenCalledTimes(1);
    });

    it('should remove notice when hide is called', () => {
        const notice = new Notice('Test message');
        expect(Notice.getActiveNotices()).toHaveLength(1);
        
        notice.hide();
        expect(Notice.getActiveNotices()).toHaveLength(0);
    });
}); 