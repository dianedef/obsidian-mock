import { vi } from 'vitest';
import type { RequestUrlParam, RequestUrlResponse, RequestUrlResponsePromise } from 'obsidian';

export const requestUrl = vi.fn().mockImplementation(
    async (params: RequestUrlParam | string): Promise<RequestUrlResponsePromise> => {
        const defaultResponse: RequestUrlResponse = {
            status: 200,
            headers: {},
            text: '',
            arrayBuffer: new ArrayBuffer(0),
            json: {}
        };

        // Si params est une string, on la traite comme une URL
        if (typeof params === 'string') {
            const promise = Promise.resolve(defaultResponse) as RequestUrlResponsePromise;
            promise.arrayBuffer = Promise.resolve(defaultResponse.arrayBuffer);
            promise.json = Promise.resolve(defaultResponse.json);
            promise.text = Promise.resolve(defaultResponse.text);
            return promise;
        }

        // Sinon on utilise les paramètres fournis
        const response: RequestUrlResponse = {
            ...defaultResponse,
            headers: params.headers || {},
            text: typeof params.body === 'string' ? params.body : '',
            arrayBuffer: params.body instanceof ArrayBuffer ? params.body : new ArrayBuffer(0)
        };

        // Si throw est activé et que le status est >= 400, on lance une erreur
        if (params.throw !== false && response.status >= 400) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const promise = Promise.resolve(response) as RequestUrlResponsePromise;
        promise.arrayBuffer = Promise.resolve(response.arrayBuffer);
        promise.json = Promise.resolve(response.json);
        promise.text = Promise.resolve(response.text);
        return promise;
    }
);

export const request = vi.fn().mockImplementation(
    async (params: RequestUrlParam | string): Promise<string> => {
        const response = await requestUrl(params);
        return response.text;
    }
); 