import { api } from "@/lib/axiosInterceptor";
import {
  MahjongGameRecord,
  MahjongMainPageDto,
  MahjongRankingRecord,
  MahjongSeasonDto,
} from "@/types/mahjong";
import { Box, Grid2 as Grid, Typography } from "@mui/material";
import AddButton from "./_components/add-button";
import MahjongGameList from "./_components/game-list";
import MahjongRankingList from "./_components/ranking-list";
import StatisticsButton from "./_components/statistics-button";
import { getRunningSeasons } from "@/lib/utils";
import SeasonDisplay from "./_components/season-display";
import ManageSeasonButton from "./_components/manage-season-button";

const testRanking = [
  {
    playerName: "p1",
    nickname: "참가자1",
    rating: 102.3,
    ranking: 1,
  },
  {
    nickname: "참가자2",
    rating: 12.3,
    playerName: "p2",
    ranking: 2,
  },
  {
    nickname: "참가자3",
    rating: -2.3,
    playerName: "p3",
    ranking: 3,
  },
  {
    nickname: "참가자4",
    rating: -60.3,
    playerName: "p4",
    ranking: 4,
  },
];

const getProps: () => Promise<MahjongMainPageDto> = async () => {
  try {
    const seasons = (await api.get(`/mahjong/season`))
      .data as MahjongSeasonDto[];
    const runningSeasons = getRunningSeasons(seasons);
    const runningSeason =
      runningSeasons.length > 0
        ? runningSeasons[0]
        : { season: undefined, startDate: "", endDate: "" };
    const recordResponsePromise = api.get(`/mahjong/game`, {
      params: {
        season: runningSeason.season,
      },
    });
    const p3RankingResponsePromise = api.get(`/mahjong/player/ranking`, {
      params: {
        category: "3마",
        season: runningSeason.season,
      },
    });
    const p4RankingResponsePromise = api.get(`/mahjong/player/ranking`, {
      params: {
        category: "4마",
        season: runningSeason.season,
      },
    });

    const [recordResponse, p3RankingResponse, p4RankingResponse] =
      await Promise.all([
        recordResponsePromise,
        p3RankingResponsePromise,
        p4RankingResponsePromise,
      ]);

    const record = recordResponse.data as MahjongGameRecord[];
    const p3Ranking: MahjongRankingRecord[] =
      p3RankingResponse.data as MahjongRankingRecord[];
    const p4Ranking: MahjongRankingRecord[] =
      p4RankingResponse.data as MahjongRankingRecord[];
    // console.log(ranking);
    return {
      record: record,
      ranking: [
        {
          category: "4마",
          ranking: p4Ranking,
        },
        {
          category: "3마",
          ranking: p3Ranking,
        },
      ],
      season: runningSeason,
    };
  } catch (err) {
    // return test data
    return {
      record: [],
      ranking: [
        {
          category: "4마",
          ranking: testRanking,
        },
        {
          category: "3마",
          ranking: testRanking,
        },
      ],
    };
  }
};

export default async function MahjongMainPage() {
  const { record, ranking, season } = await getProps();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        <Grid size={12}>
          <SeasonDisplay season={season} />
        </Grid>
        <Grid display={{ xs: "none", md: "inline" }} size={2} />
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <AddButton />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatisticsButton />
        </Grid>
        <Grid display={{ xs: "none", md: "inline" }} size={2} />
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                display: { sm: "block" },
                userSelect: "none",
              }}
            >
              최근 기록
            </Typography>
            <MahjongGameList record={record} />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {ranking.map(({ category, ranking }) => (
              <MahjongRankingList
                key={category}
                category={category}
                ranking={ranking}
              />
            ))}
          </Box>
        </Grid>
        <Grid display={{ xs: "none", sm: "inline" }} size={2} />
        <Grid size={{ xs: 12, sm: 8 }}>
          <ManageSeasonButton />
        </Grid>
        <Grid display={{ xs: "none", sm: "inline" }} size={2} />
      </Grid>
    </Box>
  );
}
