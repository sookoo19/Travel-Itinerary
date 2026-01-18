/**
 * Places 検索コンポーネント
 * 
 * Google Places API を使用して場所を検索し、
 * 選択した場所を Trip に追加できるようにします。
 */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { Spot } from '@/types/trip';

const libraries: ("places")[] = ['places'];

interface PlaceSearchProps {
  /** 場所が選択された時のコールバック */
  onPlaceSelect: (spot: Spot) => void;
}

/**
 * Google Places Autocomplete を使用した検索コンポーネント
 */
export default function PlaceSearch({ onPlaceSelect }: PlaceSearchProps) {
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // サービスの参照
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const dummyDivRef = useRef<HTMLDivElement | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  // サービスの初期化
  useEffect(() => {
    if (isLoaded && !autocompleteServiceRef.current) {
      autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
      // PlacesService は DOM 要素が必要なのでダミー div を使用
      if (dummyDivRef.current) {
        placesServiceRef.current = new google.maps.places.PlacesService(dummyDivRef.current);
      }
    }
  }, [isLoaded]);

  // 検索クエリが変わった時の処理
  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || !autocompleteServiceRef.current) {
      setPredictions([]);
      return;
    }

    setIsSearching(true);
    
    try {
      autocompleteServiceRef.current.getPlacePredictions(
        { 
          input: searchQuery,
          // 日本を優先
          componentRestrictions: { country: 'jp' },
        },
        (results, status) => {
          setIsSearching(false);
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            setPredictions(results);
          } else {
            setPredictions([]);
          }
        }
      );
    } catch (error) {
      console.error('検索エラー:', error);
      setIsSearching(false);
      setPredictions([]);
    }
  }, []);

  // デバウンス処理
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  // 場所を選択した時の処理
  const handleSelectPlace = (prediction: google.maps.places.AutocompletePrediction) => {
    if (!placesServiceRef.current) return;

    placesServiceRef.current.getDetails(
      { 
        placeId: prediction.place_id,
        fields: ['name', 'geometry', 'place_id'],
      },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          const spot: Spot = {
            name: place.name || prediction.description,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            placeId: place.place_id || prediction.place_id,
          };
          onPlaceSelect(spot);
          // 検索をクリア
          setQuery('');
          setPredictions([]);
        }
      }
    );
  };

  if (!isLoaded) {
    return (
      <div className="p-2 text-gray-500 text-sm">
        検索機能を読み込み中...
      </div>
    );
  }

  return (
    <div className="relative">
      {/* PlacesService 用のダミー要素 */}
      <div ref={dummyDivRef} style={{ display: 'none' }} />
      
      {/* 検索入力 */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="場所を検索..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
          </div>
        )}
      </div>

      {/* 検索結果のドロップダウン */}
      {predictions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {predictions.map((prediction) => (
            <li
              key={prediction.place_id}
              onClick={() => handleSelectPlace(prediction)}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="text-sm font-medium text-gray-900">
                {prediction.structured_formatting.main_text}
              </div>
              <div className="text-xs text-gray-500">
                {prediction.structured_formatting.secondary_text}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
