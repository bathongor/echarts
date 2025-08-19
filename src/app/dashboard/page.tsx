"use client";

import { useState, useEffect } from 'react';
import EChartsWrapper from '@/components/EChartsWrapper';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import * as echarts from 'echarts';
import Papa from 'papaparse';
import StockSummary from '@/components/StockSummary';
import DataOverview from '@/components/DataOverview';
import ChartActions from '@/components/ChartActions';

interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  Name: string;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function Dashboard() {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'all' | 'year' | 'quarter' | 'month'>('month');
  const [aggregationType, setAggregationType] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    loadStockData();
  }, []);

  const loadStockData = async () => {
    try {
      const response = await fetch('/stock_data/BA_data.csv');
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transform: (value, header) => {
          if (header === 'date') return value;
          if (header === 'Name') return value;
          return parseFloat(value);
        },
        complete: (results) => {
          const data = results.data as StockData[];
          setStockData(data);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Error loading stock data:', error);
      setLoading(false);
    }
  };

  const getFilteredData = (): StockData[] => {
    if (stockData.length === 0) return [];
    
    const sortedData = [...stockData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const latestDate = new Date(sortedData[sortedData.length - 1].date);
    
    let startDate: Date;
    switch (dateRange) {
      case 'month':
        startDate = new Date(latestDate);
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate = new Date(latestDate);
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case 'year':
        startDate = new Date(latestDate);
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        return sortedData;
    }
    
    return sortedData.filter(item => new Date(item.date) >= startDate);
  };

  const processLineChartData = () => {
    const filteredData = getFilteredData();
    if (filteredData.length === 0) return { dates: [], prices: [] };

    const dates: string[] = [];
    const prices: any[] = [];
    
    if (aggregationType === 'daily') {
      // Daily data
      filteredData.forEach((item, index) => {
        const prevClose = index > 0 ? filteredData[index - 1].close : item.open;
        const change = item.close - prevClose;
        const changePercent = ((change / prevClose) * 100);
        
        dates.push(formatDate(item.date));
        prices.push({
          value: item.close,
          open: item.open,
          close: item.close,
          volume: item.volume,
          change: change,
          changePercent: changePercent
        });
      });
    } else if (aggregationType === 'weekly') {
      // Group by weeks
      const weeklyData: { [key: string]: StockData[] } = {};
      
      filteredData.forEach(item => {
        const date = new Date(item.date);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];
        
        if (!weeklyData[weekKey]) {
          weeklyData[weekKey] = [];
        }
        weeklyData[weekKey].push(item);
      });

      const weeks = Object.keys(weeklyData).sort();

      weeks.forEach((week, index) => {
        const weekData = weeklyData[week].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const startPrice = weekData[0].open;
        const endPrice = weekData[weekData.length - 1].close;
        const totalVolume = weekData.reduce((sum, item) => sum + item.volume, 0);
        
        const prevWeekPrice = index > 0 ? prices[index - 1].close : startPrice;
        const change = endPrice - prevWeekPrice;
        const changePercent = ((change / prevWeekPrice) * 100);
        
        // Use the last date of the week, formatted as dd/mm/yyyy
        const lastDateOfWeek = weekData[weekData.length - 1].date;
        dates.push(formatDate(lastDateOfWeek));
        prices.push({
          value: endPrice,
          open: startPrice,
          close: endPrice,
          volume: totalVolume,
          change: change,
          changePercent: changePercent
        });
      });
    } else {
      // Monthly aggregation
      const monthlyData: { [key: string]: StockData[] } = {};
      
      filteredData.forEach(item => {
        const date = new Date(item.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = [];
        }
        monthlyData[monthKey].push(item);
      });

      const months = Object.keys(monthlyData).sort();

      months.forEach((month, index) => {
        const monthData = monthlyData[month].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const startPrice = monthData[0].open;
        const endPrice = monthData[monthData.length - 1].close;
        const totalVolume = monthData.reduce((sum, item) => sum + item.volume, 0);
        
        const prevMonthPrice = index > 0 ? prices[index - 1].close : startPrice;
        const change = endPrice - prevMonthPrice;
        const changePercent = ((change / prevMonthPrice) * 100);
        
        // Use the last date of the month, formatted as dd/mm/yyyy
        const lastDateOfMonth = monthData[monthData.length - 1].date;
        dates.push(formatDate(lastDateOfMonth));
        prices.push({
          value: endPrice,
          open: startPrice,
          close: endPrice,
          volume: totalVolume,
          change: change,
          changePercent: changePercent
        });
      });
    }

    return { dates, prices };
  };

  const lineChartData = processLineChartData();
  const filteredData = getFilteredData();
  const totalValue = filteredData.length > 0 ? filteredData[filteredData.length - 1].close : 0;
  const startValue = filteredData.length > 0 ? filteredData[0].open : 0;
  const totalChange = totalValue - startValue;

  const lineChartOption: echarts.EChartsOption = {
    title: {
      text: `Boeing (BA) ${aggregationType.charAt(0).toUpperCase() + aggregationType.slice(1)} Price Trend`,
      left: 'center',
      textStyle: {
        fontSize: 24,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        snap: true,
        animation: false,
        lineStyle: {
          color: '#999',
          width: 1,
          type: 'dashed'
        },
        label: {
          backgroundColor: '#FFFFFF'
        }
      },
      formatter: function(params: any) {
        const param = Array.isArray(params) ? params[0] : params;
        const data = param.data;
        const changeColor = data.change >= 0 ? '#10b981' : '#ef4444';
        const changeSign = data.change >= 0 ? '+' : '';
        
        return `
          <div style="text-align: left;">
            <strong>${param.axisValue}</strong><br/>
            <span style="color:${param.color}">●</span> Price: $${data.value.toFixed(2)}<br/>
            <span style="color:${changeColor}">●</span> Change: ${changeSign}$${data.change.toFixed(2)} (${changeSign}${data.changePercent.toFixed(2)}%)<br/>
            <span style="color:#8b5cf6">●</span> Volume: ${data.volume.toLocaleString()}
          </div>
        `;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: lineChartData.dates,
      axisLabel: {
        rotate: aggregationType === 'daily' ? 45 : 0,
        fontSize: aggregationType === 'daily' ? 10 : 12
      }
    },
    yAxis: {
      type: 'value',
      name: 'Price ($)',
      scale: true,
      axisLabel: {
        formatter: '${value}'
      },
      min: function(value: any) {
        return (value.min * 0.98).toFixed(0);
      },
      max: function(value: any) {
        return (value.max * 1.02).toFixed(0);
      }
    },
    dataZoom: lineChartData.dates.length > 30 ? [
      {
        type: 'slider',
        show: true,
        start: 70,
        end: 100,
        bottom: '2%'
      },
      {
        type: 'inside',
        start: 70,
        end: 100
      }
    ] : undefined,
    series: [
      {
        name: 'Price',
        type: 'line',
        data: lineChartData.prices,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6, // Always show symbols for better snapping
        lineStyle: {
          color: '#3b82f6',
          width: 3
        },
        itemStyle: {
          color: '#3b82f6'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(59, 130, 246, 0.3)'
              },
              {
                offset: 1,
                color: 'rgba(59, 130, 246, 0.05)'
              }
            ]
          }
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            color: '#FFFFFF',
            shadowBlur: 10,
            shadowColor: 'rgba(59, 130, 246, 0.6)'
          }
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Boeing (BA) Stock Analysis
              </h1>
              <p className="text-sm text-muted-foreground">
                Clean stock price line chart with trend analysis
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {!loading && filteredData.length > 0 && (
                <div className="text-right">
                  <div className="text-sm font-medium">
                    ${totalValue.toFixed(2)}
                  </div>
                  <div className={`text-xs ${totalChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalChange >= 0 ? '+' : ''}${totalChange.toFixed(2)} 
                    ({((totalChange / startValue) * 100).toFixed(1)}%)
                  </div>
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                {filteredData.length > 0 && (
                  `${formatDate(filteredData[0].date)} to ${formatDate(filteredData[filteredData.length - 1].date)}`
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-auto p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <div className="grid gap-6 lg:grid-cols-3 max-w-7xl mx-auto">
            {/* Chart Section */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Boeing Stock Price Chart
                    <span className="text-sm font-normal text-muted-foreground">
                      {loading ? 'Loading...' : `${aggregationType.charAt(0).toUpperCase() + aggregationType.slice(1)} Trend`}
                    </span>
                  </CardTitle>
                  <CardDescription className="mb-4">
                    {aggregationType.charAt(0).toUpperCase() + aggregationType.slice(1)} stock price trend over time
                  </CardDescription>
                  
                  {/* Controls */}
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Time Range:</span>
                      <div className="flex space-x-1">
                        {(['month', 'quarter', 'year', 'all'] as const).map((range) => (
                          <Button
                            key={range}
                            variant={dateRange === range ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setDateRange(range)}
                            className="text-xs"
                          >
                            {range === 'all' ? 'All Time' : `1 ${range.charAt(0).toUpperCase() + range.slice(1)}`}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Aggregation:</span>
                      <div className="flex space-x-1">
                        {(['daily', 'weekly', 'monthly'] as const).map((type) => (
                          <Button
                            key={type}
                            variant={aggregationType === type ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setAggregationType(type)}
                            className="text-xs"
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center h-[400px]">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <EChartsWrapper 
                      option={lineChartOption} 
                      style={{ height: '400px', width: '100%' }}
                      className="rounded-lg"
                    />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-6">
              <StockSummary
                loading={loading}
                startValue={startValue}
                totalValue={totalValue}
                totalChange={totalChange}
                hasData={filteredData.length > 0}
              />

              <DataOverview
                loading={loading}
                filteredData={filteredData}
                dateRange={dateRange}
                aggregationType={aggregationType}
              />

              <ChartActions onRefreshData={loadStockData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
