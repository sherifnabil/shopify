import { useState, useEffect } from "react";

export function useAppStatus() {
    const [isLoading, setIsLoading] = useState(true);
    const [extensionActivated, setExtensionActivated] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchAppStatus() {
            try {
                const response = await fetch("/api/app/status", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }

                const json = await response.json();

                // Assuming the API returns something like { active: true }
                setExtensionActivated(json.active);
            } catch (err) {
                console.error("Error fetching app status:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchAppStatus();
    }, []);

    return { isLoading, extensionActivated, error };
}
