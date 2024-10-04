import { api } from "@/lib/axiosInterceptor";
import {
  Box,
  Grid2 as Grid,
  List,
  ListItem,
  ListItemButton,
  Paper,
  Typography,
} from "@mui/material";
import { MahjongMainPageDto } from "@/types/mahjong";
import { AddButton } from "./_components/add-button";
import { StatisticsButton } from "./_components/statistics-button";
import { RankingEntry } from "./_components/ranking-entry";
import { RecordEntry } from "./_components/record-entry";

const testRecord = [
  {
    category: "4마 반장전",
    players: [
      { nickname: "참가자1", score: 73000 },
      { nickname: "참가자2", score: -23000 },
      { nickname: "참가자3", score: 25000 },
      { nickname: "참가자4", score: 25000 },
    ],
  },
  {
    category: "3마 동풍전",
    players: [
      { nickname: "참가자2", score: 83000 },
      { nickname: "참가자1", score: -13000 },
      { nickname: "참가자3", score: 35000 },
    ],
  },
];

const testRanking = [
  {
    nickname: "참가자1",
    rating: 102.3,
  },
  {
    nickname: "참가자2",
    rating: 12.3,
  },
  {
    nickname: "참가자1",
    rating: -2.3,
  },
  {
    nickname: "참가자1",
    rating: -60.3,
  },
];

const getProps: () => Promise<MahjongMainPageDto> = async () => {
  try {
    const recordResponsePromise = api.get(`/mahjong`);
    const p3RankingResponsePromise = api.get(`/mahjong/player/ranking/3마`);
    const p4RankingResponsePromise = api.get(`/mahjong/player/ranking/4마`);
    // console.log("VVVVVVVVVVVVVV");
    const [recordResponse, p3RankingResponse, p4RankingResponse] =
      await Promise.all([
        recordResponsePromise,
        p3RankingResponsePromise,
        p4RankingResponsePromise,
      ]);
    // console.log("AAAAAAAAAAAAA");
    const record = (recordResponse.data as any).data.slice(0, 5);
    const p3Ranking = (p3RankingResponse.data as any).data;
    const p4Ranking = (p4RankingResponse.data as any).data;
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
      record: testRecord,
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
            <List sx={{ width: "100%" }}>
              {record.map((value) => (
                <RecordEntry key={value.id} {...value} />
              ))}
            </List>
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
              <Box
                key={category}
                sx={{
                  width: "100%",
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
                    flexGrow: 1,
                  }}
                >
                  {`${category} 우마 순위`}
                </Typography>
                <List sx={{ width: "100%" }}>
                  {ranking.map((value) => (
                    <RankingEntry
                      key={value.playerName}
                      category={category}
                      {...value}
                    />
                  ))}
                </List>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
