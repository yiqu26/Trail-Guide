import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'trail-search-history';
const MAX_HISTORY = 10;

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);

  // 從 localStorage 讀取歷史紀錄
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  }, []);

  // 新增搜尋紀錄
  const addHistory = useCallback((keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    setHistory((prev) => {
      // 移除重複項目
      const filtered = prev.filter((item) => item !== trimmed);
      // 新增到最前面，保留最多 MAX_HISTORY 筆
      const updated = [trimmed, ...filtered].slice(0, MAX_HISTORY);

      // 儲存到 localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save search history:', error);
      }

      return updated;
    });
  }, []);

  // 移除單筆紀錄
  const removeHistory = useCallback((keyword: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item !== keyword);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save search history:', error);
      }

      return updated;
    });
  }, []);

  // 清除所有紀錄
  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear search history:', error);
    }
  }, []);

  return {
    history,
    addHistory,
    removeHistory,
    clearHistory,
  };
}
