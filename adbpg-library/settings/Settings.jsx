import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";

export default function Settings() {
  const [libraryName, setLibraryName] = useState("My Library");
  const [maxLoans, setMaxLoans] = useState(5);

  const saveSettings = () => {
    // Bạn có thể POST lên backend sau này
    console.log("Saved settings:", { libraryName, maxLoans });
    alert("Settings saved!");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 500 }}>
        <TextField
          fullWidth
          label="Library Name"
          value={libraryName}
          onChange={(e) => setLibraryName(e.target.value)}
          sx={{ mb: 3 }}
        />

        <TextField
          fullWidth
          type="number"
          label="Maximum Books Per Patron"
          value={maxLoans}
          onChange={(e) => setMaxLoans(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Button variant="contained" onClick={saveSettings}>
          Save Settings
        </Button>
      </Paper>
    </Box>
  );
}
