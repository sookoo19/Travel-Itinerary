/**
 * メインアプリケーションコンポーネント
 * 
 * クライアントサイドで動作するメインUI
 * URLからデータを復元し、状態を管理する
 */

'use client';

import { useState, useRef } from 'react';
import { TabType } from '@/types/trip';
import { useTrip } from '@/hooks/useTrip';
import Header from '@/components/Header';
import TabNavigation from '@/components/TabNavigation';
import ScheduleTab from '@/components/tabs/ScheduleTab';
import SimpleListTab from '@/components/tabs/SimpleListTab';
import HotelsTab from '@/components/tabs/HotelsTab';
import EmergenciesTab from '@/components/tabs/EmergenciesTab';
import PreviewTab from '@/components/tabs/PreviewTab';

export default function TripApp() {
  // Trip 状態管理
  const {
    trip,
    isInitialized,
    updateTitle,
    addDate,
    removeDate,
    addSpot,
    removeSpot,
    addTodo,
    removeTodo,
    addItem,
    removeItem,
    addHotel,
    updateHotel,
    removeHotel,
    addEmergency,
    updateEmergency,
    removeEmergency,
  } = useTrip();

  // 現在のタブ
  const [activeTab, setActiveTab] = useState<TabType>('schedule');
  
  // PDF出力用の参照
  const previewRef = useRef<HTMLDivElement>(null);

  // 初期化前はローディング表示
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500">読み込み中...</p>
        </div>
      </div>
    );
  }

  // タブに応じたコンテンツを表示
  const renderTabContent = () => {
    switch (activeTab) {
      case 'schedule':
        return (
          <ScheduleTab
            dates={trip.dates}
            spots={trip.spots}
            onAddDate={addDate}
            onRemoveDate={removeDate}
            onAddSpot={addSpot}
            onRemoveSpot={removeSpot}
          />
        );
      
      case 'todos':
        return (
          <SimpleListTab
            title="したいことリスト"
            icon="✅"
            items={trip.todos}
            onAdd={addTodo}
            onRemove={removeTodo}
            placeholder="やりたいことを入力..."
          />
        );
      
      case 'items':
        return (
          <SimpleListTab
            title="持っていくものリスト"
            icon="🎒"
            items={trip.items}
            onAdd={addItem}
            onRemove={removeItem}
            placeholder="持ち物を入力..."
          />
        );
      
      case 'hotels':
        return (
          <HotelsTab
            hotels={trip.hotels}
            onAdd={addHotel}
            onUpdate={updateHotel}
            onRemove={removeHotel}
          />
        );
      
      case 'emergencies':
        return (
          <EmergenciesTab
            emergencies={trip.emergencies}
            onAdd={addEmergency}
            onUpdate={updateEmergency}
            onRemove={removeEmergency}
          />
        );
      
      case 'preview':
        return (
          <div>
            {/* PDF出力ボタン（将来的に実装） */}
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700">
                💡 PDF出力機能は今後実装予定です。
                下のプレビューを印刷することで代替できます。
              </p>
              <button
                onClick={() => window.print()}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium"
              >
                🖨️ 印刷する
              </button>
            </div>
            
            {/* プレビューコンポーネント */}
            <PreviewTab ref={previewRef} trip={trip} />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <Header
        title={trip.title}
        onTitleChange={updateTitle}
        trip={trip}
      />

      {/* メインコンテンツ */}
      <main className="max-w-[375px] mx-auto px-4 py-4 pb-20">
        {renderTabContent()}
      </main>

      {/* タブナビゲーション */}
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}
