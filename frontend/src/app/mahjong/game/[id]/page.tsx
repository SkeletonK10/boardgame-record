"use client";
import {
  Box,
  CircularProgress,
  Grid2 as Grid,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState, useTransition } from "react";
import { text } from "@/lib/data";
import { MahjongDetailedGameDto } from "@/types/mahjong";
import { fetchDetailedGame } from "./actions";
import { formatDate } from "@/lib/utils";
import PlayerCard from "./_components/player-card";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";

type Props = {
  params: {
    id: number;
  };
};

export default function MahjongDetailedGamePage({ params }: Props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [isPending, startTransition] = useTransition();
  const [game, setGame] = useState<MahjongDetailedGameDto>();

  useEffect(() => {
    try {
      if (!Number.isInteger(Number(params.id))) throw new Error();
      startTransition(
        async () => await setGame(await fetchDetailedGame(params.id))
      );
    } catch (e) {
      const msg = text.mahjong.game.error.notFound;
      enqueueSnackbar(msg, { variant: "error" });
      router.push("/mahjong");
    }
  }, []);

  return (
    <Box
      sx={{
        width: "80%",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {isPending ? (
        <CircularProgress />
      ) : (
        <>
          {game ? (
            <>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  display: { sm: "block" },
                  userSelect: "none",
                  textAlign: "center",
                }}
              >
                {text.mahjong.game.title(params.id)}
              </Typography>
              <Typography
                variant="subtitle1"
                noWrap
                component="div"
                sx={{
                  display: { sm: "block" },
                  userSelect: "none",
                  textAlign: "center",
                }}
              >
                {game.createdAt.slice(0, 10)}
              </Typography>
              <Box sx={{ height: "3vh" }} />
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  display: { sm: "block" },
                  userSelect: "none",
                  textAlign: "center",
                }}
              >
                {text.mahjong.game.result}
              </Typography>
              <Box sx={{ height: "3vh" }} />
              <Grid
                container
                columns={24}
                spacing={2}
                sx={{
                  minWidth: "200px",
                  maxWidth: "400px",
                  padding: "10px",
                }}
              >
                <Grid size={7} />
                <Grid size={10}>
                  <PlayerCard {...game.players[2]}></PlayerCard>
                </Grid>
                <Grid size={7} />

                <Grid size={10}>
                  {game.players[3] ? (
                    <PlayerCard {...game.players[3]}></PlayerCard>
                  ) : (
                    <Paper
                      sx={{
                        height: "100%",
                        padding: "0.5rem",
                        fontSize: "0.7rem",
                        textAlign: "center",
                        backgroundColor: "#FFFFFF",
                      }}
                    />
                  )}
                </Grid>
                <Grid size={4} />
                <Grid size={10}>
                  <PlayerCard {...game.players[1]}></PlayerCard>
                </Grid>

                <Grid size={7} />
                <Grid size={10}>
                  <PlayerCard {...game.players[0]}></PlayerCard>
                </Grid>
                <Grid size={7} />
              </Grid>
            </>
          ) : (
            <></>
          )}
        </>
      )}
    </Box>
  );
}
