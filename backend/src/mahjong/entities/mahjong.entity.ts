// TODO: 마작 관련 엔티티 정리하기

// MahjongPlayer
// User와 별개의 엔티티, OneToOne 매핑 (nickname)
// 우마, 판수 등 추가 정보 필요

// MahjongPlayerRecord
// { player: MahjongPlayer, score: number }

// MahjongGameRecord
// { east: MahjongPlayerRecord,
//   south,
//   west,
//   north,
//   category: '동풍전' | '반장전' | '기타',
//   note: text,
//   그리고또... 뭐있을까?
// }

export class Mahjong {}
