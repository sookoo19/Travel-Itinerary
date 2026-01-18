/**
 * 緊急連絡先タブ
 * 
 * 緊急連絡先の登録・編集・削除を行うコンポーネント
 */

'use client';

import { useState } from 'react';
import { Emergency } from '@/types/trip';

interface EmergenciesTabProps {
  /** 緊急連絡先リスト */
  emergencies: Emergency[];
  /** 追加コールバック */
  onAdd: (emergency: Emergency) => void;
  /** 更新コールバック */
  onUpdate: (index: number, emergency: Emergency) => void;
  /** 削除コールバック */
  onRemove: (index: number) => void;
}

export default function EmergenciesTab({
  emergencies,
  onAdd,
  onUpdate,
  onRemove,
}: EmergenciesTabProps) {
  // 新規入力フォームの状態
  const [isAdding, setIsAdding] = useState(false);
  const [newEmergency, setNewEmergency] = useState<Emergency>({
    name: '',
    phone: '',
    memo: '',
  });
  // 編集中のインデックス
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editingEmergency, setEditingEmergency] = useState<Emergency | null>(null);

  // 新規追加の保存
  const handleSaveNew = () => {
    if (newEmergency.name.trim() && newEmergency.phone.trim()) {
      onAdd({
        name: newEmergency.name.trim(),
        phone: newEmergency.phone.trim(),
        memo: newEmergency.memo?.trim() || undefined,
      });
      setNewEmergency({ name: '', phone: '', memo: '' });
      setIsAdding(false);
    }
  };

  // 編集開始
  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditingEmergency({ ...emergencies[index] });
  };

  // 編集保存
  const handleSaveEdit = () => {
    if (editingEmergency && editingEmergency.name.trim() && editingEmergency.phone.trim()) {
      onUpdate(editingIndex, {
        ...editingEmergency,
        name: editingEmergency.name.trim(),
        phone: editingEmergency.phone.trim(),
        memo: editingEmergency.memo?.trim() || undefined,
      });
      setEditingIndex(-1);
      setEditingEmergency(null);
    }
  };

  // 編集キャンセル
  const handleCancelEdit = () => {
    setEditingIndex(-1);
    setEditingEmergency(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">🆘 緊急連絡先</h2>
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
        <div className="bg-red-50 p-4 rounded-lg space-y-3">
          <input
            type="text"
            value={newEmergency.name}
            onChange={(e) => setNewEmergency({ ...newEmergency, name: e.target.value })}
            placeholder="連絡先名（例: 現地病院）"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base"
          />
          <input
            type="tel"
            value={newEmergency.phone}
            onChange={(e) => setNewEmergency({ ...newEmergency, phone: e.target.value })}
            placeholder="電話番号"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base"
          />
          <textarea
            value={newEmergency.memo || ''}
            onChange={(e) => setNewEmergency({ ...newEmergency, memo: e.target.value })}
            placeholder="メモ"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base resize-none"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveNew}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium"
            >
              保存
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewEmergency({ name: '', phone: '', memo: '' });
              }}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* 緊急連絡先リスト */}
      {emergencies.length === 0 && !isAdding ? (
        <p className="text-gray-500 text-sm text-center py-8">
          緊急連絡先がまだ登録されていません
        </p>
      ) : (
        <ul className="space-y-3">
          {emergencies.map((emergency, index) => (
            <li key={index} className="bg-gray-50 p-4 rounded-lg">
              {editingIndex === index && editingEmergency ? (
                // 編集モード
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editingEmergency.name}
                    onChange={(e) =>
                      setEditingEmergency({ ...editingEmergency, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base"
                  />
                  <input
                    type="tel"
                    value={editingEmergency.phone}
                    onChange={(e) =>
                      setEditingEmergency({ ...editingEmergency, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base"
                  />
                  <textarea
                    value={editingEmergency.memo || ''}
                    onChange={(e) =>
                      setEditingEmergency({ ...editingEmergency, memo: e.target.value })
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
                      <h3 className="font-bold text-base">{emergency.name}</h3>
                      <a
                        href={`tel:${emergency.phone}`}
                        className="text-blue-600 underline text-base mt-1 inline-block"
                      >
                        📞 {emergency.phone}
                      </a>
                      {emergency.memo && (
                        <p className="text-sm text-gray-500 mt-1">📝 {emergency.memo}</p>
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
