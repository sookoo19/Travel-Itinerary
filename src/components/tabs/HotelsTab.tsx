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
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">🏨 宿泊情報</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm font-medium"
          >
            + 追加
          </button>
        )}
      </div>

      {/* 新規追加フォーム */}
      {isAdding && (
        <div className="bg-blue-50 p-4 rounded-lg space-y-3">
          <input
            type="text"
            value={newHotel.name}
            onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
            placeholder="宿泊施設名"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base"
          />
          <input
            type="text"
            value={newHotel.address}
            onChange={(e) => setNewHotel({ ...newHotel, address: e.target.value })}
            placeholder="住所"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base"
          />
          <textarea
            value={newHotel.memo || ''}
            onChange={(e) => setNewHotel({ ...newHotel, memo: e.target.value })}
            placeholder="メモ（チェックイン時間など）"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base resize-none"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveNew}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium"
            >
              保存
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewHotel({ name: '', address: '', memo: '' });
              }}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* 宿泊施設リスト */}
      {hotels.length === 0 && !isAdding ? (
        <p className="text-gray-500 text-sm text-center py-8">
          宿泊施設がまだ登録されていません
        </p>
      ) : (
        <ul className="space-y-3">
          {hotels.map((hotel, index) => (
            <li key={index} className="bg-gray-50 p-4 rounded-lg">
              {editingIndex === index && editingHotel ? (
                // 編集モード
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editingHotel.name}
                    onChange={(e) =>
                      setEditingHotel({ ...editingHotel, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base"
                  />
                  <input
                    type="text"
                    value={editingHotel.address}
                    onChange={(e) =>
                      setEditingHotel({ ...editingHotel, address: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base"
                  />
                  <textarea
                    value={editingHotel.memo || ''}
                    onChange={(e) =>
                      setEditingHotel({ ...editingHotel, memo: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base resize-none"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium text-sm"
                    >
                      保存
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium text-sm"
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
                      <h3 className="font-bold text-base">{hotel.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{hotel.address}</p>
                      {hotel.memo && (
                        <p className="text-sm text-gray-500 mt-1">📝 {hotel.memo}</p>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleStartEdit(index)}
                        className="text-blue-500 text-sm px-2 py-1"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => onRemove(index)}
                        className="text-red-500 text-sm px-2 py-1"
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
      )}
    </div>
  );
}
