import React from 'react'
import { Box, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { Link } from 'react-router-dom'
import { ROUTING_PATH } from '../../constants/endpoints'

interface DashBoardLayoutProps {
  children: React.ReactNode
}

const DashBoardLayout: React.FC<DashBoardLayoutProps> = ({ children }) => {
  return (
    <Box display="flex" height="">
      <Box
        component="nav"
        sx={{
          backgroundColor: '#686D76',
          color: 'white',
        }}
      >
        <List>
          <ListItem>
            <ListItemButton component={Link} to={ROUTING_PATH.MANAGERS_HOME}>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component={Link} to={ROUTING_PATH.MANAGERS_MOVIE}>
              <ListItemText primary="Movie" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component={Link} to={ROUTING_PATH.MANAGERS_SHOW}>
              <ListItemText primary="Show" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component={Link} to={ROUTING_PATH.MANAGERS_SEAT}>
              <ListItemText primary="Seat" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component={Link} to={ROUTING_PATH.MANAGERS_TICKET}>
              <ListItemText primary="Ticket" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component={Link} to={ROUTING_PATH.MANAGERS_STAFF}>
              <ListItemText primary="Staff" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component={Link} to={ROUTING_PATH.MANAGERS_MEMBER}>
              <ListItemText primary="Member" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
    </Box>
  );
}



export default DashBoardLayout