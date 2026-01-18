/**
 * Places 検索コンポーネント
 * 
 * Google Places API を使用して場所を検索し、
 * 選択した場所を Trip に追加できるようにします。
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { Spot } from '@/types/trip';
import { GOOGLE_MAPS_LIBRARIES, GOOGLE_MAPS_API_KEY } from '@/lib/googleMaps';

interface PlaceSearchProps {
  /** 場所が選択された時のコールバック */
  onPlaceSelect: (spot: Spot) => void;
}

interface PlacePrediction {
  placeId: string;
  mainText: string;
  secondaryText?: string;
  description: string;
}

/**
 * Google Places Autocomplete を使用した検索コンポーネント
 */
export default function PlaceSearch({ onPlaceSelect }: PlaceSearchProps) {
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const toText = useCallback((value: unknown): string => {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object' && 'text' in value) {
      const textValue = (value as { text?: string }).text;
      return typeof textValue === 'string' ? textValue : '';
    }
    return '';
  }, []);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  // 検索クエリが変わった時の処理
  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setPredictions([]);
      return;
    }

    if (!google.maps.places?.AutocompleteSuggestion) {
      console.warn('Places API (New) が利用できません。APIの有効化を確認してください。');
      setPredictions([]);
      return;
    }

    setIsSearching(true);
    
    try {
      const response = await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input: searchQuery,
        // 日本を優先
        region: 'JP',
      });

      const nextPredictions: PlacePrediction[] = response.suggestions
        .map((suggestion) => suggestion.placePrediction)
        .filter((prediction): prediction is google.maps.places.PlacePrediction => Boolean(prediction))
        .map((prediction) => {
          const structuredFormat = (prediction as unknown as { structuredFormat?: { mainText?: unknown; secondaryText?: unknown } }).structuredFormat;
          const mainText = toText(structuredFormat?.mainText) || toText((prediction as unknown as { text?: unknown }).text);
          const secondaryText = toText(structuredFormat?.secondaryText) || undefined;
          const description = toText((prediction as unknown as { text?: unknown }).text) || mainText;

          return {
            placeId: prediction.placeId,
            mainText,
            secondaryText,
            description,
          };
        })
        .filter((prediction) => prediction.placeId);

      setPredictions(nextPredictions);
    } catch (error) {
      console.error('検索エラー:', error);
      setIsSearching(false);
      setPredictions([]);
      return;
    }
    setIsSearching(false);
  }, []);

  // デバウンス処理
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  // 場所を選択した時の処理
  const handleSelectPlace = async (prediction: PlacePrediction) => {
    if (!google.maps.places?.Place) return;

    try {
      const place = new google.maps.places.Place({ id: prediction.placeId });
      await place.fetchFields({ fields: ['displayName', 'location', 'id'] });

      if (place.location) {
        const spot: Spot = {
          name: place.displayName || prediction.description,
          lat: place.location.lat(),
          lng: place.location.lng(),
          placeId: place.id || prediction.placeId,
        };
        onPlaceSelect(spot);
        // 検索をクリア
        setQuery('');
        setPredictions([]);
      }
    } catch (error) {
      console.error('場所詳細取得エラー:', error);
    }
  };

  if (!isLoaded) {
    return (
      <div className="p-2 text-gray-500 text-sm">
        検索機能を読み込み中...
      </div>
    );
  }

  if (!google.maps.places?.AutocompleteSuggestion) {
    return (
      <div className="p-2 text-red-500 text-sm">
        Places API (New) が有効化されていません。
        Google Cloud ConsoleでPlaces API (New)を有効化してください。
      </div>
    );
  }

  return (
    <div className="relative">
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
              key={prediction.placeId}
              onClick={() => handleSelectPlace(prediction)}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="text-sm font-medium text-gray-900">
                {prediction.mainText}
              </div>
              <div className="text-xs text-gray-500">
                {prediction.secondaryText}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
