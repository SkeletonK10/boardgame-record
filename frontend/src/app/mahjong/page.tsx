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
import { MahjongMainPageDto, MahjongRatingCategory } from "./dto";
import { AddButton } from "./add-button";

const testRecord = [
  {
    category: "반장전",
    players: [
      { nickname: "참가자1", score: 73000 },
      { nickname: "참가자2", score: -23000 },
      { nickname: "참가자3", score: 25000 },
      { nickname: "참가자4", score: 25000 },
    ],
  },
  {
    category: "동풍전",
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
          category: MahjongRatingCategory.fourPlayer,
          ranking: p4Ranking,
        },
        {
          category: MahjongRatingCategory.threePlayer,
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
          category: MahjongRatingCategory.fourPlayer,
          ranking: testRanking,
        },
        {
          category: MahjongRatingCategory.threePlayer,
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
              {record.map((value, index) => (
                <ListItem key={index}>
                  <ListItemButton>
                    <Paper elevation={2} sx={{ width: "100%" }}>
                      <Grid container spacing={1} sx={{ width: "100%" }}>
                        <Grid size={12}>
                          <Typography
                            component="div"
                            noWrap
                            sx={{ fontSize: "0.8rem" }}
                          >
                            {value.category}
                          </Typography>
                        </Grid>
                        {value.players.map(
                          ({ playerName, nickname, score }) => (
                            <Grid
                              size={6}
                              key={playerName}
                              sx={{ padding: "0.3rem" }}
                            >
                              <Typography component="div" noWrap>
                                {nickname}
                              </Typography>
                              <Typography component="div">{score}</Typography>
                            </Grid>
                          )
                        )}
                      </Grid>
                    </Paper>
                  </ListItemButton>
                </ListItem>
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
                    <ListItem disableGutters key={value.playerName}>
                      <ListItemButton disableGutters>
                        <Grid container spacing={1} sx={{ width: "100%" }}>
                          <Grid size={2}>
                            <Box>{value.ranking}</Box>
                          </Grid>
                          <Grid size={6}>
                            <Typography component="div" noWrap>
                              {`${value.nickname}`}
                            </Typography>
                          </Grid>
                          <Grid size={4}>
                            <Box>{value.rating}</Box>
                          </Grid>
                        </Grid>
                      </ListItemButton>
                    </ListItem>
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
