"use client";
import { text } from "@/lib/data";
import {
  Box,
  FormControl,
  TextField,
  Grid2 as Grid,
  FormControlLabel,
  Button,
  RadioGroup,
  Radio,
  Autocomplete,
  Typography,
  ButtonGroup,
  Link,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { createRecord, fetchPlayers } from "./actions";
import { useFormState } from "react-dom";
import { useSnackbar } from "notistack";
import { useEffect, useState, useTransition } from "react";
import { MahjongCategory, MahjongPlayersDto } from "@/types/mahjong";
import { Add, Remove } from "@mui/icons-material";
import YakumanEntry from "./_components/yakuman-entry";

const initialState = {
  state: "initial",
  message: "",
};

const playerLabelArr: Record<MahjongCategory, string[][]> = {
  "3마": [
    ["east", "동"],
    ["south", "남"],
    ["west", "서"],
  ],

  "4마": [
    ["east", "동"],
    ["south", "남"],
    ["west", "서"],
    ["north", "북"],
  ],
};

export default function MahjongAddRecordPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [formState, formAction] = useFormState(createRecord, initialState);
  const [players, setPlayers] = useState<MahjongPlayersDto[]>([]);
  const [playerLabel, setPlayerLabel] = useState(playerLabelArr["4마"]);
  const [yakumanNumber, setYakumanNumber] = useState(0);
  const [isPending, startTransition] = useTransition();

  const yakumanRange = [...Array(yakumanNumber)];

  useEffect(() => {
    startTransition(async () => await setPlayers(await fetchPlayers()));
  }, []);
  useEffect(() => {
    if (formState.state === "success") {
      enqueueSnackbar(formState.message, { variant: "success" });
      router.push(`/mahjong`);
    } else if (formState.state === "error") {
      enqueueSnackbar(formState.message, { variant: "error" });
    }
  }, [formState, enqueueSnackbar, router]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="h5"
        noWrap
        component="div"
        sx={{
          display: { sm: "block" },
          userSelect: "none",
        }}
      >
        {text.mahjong.addRecord.title}
      </Typography>
      <form action={formAction}>
        <Box
          sx={{
            width: "min(500px, 80vw)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            rowGap: "0.5rem",
          }}
        >
          <FormControl>
            <TextField
              type="hidden"
              name="yakuman-number"
              defaultValue={yakumanNumber}
            />
          </FormControl>
          <FormControl>
            <RadioGroup
              row
              onChange={(e, v) => {
                setPlayerLabel(playerLabelArr[v as MahjongCategory]);
              }}
              defaultValue="4마"
            >
              <FormControlLabel
                key="3마"
                value="3마"
                control={<Radio />}
                label="3마"
              />
              <FormControlLabel
                key="4마"
                value="4마"
                control={<Radio />}
                label="4마"
              />
            </RadioGroup>
            <RadioGroup row defaultValue="반장전" name="subcategory">
              <FormControlLabel
                key="동풍전"
                value="동풍전"
                control={<Radio />}
                label="동풍전"
              />
              <FormControlLabel
                key="반장전"
                value="반장전"
                control={<Radio />}
                label="반장전"
              />
            </RadioGroup>
          </FormControl>
          <Grid container sx={{ width: "80%" }}>
            <Grid size={4}>
              <Typography>플레이어</Typography>
            </Grid>
            <Grid size={8}>
              <Link
                href="/mahjong/add-player"
                variant="caption"
                underline="none"
                sx={{ textAlign: "right" }}
              >
                처음 기록하는 플레이어인가요?
              </Link>
            </Grid>
          </Grid>
          {playerLabel.map(([enVal, krVal]) => (
            <Grid container key={enVal} sx={{ width: "80%" }}>
              <Grid size={6}>
                <FormControl fullWidth>
                  {/* TODO: 플레이어 로딩 보이게 하기? */}
                  <Autocomplete
                    autoHighlight
                    autoComplete
                    forcePopupIcon={false}
                    options={players.map(({ playerName }) => {
                      return {
                        label: playerName,
                        value: playerName,
                      };
                    })}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name={`${enVal}-player-name`}
                        label={`${krVal} 이름`}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid size={6}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    type="text"
                    name={`${enVal}-score`}
                    label={`${krVal} 점수`}
                  ></TextField>
                </FormControl>
              </Grid>
            </Grid>
          ))}
          {yakumanRange.map((_, i) => (
            <YakumanEntry key={`yakuman-${i}`} players={players} idx={i} />
          ))}
          <ButtonGroup>
            <Button
              variant="outlined"
              onClick={() => setYakumanNumber(yakumanNumber + 1)}
            >
              <Add />
              <Typography>역만 추가하기</Typography>
            </Button>
            {yakumanNumber !== 0 && (
              <Button
                variant="outlined"
                color="error"
                onClick={() => setYakumanNumber(Math.max(yakumanNumber - 1, 0))}
              >
                <Remove />
              </Button>
            )}
          </ButtonGroup>

          <FormControl sx={{ width: "80%" }}>
            <TextField
              type="text"
              name="note"
              label="추가 기록 사항 (선택)"
              placeholder="추가적으로 경기에서 기록할 만한 사항을 적어주세요."
              multiline
              rows={4}
            ></TextField>
          </FormControl>
        </Box>
        <Button
          variant="contained"
          type="submit"
          sx={{
            width: "100%",
            marginTop: "2rem",
          }}
        >
          기록
        </Button>
      </form>
    </Box>
  );
}
