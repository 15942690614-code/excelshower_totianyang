import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';

interface ChartControlsProps {
  columns: string[];
  xAxisField: string;
  yAxisField: string;
  aggregate: boolean;
  onXAxisChange: (field: string) => void;
  onYAxisChange: (field: string) => void;
  onAggregateChange: (enabled: boolean) => void;
}

export const ChartControls: React.FC<ChartControlsProps> = ({
  columns,
  xAxisField,
  yAxisField,
  aggregate,
  onXAxisChange,
  onYAxisChange,
  onAggregateChange
}) => {
  if (!columns || columns.length === 0) return null;

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Dimension (X-Axis) Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Select Dimension (X-Axis)
            </label>
            <select
              value={xAxisField}
              onChange={(e) => onXAxisChange(e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {columns.map((col) => (
                <option key={`x-${col}`} value={col}>
                  {col}
                </option>
              ))}
            </select>
            <p className="text-[0.8rem] text-muted-foreground">
              Choose the category or time dimension for your chart.
            </p>
          </div>

          {/* Metric (Y-Axis) Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Select Metric (Y-Axis)
            </label>
            <select
              value={yAxisField}
              onChange={(e) => onYAxisChange(e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {columns.map((col) => (
                <option key={`y-${col}`} value={col}>
                  {col}
                </option>
              ))}
            </select>
            <p className="text-[0.8rem] text-muted-foreground">
              Choose the numerical value you want to measure.
            </p>
          </div>

          {/* Aggregation Toggle */}
          <div className="space-y-2 flex flex-col justify-start">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2">
              Aggregation (Sum)
            </label>
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="aggregate-toggle"
                    checked={aggregate}
                    onChange={(e) => onAggregateChange(e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="aggregate-toggle" className="text-sm font-medium leading-none cursor-pointer select-none">
                    Enable Sum Aggregation
                </label>
            </div>
             <p className="text-[0.8rem] text-muted-foreground mt-2">
              Combine values for the same X-Axis category.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
