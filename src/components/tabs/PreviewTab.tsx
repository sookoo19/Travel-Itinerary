/**
 * プレビュー / PDF 用コンポーネント
 * 
 * しおり全体を縦に一覧表示する画面。
 * 後で react-to-print または html2pdf.js を使って PDF 出力できる構造。
 */

'use client';

import { forwardRef } from 'react';
import { Trip } from '@/types/trip';

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
        {trip.dates.length > 0 && (
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

        {/* スポット */}
        {trip.spots.length > 0 && (
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
