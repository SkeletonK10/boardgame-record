"use client";

import { text } from "@/lib/data";
import { AccountCircle, ChevronLeft, Menu } from "@mui/icons-material";
import {
  AppBar as MuiAppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  Drawer,
  styled,
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItem,
  List,
  ListItemText,
} from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const drawerWidth = 275;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "center",
}));

export default function AppBar() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const menuList = [
    { name: `메인 페이지`, url: `/` },
    { name: `마작 저장소`, url: `/mahjong` },
    { name: `테스트(메인 페이지)`, url: `/` },
  ]
  return (
    <Box sx={{ flexGrow: 1 }}>
      <MuiAppBar position="fixed">
        <Toolbar>
          <IconButton
            onClick={() => setOpen(true)}
            size="large"
            color="inherit"
          >
            <Menu />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            onClick={() => router.push("/")}
            sx={{
              display: { sm: "block" },
              userSelect: "none",
              cursor: "pointer",
            }}
          >
            {text.main.title}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { md: "flex" } }}>
            {session ? (
              <Toolbar component="div">
                <IconButton
                  size="large"
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Typography
                  noWrap
                  component="div"
                  onClick={() => {
                    signOut();
                    router.refresh();
                  }}
                  sx={{
                    padding: '0.5rem',
                    userSelect: "none",
                    cursor: "pointer",
                  }}
                >
                로그아웃
                </Typography>
              </Toolbar>
            ) : (
              <Toolbar component="div">
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  onClick={() => router.push("/api/auth/signin")}
                    sx={{
                    padding: '0.5rem',
                    userSelect: "none",
                    cursor: "pointer",
                  }}
                >
                로그인
                </Typography>
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  onClick={() => router.push("/api/auth/register")}
                  sx={{
                    padding: '0.5rem',
                    userSelect: "none",
                    cursor: "pointer",
                  }}
                >
                회원가입
                </Typography>
              </Toolbar>
            )}
          </Box>
        </Toolbar>
      </MuiAppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={() => setOpen(false)} size="large">
            <ChevronLeft />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuList.map(({ name, url }, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => {
                router.push(url);
                setOpen(false);
              }}>
                <ListItemIcon>
                  <Menu />
                </ListItemIcon>
                <ListItemText>{name}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
