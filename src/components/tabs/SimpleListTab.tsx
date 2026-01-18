/**
 * 汎用リストタブコンポーネント
 * 
 * 「したいことリスト」と「持っていくものリスト」の共通コンポーネント
 */

'use client';

import { useState } from 'react';

interface SimpleListTabProps {
  /** タブのタイトル */
  title: string;
  /** タイトルのアイコン */
  icon: string;
  /** リスト項目 */
  items: string[];
  /** 項目追加コールバック */
  onAdd: (item: string) => void;
  /** 項目削除コールバック */
  onRemove: (index: number) => void;
  /** 入力プレースホルダー */
  placeholder?: string;
}

export default function SimpleListTab({
  title,
  icon,
  items,
  onAdd,
  onRemove,
  placeholder = '新しい項目を入力...',
}: SimpleListTabProps) {
  const [newItem, setNewItem] = useState('');

  // 追加ハンドラ
  const handleAdd = () => {
    if (newItem.trim()) {
      onAdd(newItem.trim());
      setNewItem('');
    }
  };

  // Enter キーで追加
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ヘッダー */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <span>{title}</span>
        </h2>
      </div>

      {/* 入力フォーム */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-main transition-all"
          />
          <button
            onClick={handleAdd}
            className="px-5 py-3 bg-main text-white rounded-xl font-medium active:opacity-80 transition-all"
          >
            追加
          </button>
        </div>
      </div>

      {/* リスト表示 */}
      {items.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <p className="text-text-sub text-sm text-center">
            まだ項目がありません ✨
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-sub/10 px-4 py-3 rounded-xl border border-sub/20"
              >
                <span className="text-base text-text-main flex-1 mr-2">{item}</span>
                <button
                  onClick={() => onRemove(index)}
                  className="text-warn text-sm px-3 py-1 shrink-0 rounded-lg hover:bg-warn/10 transition-colors"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
          
          {/* 項目数カウント */}
          <p className="text-text-sub text-sm text-right mt-4 pt-3 border-t border-gray-100">
            合計: <span className="font-medium text-main">{items.length}</span> 件
          </p>
        </div>
      )}
    </div>
  );
}
