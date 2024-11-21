"use client";
import { Grid2 as Grid, Paper, Typography } from "@mui/material";

interface MahjongPlayerCardProps {
  playerName: string;
  nickname: string;
  score: number;
  ratingDiff: number;
}

const style = { fontSize: "0.8rem", textAlign: "center" };

const ratingDiffStyle = (ratingDiff: number) => {
  let color = "#000000";
  if (ratingDiff > 0) color = "#81C147"; // 194, 63, 56
  else if (ratingDiff < 0) color = "#C23F38";
  return {
    fontSize: "0.7rem",
    textAlign: "center",
    color,
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
  ratingDiff,
}: MahjongPlayerCardProps) {
  return (
    <Paper>
      <Grid container>
        <Grid size={12}>
          <Typography sx={style}>{`${nickname} (${playerName})`}</Typography>
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
