import { useEffect, useState } from "react";

export function useCurrency() {
    const [currency, setCurrency] = useState("XAF")

    useEffect(() => {
        const getCountry = async () => {
            try {
                // Check cache first
                const cachedCurrency = localStorage.getItem("user_currency");
                if (cachedCurrency) {
                    setCurrency(cachedCurrency);
                    return;
                }

                // Check if we checked recently (prevent spamming on 429s)
                const lastCheck = localStorage.getItem("currency_last_check");
                const now = Date.now();
                if (lastCheck && now - parseInt(lastCheck) < 3600000) { // 1 hour cooldown
                    return;
                }

                localStorage.setItem("currency_last_check", now.toString());

                const result = await fetch("https://ipapi.co/currency/")
                if (!result.ok) {
                    throw new Error(`HTTP error! status: ${result.status}`);
                }
                const data = await result.text();

                if (data) {
                    setCurrency(data);
                    localStorage.setItem("user_currency", data);
                }
            } catch (error) {
                // Silently fail to fallback
                console.warn("Currency fetch failed (using fallback):", error);
            }
        }
        getCountry()
    }, [])

    return currency
}