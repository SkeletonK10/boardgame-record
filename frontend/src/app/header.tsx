'use client';

import { text } from '@/data';
import { AccountCircle } from '@mui/icons-material';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            onClick={() => router.push('/')}
            sx={{ display: { sm: 'block' }, userSelect: 'none', cursor: 'pointer' }}
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
      </AppBar>
    </Box>
  );
}
