"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
  ResponsiveContainer,
  Tooltip,
  Legend,
  Text,
  Label,
  Cell,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LabelList,
} from "recharts";
import {
  BarChart3,
  LineChart as LineChartIcon,
  PieChartIcon,
  InfoIcon,
} from "lucide-react";

interface CategoryData {
  name: string;
  score: number;
  shortName?: string; // For abbreviated display
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

// Utility function to abbreviate category names
function abbreviateCategory(name: string): string {
  // Map for initial categories
  const initialCategoryMap: Record<string, string> = {
    "Políticas de Seguridad": "Políticas",
    "Identificación de Activos y Procesos": "Activos",
    "SGSI y Controles Básicos": "SGSI",
    "Formación y Cultura de Seguridad": "Formación",
    "Indicadores, Continuidad e Incidentes": "Indicadores",
  };

  // Map for advanced categories
  const advancedCategoryMap: Record<string, string> = {
    "Políticas, Normativas y Gobernanza": "Políticas",
    "Identificación de Activos y Gestión de Riesgos": "Activos",
    "Controles Técnicos y Protección de Infraestructura": "Controles",
    "Monitoreo, Auditoría y Respuesta a Incidentes": "Monitoreo",
    "Seguridad en Desarrollo y Aplicaciones": "Desarrollo",
    "Seguridad en Redes y Defensa Activa": "Redes",
    "Ingeniería Social y Resiliencia": "Ingeniería",
    "Gestión de Incidentes y Resiliencia": "Incidentes",
    "Continuidad del Negocio y Protección de la Información": "Continuidad",
  };

  // Check if we have a direct mapping
  if (initialCategoryMap[name]) {
    return initialCategoryMap[name];
  }

  if (advancedCategoryMap[name]) {
    return advancedCategoryMap[name];
  }

  // If no mapping, extract first words
  const words = name.split(" ");
  return words.slice(0, 2).join(" ");
}

// Custom tooltip formatter function
const formatTooltipValue = (value: any) => {
  return [`${value}%`, "Puntuación"];
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-2 rounded-md shadow-md">
        <p className="text-sm font-medium">{`${label || payload[0].name}`}</p>
        <p
          className="text-sm"
          style={{ color: "hsl(var(--chart-3))" }}
        >{`${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

export function DashboardCharts({
  type,
  data,
  title,
  description,
}: DashboardChartsProps) {
  // Process data with abbreviated names for category charts
  const processedData =
    type === "category"
      ? (data as CategoryData[]).map((item) => ({
          ...item,
          shortName: abbreviateCategory(item.name),
        }))
      : data;

  // Map of chart colors from our theme
  const chartColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  // Handle empty data
  const hasData = processedData && processedData.length > 0;
  const emptyMessage =
    type === "category"
      ? "No hay datos de categorías disponibles"
      : "No hay suficientes evaluaciones para mostrar evolución";

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {type === "category" ? (
          <PieChartIcon className="h-4 w-4 text-muted-foreground" />
        ) : (
          <LineChartIcon className="h-4 w-4 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        {!hasData ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <div className="w-full h-full">
            {type === "category" ? (
              <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                <RadarChart
                  data={processedData as CategoryData[]}
                  margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                >
                  <PolarGrid />
                  <PolarAngleAxis
                    dataKey="shortName"
                    tick={{
                      fill: "var(--foreground)",
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  />
                  <PolarRadiusAxis
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}`}
                    tick={{ fill: "var(--foreground)", fontSize: 10 }}
                    angle={90}
                  />
                  <Radar
                    name="Puntuación"
                    dataKey="score"
                    stroke={chartColors[2]}
                    fill={chartColors[2]}
                    fillOpacity={0.5}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                <LineChart
                  data={processedData as ScoreData[]}
                  margin={{
                    top: 20,
                    right: 15,
                    left: 10,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="score"
                    name="Puntuación"
                    stroke={chartColors[2]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    fill={chartColors[2]}
                    fillOpacity={0.1}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex items-center text-xs text-muted-foreground">
          <InfoIcon className="h-3 w-3 mr-1" />
          {type === "category"
            ? "Datos basados en su evaluación más reciente"
            : "Evolución basada en todas sus evaluaciones completadas"}
        </div>
      </CardFooter>
    </Card>
  );
}
