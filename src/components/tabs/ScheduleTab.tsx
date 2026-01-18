/**
 * 旅行日程タブ
 * 
 * - 日別スケジュールの管理
 * - 時間スロット（12:00~13:00形式）
 * - 移動手段アイコン表示
 * - 場所検索とスポット追加
 */

'use client';

import { useState } from 'react';
import { Spot, DaySchedule, ScheduleItem, TransportType, TRANSPORT_ICONS, TRANSPORT_LABELS } from '@/types/trip';
import PlaceSearch from '@/components/PlaceSearch';

// 利用可能な移動手段
const TRANSPORT_OPTIONS: TransportType[] = [
  'walk', 'car', 'train', 'bus', 'plane', 'ship', 'bicycle', 'taxi', 'other'
];

interface ScheduleTabProps {
  /** 旅行日程 */
  dates: string[];
  /** 日別スケジュール */
  schedule: DaySchedule[];
  /** 日付追加コールバック */
  onAddDate: (date: string) => void;
  /** 日付削除コールバック */
  onRemoveDate: (date: string) => void;
  /** 日程追加コールバック */
  onAddDaySchedule: (date: string) => void;
  /** 日程削除コールバック */
  onRemoveDaySchedule: (dayId: string) => void;
  /** スケジュールアイテム追加コールバック */
  onAddScheduleItem: (dayId: string, item: Omit<ScheduleItem, 'id'>) => void;
  /** スケジュールアイテム更新コールバック */
  onUpdateScheduleItem: (dayId: string, itemId: string, updates: Partial<ScheduleItem>) => void;
  /** スケジュールアイテム削除コールバック */
  onRemoveScheduleItem: (dayId: string, itemId: string) => void;
  /** 移動手段更新コールバック */
  onUpdateTransport: (dayId: string, itemId: string, transport: TransportType | undefined) => void;
}

export default function ScheduleTab({
  dates,
  schedule,
  onAddDate,
  onRemoveDate,
  onAddDaySchedule,
  onRemoveDaySchedule,
  onAddScheduleItem,
  onUpdateScheduleItem,
  onRemoveScheduleItem,
  onUpdateTransport,
}: ScheduleTabProps) {
  // 新しい日付入力用
  const [newDate, setNewDate] = useState('');
  // 編集中のアイテム
  const [editingItem, setEditingItem] = useState<{ dayId: string; itemId: string } | null>(null);
  // 新規アイテム追加モード
  const [addingToDayId, setAddingToDayId] = useState<string | null>(null);
  // 新規アイテム入力
  const [newItemForm, setNewItemForm] = useState<{
    title: string;
    startTime: string;
    endTime: string;
    memo: string;
    spot?: Spot;
  }>({
    title: '',
    startTime: '',
    endTime: '',
    memo: '',
    spot: undefined,
  });

  // 日付追加ハンドラ
  const handleAddDate = () => {
    if (newDate && !dates.includes(newDate)) {
      onAddDate(newDate);
      onAddDaySchedule(newDate);
      setNewDate('');
    }
  };

  // 日付削除ハンドラ
  const handleRemoveDate = (date: string) => {
    const daySchedule = schedule.find(s => s.date === date);
    if (daySchedule) {
      onRemoveDaySchedule(daySchedule.id);
    }
    onRemoveDate(date);
  };

  // 新規アイテム追加ハンドラ
  const handleAddItem = (dayId: string) => {
    if (!newItemForm.title.trim()) return;
    
    onAddScheduleItem(dayId, {
      title: newItemForm.title.trim(),
      startTime: newItemForm.startTime || undefined,
      endTime: newItemForm.endTime || undefined,
      memo: newItemForm.memo.trim() || undefined,
      spot: newItemForm.spot,
    });
    
    setNewItemForm({ title: '', startTime: '', endTime: '', memo: '', spot: undefined });
    setAddingToDayId(null);
  };

  // スポット選択時のハンドラ（フォーム内で使用）
  const handleSpotSelectInForm = (spot: Spot) => {
    setNewItemForm(prev => ({
      ...prev,
      title: spot.name,
      spot,
    }));
  };

  // 日付をフォーマット
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ja-JP', {
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  // 時間をフォーマット
  const formatTimeRange = (startTime?: string, endTime?: string) => {
    if (!startTime && !endTime) return null;
    if (startTime && endTime) return `${startTime}〜${endTime}`;
    if (startTime) return `${startTime}〜`;
    return `〜${endTime}`;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* セクション: 日程追加 */}
      <section className="bg-white rounded-xl p-4 shadow-sm">
        <h2 className="text-lg font-bold mb-3">📅 日程を追加</h2>
        <div className="flex gap-2">
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-base"
          />
          <button
            onClick={handleAddDate}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium active:bg-blue-600"
          >
            追加
          </button>
        </div>
      </section>

      {/* セクション: 日別スケジュール */}
      {schedule.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <p className="text-gray-500">日程がまだ設定されていません</p>
          <p className="text-gray-400 text-sm mt-1">上から日付を追加してください</p>
        </div>
      ) : (
        schedule.map((day, dayIndex) => (
          <section key={day.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* 日付ヘッダー */}
            <div className="bg-blue-500 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">Day {dayIndex + 1}</span>
                <span className="text-sm opacity-90">{formatDate(day.date)}</span>
              </div>
              <button
                onClick={() => handleRemoveDate(day.date)}
                className="text-white/80 hover:text-white text-sm"
              >
                削除
              </button>
            </div>

            {/* スケジュールアイテム一覧 */}
            <div className="p-4">
              {day.items.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">
                  予定がありません
                </p>
              ) : (
                <div className="space-y-3">
                  {day.items.map((item, itemIndex) => (
                    <div key={item.id}>
                      {/* スケジュールアイテム */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            {/* 時間表示 */}
                            {formatTimeRange(item.startTime, item.endTime) && (
                              <p className="text-blue-600 text-sm font-medium mb-1">
                                🕐 {formatTimeRange(item.startTime, item.endTime)}
                              </p>
                            )}
                            {/* タイトル */}
                            <p className="font-medium truncate">{item.title}</p>
                            {/* Google Mapリンク */}
                            {item.spot && (
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.title)}&query_place_id=${item.spot.placeId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-blue-500 text-xs mt-1 hover:underline"
                              >
                                🗺️ Google Mapで開く
                              </a>
                            )}
                            {/* メモ */}
                            {item.memo && (
                              <p className="text-gray-500 text-sm mt-1">{item.memo}</p>
                            )}
                          </div>
                          {/* 編集・削除ボタン */}
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => setEditingItem(
                                editingItem?.itemId === item.id ? null : { dayId: day.id, itemId: item.id }
                              )}
                              className="text-gray-400 hover:text-gray-600 p-1"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => onRemoveScheduleItem(day.id, item.id)}
                              className="text-gray-400 hover:text-red-500 p-1"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>

                        {/* 編集フォーム */}
                        {editingItem?.dayId === day.id && editingItem?.itemId === item.id && (
                          <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                            {/* 行き先検索 */}
                            <div>
                              <label className="text-xs text-gray-600 mb-1 block">📍 行き先を検索</label>
                              <PlaceSearch 
                                onPlaceSelect={(spot) => {
                                  onUpdateScheduleItem(day.id, item.id, { title: spot.name, spot });
                                }} 
                              />
                              {item.spot && (
                                <p className="text-xs text-green-600 mt-2">✓ {item.title}</p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="time"
                                value={item.startTime || ''}
                                onChange={(e) => onUpdateScheduleItem(day.id, item.id, { startTime: e.target.value || undefined })}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                              <span className="flex items-center text-gray-400">〜</span>
                              <input
                                type="time"
                                value={item.endTime || ''}
                                onChange={(e) => onUpdateScheduleItem(day.id, item.id, { endTime: e.target.value || undefined })}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                            </div>
                            <textarea
                              value={item.memo || ''}
                              onChange={(e) => onUpdateScheduleItem(day.id, item.id, { memo: e.target.value || undefined })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder="メモ"
                              rows={2}
                            />
                            <button
                              onClick={() => setEditingItem(null)}
                              className="w-full py-2 bg-gray-200 text-gray-700 rounded-lg text-sm"
                            >
                              編集を閉じる
                            </button>
                          </div>
                        )}
                      </div>

                      {/* 移動手段（最後のアイテム以外に表示） */}
                      {itemIndex < day.items.length - 1 && (
                        <div className="flex items-center justify-center py-2">
                          <div className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1">
                            <span className="text-lg">
                              {item.transportToNext ? TRANSPORT_ICONS[item.transportToNext] : '↓'}
                            </span>
                            <select
                              value={item.transportToNext || ''}
                              onChange={(e) => onUpdateTransport(
                                day.id, 
                                item.id, 
                                e.target.value as TransportType || undefined
                              )}
                              className="bg-transparent text-sm text-gray-600 border-none outline-none cursor-pointer"
                            >
                              <option value="">移動手段</option>
                              {TRANSPORT_OPTIONS.map(t => (
                                <option key={t} value={t}>
                                  {TRANSPORT_ICONS[t]} {TRANSPORT_LABELS[t]}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* 予定追加ボタン/フォーム */}
              {addingToDayId === day.id ? (
                <div className="mt-4 bg-blue-50 rounded-lg p-3 space-y-3">
                  {/* 行き先検索 */}
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">📍 行き先を検索（必須）</label>
                    <PlaceSearch onPlaceSelect={handleSpotSelectInForm} />
                    {newItemForm.spot && (
                      <p className="text-xs text-green-600 mt-2">✓ {newItemForm.title}</p>
                    )}
                  </div>
                  
                  {/* 時間入力 */}
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">🕐 時間</label>
                    <div className="flex gap-2">
                      <input
                        type="time"
                        value={newItemForm.startTime}
                        onChange={(e) => setNewItemForm(prev => ({ ...prev, startTime: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <span className="flex items-center text-gray-400">〜</span>
                      <input
                        type="time"
                        value={newItemForm.endTime}
                        onChange={(e) => setNewItemForm(prev => ({ ...prev, endTime: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                  
                  {/* メモ */}
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">📝 メモ</label>
                    <textarea
                      value={newItemForm.memo}
                      onChange={(e) => setNewItemForm(prev => ({ ...prev, memo: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="メモ（任意）"
                      rows={2}
                    />
                  </div>
                  
                  {/* ボタン */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        setAddingToDayId(null);
                        setNewItemForm({ title: '', startTime: '', endTime: '', memo: '', spot: undefined });
                      }}
                      className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={() => handleAddItem(day.id)}
                      disabled={!newItemForm.title.trim()}
                      className="flex-1 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      追加
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAddingToDayId(day.id)}
                  className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500"
                >
                  ＋ 予定を追加
                </button>
              )}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
