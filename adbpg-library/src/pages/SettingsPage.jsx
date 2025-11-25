import React, { useState } from 'react'
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material'
import GeneralSettings from '../features/settings/components/GeneralSettings'
import LibraryConfig from '../features/settings/components/LibraryConfig'
import UserManagement from '../features/settings/components/UserManagement'

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default function SettingsPage() {
  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        System Administration
      </Typography>
      
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth" 
        >
          <Tab label="General Info" />
          <Tab label="Library Rules" />
          <Tab label="User Management" />
        </Tabs>
      </Paper>

      <TabPanel value={value} index={0}>
        <GeneralSettings />
      </TabPanel>
      
      <TabPanel value={value} index={1}>
        <LibraryConfig />
      </TabPanel>
      
      <TabPanel value={value} index={2}>
        <UserManagement />
      </TabPanel>
    </Box>
  )
}