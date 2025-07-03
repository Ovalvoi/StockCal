// Wait for the HTML document to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- Stock Ticker List Functionality ---
    const tickerContainer = document.getElementById('stock-ticker-container');
    if (tickerContainer) {
        // Define the tickers and their corresponding company names, organized by sector
        const sectors = [
            {
                title: 'Tech & Growth',
                symbols: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA']
            },
            {
                title: 'Semiconductors & Software',
                symbols: ['NVDA', 'AVGO', 'ADBE', 'CRM', 'INTC']
            },
            {
                title: 'Financial & Payments',
                symbols: ['JPM', 'V', 'MA', 'BAC', 'WFC']
            },
            {
                title: 'Healthcare',
                symbols: ['UNH', 'LLY', 'JNJ', 'MRK', 'ABBV']
            },
            {
                title: 'Consumer & Retail',
                symbols: ['WMT', 'HD', 'COST', 'NKE', 'MCD']
            }
        ];

        // A map of symbols to their full company names to avoid extra API calls
        const companyNames = {
            'AAPL': 'Apple Inc.', 'MSFT': 'Microsoft Corp.', 'GOOGL': 'Alphabet Inc.', 'AMZN': 'Amazon.com, Inc.', 'TSLA': 'Tesla, Inc.',
            'NVDA': 'NVIDIA Corp.', 'AVGO': 'Broadcom Inc.', 'ADBE': 'Adobe Inc.', 'CRM': 'Salesforce, Inc.', 'INTC': 'Intel Corp.',
            'JPM': 'JPMorgan Chase & Co.', 'V': 'Visa Inc.', 'MA': 'Mastercard Inc.', 'BAC': 'Bank of America', 'WFC': 'Wells Fargo & Co.',
            'UNH': 'UnitedHealth Group', 'LLY': 'Eli Lilly & Co.', 'JNJ': 'Johnson & Johnson', 'MRK': 'Merck & Co.', 'ABBV': 'AbbVie Inc.',
            'WMT': 'Walmart Inc.', 'HD': 'The Home Depot', 'COST': 'Costco Wholesale', 'NKE': 'NIKE, Inc.', 'MCD': "McDonald's Corp."
        };

        // Flatten the symbols from all sectors into a single array for the API request
        const flatSymbols = sectors.map(sector => sector.symbols).flat();
        const proxyUrl = 'https://us-central1-api-proxy-464819.cloudfunctions.net/getStockDataProxy';
        const tickerApiUrl = `${proxyUrl}?symbols=${flatSymbols.join(',')}`;

        fetch(tickerApiUrl)
            .then(response => response.json())
            .then(data => {
                // Create a simple map for easy price lookups from the API response
                const priceMap = {};
                if (data && data.data) {
                    data.data.forEach(stock => {
                        priceMap[stock.symbol] = stock.close;
                    });
                }

                // Build the grid HTML using the sectors data structure
                let tickerHTML = '<div class="card-body">';

                sectors.forEach((sector, index) => {
                    // Add the sector title as a header
                    tickerHTML += `<h5 class="mb-3 text-center">${sector.title}</h5>`;
                    
                    // For each row in the matrix, create a Bootstrap row
                    tickerHTML += '<div class="row mb-3">';
                    sector.symbols.forEach(symbol => {
                        const price = priceMap[symbol] ? `$${priceMap[symbol].toFixed(2)}` : 'N/A';
                        const name = companyNames[symbol] || ''; // Get the company name from our map

                        // For each symbol in the row, create a Bootstrap column.
                        tickerHTML += `
                            <div class="col text-center">
                                <span class="stock-symbol fw-bold d-block">${symbol}</span>
                                <span class="stock-price d-block small">${price}</span>
                                <span class="company-name d-block" style="font-size: 0.7rem;">${name}</span>
                            </div>
                        `;
                    });
                    tickerHTML += '</div>'; // Close the Bootstrap row

                    // Add a horizontal line between sectors, but not after the last one
                    if (index < sectors.length - 1) {
                        tickerHTML += '<hr class="my-4">';
                    }
                });

                tickerHTML += '</div>'; // Close card-body
                tickerContainer.innerHTML = tickerHTML;
            })
            .catch(error => {
                console.error('Error fetching stock data:', error);
                tickerContainer.innerHTML = '<div class="card-body"><p class="text-danger">Could not load stock ticker.</p></div>';
            });
    }
});
