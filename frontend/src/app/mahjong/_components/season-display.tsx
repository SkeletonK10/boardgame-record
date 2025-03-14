"use client";
import { Box, Grid2 as Grid, Typography } from "@mui/material";
import { MahjongSeasonDto } from "@/types/mahjong";

interface SeasonDisplayProps {
  season?: MahjongSeasonDto;
}

export default function SeasonDisplay({ season }: SeasonDisplayProps) {
  return season ? (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
        {`시즌 ${season.season}`}
      </Typography>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography
            variant="body1"
            gutterBottom
            sx={{ textAlign: { xs: "center", sm: "right" } }}
          >
            {new Date(season.startDate).toLocaleString()}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography
            variant="body1"
            sx={{ textAlign: { xs: "center", sm: "left" } }}
          >
            {`~ ${new Date(season.endDate).toLocaleString()}`}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  ) : (
    <></>
  );
}
