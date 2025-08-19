"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StockSummaryProps {
  loading: boolean;
  startValue: number;
  totalValue: number;
  totalChange: number;
  hasData: boolean;
}

const StockSummary: React.FC<StockSummaryProps> = ({
  loading,
  startValue,
  totalValue,
  totalChange,
  hasData
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Stock Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : hasData ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Starting Price</span>
              <span className="font-semibold">${startValue.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current Price</span>
              <span className="font-semibold">${totalValue.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Change</span>
              <span className={`font-semibold ${totalChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalChange >= 0 ? '+' : ''}${totalChange.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Return</span>
              <span className={`font-semibold ${totalChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {((totalChange / startValue) * 100).toFixed(1)}%
              </span>
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default StockSummary;
