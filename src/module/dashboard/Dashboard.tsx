import { Grid, Paper, Typography, useTheme } from "@mui/material";
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
  { name: "Jan", realizadas: 40, canceladas: 10, faltas: 5 },
  { name: "Fev", realizadas: 50, canceladas: 8, faltas: 7 },
  { name: "Mar", realizadas: 70, canceladas: 15, faltas: 3 },
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
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.success.main,
  ];

  if (!section) return <Typography>Role não encontrada</Typography>;

  return (
    <Grid container spacing={2}>
      {section.items.map((item) => (
        <Grid item xs={12} md={6} lg={4} key={item.id}>
          <Paper elevation={3} style={{ padding: 16 }}>
            <Typography variant="h6" gutterBottom color="text.primary">
              {item.name}
            </Typography>

            {item.chart === "line" && (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="realizadas"
                    stroke={theme.palette.primary.main}
                  />
                  <Line
                    type="monotone"
                    dataKey="canceladas"
                    stroke={theme.palette.error.main}
                  />
                  <Line
                    type="monotone"
                    dataKey="faltas"
                    stroke={theme.palette.warning.main}
                  />
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
                  <Bar dataKey="realizadas" fill={theme.palette.primary.main} />
                  <Bar dataKey="canceladas" fill={theme.palette.error.main} />
                  <Bar dataKey="faltas" fill={theme.palette.warning.main} />
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
                    dataKey="realizadas"
                    stroke={theme.palette.primary.main}
                    fill={theme.palette.primary.light}
                  />
                  <Area
                    type="monotone"
                    dataKey="canceladas"
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
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default Dashboard;
