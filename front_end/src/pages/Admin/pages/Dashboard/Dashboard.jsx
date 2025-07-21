import React, { useEffect, useState } from "react";
import {
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
} from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import orderApi from "../../../../apis/order";
import { formatCurrency } from "../../../../common";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CancelIcon from "@mui/icons-material/Cancel";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [revenueData, setRevenueData] = useState([]);
  const [displayType, setDisplayType] = useState("daily");
  const [statistics, setStatistics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
  });

  useEffect(() => {
    fetchData(displayType);
  }, [displayType]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await orderApi.getStatistics();
      setStatistics(response.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const fetchData = async (type) => {
    let fetchFunction;
    switch (type) {
      case "daily":
        fetchFunction = orderApi.getSale;
        break;
      case "monthly":
        fetchFunction = orderApi.getMonthlyRevenue;
        break;
      case "annual":
        fetchFunction = orderApi.getAnnualRevenue;
        break;
      default:
        fetchFunction = orderApi.getSale;
        break;
    }

    try {
      const response = await fetchFunction();
      if (response.data) {
        const data = response.data.map((item) => ({
          ...item,
          totalRevenue: parseFloat(item.totalRevenue),
        }));
        setRevenueData(data);
      }
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    }
  };

  const handleDisplayTypeChange = (event) => {
    setDisplayType(event.target.value);
  };

  const chartData = {
    labels: revenueData.map((item) => item.date || item.month || item.year),
    datasets: [
      {
        label: "Doanh thu",
        data: revenueData.map((item) => item.totalRevenue),
        backgroundColor: "rgba(76, 175, 80, 0.6)",
        borderColor: "#4caf50",
        borderWidth: 1,
      },
    ],
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card
      sx={{
        height: "100%",
        backgroundColor: color,
        color: "#fff",
        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
        borderRadius: 2,
        transition: "transform 0.3s",
        "&:hover": { transform: "translateY(-5px)" },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              {title}
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {value}
            </Typography>
          </Box>
          <Box sx={{ fontSize: 50, opacity: 0.3 }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 4, backgroundColor: "#fdfdfd", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight={700} gutterBottom color="#333">
        Thống kê bán hàng
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tổng doanh thu"
            value={formatCurrency(statistics.totalRevenue) + " đ"}
            color="#4caf50"
            icon={<AttachMoneyIcon fontSize="inherit" />}
          />
        </Grid>

{/*         <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tổng đơn hàng"
            value={statistics.totalOrders}
            color="#2196f3"
            icon={<ShoppingCartIcon fontSize="inherit" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Đơn hàng đã giao"
            value={statistics.deliveredOrders}
            color="#ff9800"
            icon={<LocalShippingIcon fontSize="inherit" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Đơn hàng đã huỷ"
            value={statistics.cancelledOrders}
            color="#f44336"
            icon={<CancelIcon fontSize="inherit" />}
          />
        </Grid> */}
      </Grid>

      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          backgroundColor: "#fff",
          height: 400,
          width: "100%",
          maxWidth: "100%",
          overflowX: "auto",
        }}
        elevation={3}
      >
        <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-start" }}>
          <FormControl sx={{ minWidth: 220 }}>
            <InputLabel id="display-type-label">Hiển thị theo</InputLabel>
            <Select
              labelId="display-type-label"
              value={displayType}
              onChange={handleDisplayTypeChange}
              label="Hiển thị theo"
              size="small"
            >
              <MenuItem value="daily">Ngày</MenuItem>
              <MenuItem value="monthly">Tháng</MenuItem>
              <MenuItem value="annual">Năm</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {chartData.labels.length > 0 ? (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              animation: { duration: 0 },
              plugins: {
                legend: {
                  position: "top",
                  labels: { font: { size: 14 }, color: "#555" },
                },
                title: {
                  display: true,
                  text: "Biểu đồ doanh thu",
                  font: { size: 18, weight: "bold" },
                  color: "#333",
                },
                tooltip: {
                  mode: "index",
                  intersect: false,
                },
              },
              scales: {
                x: {
                  ticks: { color: "#666", font: { size: 13 } },
                  grid: { display: false },
                },
                y: {
                  ticks: {
                    color: "#666",
                    font: { size: 13 },
                    callback: (value) => formatCurrency(value) + " đ",
                  },
                  grid: { color: "#eee" },
                },
              },
              interaction: {
                mode: "nearest",
                axis: "x",
                intersect: false,
              },
            }}
            height={350}
          />
        ) : (
          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            sx={{ mt: 6 }}
          >
            Không có dữ liệu cho giai đoạn đã chọn
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
