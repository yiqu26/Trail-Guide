/**
 * 將分鐘數轉換為易讀的時間格式
 * @param minutes 分鐘數
 * @returns 格式化的時間字串
 *
 * 範例：
 * - 40 → "40分"
 * - 90 → "1.5小時"
 * - 120 → "2小時"
 * - 150 → "2.5小時"
 * - 1440 → "1天"
 * - 2880 → "2天"
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}分`;
  }

  if (minutes >= 1440) {
    const days = minutes / 1440;
    if (Number.isInteger(days)) {
      return `${days}天`;
    }
    // 超過一天但不是整數天，顯示小時
    const hours = minutes / 60;
    return `${Math.round(hours)}小時`;
  }

  const hours = minutes / 60;
  if (Number.isInteger(hours)) {
    return `${hours}小時`;
  }

  // 顯示到小數點一位
  return `${hours.toFixed(1)}小時`;
}
