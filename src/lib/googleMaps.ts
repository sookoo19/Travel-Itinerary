/**
 * Google Maps API 共通設定
 * 
 * useJsApiLoader を複数コンポーネントで同じオプションで使用するため、
 * libraries やその他の設定を一箇所で管理します。
 */

// 使用するライブラリを一元管理
// places: Places API (New) 用
// marker: AdvancedMarkerElement 用
export const GOOGLE_MAPS_LIBRARIES: ("places" | "marker")[] = ['places', 'marker'];

// Google Maps API キー
export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

// Map ID（AdvancedMarkerElement を使用するために必要）
// Google Cloud Console > Google Maps Platform > Map Management で作成
// https://console.cloud.google.com/google/maps-apis/studio/maps
export const GOOGLE_MAPS_MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || '';
