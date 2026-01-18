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
      {/* ヘッダー */}
      <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
          <span className="text-2xl">🆘</span>
          <span>緊急連絡先</span>
        </h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-warn text-white rounded-xl text-sm font-medium active:opacity-80 transition-all"
          >
            + 追加
          </button>
        )}
      </div>

      {/* 新規追加フォーム */}
      {isAdding && (
        <div className="bg-warn/10 p-4 rounded-2xl space-y-3 border border-warn/20">
          <input
            type="text"
            value={newEmergency.name}
            onChange={(e) => setNewEmergency({ ...newEmergency, name: e.target.value })}
            placeholder="連絡先名（例: 現地病院）"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-warn transition-all"
          />
          <input
            type="tel"
            value={newEmergency.phone}
            onChange={(e) => setNewEmergency({ ...newEmergency, phone: e.target.value })}
            placeholder="電話番号"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-warn transition-all"
          />
          <textarea
            value={newEmergency.memo || ''}
            onChange={(e) => setNewEmergency({ ...newEmergency, memo: e.target.value })}
            placeholder="メモ"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base resize-none focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-warn transition-all"
            rows={2}
          />
          <div className="flex gap-3">
            <button
              onClick={handleSaveNew}
              className="flex-1 px-4 py-3 bg-warn text-white rounded-xl font-medium active:opacity-80 transition-all"
            >
              保存
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewEmergency({ name: '', phone: '', memo: '' });
              }}
              className="flex-1 px-4 py-3 bg-gray-200 text-text-sub rounded-xl font-medium active:opacity-80 transition-all"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* 緊急連絡先リスト */}
      {emergencies.length === 0 && !isAdding ? (
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <p className="text-text-sub text-sm text-center">
            緊急連絡先がまだ登録されていません 🆘
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <ul className="space-y-3">
            {emergencies.map((emergency, index) => (
              <li key={index} className="bg-accent/10 p-4 rounded-xl border border-accent/20">
                {editingIndex === index && editingEmergency ? (
                  // 編集モード
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editingEmergency.name}
                      onChange={(e) =>
                        setEditingEmergency({ ...editingEmergency, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-warn transition-all"
                    />
                    <input
                      type="tel"
                      value={editingEmergency.phone}
                      onChange={(e) =>
                        setEditingEmergency({ ...editingEmergency, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-warn transition-all"
                    />
                    <textarea
                      value={editingEmergency.memo || ''}
                      onChange={(e) =>
                        setEditingEmergency({ ...editingEmergency, memo: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base resize-none focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-warn transition-all"
                      rows={2}
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveEdit}
                        className="flex-1 px-4 py-3 bg-warn text-white rounded-xl font-medium text-sm active:opacity-80 transition-all"
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
                        <h3 className="font-bold text-base text-text-main">{emergency.name}</h3>
                        <a
                          href={`tel:${emergency.phone}`}
                          className="text-main font-medium text-base mt-1 inline-block hover:underline"
                        >
                          📞 {emergency.phone}
                        </a>
                        {emergency.memo && (
                          <p className="text-sm text-text-sub mt-1">📝 {emergency.memo}</p>
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
