import * as questRepository from "../repositories/quest";
import { v7 as uuidv7 } from "uuid";
import { Prisma } from "@prisma/client";
import { BaseResponse, LimitOffsetRequest } from "../types/common";

/**
 * クエストを作成するためのリクエスト
 */
export type CreateRequest = Pick<Prisma.QuestCreateInput, "name" | "description" | "state">;

/**
 * クエストを更新するためのリクエスト
 */
export type UpdateRequest = Pick<Prisma.QuestUpdateInput, "name" | "description" | "state"> & {
  id?: number;
  uuid?: string;
};

/**
 * クエストを削除するためのリクエスト
 */
export type DeleteRequest = {
  id?: number;
  uuid?: string;
};

/**
 * クエスト一覧を返すレスポンス
 */
export type QuestListResponse = {
  quests: QuestResponse[];
} & BaseResponse;

/**
 * クエストを返すレスポンス
 */
export type QuestResponse = {
  uuid: string;
  name: string;
  description: string | null;
  state: string;
};

/**
 * クエストの総数を取得する
 * @returns クエストの総数
 */
export const getCount = async () => {
  return await questRepository.count();
};

/**
 * クエスト一覧を取得する
 * @param payload.query クエスト名で検索するクエリ
 * @param payload.limit 取得するクエストの数
 * @param payload.offset 取得するクエストの開始位置
 * @returns クエスト一覧
 */
export const getAll = async (payload: LimitOffsetRequest) => {
  return await questRepository.findAll(payload);
};

/**
 * クエストを作成する
 * @param name クエストの名前
 * @param description クエストの説明
 * @param state クエストの状態
 * @returns クエスト
 */
export const create = async (payload: CreateRequest) => {
  const uuid = uuidv7();
  return await questRepository.create({ uuid, ...payload });
};

/**
 * クエスト一覧レスポンスを返す
 * @param quests クエスト一覧
 * @param total クエストの総数
 * @param limit 取得するクエストの数
 * @param offset 取得するクエストの開始位置
 * @returns クエスト一覧レスポンス
 */
export const getQuestListResponse = async (
  quests: questRepository.Quest[],
  total: number,
  limit: number,
  offset: number
) => {
  if (quests.length === 0) {
    return {
      quests: [],
      total,
      limit,
      offset,
    };
  }

  return {
    quests: quests.map((quest) => ({
      uuid: quest.uuid,
      name: quest.name,
      description: quest.description,
      state: quest.state,
    })),
    total,
    limit,
    offset,
  };
};

/**
 * クエストレスポンスを返す
 * @param quest クエスト
 * @returns クエストレスポンス
 */
export const getQuestResponse = async (quest: questRepository.Quest) => {
  return {
    uuid: quest.uuid,
    name: quest.name,
    description: quest.description,
    state: quest.state,
  };
};
