export enum MahjongSeat {
  east,
  south,
  west,
  north,
}

// Basic Enumerations /////////////////////////////////////////////////////////

export const MahjongCategoryValues = ['4마', '3마'];

export type MahjongCategory = (typeof MahjongCategoryValues)[number];

export const MahjongSubcategoryValues = ['반장전', '동풍전'];

export type MahjongSubcategory = (typeof MahjongSubcategoryValues)[number];
