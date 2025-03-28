"use client";

import {
  Bar,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  TooltipFormatter,
  LabelFormatter,
} from "recharts";

interface ChartProps<T extends Record<string, unknown>> {
  data: T[];
  xAxisKey: keyof T & string;
  yAxisKey: keyof T & string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  height?: number;
}

export function BarChart<T extends Record<string, unknown>>({
  data,
  xAxisKey,
  yAxisKey,
  categories,
  colors = ["#2563eb"],
  valueFormatter = (value: number) => `${value}`,
  height = 400,
}: ChartProps<T>) {
  // Type assertion for the formatter functions to satisfy Recharts types
  const formatter: TooltipFormatter = (value) => [valueFormatter(Number(value)), yAxisKey.toString()];
  const labelFormatter: LabelFormatter = (label) => `${label}`;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey={xAxisKey}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={valueFormatter}
        />
        <Tooltip
          formatter={formatter}
          labelFormatter={labelFormatter}
          contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }}
        />
        <Legend />
        {categories.map((category, index) => (
          <Bar
            key={category}
            dataKey={category}
            fill={colors[index % colors.length]}
            radius={[4, 4, 0, 0]}
            barSize={40}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

export function LineChart<T extends Record<string, unknown>>({
  data,
  xAxisKey,
  yAxisKey,
  categories,
  colors = ["#2563eb"],
  valueFormatter = (value: number) => `${value}`,
  height = 400,
}: ChartProps<T>) {
  // Type assertion for the formatter functions to satisfy Recharts types
  const formatter: TooltipFormatter = (value) => [valueFormatter(Number(value)), yAxisKey.toString()];
  const labelFormatter: LabelFormatter = (label) => `${label}`;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey={xAxisKey}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={valueFormatter}
        />
        <Tooltip
          formatter={formatter}
          labelFormatter={labelFormatter}
          contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }}
        />
        <Legend />
        {categories.map((category, index) => (
          <Line
            key={category}
            type="monotone"
            dataKey={category}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
