"use client";
import { text } from "@/lib/data";
import { Box, FormControl, TextField, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { createPlayer } from "./actions";
import { useFormState } from "react-dom";
import { useSnackbar } from "notistack";
import { useEffect } from "react";

const initialState = {
  state: "initial",
  message: "",
};

export default function MahjongAddPlayerPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [formState, formAction] = useFormState(createPlayer, initialState);

  useEffect(() => {
    if (formState.state === "success") {
      enqueueSnackbar(formState.message, { variant: "success" });
      router.push(`/mahjong`);
    } else if (formState.state === "error") {
      enqueueSnackbar(formState.message, { variant: "error" });
    }
  }, [formState]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        rowGap: "1rem",
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
        {text.mahjong.addPlayer.title}
      </Typography>
      <Typography
        variant="subtitle1"
        noWrap
        component="div"
        sx={{
          display: { sm: "block" },
          userSelect: "none",
        }}
      >
        {text.mahjong.addPlayer.subTitle}
      </Typography>
      <form action={formAction}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            rowGap: "1rem",
          }}
        >
          <FormControl>
            <TextField type="text" name="playername" label="이름"></TextField>
          </FormControl>
          <Button variant="contained" type="submit">
            기록
          </Button>
        </Box>
      </form>
    </Box>
  );
}
