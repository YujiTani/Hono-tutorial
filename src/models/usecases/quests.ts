import * as questRepository from "../repositories/quest";

/**
 * クエストの総数を取得する
 * @returns クエストの総数
 */
export const getCount = async () => {
  return await questRepository.count();
};

/**
 * クエスト一覧を取得する
 * @param limit 取得するクエストの数
 * @param offset 取得するクエストの開始位置
 * @returns クエスト一覧
 */
export const getAll = async (limit: number, offset: number) => {
  return await questRepository.findAll(limit, offset);
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
