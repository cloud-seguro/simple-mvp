"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Area,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { BarChart3, LineChart as LineChartIcon } from "lucide-react";

interface CategoryData {
  name: string;
  score: number;
}

interface ScoreData {
  date: string;
  score: number | null;
}

interface DashboardChartsProps {
  type: "category" | "score";
  data: CategoryData[] | ScoreData[];
  title: string;
  description: string;
}

export function DashboardCharts({
  type,
  data,
  title,
  description,
}: DashboardChartsProps) {
  const chartConfig = {
    category: {
      label: "Categoría",
      color: "hsl(var(--chart-1))",
    },
    score: {
      label: "Puntuación",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {type === "category" ? (
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        ) : (
          <LineChartIcon className="h-4 w-4 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent>
        <div className="aspect-[4/3]">
          <ChartContainer config={chartConfig} className="w-full aspect-[4/3]">
            {type === "category" ? (
              <BarChart
                data={data as CategoryData[]}
                className="h-[240px]"
                accessibilityLayer
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis tickLine={false} tickMargin={10} axisLine={false} />
                <Bar dataKey="score" fill="var(--color-category)" radius={4} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
              </BarChart>
            ) : (
              <LineChart
                data={data as ScoreData[]}
                className="h-[240px]"
                accessibilityLayer
              >
                <CartesianGrid />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis tickLine={false} tickMargin={10} axisLine={false} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="var(--color-score)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  fill="var(--color-score)"
                  fillOpacity={0.1}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
              </LineChart>
            )}
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
