import { HttpStatus } from '@nestjs/common';
import { ErrorHttpStatusCode } from '@nestjs/common/utils/http-error-by-code.util';

type ExceptionInfo = {
  statusCode: ErrorHttpStatusCode;
  errorCode: number;
  message: string;
};

export const ExceptionValues = {
  USER_ALREADY_EXISTS: {
    statusCode: HttpStatus.CONFLICT,
    errorCode: 10000,
    message: '생성하려는 유저의 아이디가 중복됩니다.',
  },

  GRANT_ROLE_USER_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 10100,
    message: '역할을 부여하려는 유저가 존재하지 않습니다.',
  },

  DEPRIVE_ROLE_USER_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 10101,
    message: '역할을 박탈하려는 유저가 존재하지 않습니다.',
  },

  WRONG_ROLE_NAME: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 10102,
    message: '존재하지 않는 역할 이름입니다.',
  },

  AUTH_ID_DOES_NOT_EXIST: {
    statusCode: HttpStatus.UNAUTHORIZED,
    errorCode: 20000,
    message: '존재하지 않는 아이디입니다.',
  },

  AUTH_PASSWORD_DOES_NOT_MATCH: {
    statusCode: HttpStatus.UNAUTHORIZED,
    errorCode: 20001,
    message: '비밀번호가 틀렸습니다.',
  },

  AUTH_WRONG_REFRESH_TOKEN: {
    statusCode: HttpStatus.UNAUTHORIZED,
    errorCode: 20100,
    message: '유효하지 않은 refresh token입니다.',
  },

  AUTH_EXPIRED_REFRESH_TOKEN: {
    statusCode: HttpStatus.UNAUTHORIZED,
    errorCode: 20101,
    message: '만료된 refresh token입니다.',
  },

  MAHJONG_GAME_PLAYER_DOES_NOT_EXISTS: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 30000,
    message: '마작 경기의 참여자가 존재하지 않습니다.',
  },

  INVALID_MAHJONG_GAME: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 30100,
    message: '유효하지 않은 마작 경기입니다.',
  },

  YAKUMAN_DUPLICATED_PLAYER: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 30101,
    message: '역만 기록 문제: 화료자와 방총자가 같은 플레이어입니다.',
  },

  YAKUMAN_TOO_MANY_OVERLAPPING_YAKUMAN: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 30102,
    message: '역만 기록 문제: 너무 많은 역만이 중첩됩니다.',
  },

  YAKUMAN_WRONG_COMBINATION: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 30103,
    message: '역만 기록 문제: 허용되지 않는 역만 조합이 포함되어 있습니다.',
  },

  MAHJONG_GAME_DUPLICATE_PLAYER: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 30104,
    message: '경기 기록 문제: 플레이어가 중복됩니다.',
  },

  MAHJONG_GAME_INVALID_PLAYER_NUMBER: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 30105,
    message: '경기 기록 문제: 플레이어 수는 3인 또는 4인이어야 합니다.',
  },

  MAHJONG_GAME_INVALID_SCORE: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 30106,
    message: '경기 기록 문제: 유효하지 않은 점수 기록입니다.',
  },

  YAKUMAN_WRONG_YAKUMAN_NAME: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 30107,
    message: '역만 기록 문제: 올바르지 않은 역만 이름입니다.',
  },

  MAHJONG_GAME_ID_DOES_NOT_EXISTS: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 30200,
    message: '해당하는 id의 마작 경기가 존재하지 않습니다.',
  },

  MAHJONG_PLAYER_ALREADY_EXIST: {
    statusCode: HttpStatus.CONFLICT,
    errorCode: 30300,
    message: '해당하는 아이디의 마작 플레이어가 이미 존재합니다.',
  },

  MAHJONG_INVALID_SEASON: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 30400,
    message: '해당 시즌은 존재하지 않습니다.',
  },

  MAHJONG_SEASON_ALREADY_ENDED: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 30401,
    message: '해당 시즌은 이미 종료된 시즌입니다.',
  },

  MAHJONG_CREATE_GAME_RECORD_FAIL: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: 30900,
    message: '마작 경기 생성 중 오류가 발생했습니다. 관리자에게 문의해 주세요.',
  },

  MAHJONG_DELETE_GAME_RECORD_FAIL: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: 30901,
    message: '마작 경기 삭제 중 오류가 발생했습니다. 관리자에게 문의해 주세요.',
  },
};
