import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {Page, Card, FormLayout, TextField, Banner, SkeletonBodyText, Layout, Button, Frame} from '@shopify/polaris';

import { useAppBridge, SaveBar } from '@shopify/app-bridge-react';

export default function ProductsCard() {
    const [notes, setNotes] = useState('');
    const shopify = useAppBridge();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchData = async () => {
            // const token = await getSessionToken(app);

            const resp = await fetch("/api/custom/get", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const json = await resp.json();
            setNotes(json.metafield.value)
            setLoading(false)
        };
        fetchData()
    }, []);
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

        try {
            const resp = await fetch("/api/custom/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",

                },
                body: JSON.stringify({
                    custom_text: notes,
                    // token: getSessionToken()
                }),
            });

            const json = await resp.json();
            if (!json.success) {
                alert("Save failed");
            } else {
                alert("Saved successfully");
            }
        } catch (err) {
            alert("Error saving");
        }
    };

    return (
        <Page
            title="Store Front Meta Field"
            subtitle="Notes Store Front."
            fullWidth>

            <Card sectioned>
                <FormLayout>
                    {loading &&
                        <Layout.Section>
                            <Card sectioned>
                                <SkeletonBodyText lines={2}/>
                            </Card>
                        </Layout.Section>
                    }
                    {!loading &&
                        <TextField
                            label="Notes"
                            value={notes}
                            onChange={handleChange}
                        />
                    }
                    <SaveBar id="my-save-bar">
                        <button variant="primary" onClick={handleSave}></button>
                        <button onClick={handleDiscard}></button>
                    </SaveBar>
                </FormLayout>
            </Card>


        </Page>

);
};
