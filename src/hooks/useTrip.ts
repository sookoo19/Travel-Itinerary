/**
 * Trip 状態管理カスタムフック
 * 
 * Tripデータの状態管理とURL同期を行います。
 * useState/useEffectのみを使用し、外部ライブラリは使用しません。
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Trip, Spot, Hotel, Emergency, DaySchedule, ScheduleItem, TransportType, createEmptyTrip, generateId } from '@/types/trip';
import { getTripFromUrl, updateUrlWithTrip } from '@/utils/urlCodec';

/**
 * Trip状態管理フック
 * 
 * @returns Trip状態と各種更新関数
 */
export function useTrip() {
  // 初期化フラグ（クライアントサイドのみtrue）
  const isInitializedRef = useRef(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Trip の状態（初期値はクライアントサイドでURLから読み込み）
  const [trip, setTrip] = useState<Trip>(() => {
    // SSR時は空のTripを返す
    if (typeof window === 'undefined') {
      return createEmptyTrip();
    }
    // クライアントサイドでURLから復元
    return getTripFromUrl();
  });

  // 初期化完了をマーク（クライアントサイドのみ）
  // Note: このuseEffectでのsetState呼び出しは意図的なもので、
  // ハイドレーション後にURLからデータを再読み込みするために必要
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      // ハイドレーション完了後、URLから最新の状態を取得
      const tripFromUrl = getTripFromUrl();
      // setTimeoutで遅延させてカスケードレンダリングを回避
      setTimeout(() => {
        setTrip(prev => {
          if (JSON.stringify(prev) === JSON.stringify(tripFromUrl)) {
            return prev;
          }
          return tripFromUrl;
        });
        setIsInitialized(true);
      }, 0);
    }
  }, []);

  // Trip が更新されたら URL も更新
  useEffect(() => {
    if (isInitialized) {
      updateUrlWithTrip(trip);
    }
  }, [trip, isInitialized]);

  // === タイトル ===
  const updateTitle = useCallback((title: string) => {
    setTrip(prev => ({ ...prev, title }));
  }, []);

  // === 日付 ===
  const addDate = useCallback((date: string) => {
    setTrip(prev => ({
      ...prev,
      dates: [...prev.dates, date].sort(),
    }));
  }, []);

  const removeDate = useCallback((date: string) => {
    setTrip(prev => ({
      ...prev,
      dates: prev.dates.filter(d => d !== date),
    }));
  }, []);

  // === スポット ===
  const addSpot = useCallback((spot: Spot) => {
    setTrip(prev => ({
      ...prev,
      spots: [...prev.spots, spot],
    }));
  }, []);

  const removeSpot = useCallback((index: number) => {
    setTrip(prev => ({
      ...prev,
      spots: prev.spots.filter((_, i) => i !== index),
    }));
  }, []);

  // === やりたいことリスト ===
  const addTodo = useCallback((todo: string) => {
    if (!todo.trim()) return;
    setTrip(prev => ({
      ...prev,
      todos: [...prev.todos, todo.trim()],
    }));
  }, []);

  const removeTodo = useCallback((index: number) => {
    setTrip(prev => ({
      ...prev,
      todos: prev.todos.filter((_, i) => i !== index),
    }));
  }, []);

  // === 持ち物リスト ===
  const addItem = useCallback((item: string) => {
    if (!item.trim()) return;
    setTrip(prev => ({
      ...prev,
      items: [...prev.items, item.trim()],
    }));
  }, []);

  const removeItem = useCallback((index: number) => {
    setTrip(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }, []);

  // === 宿泊施設 ===
  const addHotel = useCallback((hotel: Hotel) => {
    setTrip(prev => ({
      ...prev,
      hotels: [...prev.hotels, hotel],
    }));
  }, []);

  const updateHotel = useCallback((index: number, hotel: Hotel) => {
    setTrip(prev => ({
      ...prev,
      hotels: prev.hotels.map((h, i) => i === index ? hotel : h),
    }));
  }, []);

  const removeHotel = useCallback((index: number) => {
    setTrip(prev => ({
      ...prev,
      hotels: prev.hotels.filter((_, i) => i !== index),
    }));
  }, []);

  // === 緊急連絡先 ===
  const addEmergency = useCallback((emergency: Emergency) => {
    setTrip(prev => ({
      ...prev,
      emergencies: [...prev.emergencies, emergency],
    }));
  }, []);

  const updateEmergency = useCallback((index: number, emergency: Emergency) => {
    setTrip(prev => ({
      ...prev,
      emergencies: prev.emergencies.map((e, i) => i === index ? emergency : e),
    }));
  }, []);

  const removeEmergency = useCallback((index: number) => {
    setTrip(prev => ({
      ...prev,
      emergencies: prev.emergencies.filter((_, i) => i !== index),
    }));
  }, []);

  // === スケジュール（日程管理） ===
  
  // 日程を追加
  const addDaySchedule = useCallback((date: string) => {
    setTrip(prev => {
      // 既に同じ日付があれば追加しない
      if (prev.schedule.some(s => s.date === date)) {
        return prev;
      }
      const newSchedule: DaySchedule = {
        id: generateId(),
        date,
        items: [],
      };
      return {
        ...prev,
        schedule: [...prev.schedule, newSchedule].sort((a, b) => a.date.localeCompare(b.date)),
      };
    });
  }, []);

  // 日程を削除
  const removeDaySchedule = useCallback((dayId: string) => {
    setTrip(prev => ({
      ...prev,
      schedule: prev.schedule.filter(s => s.id !== dayId),
    }));
  }, []);

  // スケジュールアイテムを追加
  const addScheduleItem = useCallback((dayId: string, item: Omit<ScheduleItem, 'id'>) => {
    setTrip(prev => ({
      ...prev,
      schedule: prev.schedule.map(day => {
        if (day.id !== dayId) return day;
        const newItem: ScheduleItem = {
          ...item,
          id: generateId(),
        };
        return {
          ...day,
          items: [...day.items, newItem].sort((a, b) => (a.startTime || '').localeCompare(b.startTime || '')),
        };
      }),
    }));
  }, []);

  // スケジュールアイテムを更新
  const updateScheduleItem = useCallback((dayId: string, itemId: string, updates: Partial<ScheduleItem>) => {
    setTrip(prev => ({
      ...prev,
      schedule: prev.schedule.map(day => {
        if (day.id !== dayId) return day;
        return {
          ...day,
          items: day.items
            .map(item => item.id === itemId ? { ...item, ...updates } : item)
            .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || '')),
        };
      }),
    }));
  }, []);

  // スケジュールアイテムを削除
  const removeScheduleItem = useCallback((dayId: string, itemId: string) => {
    setTrip(prev => ({
      ...prev,
      schedule: prev.schedule.map(day => {
        if (day.id !== dayId) return day;
        return {
          ...day,
          items: day.items.filter(item => item.id !== itemId),
        };
      }),
    }));
  }, []);

  // 移動手段を更新
  const updateTransportToNext = useCallback((dayId: string, itemId: string, transport: TransportType | undefined) => {
    setTrip(prev => ({
      ...prev,
      schedule: prev.schedule.map(day => {
        if (day.id !== dayId) return day;
        return {
          ...day,
          items: day.items.map(item => 
            item.id === itemId ? { ...item, transportToNext: transport } : item
          ),
        };
      }),
    }));
  }, []);

  return {
    trip,
    isInitialized,
    // タイトル
    updateTitle,
    // 日付
    addDate,
    removeDate,
    // スポット
    addSpot,
    removeSpot,
    // やりたいこと
    addTodo,
    removeTodo,
    // 持ち物
    addItem,
    removeItem,
    // 宿泊施設
    addHotel,
    updateHotel,
    removeHotel,
    // 緊急連絡先
    addEmergency,
    updateEmergency,
    removeEmergency,
    // スケジュール（日程管理）
    addDaySchedule,
    removeDaySchedule,
    addScheduleItem,
    updateScheduleItem,
    removeScheduleItem,
    updateTransportToNext,
  };
}
