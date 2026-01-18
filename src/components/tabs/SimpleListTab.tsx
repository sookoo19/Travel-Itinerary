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
      <h2 className="text-lg font-bold">
        {icon} {title}
      </h2>

      {/* 入力フォーム */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-3 bg-blue-500 text-white rounded-lg font-medium active:bg-blue-600"
        >
          追加
        </button>
      </div>

      {/* リスト表示 */}
      {items.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-8">
          まだ項目がありません
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg"
            >
              <span className="text-base flex-1 mr-2">{item}</span>
              <button
                onClick={() => onRemove(index)}
                className="text-red-500 text-sm px-2 py-1 shrink-0"
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* 項目数カウント */}
      {items.length > 0 && (
        <p className="text-gray-500 text-sm text-right">
          合計: {items.length} 件
        </p>
      )}
    </div>
  );
}
