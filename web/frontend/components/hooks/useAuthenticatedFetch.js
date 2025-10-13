import { useCallback } from 'react';
import createApp from '@shopify/app-bridge';
import { getSessionToken } from '@shopify/app-bridge-utils';

export function useAuthenticatedFetch() {
    const config = { apiKey: import.meta.env.VITE_SHOPIFY_API_KEY, host: new URLSearchParams(window.location.search).get('host') };
    const app = createApp(config);

    return useCallback(async (url, options = {}) => {
        const token = await getSessionToken(app);
        const headers = { ...options.headers, 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token };
        return fetch(url, { ...options, headers });
    }, []);
}
