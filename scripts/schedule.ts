import fetch from 'node-fetch'; // You might need to install node-fetch: npm install node-fetch @types/node-fetch
import * as fs from 'fs';
import { parseISO, startOfWeek, formatISO, addWeeks } from 'date-fns';

// Ensure your environment variable ALPHAVANTAGE_API_KEY is set
const ALPHAVANTAGE_API_KEY = process.env.ALPHAVANTAGE_API_KEY;

if (!ALPHAVANTAGE_API_KEY) {
    console.error('Error: ALPHAVANTAGE_API_KEY environment variable is not set.');
    process.exit(1);
}

const symbols: string[] = ['QQQ', 'SPY', 'SCHG', 'TQQQ', 'MAGS'];

const DailyPriceAPI_Base = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY';

interface DividendPrice {
    date: string;
    dividend: string;
    price: string;
}

interface DailyPriceResponse {
    'Time Series (Daily)': {
        [date: string]: {
            '1. open': string, '2. high': string, '3. low': string, '4. close': string, '5. volume': string
        }
    };
}

interface DailyData {
    [date: string]: {
        '1. open': string, '2. high': string, '3. low': string, '4. close': string, '5. volume': string
    }
}

interface Statistics {
    averageClose: number;
    averageVolume: number;
    closeGrowthRate?: number;
    volumeGrowthRate?: number;
}

interface SymbolData {
    price: number;
    monthlyData: StatisticsDate[];
    weeklyData: StatisticsDate[];
    biweeklyData: StatisticsDate[];
    news: any[];
}

type StatisticsDate = Statistics & { date: string };

async function fetchData() {
    const m: Record<string, SymbolData> = {};

    for (const symbol of symbols) {
        // Construct Daily Price API URL
        const dailyPriceUrl = `${DailyPriceAPI_Base}&symbol=${symbol}&apikey=${ALPHAVANTAGE_API_KEY}&outputsize=full`;
        console.log(`Fetching daily price for ${symbol} from: ${dailyPriceUrl}`);


        try {
            // Fetch Daily Price Data
            const dailyPriceResponse = await fetch(dailyPriceUrl);
            if (!dailyPriceResponse.ok) {
                throw new Error(`HTTP error! status: ${dailyPriceResponse.status} for ${dailyPriceUrl}`);
            }
            // const dailyPriceResponse = await priceAPI();
            const dailyPriceAPIData: any = await dailyPriceResponse.json();
            // console.log(`Daily Price Data for ${symbol}:`, dailyPriceAPIData);

            const dailyData: DailyData = dailyPriceAPIData['Time Series (Daily)'];

            if (!dailyData) {
                console.error(`No 'Time Series (Daily)' data for ${symbol}. API Response:`, dailyPriceAPIData);
                continue;
            }

            const monthlyData = groupByMonthAndAverageStats(dailyData);
            const monthlyDataGrowth = calculateWeeklyGrowth(monthlyData);
            const monthlyDataList = toArrayWithDate(monthlyDataGrowth)
            // console.log(`Monthly Data for ${symbol}:`, monthlyDataList);

            const weeklyData = groupByWeek(dailyData)
            const weeklyDataGrowth = calculateWeeklyGrowth(weeklyData);
            const weeklyDataList = toArrayWithDate(weeklyDataGrowth)
            // console.log(`Weekly Data for ${symbol}:`, weeklyDataList);

            const biweeklyData = groupByBiWeek(dailyData)
            const biweeklyDataGrowth = calculateWeeklyGrowth(biweeklyData);
            const biweeklyDataList = toArrayWithDate(biweeklyDataGrowth)
            // console.log(`Biweekly Data for ${symbol}:`, biweeklyDataList);

            m[symbol] = {
                price: currentPrice(dailyData),
                monthlyData: monthlyDataList,
                weeklyData: weeklyDataList,
                biweeklyData: biweeklyDataList,
                news: []
            }

        } catch (error) {
            console.error(`Failed to fetch data for ${symbol}:`, error);
        }
        console.log('---'); // Separator for better readability
    }

    return m
}


function currentPrice(data: DailyData): number {
    const dates = Object.keys(data);
    if (dates.length === 0) {
        console.warn('currentPrice called with empty data object, returning 0.');
        return 0;
    }
    const date = dates[0];
    return Number(data[date]['4. close']);
}

function groupByMonthAndAverageStats(data: DailyData): Record<string, Statistics> {
    const monthlyGroups: Record<string, { closes: number[]; volumes: number[] }> = {};

    for (const date in data) {
        const close = parseFloat(data[date]['4. close']);
        const volume = parseInt(data[date]['5. volume'], 10);
        const month = date.slice(0, 7); // YYYY-MM

        if (!monthlyGroups[month]) {
            monthlyGroups[month] = { closes: [], volumes: [] };
        }

        monthlyGroups[month].closes.push(close);
        monthlyGroups[month].volumes.push(volume);
    }

    const result: Record<string, Statistics> = {};

    for (const month in monthlyGroups) {
        const { closes, volumes } = monthlyGroups[month];
        const avgClose = closes.reduce((sum, val) => sum + val, 0) / closes.length;
        const avgVolume = volumes.reduce((sum, val) => sum + val, 0) / volumes.length;

        result[month] = {
            averageClose: parseFloat(avgClose.toFixed(2)),
            averageVolume: Math.round(avgVolume),
        };
    }

    return result;
}

function groupByWeek(data: DailyData): Record<string, Statistics> {
    const weeklyGroups: Record<string, { closes: number[]; volumes: number[] }> = {};

    for (const date in data) {
        const d = parseISO(date);
        const weekStart = formatISO(startOfWeek(d, { weekStartsOn: 1 }), { representation: 'date' }); // 以星期一為起始日

        if (!weeklyGroups[weekStart]) {
            weeklyGroups[weekStart] = { closes: [], volumes: [] };
        }

        weeklyGroups[weekStart].closes.push(parseFloat(data[date]['4. close']));
        weeklyGroups[weekStart].volumes.push(parseInt(data[date]['5. volume'], 10));
    }

    const result: Record<string, Statistics> = {};
    for (const week in weeklyGroups) {
        const { closes, volumes } = weeklyGroups[week];
        const avgClose = closes.reduce((sum, v) => sum + v, 0) / closes.length;
        const avgVolume = volumes.reduce((sum, v) => sum + v, 0) / volumes.length;

        result[week] = {
            averageClose: parseFloat(avgClose.toFixed(4)),
            averageVolume: Math.round(avgVolume),
        };
    }

    return result;
}

function groupByBiWeek(data: DailyData): Record<string, Statistics> {
    const sortedDates = Object.keys(data).sort(); // 日期排序（從舊到新）
    const biWeekGroups: Record<string, { closes: number[]; volumes: number[] }> = {};

    for (const date of sortedDates) {
        const d = parseISO(date);
        const weekStart = startOfWeek(d, { weekStartsOn: 1 });
        const biWeekStart = startOfWeek(addWeeks(weekStart, -((weekStart.getDate() % 14) < 7 ? 0 : 1)), { weekStartsOn: 1 });
        const biWeekKey = formatISO(biWeekStart, { representation: 'date' });

        if (!biWeekGroups[biWeekKey]) {
            biWeekGroups[biWeekKey] = { closes: [], volumes: [] };
        }

        biWeekGroups[biWeekKey].closes.push(parseFloat(data[date]['4. close']));
        biWeekGroups[biWeekKey].volumes.push(parseInt(data[date]['5. volume'], 10));
    }

    const result: Record<string, Statistics> = {};
    for (const period in biWeekGroups) {
        const { closes, volumes } = biWeekGroups[period];
        const avgClose = closes.reduce((sum, v) => sum + v, 0) / closes.length;
        const avgVolume = volumes.reduce((sum, v) => sum + v, 0) / volumes.length;

        result[period] = {
            averageClose: parseFloat(avgClose.toFixed(4)),
            averageVolume: Math.round(avgVolume),
        };
    }

    return result;
}

function calculateWeeklyGrowth(stats: Record<string, Statistics>): Record<string, Statistics> {
    const sortedWeeks = Object.keys(stats).sort(); // 日期排序（從舊到新）

    for (let i = 1; i < sortedWeeks.length; i++) {
        const currentKey = sortedWeeks[i];
        const prevKey = sortedWeeks[i - 1];

        const current = stats[currentKey];
        const prev = stats[prevKey];

        if (prev.averageClose !== 0) {
            current.closeGrowthRate = parseFloat((((current.averageClose - prev.averageClose) / prev.averageClose) * 100).toFixed(2));
        }
        if (prev.averageVolume !== 0) {
            current.volumeGrowthRate = parseFloat((((current.averageVolume - prev.averageVolume) / prev.averageVolume) * 100).toFixed(2));
        }
    }

    return stats;
}

function toArrayWithDate<T>(map: Record<string, T>): (T & { date: string })[] {
    return Object.entries(map)
        .map(([date, data]) => ({
            ...data,
            date,
        }))
        .sort((a, b) => a.date.localeCompare(b.date)); // 可選：依照日期排序
}

fetchData().then(data => {
    for (const key in data) {
        const filename = `${key}.json`;
        const filePath = `public/data/${filename}`;
        const jsonData = JSON.stringify(data[key], null, 2);

        fs.writeFile(filePath, jsonData, (err) => {
            if (err) {
                console.error(`Failed to write file ${filename}:`, err);
            } else {
                console.log(`Successfully wrote file ${filename}`);
            }
        });
    }
});
