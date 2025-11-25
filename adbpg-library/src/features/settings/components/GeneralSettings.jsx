import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import { getSettings, saveSettings } from "../api/settingsApi";

export default function GeneralSettings() {
  const [form, setForm] = useState({
    libraryName: "My Library",
    maxLoans: 5
  });

  useEffect(() => {
    getSettings()
      .then((data) => {
        setForm((prev) => ({
          ...prev,
          ...data 
        }));
      })
      .catch((err) => console.error("Failed to load settings:", err));
  }, []);

  const handleSave = () => {
    saveSettings(form)
      .then(() => {
        alert("Settings saved successfully!");
      })
      .catch(() => {
        alert("Failed to save settings.");
      });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        General Settings
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 500 }}>
        <TextField
          fullWidth
          label="Library Name"
          value={form.libraryName}
          onChange={(e) => setForm({ ...form, libraryName: e.target.value })}
          sx={{ mb: 3 }}
        />

        <TextField
          fullWidth
          type="number"
          label="Maximum Books Per Patron"
          value={form.maxLoans}
          onChange={(e) => setForm({ ...form, maxLoans: e.target.value })}
          sx={{ mb: 3 }}
        />

        <Button variant="contained" onClick={handleSave}>
          Save Settings
        </Button>
      </Paper>
    </Box>
  );
}