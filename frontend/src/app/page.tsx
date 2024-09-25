import { text } from "@/lib/data";
import { Box, Divider } from "@mui/material";

import PatchNote from "../lib/patchNote.mdx";

export default function Home() {
  return (
    <Box>
      <h2>{text.main.title}</h2>
      <h3>{text.main.developing}</h3>
      <Divider />
      <PatchNote />
    </Box>
  );
}
