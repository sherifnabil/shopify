// src/components/providers/PolarisProvider.jsx
import React, { useCallback } from "react";
import { AppProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import { getPolarisTranslations } from "../../utils/i18nUtils";
import { useNavigate } from "react-router-dom";

function AppBridgeLink({ url, children, external, ...rest }) {
    const navigate = useNavigate();
    const handleClick = useCallback(() => navigate(url), [url]);

    const IS_EXTERNAL_LINK_REGEX = /^(?:[a-z][a-z\d+.-]*:|\/\/)/;

    if (external || IS_EXTERNAL_LINK_REGEX.test(url)) {
        return (
            <a {...rest} href={url} target="_blank" rel="noopener noreferrer">
                {children}
            </a>
        );
    }

    return (
        <a {...rest} onClick={handleClick}>
            {children}
        </a>
    );
}

export function PolarisProvider({ children }) {
    const translations = getPolarisTranslations();

    return (
        <AppProvider i18n={translations} linkComponent={AppBridgeLink}>
            {children}
        </AppProvider>
    );
}
