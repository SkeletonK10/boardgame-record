"use client";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { MahjongCategory } from "../dto";

class Props {
  setCategory!: Dispatch<SetStateAction<MahjongCategory>>;
}

export function CategoryRadio({ setCategory }: Props) {
  return (
  <RadioGroup
      row
      onChange={(e, v) => setCategory(v as MahjongCategory)}  // FIXME: DO NOT USE as STATEMENT
      defaultValue={MahjongCategory.fourPlayer}>
      {Object.values(MahjongCategory).map((category) => (
        <FormControlLabel
          key={category}
          value={category}
          control={<Radio />}
          label={category}
        />
      ))}
  </RadioGroup>
  );
}
