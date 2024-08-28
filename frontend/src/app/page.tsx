import { text } from "@/lib/data";
import { Box } from "@mui/material";

export default function Home() {
  return (
    <Box>
      <h2>{text.main.title}</h2>
      <h3>{text.main.developing}</h3>
    </Box>
  );
}
