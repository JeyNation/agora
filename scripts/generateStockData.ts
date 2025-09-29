import fs from 'fs';
import path from 'path';

interface StockDataPoint {
  date: string;
  price: number;
}

interface StockData {
  data: StockDataPoint[];
}

function generateStockData(): StockData {
  const data: StockDataPoint[] = [];
  const startPrice = 150.0;
  let currentPrice = startPrice;
  
  // Start date: September 28, 2024
  // End date: September 28, 2025
  const startDate = new Date('2024-09-28T00:00:00.000Z');
  const endDate = new Date('2025-09-28T23:59:59.999Z');
  
  // Trading hours in UTC (9:30 AM - 4:00 PM EST)
  const tradingHours = [
    [14, 30], [15, 0], [16, 0], [17, 0],
    [18, 0], [19, 0], [20, 0]
  ];
  
  for (
    let currentDate = new Date(startDate);
    currentDate <= endDate;
    currentDate.setDate(currentDate.getDate() + 1)
  ) {
    // Skip weekends
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      for (const [hour, minute] of tradingHours) {
        // Add random variation (-0.5% to +0.5%)
        const variation = (Math.random() - 0.5) * 0.01;
        currentPrice *= (1 + variation);
        
        // Add slight upward trend (about 30% over the year)
        currentPrice *= 1.001;
        
        const timestamp = new Date(currentDate);
        timestamp.setUTCHours(hour, minute, 0, 0);
        
        data.push({
          date: timestamp.toISOString(),
          price: Number(currentPrice.toFixed(2))
        });
      }
    }
  }
  
  return { data };
}

// Generate the data
const stockData = generateStockData();

// Ensure the directory exists
const dirPath = path.resolve('./src/data/stocks');
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

// Write to file
const filePath = path.resolve(dirPath, 'yearlyStockData.json');
fs.writeFileSync(
  filePath,
  JSON.stringify(stockData, null, 2),
  'utf8'
);

console.log(`Generated ${stockData.data.length} data points`);
console.log(`File saved to: ${filePath}`);