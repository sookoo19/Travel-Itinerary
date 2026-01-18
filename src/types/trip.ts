/**
 * 旅のしおりアプリ - データ型定義
 * 
 * このファイルでは、アプリ全体で使用するデータ構造を定義します。
 * 型を変更する場合は、URLエンコード/デコードのロジックにも影響するため注意してください。
 */

/**
 * 移動手段の種類
 */
export type TransportType = 
  | 'walk'      // 🚶 徒歩
  | 'car'       // 🚗 車
  | 'train'     // 🚃 電車
  | 'bus'       // 🚌 バス
  | 'plane'     // ✈️ 飛行機
  | 'ship'      // 🚢 船
  | 'bicycle'   // 🚴 自転車
  | 'taxi'      // 🚕 タクシー
  | 'other';    // その他

/**
 * 移動手段のアイコンマッピング
 */
export const TRANSPORT_ICONS: Record<TransportType, string> = {
  walk: '🚶',
  car: '🚗',
  train: '🚃',
  bus: '🚌',
  plane: '✈️',
  ship: '🚢',
  bicycle: '🚴',
  taxi: '🚕',
  other: '➡️',
};

/**
 * 移動手段のラベルマッピング
 */
export const TRANSPORT_LABELS: Record<TransportType, string> = {
  walk: '徒歩',
  car: '車',
  train: '電車',
  bus: 'バス',
  plane: '飛行機',
  ship: '船',
  bicycle: '自転車',
  taxi: 'タクシー',
  other: 'その他',
};

/**
 * 観光スポット・訪問地点
 */
export interface Spot {
  /** スポット名 */
  name: string;
  /** 緯度 */
  lat: number;
  /** 経度 */
  lng: number;
  /** Google Places API の Place ID */
  placeId: string;
}

/**
 * 日程内のアクティビティ（時間付きスポット）
 */
export interface ScheduleItem {
  /** 一意のID */
  id: string;
  /** タイトル（スポット名またはカスタム名称） */
  title: string;
  /** スポット情報（オプション） */
  spot?: Spot;
  /** 開始時間（HH:MM形式、例: "12:00"） */
  startTime?: string;
  /** 終了時間（HH:MM形式、例: "13:00"） */
  endTime?: string;
  /** メモ */
  memo?: string;
  /** 次のスポットへの移動手段 */
  transportToNext?: TransportType;
}

/**
 * 1日分の日程
 */
export interface DaySchedule {
  /** 一意のID */
  id: string;
  /** 日付（YYYY-MM-DD形式） */
  date: string;
  /** その日のアクティビティ一覧 */
  items: ScheduleItem[];
}

/**
 * 宿泊施設情報
 */
export interface Hotel {
  /** 宿泊施設名 */
  name: string;
  /** 住所 */
  address: string;
  /** メモ（チェックイン時間など） */
  memo?: string;
  /** 緯度（任意：地図表示用） */
  lat?: number;
  /** 経度（任意：地図表示用） */
  lng?: number;
}

/**
 * 緊急連絡先
 */
export interface Emergency {
  /** 連絡先名（例：現地病院、大使館） */
  name: string;
  /** 電話番号 */
  phone: string;
  /** メモ */
  memo?: string;
}

/**
 * 旅行データ全体
 * 
 * このオブジェクトがURL経由で共有される単位となります。
 */
export interface Trip {
  /** 旅行タイトル */
  title: string;
  /** 旅行日程（YYYY-MM-DD形式の配列） - 後方互換用 */
  dates: string[];
  /** 日別スケジュール（新形式） */
  schedule: DaySchedule[];
  /** 訪問スポット一覧 - 後方互換用、新規はschedule内で管理 */
  spots: Spot[];
  /** やりたいことリスト */
  todos: string[];
  /** 持ち物リスト */
  items: string[];
  /** 宿泊施設情報 */
  hotels: Hotel[];
  /** 緊急連絡先 */
  emergencies: Emergency[];
}

/**
 * 空のTripオブジェクトを生成
 * URLにデータがない場合に使用
 */
export function createEmptyTrip(): Trip {
  return {
    title: '新しい旅行',
    dates: [],
    schedule: [],
    spots: [],
    todos: [],
    items: [],
    hotels: [],
    emergencies: [],
  };
}

/**
 * ユニークIDを生成
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * タブの種類
 */
export type TabType = 
  | 'schedule'    // 旅行日程
  | 'todos'       // したいことリスト
  | 'items'       // 持っていくものリスト
  | 'hotels'      // 宿泊情報
  | 'emergencies' // 緊急連絡先
  | 'preview';    // プレビュー / PDF
