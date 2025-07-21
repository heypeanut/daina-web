"use client";

import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '@/components/common/useDebounce';

interface UseMarketSearchOptions {
  onSearch?: (keyword: string) => void;
  onHistoryChange?: (history: string[]) => void;
  debounceMs?: number;
  maxHistoryItems?: number;
}

const SEARCH_HISTORY_KEY = 'market_search_history';

export function useMarketSearch(options: UseMarketSearchOptions = {}) {
  const {
    onSearch,
    onHistoryChange,
    debounceMs = 300,
    maxHistoryItems = 10
  } = options;

  // 搜索状态
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // 防抖搜索关键词
  const debouncedKeyword = useDebounce(searchKeyword, debounceMs);

  // 初始化搜索历史
  useEffect(() => {
    const savedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        setSearchHistory(Array.isArray(history) ? history : []);
      } catch (error) {
        console.error('Failed to parse search history:', error);
      }
    }
  }, []);

  // 监听防抖后的搜索关键词变化
  useEffect(() => {
    if (debouncedKeyword.trim()) {
      onSearch?.(debouncedKeyword.trim());
      setIsSearching(false);
    }
  }, [debouncedKeyword, onSearch]);

  // 保存搜索历史到 localStorage
  const saveSearchHistory = useCallback((history: string[]) => {
    try {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
      onHistoryChange?.(history);
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  }, [onHistoryChange]);

  // 添加搜索历史
  const addToHistory = useCallback((keyword: string) => {
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) return;

    setSearchHistory(prev => {
      // 去重并移到最前面
      const filtered = prev.filter(item => item !== trimmedKeyword);
      const newHistory = [trimmedKeyword, ...filtered].slice(0, maxHistoryItems);
      
      saveSearchHistory(newHistory);
      return newHistory;
    });
  }, [maxHistoryItems, saveSearchHistory]);

  // 执行搜索
  const handleSearch = useCallback((keyword: string) => {
    const trimmedKeyword = keyword.trim();
    setSearchKeyword(trimmedKeyword);
    setShowHistory(false);
    
    if (trimmedKeyword) {
      setIsSearching(true);
      addToHistory(trimmedKeyword);
    }
  }, [addToHistory]);

  // 清空搜索
  const handleClearSearch = useCallback(() => {
    setSearchKeyword('');
    setIsSearching(false);
    setShowHistory(false);
  }, []);

  // 从历史记录搜索
  const handleSearchFromHistory = useCallback((keyword: string) => {
    handleSearch(keyword);
  }, [handleSearch]);

  // 删除历史记录项
  const removeFromHistory = useCallback((keyword: string) => {
    setSearchHistory(prev => {
      const newHistory = prev.filter(item => item !== keyword);
      saveSearchHistory(newHistory);
      return newHistory;
    });
  }, [saveSearchHistory]);

  // 清空历史记录
  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    saveSearchHistory([]);
  }, [saveSearchHistory]);

  // 显示历史记录
  const showSearchHistory = useCallback(() => {
    setShowHistory(true);
  }, []);

  // 隐藏历史记录
  const hideSearchHistory = useCallback(() => {
    setShowHistory(false);
  }, []);

  // 输入变化处理
  const handleInputChange = useCallback((value: string) => {
    setSearchKeyword(value);
    setIsSearching(!!value.trim());
    
    // 显示历史记录（如果输入为空且有历史记录）
    if (!value.trim() && searchHistory.length > 0) {
      setShowHistory(true);
    } else {
      setShowHistory(false);
    }
  }, [searchHistory.length]);

  // 输入焦点处理
  const handleInputFocus = useCallback(() => {
    if (!searchKeyword.trim() && searchHistory.length > 0) {
      setShowHistory(true);
    }
  }, [searchKeyword, searchHistory.length]);

  // 输入失焦处理（延迟隐藏历史记录，允许点击历史项）
  const handleInputBlur = useCallback(() => {
    setTimeout(() => {
      setShowHistory(false);
    }, 200);
  }, []);

  return {
    // 状态
    searchKeyword,
    searchHistory,
    isSearching,
    showHistory,
    debouncedKeyword,

    // 方法
    handleSearch,
    handleClearSearch,
    handleSearchFromHistory,
    removeFromHistory,
    clearHistory,
    showSearchHistory,
    hideSearchHistory,
    handleInputChange,
    handleInputFocus,
    handleInputBlur,

    // 工具方法
    addToHistory
  };
}