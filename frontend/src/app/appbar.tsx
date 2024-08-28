'use client';

import { text } from '@/data';
import { AccountCircle, ChevronLeft, Menu } from '@mui/icons-material';
import { AppBar as MuiAppBar, Box, IconButton, Toolbar, Typography, Drawer, styled, Divider, ListItemButton, ListItemIcon, ListItem, List, ListItemText } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const drawerWidth = 200;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'center',
}));

export default function AppBar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <MuiAppBar position='fixed'>
        <Toolbar>
          <IconButton
            onClick={() => setOpen(true)}
            size='large'
            color='inherit'
          >
            <Menu />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            onClick={() => router.push('/')}
            sx={{
              display: { sm: 'block' },
              userSelect: 'none',
              cursor: 'pointer',
            }}
          >
            {text.main.title}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { md: 'flex' } }}>
            <IconButton
              size='large'
              color='inherit'
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </MuiAppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={() => setOpen(false)} size='large'>
            <ChevronLeft />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {['테스트1', '테스트2', '테스트3'].map((value) => (
            <ListItem key={value} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Menu />
                </ListItemIcon>
                <ListItemText>
                  {value}
                </ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
