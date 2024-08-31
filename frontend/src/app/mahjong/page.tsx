import { api } from "@/lib/axiosInterceptor";
import {
  Box,
  Grid2 as Grid,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";
import { MahjongMainPageDto } from "./dto";

const testRecord = [
  {
    east: { nickname: "참가자1", score: 73000 },
    south: { nickname: "참가자2", score: -23000 },
    west: { nickname: "참가자3", score: 25000 },
    north: { nickname: "참가자4", score: 25000 },
  },
  {
    east: { nickname: "참가자2", score: 73000 },
    south: { nickname: "참가자1", score: -23000 },
    west: { nickname: "참가자3", score: 25000 },
    north: { nickname: "참가자4", score: 25000 },
  },
];

const testRanking = [
  {
    nickname: '참가자1',
    score: 102.3,
  },
  {
    nickname: '참가자2',
    score: 12.3,
  },
  {
    nickname: '참가자1',
    score: -2.3,
  },
  {
    nickname: '참가자1',
    score: -60.3,
  },
];

const getProps: () => Promise<MahjongMainPageDto> = async () => {
  try {
    const recordResponsePromise = api.get(`/mahjong/record`);
    const rankingResponsePromise = api.get(`/mahjong/ranking`);
    const [recordResponse, rankingResponse] = await Promise.all([recordResponsePromise, rankingResponsePromise]);
    const record = (recordResponse.data as any).data.slice(10);
    const ranking = (rankingResponse.data as any).data;
    return {
      record,
      ranking,
    }
  } catch (err) {
    // return test data
    return {
      record: testRecord,
      ranking: testRanking,
    }
  }
}

export default async function MahjongMainPage() {
  const { record, ranking } = await getProps();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}>
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
            <List sx={{width: '100%'}}>
              {record.map((value, index) => (
                <ListItem key={index}>
                  <ListItemButton>
                    <Grid container spacing={1} sx={{width: '100%'}}>
                      <Grid size={6}>
                        <Typography component="div" noWrap>{value.east.nickname}</Typography>
                        <Typography component="div">{value.east.score}</Typography>
                      </Grid>
                      <Grid size={6}>
                        <Typography component="div" noWrap>{value.south.nickname}</Typography>
                        <Typography component="div">{value.south.score}</Typography>
                      </Grid>
                      <Grid size={6}>
                        <Typography component="div" noWrap>{value.west.nickname}</Typography>
                        <Typography component="div">{value.west.score}</Typography>
                      </Grid>
                      <Grid size={6}>
                        <Typography component="div" noWrap>{value.north.nickname}</Typography>
                        <Typography component="div">{value.north.score}</Typography>
                      </Grid>
                    </Grid>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                display: { sm: "block" },
                userSelect: "none",
                flexGrow: 1
              }}
            >
              우마 순위
            </Typography>
            <List sx={{width: '100%'}}>
              {ranking.map((value, index) => (
                <ListItem key={index}>
                  <ListItemButton>
                    <Grid container spacing={1} sx={{width: '100%'}}>
                      <Grid size={2}>
                        <Box>{index+1}</Box>
                      </Grid>
                      <Grid size={6}>
                        <Typography component="div" noWrap>{value.nickname}</Typography>
                      </Grid>
                      <Grid size={4}>
                        <Box>{value.score}</Box>
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
