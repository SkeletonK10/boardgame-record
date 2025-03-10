"use client";
import { text } from "@/lib/data";
import { MahjongSeasonDto } from "@/types/mahjong";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useState, useTransition } from "react";
import { useFormState } from "react-dom";
import { fetchSeasons, postSeasonManagement } from "./actions";

const initialState = {
  state: "initial",
  message: "",
};

// TODO: 허가되지 않은 사용자 접근 차단
// TODO: radio에 따라 폼 적당히 변경하기 (백엔드 api 참고)
// TODO: ./actions에 api 요청 적당히 보내기

export default function MahjongManageSeasonPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [seasons, setSeasons] = useState<MahjongSeasonDto[]>([]);
  const [formState, formAction] = useFormState(
    postSeasonManagement,
    initialState
  );
  const [isPending, startTransition] = useTransition();
  const [isStart, setIsStart] = useState(true);

  const runningSeasons = seasons.filter((season) => {
    const now = new Date();
    return (
      new Date(season.startDate) < now &&
      (season.endDate === null || now < new Date(season.endDate))
    );
  });

  useEffect(() => {
    startTransition(async () => await setSeasons(await fetchSeasons()));
  }, []);
  useEffect(() => {
    setIsStart(runningSeasons.length === 0);
  }, [seasons]);
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
        {text.mahjong.manageSeason.title}
      </Typography>
      <Box sx={{ height: "1rem" }} />
      {isStart ? (
        <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
          {text.mahjong.manageSeason.noRunningSeason}
        </Typography>
      ) : (
        runningSeasons.map((season) => (
          <>
            <Typography variant="body2" key={season.season}>
              {`시즌 ${season.season}: ${new Date(
                season.startDate
              ).toLocaleString()}`}
            </Typography>
            <Typography variant="body2" key={season.season + "end"}>
              {` ~ ${
                season.endDate
                  ? new Date(season.endDate).toLocaleString()
                  : "진행 중"
              }
            `}
            </Typography>
          </>
        ))
      )}
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
            <TextField type="hidden" name="isStart" value={isStart} />
          </FormControl>
          <Box sx={{ flexGrow: 1 }}>
            {isStart ? (
              <>
                <FormControl sx={{ width: "100%" }} margin="normal">
                  <TextField
                    type="date"
                    name="startDate"
                    label="시작일"
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </FormControl>
                <FormControl sx={{ width: "100%" }} margin="normal">
                  <TextField
                    type="date"
                    name="endDate"
                    label="종료일"
                    defaultValue={
                      new Date(new Date().setMonth(new Date().getMonth() + 3))
                        .toISOString()
                        .split("T")[0]
                    }
                  />
                </FormControl>
              </>
            ) : (
              <>
                <FormControl sx={{ width: "100%" }} margin="normal">
                  <TextField
                    select
                    label="변경할 시즌"
                    name="season"
                    placeholder="시즌 선택"
                    defaultValue={runningSeasons[0]?.season}
                  >
                    {runningSeasons.map((season) => (
                      <MenuItem key={season.season} value={season.season}>
                        {`시즌 ${season.season}`}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>
                <FormControl sx={{ width: "100%" }} margin="normal">
                  <TextField
                    type="date"
                    name="endDate"
                    label="종료일"
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </FormControl>
              </>
            )}
          </Box>
          <Button
            variant="contained"
            type="submit"
            sx={{
              width: "100%",
              marginTop: "2rem",
            }}
          >
            {text.mahjong.manageSeason.submit}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
