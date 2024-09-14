export const text = {
  error: {
    noSession: `로그인이 필요합니다.`,
    noRole: `페이지에 접근할 권한이 없습니다.`,
  },

  main: {
    title: `보드게임 저장소? (beta)`,
    signIn: `로그인`,
    register: `회원가입`,
    developing: `현재 개발 중`,
  },

  auth: {
    manageRole: {
      title: `역할 관리하기`,
      successToGrant: `역할 부여 성공!`,
      successToDeprive: `역할 제거 성공!`,
      error: `에러가 발생했습니다.`,
    },
  },

  register: {
    title: `회원가입`,
  },

  signIn: {
    title: `로그인`,
  },

  mahjong: {
    addRecord: {
      title: `기록 추가`,
      error: `기록 추가 중 문제가 발생했습니다.`,
      success: `기록 추가 완료!`,
    },
  },
};

export enum Role {
  admin = "ADMIN",
  mahjongRecordAdmin = "MAHJONG_RECORD_ADMIN",
  user = "USER",
}
