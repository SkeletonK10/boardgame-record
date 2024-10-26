"use client";
import {
  Autocomplete,
  FormControl,
  FormControlLabel,
  Grid2 as Grid,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { MahjongPlayersDto } from "@/types/mahjong";
import { MahjongYakumanValues } from "@/lib/constants/mahjong";

class YakumanEntryProps {
  players!: MahjongPlayersDto[];
  idx!: number;
}

export function YakumanEntry({ players, idx }: YakumanEntryProps) {
  const [isTsumo, setIsTsumo] = useState(true);
  const [wonYakuman, setWonYakuman] = useState<string[]>([]);
  return (
    <Paper variant="outlined" sx={{ padding: "0.5rem", width: "80%" }}>
      <Grid container spacing={1}>
        <Grid size={12}>
          <Typography>{`역만 #${idx + 1}`}</Typography>
        </Grid>
        <Grid size={12}>
          <RadioGroup
            row
            defaultValue="쯔모"
            name={`yakuman-${idx}-tsumo`}
            onChange={(e, v) => {
              setIsTsumo(v === "쯔모");
            }}
          >
            <FormControlLabel
              key="쯔모"
              value="쯔모"
              control={<Radio />}
              label="쯔모"
            />
            <FormControlLabel
              key="론"
              value="론"
              control={<Radio />}
              label="론"
            />
          </RadioGroup>
        </Grid>
        <Grid size={12}>
          <FormControl fullWidth>
            <TextField
              type="text"
              name={`yakuman-${idx}-round`}
              label="해당 국"
              placeholder="'동 1국 0본장' 형식"
            ></TextField>
          </FormControl>
        </Grid>
        <Grid size={6}>
          <FormControl fullWidth>
            <Autocomplete
              freeSolo
              autoHighlight
              autoComplete
              options={players.map(({ playerName }) => {
                return {
                  label: playerName,
                  value: playerName,
                };
              })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name={`yakuman-${idx}-winner`}
                  label={`화료자`}
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid size={6}>
          <FormControl fullWidth>
            <Autocomplete
              freeSolo
              autoHighlight
              autoComplete
              disabled={isTsumo}
              key={isTsumo.toString()} // to re-render when isTsumo changes
              options={players.map(({ playerName }) => {
                return {
                  label: playerName,
                  value: playerName,
                };
              })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name={`yakuman-${idx}-opponent`}
                  label={`방총자`}
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid size={12}>
          <FormControl fullWidth>
            <Autocomplete
              multiple
              autoHighlight
              autoComplete
              onChange={(e, v) => setWonYakuman(v)}
              options={MahjongYakumanValues}
              renderInput={(params) => (
                <TextField {...params} label="화료한 역만" />
              )}
            />
          </FormControl>
        </Grid>
        <FormControl>
          <input
            type="hidden"
            name={`yakuman-${idx}-yakuman`}
            value={wonYakuman}
          />
        </FormControl>
      </Grid>
    </Paper>
  );
}
