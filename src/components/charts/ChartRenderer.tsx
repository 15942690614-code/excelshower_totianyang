'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ChartConfig } from '@/types';

interface ChartRendererProps {
  data: any[];
  config: ChartConfig;
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({ data, config }) => {
  const getOption = () => {
    if (!data || data.length === 0) {
        return {
            title: { text: 'No Data Available' }
        };
    }
    
    const { type, xAxisField, yAxisField, title } = config;
    
    // Auto-detect fields if not provided
    const keys = Object.keys(data[0] || {});
    const xField = xAxisField || keys[0];
    
    // Better auto-detection for Y-axis (find first numeric field)
    let yField = yAxisField;
    if (!yField) {
        // Find first key that is not xField and looks like a number
        const numericKey = keys.find(k => k !== xField && !isNaN(Number(data[0][k])));
        yField = numericKey || keys[1] || keys[0];
    }

    const xData = data.map(item => item[xField]);
    const seriesData = data.map(item => {
        const val = item[yField];
        return isNaN(Number(val)) ? 0 : Number(val);
    });

    const baseOption = {
      title: {
        text: title,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: [yField],
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        data: xData
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: yField,
          type: type === 'heatmap' ? 'heatmap' : (type === 'radar' ? 'radar' : type), // Fallback
          data: seriesData,
          smooth: true // for line chart
        }
      ]
    };

    // Special handling for Heatmap
    if (type === 'heatmap') {
        // Heatmap requires specific data structure [x, y, value] and visualMap
        // Current data structure is just simple rows, which maps better to Bar/Line.
        // For a quick fix to avoid crash:
        // We will construct a dummy heatmap where X-axis is category, Y-axis is just one row (since we only have 1 series selected usually), and value is the data.
        
        return {
            ...baseOption,
            tooltip: { position: 'top' },
            grid: { height: '50%', top: '10%' },
            xAxis: { type: 'category', data: xData, splitArea: { show: true } },
            yAxis: { type: 'category', data: [yField], splitArea: { show: true } },
            visualMap: {
                min: Math.min(...seriesData as number[]),
                max: Math.max(...seriesData as number[]),
                calculable: true,
                orient: 'horizontal',
                left: 'center',
                bottom: '15%'
            },
            series: [{
                name: title,
                type: 'heatmap',
                data: seriesData.map((val, index) => [index, 0, val]), // [xIndex, yIndex, value]
                label: { show: true }
            }]
        };
    }

    if (type === 'pie') {
      return {
        ...baseOption,
        xAxis: undefined,
        yAxis: undefined,
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: title,
            type: 'pie',
            radius: '50%',
            data: data.map(item => ({
              name: item[xField],
              value: item[yField]
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
    }
    
    if (type === 'radar') {
         // Radar chart needs special data structure: indicators and series
         const maxVal = Math.max(...seriesData as number[]);
         return {
             ...baseOption,
             xAxis: undefined,
             yAxis: undefined,
             tooltip: {},
             radar: {
                 indicator: xData.map(name => ({ name, max: maxVal * 1.2 }))
             },
             series: [{
                 name: title,
                 type: 'radar',
                 data: [
                     {
                         value: seriesData,
                         name: yField
                     }
                 ]
             }]
         };
    }
    
    if (type === 'scatter') {
        return {
            ...baseOption,
            xAxis: { type: 'value' }, // Scatter usually needs numeric X
            series: [{
                symbolSize: 20,
                data: data.map(item => [item[xField], item[yField]]),
                type: 'scatter'
            }]
        }
    }

    return baseOption;
  };

  return (
    <Card className="w-full h-[500px]">
      <CardHeader>
        <CardTitle>{config.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ReactECharts
          option={getOption()}
          style={{ height: '400px', width: '100%' }}
          notMerge={true}
          lazyUpdate={true}
        />
      </CardContent>
    </Card>
  );
};
