"use client";
import { text } from "@/lib/data";
import { MahjongSeasonDto } from "@/types/mahjong";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
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

export default function MahjongAddRecordPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [seasons, setSeasons] = useState<MahjongSeasonDto[]>([]);
  const [formState, formAction] = useFormState(
    postSeasonManagement,
    initialState
  );
  const [isPending, startTransition] = useTransition();

  const runningSeasons = seasons.filter((season) => {
    const now = new Date();
    return new Date(season.startDate) < now && now < new Date(season.endDate);
  });

  useEffect(() => {
    startTransition(async () => await setSeasons(await fetchSeasons()));
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
      {seasons.map((season) => (
        <Typography>
          {`시즌 ${season.season}: ${new Date(
            season.startDate
          ).toLocaleString()} ~ ${
            season.endDate
              ? new Date(season.endDate).toLocaleString()
              : "진행 중"
          }`}
        </Typography>
      ))}
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
            <RadioGroup row defaultValue={true} name="isStart">
              <FormControlLabel
                key="start"
                value={true}
                control={<Radio />}
                label="새 시즌 생성"
              />
              <FormControlLabel
                key="end"
                value={false}
                control={<Radio />}
                label="시즌 종료"
              />
            </RadioGroup>
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
          요청 보내기
        </Button>
      </form>
    </Box>
  );
}
