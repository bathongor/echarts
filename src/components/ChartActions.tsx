"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ChartActionsProps {
  onRefreshData: () => void;
}

const ChartActions: React.FC<ChartActionsProps> = ({ onRefreshData }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Chart Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start"
          onClick={() => window.open('/stock_data/BA_data.csv', '_blank')}
        >
          Download CSV Data
        </Button>
        <Button variant="outline" size="sm" className="w-full justify-start">
          Export Chart Image
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start"
          onClick={onRefreshData}
        >
          Refresh Data
        </Button>
      </CardContent>
    </Card>
  );
};

export default ChartActions;
