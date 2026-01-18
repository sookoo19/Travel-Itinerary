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
    <header className="sticky top-0 bg-white border-b border-gray-200 z-40">
      <div className="max-w-[375px] mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* タイトル部分 */}
          <div className="flex-1 mr-3">
            {isEditing ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-lg font-bold"
                  autoFocus
                />
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                >
                  保存
                </button>
              </div>
            ) : (
              <button
                onClick={handleStartEdit}
                className="text-left w-full"
              >
                <h1 className="text-xl font-bold text-gray-800 truncate">
                  ✈️ {title}
                </h1>
                <p className="text-xs text-gray-400">タップして編集</p>
              </button>
            )}
          </div>

          {/* 共有ボタン */}
          <button
            onClick={handleShare}
            className="shrink-0 px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-medium active:bg-green-600 relative"
          >
            {showCopied ? '✓ コピー済み' : '🔗 共有'}
          </button>
        </div>
      </div>
    </header>
  );
}
