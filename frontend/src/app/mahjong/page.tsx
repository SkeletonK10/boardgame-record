import { api } from "@/lib/axiosInterceptor";
import {
  MahjongGameRecord,
  MahjongMainPageDto,
  MahjongRankingRecord,
} from "@/types/mahjong";
import { Box, Grid2 as Grid, Typography } from "@mui/material";
import AddButton from "./_components/add-button";
import MahjongGameList from "./_components/game-list";
import MahjongRankingList from "./_components/ranking-list";
import StatisticsButton from "./_components/statistics-button";

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
    const recordResponsePromise = api.get(`/mahjong/game/season`);
    const p3RankingResponsePromise = api.get(`/mahjong/player/ranking/season`, {
      params: {
        category: "3마",
      },
    });
    const p4RankingResponsePromise = api.get(`/mahjong/player/ranking/season`, {
      params: {
        category: "4마",
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
  const { record, ranking } = await getProps();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        <Grid size={2} />
        <Grid size={8}>
          <AddButton />
        </Grid>
        <Grid size={2} />
        <Grid size={2} />
        <Grid size={8}>
          <StatisticsButton />
        </Grid>
        <Grid size={2} />
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
      </Grid>
    </Box>
  );
}
