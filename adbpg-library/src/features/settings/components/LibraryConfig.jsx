// client/settings/LibraryConfig.jsx
import React, {useEffect, useState} from 'react'
import { Box, Paper, Typography, TextField, Button } from '@mui/material'
import { getSettings, saveSettings } from '../api/settingsApi'

export default function LibraryConfig(){
  const [cfg, setCfg] = useState({hours:'Mon-Fri 9:00-17:00', fineRate:0.5, loanPeriod:14})
  useEffect(()=>{ getSettings().then(r=>setCfg(r)).catch(()=>{}) },[])

  function save(){ saveSettings(cfg).then(()=>alert('Saved')).catch(()=>alert('Error')) }

  return (
    <Box sx={{p:3}}>
      <Typography variant="h5" mb={2}>Library Configuration</Typography>
      <Paper sx={{p:2, maxWidth:600}}>
        <TextField fullWidth label="Library Hours" value={cfg.hours} onChange={e=>setCfg({...cfg,hours:e.target.value})} sx={{mb:2}} />
        <TextField fullWidth label="Fine Rate (per day)" type="number" value={cfg.fineRate} onChange={e=>setCfg({...cfg,fineRate:Number(e.target.value)})} sx={{mb:2}} />
        <TextField fullWidth label="Default Loan Period (days)" type="number" value={cfg.loanPeriod} onChange={e=>setCfg({...cfg,loanPeriod:Number(e.target.value)})} sx={{mb:2}} />
        <Box sx={{display:'flex', gap:1}}>
          <Button variant="contained" onClick={save}>Save Changes</Button>
          <Button variant="outlined" onClick={()=>getSettings().then(r=>setCfg(r)).catch(()=>{})}>Reset</Button>
        </Box>
      </Paper>
    </Box>
  )
}
