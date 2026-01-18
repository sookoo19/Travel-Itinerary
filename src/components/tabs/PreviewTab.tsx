/**
 * プレビュー / PDF 用コンポーネント
 * 
 * しおり全体を縦に一覧表示する画面。
 * 後で react-to-print または html2pdf.js を使って PDF 出力できる構造。
 */

'use client';

import { forwardRef, useState } from 'react';
import { Trip, TRANSPORT_ICONS, TRANSPORT_LABELS } from '@/types/trip';

interface PreviewTabProps {
  /** Tripデータ */
  trip: Trip;
}

/**
 * PDF出力用のプレビューコンポーネント
 * 
 * forwardRef を使用して、react-to-print などのライブラリから
 * DOM 参照を取得できるようにしています。
 */
const PreviewTab = forwardRef<HTMLDivElement, PreviewTabProps>(
  function PreviewTab({ trip }, ref) {
    // 選択中の日程インデックス
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    
    return (
      <div ref={ref} className="bg-white p-4">
        {/* PDF用のスタイル（印刷時に適用） */}
        <style jsx>{`
          @media print {
            .no-print {
              display: none;
            }
          }
        `}</style>

        {/* ヘッダー */}
        <header className="text-center mb-6 pb-4 border-b-2 border-gray-300">
          <h1 className="text-2xl font-bold text-gray-800">✈️ {trip.title}</h1>
          {trip.dates.length > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              {trip.dates[0]} 〜 {trip.dates[trip.dates.length - 1]}
            </p>
          )}
        </header>

        {/* 日程 */}
        {trip.schedule.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold mb-3 text-gray-700">📅 旅行日程</h2>
            
            {/* 日付タブ */}
            <div className="flex gap-2 mb-4 overflow-x-auto no-print">
              {trip.schedule.map((day, dayIndex) => (
                <button
                  key={day.id}
                  onClick={() => setSelectedDayIndex(dayIndex)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedDayIndex === dayIndex
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Day {dayIndex + 1}
                  <span className="text-xs ml-1">
                    ({new Date(day.date).toLocaleDateString('ja-JP', {
                      month: 'short',
                      day: 'numeric',
                    })})
                  </span>
                </button>
              ))}
            </div>

            {/* 選択された日程の表示 */}
            {trip.schedule[selectedDayIndex] && (
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                {/* 日付ヘッダー */}
                <div className="bg-blue-500 text-white px-3 py-2">
                  <span className="font-bold">Day {selectedDayIndex + 1}</span>
                  <span className="ml-2 text-sm">
                    {new Date(trip.schedule[selectedDayIndex].date).toLocaleDateString('ja-JP', {
                      month: 'long',
                      day: 'numeric',
                      weekday: 'short',
                    })}
                  </span>
                </div>
                
                {/* スケジュールアイテム */}
                {trip.schedule[selectedDayIndex].items.length > 0 ? (
                  <div className="p-3 space-y-2">
                    {trip.schedule[selectedDayIndex].items.map((item, itemIndex) => (
                      <div key={item.id}>
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            {/* 時間 */}
                            {(item.startTime || item.endTime) && (
                              <p className="text-xs text-blue-600 font-medium">
                                🕐 {item.startTime && item.endTime 
                                  ? `${item.startTime}〜${item.endTime}`
                                  : item.startTime 
                                  ? `${item.startTime}〜`
                                  : `〜${item.endTime}`
                                }
                              </p>
                            )}
                            {/* タイトル */}
                            <p className="text-gray-800 font-medium">{item.title}</p>
                            {/* Google Mapリンク */}
                            {item.spot && (
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.title)}&query_place_id=${item.spot.placeId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-500 hover:underline inline-block mt-1 no-print"
                              >
                                🗺️ Google Mapで開く
                              </a>
                            )}
                            {/* メモ */}
                            {item.memo && (
                              <p className="text-xs text-gray-600 mt-1">📝 {item.memo}</p>
                            )}
                          </div>
                        </div>
                        
                        {/* 移動手段（最後以外） */}
                        {itemIndex < trip.schedule[selectedDayIndex].items.length - 1 && item.transportToNext && (
                          <div className="flex items-center justify-center py-1">
                            <div className="text-xs text-gray-500">
                              {TRANSPORT_ICONS[item.transportToNext]} {TRANSPORT_LABELS[item.transportToNext]}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="p-3 text-sm text-gray-500">予定なし</p>
                )}
              </div>
            )}
          </section>
        )}

        {/* 旧形式の日程表示（scheduleが空の場合のみ） */}
        {trip.schedule.length === 0 && trip.dates.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold mb-2 text-gray-700">📅 旅行日程</h2>
            <ul className="list-disc list-inside text-gray-600">
              {trip.dates.map((date) => (
                <li key={date}>
                  {new Date(date).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'short',
                  })}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* スポット（scheduleが空の場合のみ） */}
        {trip.schedule.length === 0 && trip.spots.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold mb-2 text-gray-700">📍 訪問予定スポット</h2>
            <ul className="list-disc list-inside text-gray-600">
              {trip.spots.map((spot, index) => (
                <li key={index}>{spot.name}</li>
              ))}
            </ul>
          </section>
        )}

        {/* やりたいこと */}
        {trip.todos.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold mb-2 text-gray-700">✅ やりたいこと</h2>
            <ul className="space-y-1">
              {trip.todos.map((todo, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-600">
                  <span className="w-4 h-4 border border-gray-400 rounded-sm shrink-0" />
                  {todo}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 持ち物 */}
        {trip.items.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold mb-2 text-gray-700">🎒 持ち物リスト</h2>
            <ul className="space-y-1">
              {trip.items.map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-600">
                  <span className="w-4 h-4 border border-gray-400 rounded-sm shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 宿泊情報 */}
        {trip.hotels.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold mb-2 text-gray-700">🏨 宿泊情報</h2>
            <ul className="space-y-3">
              {trip.hotels.map((hotel, index) => (
                <li key={index} className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-bold text-gray-800">{hotel.name}</p>
                  <p className="text-sm text-gray-600">{hotel.address}</p>
                  {hotel.memo && (
                    <p className="text-sm text-gray-500 mt-1">📝 {hotel.memo}</p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 緊急連絡先 */}
        {trip.emergencies.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold mb-2 text-gray-700">🆘 緊急連絡先</h2>
            <ul className="space-y-2">
              {trip.emergencies.map((emergency, index) => (
                <li key={index} className="bg-red-50 p-3 rounded-lg">
                  <p className="font-bold text-gray-800">{emergency.name}</p>
                  <p className="text-red-600 font-medium">📞 {emergency.phone}</p>
                  {emergency.memo && (
                    <p className="text-sm text-gray-500 mt-1">📝 {emergency.memo}</p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* フッター */}
        <footer className="text-center text-xs text-gray-400 pt-4 border-t border-gray-200">
          旅のしおり - 作成日: {new Date().toLocaleDateString('ja-JP')}
        </footer>
      </div>
    );
  }
);

export default PreviewTab;
