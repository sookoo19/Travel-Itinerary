/**
 * アプリケーションヘッダー
 * 
 * 旅行タイトルの表示と編集、共有ボタンを含む
 */

'use client';

import { useState } from 'react';
import { generateShareUrl } from '@/utils/urlCodec';
import { Trip } from '@/types/trip';

interface HeaderProps {
  /** 旅行タイトル */
  title: string;
  /** タイトル変更コールバック */
  onTitleChange: (title: string) => void;
  /** Trip データ（共有URL生成用） */
  trip: Trip;
}

export default function Header({ title, onTitleChange, trip }: HeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [showCopied, setShowCopied] = useState(false);

  // タイトル編集開始
  const handleStartEdit = () => {
    setEditTitle(title);
    setIsEditing(true);
  };

  // タイトル編集保存
  const handleSave = () => {
    if (editTitle.trim()) {
      onTitleChange(editTitle.trim());
    }
    setIsEditing(false);
  };

  // 共有URL をクリップボードにコピー
  const handleShare = async () => {
    const url = generateShareUrl(trip);
    try {
      await navigator.clipboard.writeText(url);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      // フォールバック: 選択コピー用のテキストボックスを表示
      console.error('クリップボードへのコピーに失敗:', err);
      prompt('共有URLをコピーしてください:', url);
    }
  };

  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-sm shadow-sm z-40">
      <div className="max-w-[375px] mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          {/* タイトル部分 */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-lg font-bold focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all duration-150"
                  autoFocus
                />
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-[#A5B4FC] text-white rounded-full text-sm font-medium transition-all duration-150 hover:opacity-90"
                >
                  保存
                </button>
              </div>
            ) : (
              <button
                onClick={handleStartEdit}
                className="text-left w-full transition-all duration-150"
              >
                <h1 className="text-xl font-bold text-slate-700 truncate">
                  ✈️ {title}
                </h1>
                <p className="text-xs text-slate-400">タップして編集</p>
              </button>
            )}
          </div>

          {/* 共有ボタン */}
          <button
            onClick={handleShare}
            className="shrink-0 px-4 py-2 bg-[#6EE7B7] text-slate-700 rounded-full text-sm font-medium transition-all duration-150 hover:opacity-90"
          >
            {showCopied ? '✓ コピー済み' : '🔗 共有'}
          </button>
        </div>
      </div>
    </header>
  );
}
