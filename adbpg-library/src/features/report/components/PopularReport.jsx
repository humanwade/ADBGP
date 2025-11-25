import React, { useEffect, useState } from 'react'
import { Paper, Typography, List, ListItem, ListItemText, Divider } from '@mui/material'
import { getPopular } from '../api/reportApi'

export default function PopularReport() {
  const [list, setList] = useState([])

  useEffect(() => {
    getPopular()
      .then(data => {
        if (Array.isArray(data)) {
          setList(data)
        } else {
          console.warn("Popular books data is not an array:", data)
          setList([])
        }
      })
      .catch(() => setList([]))
  }, [])

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>Top Popular Books</Typography>
      <List dense>
        {Array.isArray(list) && list.map((p, i) => (
          <React.Fragment key={p.bookId || i}>
            <ListItem>
              <ListItemText 
                primary={`${i + 1}. ${p.title}`} 
                secondary={`${p.count} times borrowed`} 
              />
            </ListItem>
            {i < list.length - 1 && <Divider />}
          </React.Fragment>
        ))}

        {(!Array.isArray(list) || list.length === 0) && (
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
            No data available
          </Typography>
        )}
      </List>
    </Paper>
  )
}