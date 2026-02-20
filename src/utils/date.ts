/**
 * 指定された日付が指定した日数以内に更新された「新しい」データかどうかを判定します
 * @param effectiveDate 比較対象の日付文字列（ISO 8601形式）
 * @param thresholdDays 「新しい」と見なす日数（デフォルト：5日）
 * @returns {boolean} 指定期間内であれば true
 */
export function isRecentlyUpdated(effectiveDate: string | undefined | null, thresholdDays = 5): boolean {
    if (!effectiveDate) return false;

    const timeDiff = Date.now() - new Date(effectiveDate).getTime();
    const thresholdMs = thresholdDays * 24 * 60 * 60 * 1000;

    return timeDiff < thresholdMs;
}
