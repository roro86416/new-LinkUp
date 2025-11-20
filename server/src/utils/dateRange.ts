// server/src/utils/dateRange.ts
/* Readme: (自event-search.service.ts抽出)
目的:
1. 定義「時間起訖」的結構：DateRange { start: Date; end: Date }
2. 提供一個主函式 getDateRange(preset, startDate?, endDate?)
3. 自動根據傳入的 preset（today, this_week, custom...）計算正確範圍

設計說明:
1. getDateRange() 是通用函式，以後活動統計、行事曆模組都能重複使用
2. 不使用任何外部套件（例如 dayjs），純 JS 原生運算。
3. 自動以 星期一為每週起點。
4. 支援「custom ─ 日期自訂」模式。
*/

export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * 將 preset 文字（today, this_week, custom 等）轉換為實際的起訖時間區間
 * @param preset 文字 token（today, tomorrow, this_week, ...）
 * @param startDate 自訂開始日期（僅 custom 時使用）
 * @param endDate 自訂結束日期（僅 custom 時使用）
 */
export function getDateRange(
  preset: string,
  startDate?: Date | string,
  endDate?: Date | string
): DateRange | null {
  const now = new Date();

  const startOfDay = (d: Date) => {
    const t = new Date(d);
    t.setHours(0, 0, 0, 0);
    return t;
  };
  const endOfDay = (d: Date) => {
    const t = new Date(d);
    t.setHours(23, 59, 59, 999);
    return t;
  };

  switch (preset) {
    case "today": {
      return { start: startOfDay(now), end: endOfDay(now) };
    }
    case "tomorrow": {
      const t = new Date(now);
      t.setDate(now.getDate() + 1);
      return { start: startOfDay(t), end: endOfDay(t) };
    }
    case "this_week": {
      const day = now.getDay(); // 0=Sun, 1=Mon, ...
      const diffToMonday = (day + 6) % 7;
      const monday = new Date(now);
      monday.setDate(now.getDate() - diffToMonday);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      return { start: startOfDay(monday), end: endOfDay(sunday) };
    }
    case "this_weekend": {
      const day = now.getDay();
      const diffToSaturday = (6 - day + 7) % 7;
      const saturday = new Date(now);
      saturday.setDate(now.getDate() + diffToSaturday);
      const sunday = new Date(saturday);
      sunday.setDate(saturday.getDate() + 1);
      return { start: startOfDay(saturday), end: endOfDay(sunday) };
    }
    case "next_week": {
      const day = now.getDay();
      const diffToMonday = (day + 6) % 7;
      const nextMonday = new Date(now);
      nextMonday.setDate(now.getDate() - diffToMonday + 7);
      const nextSunday = new Date(nextMonday);
      nextSunday.setDate(nextMonday.getDate() + 6);
      return { start: startOfDay(nextMonday), end: endOfDay(nextSunday) };
    }
    case "next_weekend": {
      const day = now.getDay();
      const diffToSaturday = (6 - day + 7) % 7;
      const nextSaturday = new Date(now);
      nextSaturday.setDate(now.getDate() + diffToSaturday + 7);
      const nextSunday = new Date(nextSaturday);
      nextSunday.setDate(nextSaturday.getDate() + 1);
      return { start: startOfDay(nextSaturday), end: endOfDay(nextSunday) };
    }
    case "custom": {
      if (startDate && endDate) {
        return { start: new Date(startDate), end: new Date(endDate) };
      }
      return null;
    }
    default:
      return null;
  }
}
