/**
 * タブナビゲーション コンポーネント
 * 
 * 画面下部に固定されるタブバー
 */

'use client';

import { TabType } from '@/types/trip';

interface TabNavigationProps {
  /** 現在選択中のタブ */
  activeTab: TabType;
  /** タブ変更コールバック */
  onTabChange: (tab: TabType) => void;
}

// タブ定義
const tabs: { id: TabType; label: string; icon: string }[] = [
  { id: 'schedule', label: '日程', icon: '📅' },
  { id: 'todos', label: 'やりたい', icon: '✅' },
  { id: 'items', label: '持ち物', icon: '🎒' },
  { id: 'hotels', label: '宿泊', icon: '🏨' },
  { id: 'emergencies', label: '緊急', icon: '🆘' },
  { id: 'preview', label: 'PDF', icon: '📄' },
];

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <ul className="flex justify-around max-w-[375px] mx-auto">
        {tabs.map((tab) => (
          <li key={tab.id} className="flex-1">
            <button
              onClick={() => onTabChange(tab.id)}
              className={`
                w-full py-2 flex flex-col items-center justify-center
                transition-colors duration-150
                ${activeTab === tab.id
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
                }
              `}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-xs mt-0.5">{tab.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
