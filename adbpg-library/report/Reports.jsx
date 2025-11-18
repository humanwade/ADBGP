import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import axios from "axios";

export default function Reports() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Gọi API (đặt tạm fake để chạy được)
    const fetchStats = async () => {
      try {
        // Nếu backend chưa có API, xài data mẫu
        const fakeData = {
          totalBooks: 52,
          totalPatrons: 11,
          activeLoans: 8,
          overdueLoans: 2
        };

        setStats(fakeData);

        // Nếu có backend thật → dùng dòng này:
        // const res = await axios.get("/api/reports");
        // setStats(res.data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchStats();
  }, []);

  if (!stats)
    return (
      <Typography sx={{ mt: 3, ml: 3 }} variant="h6">
        Loading reports...
      </Typography>
    );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>

      <Paper sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Report</TableCell>
              <TableCell align="right">Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Total Books</TableCell>
              <TableCell align="right">{stats.totalBooks}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total Patrons</TableCell>
              <TableCell align="right">{stats.totalPatrons}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Active Loans</TableCell>
              <TableCell align="right">{stats.activeLoans}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Overdue Loans</TableCell>
              <TableCell align="right">{stats.overdueLoans}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
