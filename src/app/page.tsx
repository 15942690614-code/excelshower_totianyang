'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FileUploader } from '@/components/upload/FileUploader';
import { ChartRenderer } from '@/components/charts/ChartRenderer';
import { ChartControls } from '@/components/charts/ChartControls';
import { ParsedData, ChartConfig } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function Dashboard() {
  const [datasets, setDatasets] = useState<ParsedData[]>([]);
  const [selectedDatasetIndex, setSelectedDatasetIndex] = useState<number>(0);
  const [chartType, setChartType] = useState<ChartConfig['type']>('bar');
  
  const [xAxisField, setXAxisField] = useState<string>('');
  const [yAxisField, setYAxisField] = useState<string>('');
  const [aggregate, setAggregate] = useState<boolean>(true); // Default to true

  const handleDataParsed = (data: ParsedData[]) => {
    const validData = data.filter((d) => {
      // Check if rows are valid
      if (!d.rows || d.rows.length === 0) {
        console.warn('Parsed data has no rows:', d.fileName);
        return false;
      }
      return true;
    });

    if (validData.length > 0) {
      setDatasets(prev => [...prev, ...validData]);
    }
  };

  const currentDataset = datasets[selectedDatasetIndex];

  useEffect(() => {
    if (currentDataset) {
      const headers = currentDataset.headers || Object.keys(currentDataset.rows[0] || {});
      if (headers.length > 0) {
        setXAxisField(headers[0]);
        
        // Find first numeric column for Y
        const numericCol = headers.find(h => {
             const val = currentDataset.rows[0][h];
             return !isNaN(Number(val)) && h !== headers[0];
        });
        setYAxisField(numericCol || headers[1] || headers[0]);
      }
    }
  }, [currentDataset]);

  // Compute processed data based on aggregation settings
  const processedData = useMemo(() => {
      if (!currentDataset || !xAxisField || !yAxisField) return [];
      
      const rawRows = currentDataset.rows;

      if (!aggregate) {
          return rawRows;
      }

      // Aggregation Logic (Sum by X-Axis)
      const aggMap = new Map<string, number>();
      
      rawRows.forEach(row => {
          const xKey = String(row[xAxisField] || 'Unknown');
          const yVal = parseFloat(row[yAxisField]);
          
          if (!isNaN(yVal)) {
              const currentSum = aggMap.get(xKey) || 0;
              aggMap.set(xKey, currentSum + yVal);
          }
      });

      // Convert back to array
      return Array.from(aggMap.entries()).map(([x, y]) => ({
          [xAxisField]: x,
          [yAxisField]: y
      }));

  }, [currentDataset, xAxisField, yAxisField, aggregate]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          {datasets.length} files loaded
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Upload & Controls */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload Data</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploader onDataParsed={handleDataParsed} />
            </CardContent>
          </Card>

          {datasets.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Select File</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={selectedDatasetIndex}
                    onChange={(e) => setSelectedDatasetIndex(Number(e.target.value))}
                  >
                    {datasets.map((d, i) => (
                      <option key={i} value={i}>{d.fileName} ({d.fileType})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Chart Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['bar', 'line', 'pie', 'scatter', 'radar', 'heatmap'].map(t => (
                      <Button
                        key={t}
                        variant={chartType === t ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setChartType(t as any)}
                        className="capitalize"
                      >
                        {t}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <ChartControls
                    columns={currentDataset.headers}
                    xAxisField={xAxisField}
                    yAxisField={yAxisField}
                    aggregate={aggregate}
                    onXAxisChange={setXAxisField}
                    onYAxisChange={setYAxisField}
                    onAggregateChange={setAggregate}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Visualization & Preview */}
        <div className="lg:col-span-2 space-y-8">
          {currentDataset ? (
            <>
              <ChartRenderer
                data={processedData}
                config={{
                  type: chartType,
                  title: `${currentDataset.fileName} Analysis`,
                  xAxisField,
                  yAxisField
                }}
              />

              <Card>
                <CardHeader>
                  <CardTitle>Data Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          {currentDataset.headers.map((h, i) => (
                            <th key={i} className="px-4 py-2 text-left font-medium text-gray-700">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {currentDataset.rows.slice(0, 10).map((row, i) => (
                          <tr key={i} className="border-t hover:bg-gray-50">
                            {currentDataset.headers.map((h, j) => (
                              <td key={j} className="px-4 py-2">{String(row[h])}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="mt-2 text-xs text-gray-500 text-center">
                      Showing first 10 rows of {currentDataset.rows.length}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400 border-2 border-dashed rounded-lg min-h-[400px]">
              Upload a file to visualize data
            </div>
          )}
        </div>
      </div>
    </div>
  );
}