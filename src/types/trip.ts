/**
 * 旅のしおりアプリ - データ型定義
 * 
 * このファイルでは、アプリ全体で使用するデータ構造を定義します。
 * 型を変更する場合は、URLエンコード/デコードのロジックにも影響するため注意してください。
 */

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
  /** 旅行日程（YYYY-MM-DD形式の配列） */
  dates: string[];
  /** 訪問スポット一覧 */
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
    spots: [],
    todos: [],
    items: [],
    hotels: [],
    emergencies: [],
  };
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
