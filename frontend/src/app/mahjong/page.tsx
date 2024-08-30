"use client";
import {
  Box,
  Grid2 as Grid,
  List,
  ListItem,
  ListItemButton,
  styled,
  Typography,
} from "@mui/material";

const ListBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexGrow: 1,
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));

export default function MahjongMainPage() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <ListBox>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                display: { sm: "block" },
                userSelect: "none",
              }}
            >
              최근 기록
            </Typography>
            <List>
              {[
                {
                  east: { nickname: "참가자1", score: 73000 },
                  south: { nickname: "참가자2", score: -23000 },
                  west: { nickname: "참가자3", score: 25000 },
                  north: { nickname: "참가자4", score: 25000 },
                },
              ].map((value, index) => (
                <ListItem key={index}>
                  <ListItemButton>
                    <Grid container>
                      <Grid size={6}>
                        <Box>{value.east.nickname}</Box>
                        <Box>{value.east.score}</Box>
                      </Grid>
                      <Grid size={6}>
                        <Box>{value.south.nickname}</Box>
                        <Box>{value.south.score}</Box>
                      </Grid>
                      <Grid size={6}>
                        <Box>{value.west.nickname}</Box>
                        <Box>{value.west.score}</Box>
                      </Grid>
                      <Grid size={6}>
                        <Box>{value.north.nickname}</Box>
                        <Box>{value.north.score}</Box>
                      </Grid>
                    </Grid>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </ListBox>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>abcd</Grid>
      </Grid>
    </Box>
  );
}
