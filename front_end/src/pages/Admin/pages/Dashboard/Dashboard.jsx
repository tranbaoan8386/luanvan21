import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper
} from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import orderApi from "../../../../apis/order";
import { formatCurrency } from "../../../../common";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CancelIcon from '@mui/icons-material/Cancel';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
    cancelledOrders: 0
  });

  useEffect(() => {
    fetchData(displayType);
    fetchStatistics();
  }, [displayType]);

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
          totalRevenue: parseFloat(item.totalRevenue)
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
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true
      }
    ]
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%', backgroundColor: color }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" component="div" color="white">
              {title}
            </Typography>
            <Typography variant="h4" component="div" color="white">
              {value}
            </Typography>
          </Box>
          {icon}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Thống kê bán hàng
      </Typography>

      {/* <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tổng doanh thu"
            value={formatCurrency(statistics.totalRevenue) + "đ"}
            color="#4CAF50"
          />
        </Grid>
      </Grid> */}

      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Hiển thị theo</InputLabel>
            <Select value={displayType} onChange={handleDisplayTypeChange}>
              <MenuItem value="daily">Ngày</MenuItem>
              <MenuItem value="monthly">Tháng</MenuItem>
              <MenuItem value="annual">Năm</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {chartData.labels.length > 0 ? (
          <Line 
            data={chartData} 
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Biểu đồ doanh thu'
                }
              }
            }}
          />
        ) : (
          <Typography variant="body1" color="text.secondary" align="center">
            Không có dữ liệu cho giai đoạn đã chọn
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
