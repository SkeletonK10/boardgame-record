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
import { MahjongMainPageDto } from "./dto";
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
    const rankingResponsePromise = api.get(`/mahjong/player/ranking`);
    // console.log("VVVVVVVVVVVVVV");
    const [recordResponse, rankingResponse] = await Promise.all([
      recordResponsePromise,
      rankingResponsePromise,
    ]);
    // console.log("AAAAAAAAAAAAA");
    const record = (recordResponse.data as any).data.slice(0, 5);
    const ranking = (rankingResponse.data as any).data;
    // console.log(ranking);
    return {
      record,
      ranking,
    };
  } catch (err) {
    // return test data
    return {
      record: testRecord,
      ranking: testRanking,
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
                        {value.players.map(({ nickname, score }) => (
                          <Grid size={6} key={nickname}>
                            <Typography component="div" noWrap>
                              {nickname}
                            </Typography>
                            <Typography component="div">{score}</Typography>
                          </Grid>
                        ))}
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
              우마 순위
            </Typography>
            <List sx={{ width: "100%" }}>
              {ranking.map((value, index) => (
                <ListItem key={index}>
                  <ListItemButton>
                    <Grid container spacing={1} sx={{ width: "100%" }}>
                      <Grid size={2}>
                        <Box>{index + 1}</Box>
                      </Grid>
                      <Grid size={6}>
                        <Typography component="div" noWrap>
                          {value.nickname}
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
        </Grid>
      </Grid>
    </Box>
  );
}
