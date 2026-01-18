/**
 * 旅行日程タブ
 * 
 * - 日付リストの表示・追加・削除
 * - Google Maps の表示
 * - 場所検索とスポット追加
 */

'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Spot } from '@/types/trip';
import PlaceSearch from '@/components/PlaceSearch';

// Google Maps は SSR を無効化して読み込む
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
      <p className="text-gray-500 text-sm">マップを読み込み中...</p>
    </div>
  ),
});

interface ScheduleTabProps {
  /** 旅行日程 */
  dates: string[];
  /** 訪問スポット */
  spots: Spot[];
  /** 日付追加コールバック */
  onAddDate: (date: string) => void;
  /** 日付削除コールバック */
  onRemoveDate: (date: string) => void;
  /** スポット追加コールバック */
  onAddSpot: (spot: Spot) => void;
  /** スポット削除コールバック */
  onRemoveSpot: (index: number) => void;
}

export default function ScheduleTab({
  dates,
  spots,
  onAddDate,
  onRemoveDate,
  onAddSpot,
  onRemoveSpot,
}: ScheduleTabProps) {
  // 新しい日付入力用
  const [newDate, setNewDate] = useState('');

  // 日付追加ハンドラ
  const handleAddDate = () => {
    if (newDate && !dates.includes(newDate)) {
      onAddDate(newDate);
      setNewDate('');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* セクション: 日程 */}
      <section>
        <h2 className="text-lg font-bold mb-2">📅 旅行日程</h2>
        
        {/* 日付追加フォーム */}
        <div className="flex gap-2 mb-3">
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

        {/* 日付リスト */}
        {dates.length === 0 ? (
          <p className="text-gray-500 text-sm">日程がまだ設定されていません</p>
        ) : (
          <ul className="space-y-2">
            {dates.map((date) => (
              <li
                key={date}
                className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
              >
                <span className="text-base">
                  {new Date(date).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'short',
                  })}
                </span>
                <button
                  onClick={() => onRemoveDate(date)}
                  className="text-red-500 text-sm px-2 py-1"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* セクション: 地図 */}
      <section>
        <h2 className="text-lg font-bold mb-2">🗺️ マップ</h2>
        <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-300">
          <MapComponent spots={spots} />
        </div>
      </section>

      {/* セクション: 場所検索 */}
      <section>
        <h2 className="text-lg font-bold mb-2">📍 スポットを追加</h2>
        <PlaceSearch onPlaceSelect={onAddSpot} />
      </section>

      {/* セクション: 登録済みスポット */}
      <section>
        <h2 className="text-lg font-bold mb-2">⭐ 登録済みスポット</h2>
        {spots.length === 0 ? (
          <p className="text-gray-500 text-sm">スポットがまだ登録されていません</p>
        ) : (
          <ul className="space-y-2">
            {spots.map((spot, index) => (
              <li
                key={spot.placeId || index}
                className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
              >
                <span className="text-base truncate flex-1 mr-2">{spot.name}</span>
                <button
                  onClick={() => onRemoveSpot(index)}
                  className="text-red-500 text-sm px-2 py-1 shrink-0"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
