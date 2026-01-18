/**
 * URLエンコード/デコード ユーティリティ
 * 
 * TripデータをURLクエリパラメータとして保持するためのユーティリティ関数群。
 * lz-string を使用してJSONを圧縮し、URLセーフな形式に変換します。
 */

import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import { Trip, createEmptyTrip } from '@/types/trip';

/**
 * TripオブジェクトをURL用の圧縮文字列にエンコード
 * 
 * @param trip - エンコードするTripオブジェクト
 * @returns 圧縮されたURLセーフな文字列
 */
export function encodeTrip(trip: Trip): string {
  try {
    const jsonString = JSON.stringify(trip);
    const compressed = compressToEncodedURIComponent(jsonString);
    return compressed;
  } catch (error) {
    console.error('Trip のエンコードに失敗しました:', error);
    return '';
  }
}

/**
 * URL圧縮文字列からTripオブジェクトをデコード
 * 
 * @param data - URLクエリから取得した圧縮文字列
 * @returns デコードされたTripオブジェクト（失敗時はnull）
 */
export function decodeTrip(data: string): Trip | null {
  try {
    const decompressed = decompressFromEncodedURIComponent(data);
    if (!decompressed) {
      console.warn('データの解凍に失敗しました');
      return null;
    }
    const trip = JSON.parse(decompressed) as Trip;
    // 基本的なバリデーション（必須フィールドの存在確認）
    if (!validateTrip(trip)) {
      console.warn('Tripデータのバリデーションに失敗しました');
      return null;
    }
    return trip;
  } catch (error) {
    console.error('Trip のデコードに失敗しました:', error);
    return null;
  }
}

/**
 * Tripオブジェクトの基本的なバリデーション
 * 
 * @param trip - バリデーション対象
 * @returns バリデーション結果
 */
function validateTrip(trip: unknown): trip is Trip {
  if (typeof trip !== 'object' || trip === null) return false;
  
  const t = trip as Record<string, unknown>;
  
  // 必須フィールドの型チェック
  if (typeof t.title !== 'string') return false;
  if (!Array.isArray(t.dates)) return false;
  if (!Array.isArray(t.spots)) return false;
  if (!Array.isArray(t.todos)) return false;
  if (!Array.isArray(t.items)) return false;
  if (!Array.isArray(t.hotels)) return false;
  if (!Array.isArray(t.emergencies)) return false;
  
  return true;
}

/**
 * URLを更新（リロードせずにhistory.replaceStateを使用）
 * 
 * @param trip - 現在のTripオブジェクト
 */
export function updateUrlWithTrip(trip: Trip): void {
  const encoded = encodeTrip(trip);
  if (!encoded) return;
  
  const url = new URL(window.location.href);
  url.searchParams.set('data', encoded);
  
  // リロードせずにURLを更新
  window.history.replaceState({}, '', url.toString());
}

/**
 * 現在のURLからTripデータを取得
 * URLにdataパラメータがない場合は空のTripを返す
 * 
 * @returns Tripオブジェクト
 */
export function getTripFromUrl(): Trip {
  // サーバーサイドレンダリング時はデフォルト値を返す
  if (typeof window === 'undefined') {
    return createEmptyTrip();
  }
  
  const url = new URL(window.location.href);
  const data = url.searchParams.get('data');
  
  if (!data) {
    return createEmptyTrip();
  }
  
  const trip = decodeTrip(data);
  return trip ?? createEmptyTrip();
}

/**
 * 共有用URLを生成
 * 
 * @param trip - 共有するTripオブジェクト
 * @returns 完全なURL文字列
 */
export function generateShareUrl(trip: Trip): string {
  const encoded = encodeTrip(trip);
  if (!encoded) return window.location.origin;
  
  const url = new URL(window.location.origin);
  url.searchParams.set('data', encoded);
  
  return url.toString();
}
