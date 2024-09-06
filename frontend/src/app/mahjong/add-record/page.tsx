"use client";
import { text } from "@/lib/data";
import { Box, FormControl, FormLabel, TextField, Grid2 as Grid, Checkbox, FormControlLabel, Button, RadioGroup, Radio } from "@mui/material";
import { useRouter } from "next/navigation";
import { createRecord } from "./actions";
import { useFormState } from "react-dom";
import { useSnackbar } from "notistack";
import { useEffect } from "react";

const initialState = {
  message: '',
}

export default function MahjongAddRecordPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [formState, formAction] = useFormState(createRecord, initialState);
  
  const playerLabel = [['east', '동'], ['south', '남'], ['west', '서'], ['north', '북']];
  
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
            <Grid container key={enVal}>
              <Grid size={5}>
                <FormControl>
                  <FormLabel>{krVal} 이름</FormLabel>
                  <TextField type="text" name={`${enVal}-player-name`}></TextField>
                </FormControl>
              </Grid>
              <Grid size={5}>
                <FormControl>
                  <FormLabel>{krVal} 점수</FormLabel>
                  <TextField type="text" name={`${enVal}-score`}></TextField>
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
