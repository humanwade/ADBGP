// client/user/Profile.jsx
import React, { useEffect, useState } from 'react'
import { Box, TextField, Button, Paper, Typography } from '@mui/material'
import { getProfile, updateProfile } from '../features/auth/api/authApi'

export default function Profile(){
  const [profile, setProfile] = useState(null)

  useEffect(()=>{ getProfile().then(r=>setProfile(r)).catch(()=>{}) },[])

  function save(){ updateProfile(profile).then(()=>alert('Saved')).catch(()=>alert('Error')) }

  if(!profile) return <div>Loading...</div>

  return (
    <Box sx={{p:3}}>
      <Typography variant="h5" mb={2}>Profile</Typography>
      <Paper sx={{p:2, maxWidth:600}}>
        <TextField fullWidth label="Name" value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})} sx={{mb:2}} />
        <TextField fullWidth label="Email" value={profile.email} disabled sx={{mb:2}} />
        <Box sx={{display:'flex', gap:1}}>
          <Button variant="contained" onClick={save}>Save</Button>
        </Box>
      </Paper>
    </Box>
  )
}
