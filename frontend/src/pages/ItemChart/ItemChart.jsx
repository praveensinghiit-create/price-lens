import React, { useState, useRef } from 'react';
import './ItemChart.css';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

// Chart data array
const data = [60,90,110,175,160,180,190,200,210];

// Available chart types
const chartTypes = [
  { value: 'line', label: 'Line' },
  { value: 'column', label: 'Column' },
  { value: 'area', label: 'Area' },
  { value: 'spline', label: 'Spline' },
  { value: 'bar', label: 'Bar' },
  { value: 'scatter', label: 'Scatter' }
];

const ItemChart = () => {
  const [chartType, setChartType] = useState('line');
  const chartComponentRef = useRef(null);

  const options = {
    chart: {
      type: chartType
    },
    title: {
      text: 'Trend Analysis'
    },
  xAxis: {
  title: { text: 'Time Period' }, // Or 'Month/Year', 'Reporting Period', etc.
  categories: [
    '2024/06',
    '2024/07',
    '2024/08',
    '2024/09',
    '2024/10',
    '2024/11',
    '2024/12',
    '2025/01',
    '2025/02',
    '2025/03',
    '2025/04'
  ]
},
    yAxis: {
      title: { text: 'Price (ZAR)' }
    },
    series: [{
      name: 'Year/Month',
      data
    }]
  };

  // PDF Export Handler
  const handleExportPDF = async () => {
    const chartDiv = chartComponentRef.current.container.current;
    try {
      const dataUrl = await toPng(chartDiv);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'a4'
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('analysis-report.pdf');
    } catch (err) {
      alert('Failed to export PDF');
      console.error(err);
    }
  };

  return (
    <div className='chart'>
      <div className="chart-type-selector" style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <label htmlFor="chartType">Chart Type: </label>
        <select
          id="chartType"
          value={chartType}
          onChange={e => setChartType(e.target.value)}
        >
          {chartTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
        <button onClick={handleExportPDF} className="export-button">
          Export PDF
        </button>
      </div>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartComponentRef}
      />
    </div>
  );
};

export default ItemChart;
