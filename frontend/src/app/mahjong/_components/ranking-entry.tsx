"use client";
import {
  Box,
  Grid2 as Grid,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { MahjongRankingRecord } from "../dto";

class MahjongRankingEntryProps extends MahjongRankingRecord {}

export function RankingEntry({
  playerName,
  nickname,
  rating,
  ranking,
}: MahjongRankingEntryProps) {
  const router = useRouter();
  return (
    <ListItem disableGutters>
      <ListItemButton
        disableGutters
        onClick={() => router.push(`/mahjong/player/${playerName}`)}
      >
        <Grid container spacing={1} sx={{ width: "100%" }}>
          <Grid size={2}>
            <Box>{ranking}</Box>
          </Grid>
          <Grid size={6}>
            <Typography component="div" noWrap>
              {`${nickname}`}
            </Typography>
          </Grid>
          <Grid size={4}>
            <Box>{rating}</Box>
          </Grid>
        </Grid>
      </ListItemButton>
    </ListItem>
  );
}
