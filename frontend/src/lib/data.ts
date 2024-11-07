export const text = {
  common: {
    cancel: "취소",
    confirm: "확인",
    delete: "삭제",
  },

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

    addPlayer: {
      title: `플레이어 등록`,
      subTitle: `'A' 등을 제외하고 이름만 기입해 주세요!`,
      error: `플레이어 등록 중 문제가 발생했습니다. 관리자에게 연락해 주세요.`,
      success: (playerName: string) =>
        `플레이어 추가 완료! 아이디는 ${playerName} 입니다.`,
    },

    deleteRecord: {
      title: `기록 삭제`,
      confirmTitle: `기록을 삭제할까요?`,
      confirmText: `기록을 삭제하면 되돌릴 수 없습니다! 신중히 결정해 주세요.`,
      error: `기록 삭제 중 문제가 발생했습니다.`,
      success: `기록 삭제 완료!`,
    },

    player: {
      title: (playerName: string) => playerName,
    },

    statistics: {
      player: {
        title: `마작 통계`,
        subtitle: `(PC버전에 최적화되어 있습니다.)`,
      },
    },
  },
};
