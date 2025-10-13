import React, { useState, useEffect } from 'react';
import { Page, Card, Form, TextField } from '@shopify/polaris';
import { useAppBridge, SaveBar } from '@shopify/app-bridge-react';
import {getSessionToken} from "@shopify/app-bridge-utils"; // For app instance

export default function ProductsCard() {
    const [notes, setNotes] = useState('');
    const shopify = useAppBridge();

    const handleSave = () => {
        save()
        shopify.saveBar.hide('my-save-bar');
    };
    const handleChange = (v) => {
        setNotes(v)
        shopify.saveBar.show('my-save-bar')
    };

    const handleDiscard = () => {
        setNotes('')
        shopify.saveBar.hide('my-save-bar');
    };

    const save = async () => {
        // const token = await getSessionToken(shopify);

        try {
            const resp = await fetch("http://127.0.0.1:8000/api/custom/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    custom_text: notes
                }),
            });

            const json = await resp.json();
            if (!json.success) {
                console.error("Save failed:", json.errors);
                alert("Save failed");
            } else {
                alert("Saved successfully");
            }
        } catch (err) {
            console.log("Error saving:", err);
            alert("Error saving");
        } finally {
        }
    };

    return (
        <Page title="Product Card">
            <Card sectioned>
                <Form>
                    <TextField
                        label="Notes"
                        value={notes}
                        onChange={handleChange}
                    />
                </Form>
            </Card>
            <SaveBar id="my-save-bar">
                <button variant="primary" onClick={handleSave}></button>
                <button onClick={handleDiscard}></button>
            </SaveBar>

        </Page>
    );
}
