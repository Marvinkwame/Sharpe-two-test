import  { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ExchangeRateType } from '../../types/country';

type Props = {
    data: ExchangeRateType & { provider?: string }; // Add provider as optional
};

type CurrencyData = {
    currency: string;
    rate: number;
    value: number;
    percent?: number;
};

type TooltipProps = {
    active?: boolean;
    payload?: {
        payload: CurrencyData;
    }[];
};

type LabelProps = {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    currency: string;
};

const ExchangeRatePieChart = ({ data }: Props) => {
    const [selectedCurrencies, setSelectedCurrencies] = useState([
        'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'KRW', 'BRL'
    ]);

    const pieData = useMemo(() => {
        if (!data || !data.rates) return [];

        const totalValue = selectedCurrencies.reduce((sum, currency) => {
            const rate = data.rates[currency] || 0;
            return sum + (rate ? (1 / rate) * 100 : 0);
        }, 0);

        const selectedRates = selectedCurrencies
            .map(currency => ({
                currency,
                rate: data.rates[currency] || 0,
                value: data.rates[currency] ? (1 / data.rates[currency]) * 100 : 0
            }))
            .filter(item => item.rate > 0)
            .sort((a, b) => b.value - a.value);

        return selectedRates.map(item => ({
            ...item,
            percent: totalValue > 0 ? (item.value / totalValue) * 100 : 0
        }));
    }, [data, selectedCurrencies]);

    const colors = [
        '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff7f',
        '#ff6347', '#4682b4', '#dda0dd', '#98fb98', '#f0e68c',
        '#ffb6c1', '#87ceeb', '#daa520', '#cd853f', '#40e0d0'
    ];

    const allCurrencies = data?.rates ? Object.keys(data.rates).filter(currency => currency !== 'USD') : [];

    const handleCurrencyToggle = (currency: string) => {
        setSelectedCurrencies(prev =>
            prev.includes(currency)
                ? prev.filter(c => c !== currency)
                : [...prev, currency]
        );
    };

    const CustomTooltip = ({ active, payload }: TooltipProps) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border rounded shadow-lg">
                    <p className="font-semibold">{`${data.currency}`}</p>
                    <p className="text-blue-600">{`Rate: ${data.rate.toFixed(4)} USD`}</p>
                    <p className="text-green-600">{`Strength: ${data.value.toFixed(2)}%`}</p>
                </div>
            );
        }
        return null;
    };

    const CustomLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        currency
    }: LabelProps) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize="12"
                fontWeight="bold"
            >
                {percent > 0.05 ? currency : ''}
            </text>
        );
    };

    if (!data || !data.rates) {
        return (
            <div className="w-full p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading exchange rate data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full p-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Currency Strength Distribution</h1>
                <p className="text-gray-600 mb-2">Base: {data.base} | Date: {data.date}</p>
                <p className="text-sm text-gray-500 mb-6">Pie chart shows relative currency strength (larger slice = stronger currency)</p>
                
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Select Currencies to Display:</h3>
                    <div className="flex flex-wrap gap-2">
                        {allCurrencies.slice(0, 30).map(currency => (
                            <button
                                key={currency}
                                onClick={() => handleCurrencyToggle(currency)}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                    selectedCurrencies.includes(currency)
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                {currency}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <ResponsiveContainer width="100%" height={500}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={(props: any) => (
                                    <CustomLabel 
                                        cx={props.cx}
                                        cy={props.cy}
                                        midAngle={props.midAngle}
                                        innerRadius={props.innerRadius}
                                        outerRadius={props.outerRadius}
                                        percent={props.percent}
                                        currency={props.payload?.currency || ''}
                                    />
                                )}
                                outerRadius={180}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend 
                                verticalAlign="bottom" 
                                height={36}
                                formatter={(_, entry: any) => `${entry.payload.currency} (${entry.payload.rate.toFixed(4)})`}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">Currency Strength Ranking</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-sm">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border p-2 text-left">Rank</th>
                                        <th className="border p-2 text-left">Currency</th>
                                        <th className="border p-2 text-right">Rate</th>
                                        <th className="border p-2 text-right">Strength %</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pieData.map((item, index) => (
                                        <tr key={item.currency} className="hover:bg-gray-50">
                                            <td className="border p-2 text-center font-medium">{index + 1}</td>
                                            <td className="border p-2 font-medium">{item.currency}</td>
                                            <td className="border p-2 text-right">{item.rate.toFixed(4)}</td>
                                            <td className="border p-2 text-right">
                                                <div className="flex items-center justify-end">
                                                    <div 
                                                        className="h-2 bg-blue-500 rounded mr-2"
                                                        style={{ width: `${(item.value / Math.max(...pieData.map(d => d.value))) * 100}%`, minWidth: '10px' }}
                                                    ></div>
                                                    {item.value.toFixed(2)}%
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">Data Information</h3>
                        <div className="space-y-3">
                            {data.provider && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Provider:</span>
                                    <span className="font-medium">{data.provider.replace('https://', '')}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-600">Base Currency:</span>
                                <span className="font-medium">{data.base}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Date:</span>
                                <span className="font-medium">{data.date}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Currencies:</span>
                                <span className="font-medium">{Object.keys(data.rates).length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Selected for Chart:</span>
                                <span className="font-medium">{selectedCurrencies.length}</span>
                            </div>
                        </div>
                        
                        <div className="mt-4 p-3 bg-blue-50 rounded">
                            <p className="text-sm text-blue-700">
                                <strong>Note:</strong> Currency strength is calculated as the inverse of the exchange rate. 
                                A stronger currency requires fewer units to equal 1 USD.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExchangeRatePieChart;