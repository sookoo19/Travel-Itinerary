/**
 * Google Maps コンポーネント
 * 
 * 再マウントを避けるため、アプリ全体で1つのMapインスタンスを使用します。
 * APIキーは環境変数から取得します。
 */

'use client';

import { useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { Spot, Hotel } from '@/types/trip';
import { GOOGLE_MAPS_LIBRARIES, GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_MAP_ID } from '@/lib/googleMaps';

// マップのデフォルトスタイル（モバイル向け）
const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

// 東京を初期中心として設定
const defaultCenter = {
  lat: 35.6762,
  lng: 139.6503,
};

// マップのオプション
const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  // AdvancedMarkerElementを使用するためにMap IDが必要
  mapId: GOOGLE_MAPS_MAP_ID || undefined,
};

interface MapComponentProps {
  /** 表示するスポット一覧 */
  spots: Spot[];
  /** 表示する宿泊施設一覧（任意） */
  hotels?: Hotel[];
  /** スポットがクリックされた時のコールバック */
  onSpotClick?: (spot: Spot) => void;
  /** マップの中心を変更する座標（任意） */
  center?: { lat: number; lng: number };
}

/**
 * Google Mapsを表示するコンポーネント
 * 
 * 使用方法:
 * <MapComponent spots={trip.spots} hotels={trip.hotels} />
 */
export default function MapComponent({ 
  spots, 
  hotels = [], 
  onSpotClick,
  center 
}: MapComponentProps) {
  // Google Maps APIの読み込み
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  // マップインスタンスの参照を保持
  const mapRef = useRef<google.maps.Map | null>(null);
  const spotMarkersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const hotelMarkersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  
  // 現在のマップ中心座標
  const mapCenter = center || defaultCenter;

  // マップ読み込み完了時のコールバック
  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    
    // スポットが存在する場合、全てのスポットが見えるように調整
    if (spots.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      spots.forEach(spot => {
        bounds.extend({ lat: spot.lat, lng: spot.lng });
      });
      map.fitBounds(bounds);
    }
  }, [spots]);

  // マップアンマウント時のクリーンアップ
  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  // 中心座標が変更された場合
  useEffect(() => {
    if (center && mapRef.current) {
      mapRef.current.panTo(center);
    }
  }, [center]);

  // スポットが変更された時にboundsを更新
  useEffect(() => {
    if (mapRef.current && spots.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      spots.forEach(spot => {
        bounds.extend({ lat: spot.lat, lng: spot.lng });
      });
      // 宿泊施設も含める
      hotels.forEach(hotel => {
        if (hotel.lat && hotel.lng) {
          bounds.extend({ lat: hotel.lat, lng: hotel.lng });
        }
      });
      mapRef.current.fitBounds(bounds);
    }
  }, [spots, hotels]);

  // スポット/宿泊施設マーカーの描画（AdvancedMarkerElement）
  useEffect(() => {
    if (!mapRef.current || !google.maps.marker?.AdvancedMarkerElement) return;

    // 既存マーカーをクリア
    spotMarkersRef.current.forEach(marker => {
      marker.map = null;
    });
    hotelMarkersRef.current.forEach(marker => {
      marker.map = null;
    });
    spotMarkersRef.current = [];
    hotelMarkersRef.current = [];

    // スポットのマーカー（赤）
    spots.forEach((spot) => {
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current!,
        position: { lat: spot.lat, lng: spot.lng },
        title: spot.name,
      });

      if (onSpotClick) {
        marker.addListener('gmp-click', () => onSpotClick(spot));
      }

      spotMarkersRef.current.push(marker);
    });

    // 宿泊施設のマーカー（青）
    hotels.forEach((hotel) => {
      if (!hotel.lat || !hotel.lng) return;
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current!,
        position: { lat: hotel.lat, lng: hotel.lng },
        title: hotel.name,
      });
      hotelMarkersRef.current.push(marker);
    });

    return () => {
      spotMarkersRef.current.forEach(marker => {
        marker.map = null;
      });
      hotelMarkersRef.current.forEach(marker => {
        marker.map = null;
      });
      spotMarkersRef.current = [];
      hotelMarkersRef.current = [];
    };
  }, [spots, hotels, onSpotClick]);

  // 読み込みエラー
  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-red-500 text-sm">
          マップの読み込みに失敗しました
        </p>
      </div>
    );
  }

  // 読み込み中
  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-500 text-sm">マップを読み込み中...</p>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={mapCenter}
      zoom={12}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={mapOptions}
    />
  );
}
