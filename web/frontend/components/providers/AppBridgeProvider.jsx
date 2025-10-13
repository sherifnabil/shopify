import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Banner, Layout, Page } from '@shopify/polaris';

export function AppBridgeProvider({ children }) {
    const location = useLocation();
    const navigate = useNavigate();

    const history = useMemo(
        () => ({
            replace: (path) => {
                navigate(path, { replace: true });
            },
        }),
        [navigate],
    );

    const routerConfig = useMemo(
        () => ({ history, location }),
        [history, location],
    );

    const [appBridgeConfig] = useState(() => {
        const host =
            new URLSearchParams(location.search).get('host') ||
            window.__SHOPIFY_DEV_HOST;

        window.__SHOPIFY_DEV_HOST = host;

        return {
            host,
            apiKey: import.meta.env.VITE_SHOPIFY_API_KEY, // ✅ FIXED HERE
            forceRedirect: true,
        };
    });

    if (!import.meta.env.VITE_SHOPIFY_API_KEY || !appBridgeConfig.host) { // ✅ FIXED HERE TOO
        const bannerProps = !import.meta.env.VITE_SHOPIFY_API_KEY
            ? {
                title: 'Missing Shopify API Key',
                children: (
                    <>
                        Your app is running without the VITE_SHOPIFY_API_KEY environment
                        variable. Please ensure that it is set when running or building
                        your React app.
                    </>
                ),
            }
            : {
                title: 'Missing host query argument',
                children: (
                    <>
                        Your app can only load if the URL has a <b>host</b> argument.
                        Please ensure that it is set, or access your app using the
                        Partners Dashboard <b>Test your app</b> feature
                    </>
                ),
            };

        return (
            <Page narrowWidth>
                <Layout>
                    <Layout.Section>
                        <div style={{ marginTop: '100px' }}>
                            <Banner {...bannerProps} status="critical" />
                        </div>
                    </Layout.Section>
                </Layout>
            </Page>
        );
    }

    return <>{children}</>;
}
