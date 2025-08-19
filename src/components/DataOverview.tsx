"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  Name: string;
}

interface DataOverviewProps {
  loading: boolean;
  filteredData: StockData[];
  dateRange: string;
  aggregationType: string;
}

const DataOverview: React.FC<DataOverviewProps> = ({
  loading,
  filteredData,
  dateRange,
  aggregationType
}) => {
  const hasData = filteredData.length > 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Data Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : hasData ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Time Period</span>
              <span className="text-sm font-medium">
                {formatDate(filteredData[0]?.date)} to {formatDate(filteredData[filteredData.length - 1]?.date)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Data Points</span>
              <span className="text-sm font-medium">{filteredData.length.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Highest Price</span>
              <span className="text-sm font-medium">
                ${Math.max(...filteredData.map(d => d.high)).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Lowest Price</span>
              <span className="text-sm font-medium">
                ${Math.min(...filteredData.map(d => d.low)).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Showing</span>
              <span className="text-sm font-medium">
                {dateRange === 'all' ? 'All Data' : `Last ${dateRange}`} - {aggregationType}
              </span>
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default DataOverview;
