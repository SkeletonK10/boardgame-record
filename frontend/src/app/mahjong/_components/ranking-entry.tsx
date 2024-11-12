"use client";
import {
  Box,
  Grid2 as Grid,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { MahjongCategory, MahjongRankingRecord } from "@/types/mahjong";
import { format } from "url";

interface MahjongRankingEntryProps extends MahjongRankingRecord {
  category?: MahjongCategory;
}

export default function RankingEntry({
  category,
  playerName,
  nickname,
  rating,
  ranking,
}: MahjongRankingEntryProps) {
  const pathname = `/mahjong/player/${playerName}`;
  category = category || "4마";
  const url = format({ pathname, query: { category } });
  const router = useRouter();
  return (
    <ListItem disableGutters>
      <ListItemButton disableGutters onClick={() => router.push(url)}>
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
