"use client";
import {
  Grid2 as Grid,
  ListItem,
  ListItemButton,
  Paper,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { MahjongGameRecord } from "@/dto/mahjong";

class MahjongRecordEntryProps extends MahjongGameRecord {}

export function RecordEntry({
  id,
  category,
  subcategory,
  players,
  note,
}: MahjongRecordEntryProps) {
  const router = useRouter();
  return (
    <ListItem>
      <ListItemButton>
        <Paper
          elevation={2}
          sx={{
            width: "100%",
            backgroundColor: note ? "#BBFFBB" : "#FFFFFF",
          }}
        >
          <Grid container spacing={1} sx={{ width: "100%" }}>
            <Grid size={12}>
              <Typography component="div" noWrap sx={{ fontSize: "0.8rem" }}>
                {`${category} ${subcategory}`}
              </Typography>
            </Grid>
            {players.map(({ playerName, nickname, score }) => (
              <Grid size={6} key={playerName} sx={{ padding: "0.3rem" }}>
                <Typography component="div" noWrap>
                  {nickname}
                </Typography>
                <Typography component="div">{score}</Typography>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </ListItemButton>
    </ListItem>
  );
}
