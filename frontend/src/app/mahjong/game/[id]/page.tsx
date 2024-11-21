"use client";
import {
  Box,
  CircularProgress,
  Grid2 as Grid,
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
      if (!Number.isInteger(params.id)) throw new Error();
      startTransition(
        async () => await setGame(await fetchDetailedGame(params.id))
      );
    } catch (e) {
      const msg = text.mahjong.game.error.notFound;
      enqueueSnackbar(msg, { variant: "error" });
      router.push("/mahjong");
    }
    // console.log(category);
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
              <Box sx={{ height: "10vh" }} />
              <Grid
                container
                columns={24}
                spacing={2}
                sx={{
                  minWidth: "200px",
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
                    <></>
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
              <Box sx={{ height: "10vh" }} />
              <Grid container sx={{ width: "100%" }}>
                <Grid size={4}>
                  <Typography
                    noWrap
                    component="div"
                    sx={{
                      display: { sm: "block" },
                      userSelect: "none",
                    }}
                  >
                    {text.mahjong.game.createdAt}
                  </Typography>
                </Grid>
                <Grid size={8}>
                  <Typography
                    noWrap
                    component="div"
                    sx={{
                      display: { sm: "block" },
                      userSelect: "none",
                    }}
                  >
                    {/* 2024-09-14 (2달 전) */}
                    {`${game.createdAt.slice(0, 10)} (${formatDate(
                      game.createdAt
                    )})`}
                  </Typography>
                </Grid>
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
