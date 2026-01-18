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
      <div ref={ref} className="bg-base p-4">
        {/* PDF用のスタイル（印刷時に適用） */}
        <style jsx>{`
          @media print {
            .no-print {
              display: none;
            }
          }
        `}</style>

        {/* ヘッダー */}
        <header className="text-center mb-6 pb-4 border-b-2 border-main/30">
          <h1 className="text-2xl font-bold text-text-main">✈️ {trip.title}</h1>
          {trip.dates.length > 0 && (
            <p className="text-sm text-text-sub mt-2">
              {trip.dates[0]} 〜 {trip.dates[trip.dates.length - 1]}
            </p>
          )}
        </header>

        {/* 日程 */}
        {trip.schedule.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold mb-3 text-text-main flex items-center gap-2">
              <span className="text-xl">📅</span>
              <span>旅行日程</span>
            </h2>
            
            {/* 日付タブ */}
            <div className="flex gap-2 mb-4 overflow-x-auto no-print">
              {trip.schedule.map((day, dayIndex) => (
                <button
                  key={day.id}
                  onClick={() => setSelectedDayIndex(dayIndex)}
                  className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                    selectedDayIndex === dayIndex
                      ? 'bg-main text-white'
                      : 'bg-white text-text-sub hover:bg-main/10 border border-main/20'
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
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* 日付ヘッダー */}
                <div className="bg-main text-white px-4 py-3">
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
                  <div className="p-4 space-y-3">
                    {trip.schedule[selectedDayIndex].items.map((item, itemIndex) => (
                      <div key={item.id}>
                        <div className="bg-sub/10 rounded-xl p-3 border border-sub/20">
                          {/* 時間 */}
                          {(item.startTime || item.endTime) && (
                            <p className="text-xs text-main font-medium mb-1">
                              🕐 {item.startTime && item.endTime 
                                ? `${item.startTime}〜${item.endTime}`
                                : item.startTime 
                                ? `${item.startTime}〜`
                                : `〜${item.endTime}`
                              }
                            </p>
                          )}
                          {/* タイトル */}
                          <p className="text-text-main font-medium">{item.title}</p>
                          {/* Google Mapリンク */}
                          {item.spot && (
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.title)}&query_place_id=${item.spot.placeId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-main hover:underline inline-block mt-1 no-print"
                            >
                              🗺️ Google Mapで開く
                            </a>
                          )}
                          {/* メモ */}
                          {item.memo && (
                            <p className="text-xs text-text-sub mt-1">📝 {item.memo}</p>
                          )}
                        </div>
                        
                        {/* 移動手段（最後以外） */}
                        {itemIndex < trip.schedule[selectedDayIndex].items.length - 1 && item.transportToNext && (
                          <div className="flex items-center justify-center py-2">
                            <div className="text-xs text-text-sub bg-accent/20 px-3 py-1 rounded-full">
                              {TRANSPORT_ICONS[item.transportToNext]} {TRANSPORT_LABELS[item.transportToNext]}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="p-4 text-sm text-text-sub">予定なし</p>
                )}
              </div>
            )}
          </section>
        )}

        {/* 旧形式の日程表示（scheduleが空の場合のみ） */}
        {trip.schedule.length === 0 && trip.dates.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold mb-2 text-text-main flex items-center gap-2">
              <span className="text-xl">📅</span>
              <span>旅行日程</span>
            </h2>
            <ul className="list-disc list-inside text-text-sub">
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
            <h2 className="text-lg font-bold mb-2 text-text-main flex items-center gap-2">
              <span className="text-xl">📍</span>
              <span>訪問予定スポット</span>
            </h2>
            <ul className="list-disc list-inside text-text-sub">
              {trip.spots.map((spot, index) => (
                <li key={index}>{spot.name}</li>
              ))}
            </ul>
          </section>
        )}

        {/* やりたいこと */}
        {trip.todos.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold mb-2 text-text-main flex items-center gap-2">
              <span className="text-xl">✅</span>
              <span>やりたいこと</span>
            </h2>
            <ul className="space-y-2">
              {trip.todos.map((todo, index) => (
                <li key={index} className="flex items-center gap-3 text-text-sub bg-sub/10 px-3 py-2 rounded-xl">
                  <span className="w-4 h-4 border-2 border-sub rounded shrink-0" />
                  {todo}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 持ち物 */}
        {trip.items.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold mb-2 text-text-main flex items-center gap-2">
              <span className="text-xl">🎒</span>
              <span>持ち物リスト</span>
            </h2>
            <ul className="space-y-2">
              {trip.items.map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-text-sub bg-accent/10 px-3 py-2 rounded-xl">
                  <span className="w-4 h-4 border-2 border-accent rounded shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 宿泊情報 */}
        {trip.hotels.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold mb-2 text-text-main flex items-center gap-2">
              <span className="text-xl">🏨</span>
              <span>宿泊情報</span>
            </h2>
            <ul className="space-y-3">
              {trip.hotels.map((hotel, index) => (
                <li key={index} className="bg-main/10 p-4 rounded-xl border border-main/20">
                  <p className="font-bold text-text-main">{hotel.name}</p>
                  <p className="text-sm text-text-sub mt-1">📍 {hotel.address}</p>
                  {hotel.memo && (
                    <p className="text-sm text-text-sub mt-1">📝 {hotel.memo}</p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 緊急連絡先 */}
        {trip.emergencies.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold mb-2 text-text-main flex items-center gap-2">
              <span className="text-xl">🆘</span>
              <span>緊急連絡先</span>
            </h2>
            <ul className="space-y-2">
              {trip.emergencies.map((emergency, index) => (
                <li key={index} className="bg-warn/10 p-4 rounded-xl border border-warn/20">
                  <p className="font-bold text-text-main">{emergency.name}</p>
                  <p className="text-warn font-medium mt-1">📞 {emergency.phone}</p>
                  {emergency.memo && (
                    <p className="text-sm text-text-sub mt-1">📝 {emergency.memo}</p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* フッター */}
        <footer className="text-center text-xs text-text-sub pt-4 border-t border-main/20">
          旅のしおり - 作成日: {new Date().toLocaleDateString('ja-JP')}
        </footer>
      </div>
    );
  }
);

export default PreviewTab;
