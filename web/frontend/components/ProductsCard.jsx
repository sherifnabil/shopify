import { useState, useCallback } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { TextField, Page } from "@shopify/polaris";

export function ProductsCard() {
    const shopify = useAppBridge();
    const { t } = useTranslation();
    const [value, setValue] = useState("");

    const showToast = (message, isError = false) => {
        shopify.toast.show(message, { isError });
    };

    const handleChange = useCallback((newValue) => {
        setValue(newValue);
        save();
    }, []);

    const save = async () => {
        try {
            const resp = await fetch("http://127.0.0.1:8000/api/custom/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    custom_text: value,
                }),
            });

            const json = await resp.json();
            if (!json.success) {
                console.error("Save failed:", json.errors);
                showToast("Save failed", true);
            } else {
                showToast("Saved successfully");
            }
        } catch (err) {
            console.error("Error saving:", err);
            showToast("Error saving", true);
        } finally {
        }
    };
    return (
        <Page title="Custom Text">
            <TextField
                label="Custom Text"
                value={value}
                multiline={4}
                onChange={handleChange}
                autoComplete="off"
            />
        </Page>
    );
}
