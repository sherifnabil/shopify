import {Page, Card, DataTable, Button, Frame, Layout, SkeletonBodyText} from '@shopify/polaris';
import React, { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";

export function AbandonedCartList() {
    const navigate = useNavigate();
    const [carts, setCarts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            // const token = await getSessionToken(app);

            const resp = await fetch("/api/abandoned/list", {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const json = await resp.json();
            console.log('json', json)
            setCarts(json)
            setLoading(false)
        };
        fetchData()
    }, []);

    const rows = carts.map((cart) => [
        cart.email,
        new Date(cart.created_at).toLocaleString(),
        cart.items_count,
        `${parseFloat(cart.items_total).toFixed(2)}
        `,
        <a
            href={cart.checkout_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#007bff" }}
        >
            View Checkout
        </a>,
    ]);


    return (
        <Page title="Abandoned Cart List">
            {loading &&
                <Layout.Section>
                    <Card sectioned>
                        <SkeletonBodyText lines={5}/>
                    </Card>
                </Layout.Section>
            }
            {!loading &&
                <Card padding={'0'}>
                    <DataTable
                        columnContentTypes={["text", "text", "numeric", "numeric", "text"]}
                        headings={["Email", "Created At", "Items Count", "Total", "Checkout URL"]}
                        rows={rows}
                    />
                </Card>
            }

        </Page>
    );
}
