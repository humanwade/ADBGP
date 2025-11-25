import React, { useEffect, useState } from "react";
import { Paper, Table, TableHead, TableRow, TableCell, TableBody, Typography, Box } from "@mui/material";
import { getStats } from "../api/reportApi";

export default function ReportStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getStats()
      .then(data => setStats(data))
      .catch(() => setStats(null));
  }, []);

  if (!stats) return <Typography>Loading stats...</Typography>;

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>System Statistics</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Metric</TableCell>
            <TableCell align="right">Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Total Books</TableCell>
            <TableCell align="right">{stats.totalBooks || stats.books}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Patrons</TableCell>
            <TableCell align="right">{stats.totalPatrons || stats.patrons}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Active Loans</TableCell>
            <TableCell align="right">{stats.activeLoans || stats.loans}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Overdue Loans</TableCell>
            <TableCell align="right" sx={{ color: 'error.main', fontWeight: 'bold' }}>
              {stats.overdueLoans || stats.overdue}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
}