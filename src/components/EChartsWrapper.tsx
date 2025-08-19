"use client";

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface EChartsWrapperProps {
  option: echarts.EChartsOption;
  style?: React.CSSProperties;
  className?: string;
}

const EChartsWrapper: React.FC<EChartsWrapperProps> = ({ 
  option, 
  style = { height: '400px', width: '100%' }, 
  className = '' 
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Initialize chart
      chartInstance.current = echarts.init(chartRef.current);
      
      // Set chart option
      chartInstance.current.setOption(option);

      // Handle resize
      const handleResize = () => {
        chartInstance.current?.resize();
      };
      
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chartInstance.current?.dispose();
      };
    }
  }, []);

  useEffect(() => {
    // Update chart when option changes
    if (chartInstance.current) {
      chartInstance.current.setOption(option, true);
    }
  }, [option]);

  return <div ref={chartRef} style={style} className={className} />;
};

export default EChartsWrapper;
