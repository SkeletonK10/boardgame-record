"use client";
import { Grid2 as Grid, Paper, Typography } from "@mui/material";

interface MahjongPlayerCardProps {
  playerName: string;
  nickname: string;
  score: number;
  rank: number;
  ratingDiff: number;
}

const paperStyle = {
  backgroundColor: "#2F4F4F",
};

const style = { fontSize: "0.8rem", textAlign: "center" };

const ratingDiffStyle = (ratingDiff: number) => {
  let color = "#000000";
  if (ratingDiff > 0) color = "#4B8B3B";
  else if (ratingDiff < 0) color = "#8B0000";
  return {
    fontSize: "0.7rem",
    textAlign: "center",
    color,
  };
};

const backgroundStyle = (rank: number) => {
  let color = "#FFFFFF";
  if (rank === 1) color = "#FFD700";
  else if (rank === 2) color = "#C0C0C0";
  else if (rank === 3) color = "#CD7F32";
  return {
    fontSize: "0.7rem",
    textAlign: "center",
    backgroundColor: color,
  };
};

const formatRatingDiff = (ratingDiff: number) => {
  if (ratingDiff > 0) return "+" + ratingDiff.toString();
  else return ratingDiff.toString();
};

export default function PlayerCard({
  playerName,
  nickname,
  score,
  rank,
  ratingDiff,
}: MahjongPlayerCardProps) {
  return (
    <Paper sx={backgroundStyle(rank)}>
      <Grid container>
        <Grid size={12}>
          <Typography
            sx={style}
            noWrap
          >{`${nickname} (${playerName})`}</Typography>
        </Grid>
        <Grid size={6}>
          <Typography sx={style}>{score}</Typography>
        </Grid>
        <Grid size={6}>
          <Typography sx={ratingDiffStyle(ratingDiff)}>
            {formatRatingDiff(ratingDiff)}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
