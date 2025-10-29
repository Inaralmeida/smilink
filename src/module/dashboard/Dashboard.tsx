import { Box, Grid, Typography, useTheme } from "@mui/material";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dashboardMock } from "../../service/mock/dashboardMock";

const mockData = [
  { name: "Agosto", Realizadas: 40, Canceladas: 10, Faltas: 5 },
  { name: "Setembro", Realizadas: 50, Canceladas: 8, Faltas: 7 },
  { name: "Outubro", Realizadas: 70, Canceladas: 15, Faltas: 3 },
];

const pieData = [
  { name: "Realizadas", value: 70 },
  { name: "Canceladas", value: 20 },
  { name: "Faltas", value: 10 },
];

const Dashboard = ({
  role,
}: {
  role: "paciente" | "admin" | "profissional";
}) => {
  const theme = useTheme();
  const section = dashboardMock.find((s) => s.role === role);

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.warning.dark,
    theme.palette.error.main,
    theme.palette.success.main,
  ];

  if (!section) return <Typography>Role não encontrada</Typography>;

  return (
    <Grid container spacing={2}>
      {section.items.map((item) => (
        <Grid key={item.id} size={{ xs: 12, sm: 12, md: 6 }}>
          <Box
            sx={{ width: "100%", padding: "16px", backgroundColor: "white" }}
          >
            <Typography variant="h6" gutterBottom color="text.primary">
              {item.name}
            </Typography>

            {item.chart === "line" && (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={item.mockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {item.metrics.map((metric) => (
                    <Line
                      key={metric.dataKey}
                      type={
                        metric.type as
                          | "monotone"
                          | "linear"
                          | "step"
                          | undefined
                      }
                      dataKey={metric.dataKey}
                      stroke={metric.stroke}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}

            {item.chart === "bar" && (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Realizadas" fill={theme.palette.primary.dark} />
                  <Bar dataKey="Canceladas" fill={theme.palette.error.main} />
                  <Bar dataKey="Faltas" fill={theme.palette.warning.dark} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {item.chart === "area" && (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="Realizadas"
                    stroke={theme.palette.primary.main}
                    fill={theme.palette.primary.light}
                  />
                  <Area
                    type="monotone"
                    dataKey="Canceladas"
                    stroke={theme.palette.error.main}
                    fill={theme.palette.error.light}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}

            {item.chart === "pie" && (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Tooltip />
                  <Legend />
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default Dashboard;
