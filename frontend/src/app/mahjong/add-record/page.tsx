"use client";
import { text } from "@/lib/data";
import { Box, FormControl, FormLabel, TextField, Grid2 as Grid, Checkbox, FormControlLabel, Button, RadioGroup, Radio, Autocomplete } from "@mui/material";
import { useRouter } from "next/navigation";
import { createRecord, fetchPlayers } from "./actions";
import { useFormState } from "react-dom";
import { useSnackbar } from "notistack";
import { useEffect,  useState,  useTransition } from "react";
import { MahjongPlayersDto } from "./dto";

const initialState = {
  message: '',
}

export default function MahjongAddRecordPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [formState, formAction] = useFormState(createRecord, initialState);
  const [players, setPlayers] = useState<MahjongPlayersDto[]>([]);
  const [isPending, startTransition] = useTransition();
  
  const playerLabel = [['east', '동'], ['south', '남'], ['west', '서'], ['north', '북']];

  useEffect(() => {
    startTransition(async () => await setPlayers(await fetchPlayers()));
  }, []);
  useEffect(() => {
    if (formState.message === text.mahjong.addRecord.success) {
      enqueueSnackbar(formState.message, { variant: "success" });
      router.push(`/mahjong`);
    }
    else if (formState.message === text.mahjong.addRecord.error)
      enqueueSnackbar(formState.message, { variant: "error" });
      
  }, [formState]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h2>{text.mahjong.addRecord.title}</h2>
      <form action={formAction}>
        <Box sx={{
          width: 'min(500px, 80vw)',
          display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        }}>
          <FormControl>
            <RadioGroup
              row
              defaultValue="반장전"
              name="category"
            >
              <FormControlLabel value="동풍전" control={<Radio />} label="동풍전" />
              <FormControlLabel value="반장전" control={<Radio />} label="반장전" />
            </RadioGroup>
          </FormControl>
          {playerLabel.map(([enVal, krVal]) => (
            <Grid container key={enVal} sx={{ width: '80%' }}>
              <Grid size={5}>
                <FormControl sx={{ width: '100%' }}>
                  {/* TODO: 플레이어 로딩 보이게 하기? */}
                  <Autocomplete
                    freeSolo
                    options={players.map(({ playerName }) => {
                      return {
                        label: playerName,
                        value: playerName,
                    }})}
                    renderInput=
                      {(params) => <TextField {...params} name={`${enVal}-player-name`} label={`${krVal} 이름`} />}
                    
                  />
                </FormControl>
              </Grid>
              <Grid size={5}>
                <FormControl sx={{ width: '100%' }}>
                  <TextField
                    type="text"
                    name={`${enVal}-score`}
                    label={`${krVal} 점수`}></TextField>
                </FormControl>
              </Grid>
              <Grid size={2}>
                <FormControlLabel
                  name={`${enVal}-is-guest`}
                  control={<Checkbox />}
                  label="신규"
                  labelPlacement="top"
                />
              </Grid>
            </Grid>
          ))}
        </Box>
        <Button variant="contained" type="submit" sx={{
          width: '100%',
          marginTop: '2rem',
        }}>기록</Button>
      </form>
    </Box>
  );
}
