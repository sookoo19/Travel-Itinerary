/**
 * 宿泊情報タブ
 * 
 * 宿泊施設の登録・編集・削除を行うコンポーネント
 */

'use client';

import { useState } from 'react';
import { Hotel } from '@/types/trip';

interface HotelsTabProps {
  /** 宿泊施設リスト */
  hotels: Hotel[];
  /** 宿泊施設追加コールバック */
  onAdd: (hotel: Hotel) => void;
  /** 宿泊施設更新コールバック */
  onUpdate: (index: number, hotel: Hotel) => void;
  /** 宿泊施設削除コールバック */
  onRemove: (index: number) => void;
}

export default function HotelsTab({
  hotels,
  onAdd,
  onUpdate,
  onRemove,
}: HotelsTabProps) {
  // 新規入力フォームの状態
  const [isAdding, setIsAdding] = useState(false);
  const [newHotel, setNewHotel] = useState<Hotel>({
    name: '',
    address: '',
    memo: '',
  });
  // 編集中のインデックス（-1 = 編集なし）
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);

  // 新規追加の保存
  const handleSaveNew = () => {
    if (newHotel.name.trim() && newHotel.address.trim()) {
      onAdd({
        name: newHotel.name.trim(),
        address: newHotel.address.trim(),
        memo: newHotel.memo?.trim() || undefined,
      });
      setNewHotel({ name: '', address: '', memo: '' });
      setIsAdding(false);
    }
  };

  // 編集開始
  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditingHotel({ ...hotels[index] });
  };

  // 編集保存
  const handleSaveEdit = () => {
    if (editingHotel && editingHotel.name.trim() && editingHotel.address.trim()) {
      onUpdate(editingIndex, {
        ...editingHotel,
        name: editingHotel.name.trim(),
        address: editingHotel.address.trim(),
        memo: editingHotel.memo?.trim() || undefined,
      });
      setEditingIndex(-1);
      setEditingHotel(null);
    }
  };

  // 編集キャンセル
  const handleCancelEdit = () => {
    setEditingIndex(-1);
    setEditingHotel(null);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ヘッダー */}
      <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
          <span className="text-2xl">🏨</span>
          <span>宿泊情報</span>
        </h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-main text-white rounded-xl text-sm font-medium active:opacity-80 transition-all"
          >
            + 追加
          </button>
        )}
      </div>

      {/* 新規追加フォーム */}
      {isAdding && (
        <div className="bg-main/10 p-4 rounded-2xl space-y-3 border border-main/20">
          <input
            type="text"
            value={newHotel.name}
            onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
            placeholder="宿泊施設名"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-main transition-all"
          />
          <input
            type="text"
            value={newHotel.address}
            onChange={(e) => setNewHotel({ ...newHotel, address: e.target.value })}
            placeholder="住所"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-main transition-all"
          />
          <textarea
            value={newHotel.memo || ''}
            onChange={(e) => setNewHotel({ ...newHotel, memo: e.target.value })}
            placeholder="メモ（チェックイン時間など）"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-main transition-all"
            rows={2}
          />
          <div className="flex gap-3">
            <button
              onClick={handleSaveNew}
              className="flex-1 px-4 py-3 bg-main text-white rounded-xl font-medium active:opacity-80 transition-all"
            >
              保存
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewHotel({ name: '', address: '', memo: '' });
              }}
              className="flex-1 px-4 py-3 bg-gray-200 text-text-sub rounded-xl font-medium active:opacity-80 transition-all"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* 宿泊施設リスト */}
      {hotels.length === 0 && !isAdding ? (
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <p className="text-text-sub text-sm text-center">
            宿泊施設がまだ登録されていません 🏨
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <ul className="space-y-3">
            {hotels.map((hotel, index) => (
              <li key={index} className="bg-sub/10 p-4 rounded-xl border border-sub/20">
                {editingIndex === index && editingHotel ? (
                  // 編集モード
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editingHotel.name}
                      onChange={(e) =>
                        setEditingHotel({ ...editingHotel, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-main transition-all"
                    />
                    <input
                      type="text"
                      value={editingHotel.address}
                      onChange={(e) =>
                        setEditingHotel({ ...editingHotel, address: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-main transition-all"
                    />
                    <textarea
                      value={editingHotel.memo || ''}
                      onChange={(e) =>
                        setEditingHotel({ ...editingHotel, memo: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-main transition-all"
                      rows={2}
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveEdit}
                        className="flex-1 px-4 py-3 bg-main text-white rounded-xl font-medium text-sm active:opacity-80 transition-all"
                      >
                        保存
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 px-4 py-3 bg-gray-200 text-text-sub rounded-xl font-medium text-sm active:opacity-80 transition-all"
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>
                ) : (
                  // 表示モード
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-base text-text-main">{hotel.name}</h3>
                        <p className="text-sm text-text-sub mt-1">📍 {hotel.address}</p>
                        {hotel.memo && (
                          <p className="text-sm text-text-sub mt-1">📝 {hotel.memo}</p>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleStartEdit(index)}
                          className="text-main text-sm px-3 py-1 rounded-lg hover:bg-main/10 transition-colors"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => onRemove(index)}
                          className="text-warn text-sm px-3 py-1 rounded-lg hover:bg-warn/10 transition-colors"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
