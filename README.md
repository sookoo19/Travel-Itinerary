# 旅のしおり ✈️

旅行用「旅のしおり」を作成・編集・共有できるWebアプリケーション

## 概要

- 📱 **スマートフォン専用** - モバイルファーストのUI設計
- 🔗 **URL共有方式** - データはURLに圧縮して保持（localStorageは使用しない）
- 🚫 **認証不要** - シンプルにすぐ使える
- 📄 **PDF出力対応予定** - しおりを印刷して持ち歩ける

## 機能

| タブ | 機能 |
|------|------|
| 📅 日程 | 旅行日程の管理、Google Mapsでのスポット表示、場所検索・追加 |
| ✅ やりたい | やりたいことリストの作成・管理 |
| 🎒 持ち物 | 持っていくものリストの作成・管理 |
| 🏨 宿泊 | 宿泊施設情報の登録・編集 |
| 🆘 緊急 | 緊急連絡先の登録（タップで電話発信） |
| 📄 PDF | しおり全体のプレビュー・印刷 |

## 技術スタック

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Google Maps JavaScript API + Places API
- **圧縮**: lz-string（URLエンコード用）
- **状態管理**: React useState / useEffect のみ

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルを編集し、Google Maps APIキーを設定:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

#### Google Maps APIキーの取得方法

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. プロジェクトを作成または選択
3. 「APIs & Services」→「Library」から以下のAPIを有効化:
   - **Maps JavaScript API**
   - **Places API**
4. 「APIs & Services」→「Credentials」でAPIキーを作成
5. 作成したキーを `.env.local` にコピー

### 3. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) でアプリが起動します。

## プロジェクト構成

```
src/
├── app/
│   ├── page.tsx          # メインページ（ルート）
│   ├── layout.tsx        # ルートレイアウト
│   └── globals.css       # グローバルスタイル
├── components/
│   ├── Header.tsx        # アプリヘッダー（タイトル編集・共有）
│   ├── TabNavigation.tsx # タブナビゲーション
│   ├── TripApp.tsx       # メインアプリコンポーネント
│   ├── MapComponent.tsx  # Google Maps コンポーネント
│   ├── PlaceSearch.tsx   # 場所検索コンポーネント
│   └── tabs/
│       ├── ScheduleTab.tsx     # 旅行日程タブ
│       ├── SimpleListTab.tsx   # 汎用リストタブ
│       ├── HotelsTab.tsx       # 宿泊情報タブ
│       ├── EmergenciesTab.tsx  # 緊急連絡先タブ
│       └── PreviewTab.tsx      # プレビュー/PDFタブ
├── hooks/
│   └── useTrip.ts        # Trip状態管理フック
├── types/
│   └── trip.ts           # 型定義
└── utils/
    └── urlCodec.ts       # URL圧縮・解凍ユーティリティ
```

## データ構造

```typescript
interface Trip {
  title: string;       // 旅行タイトル
  dates: string[];     // 日程（YYYY-MM-DD形式）
  spots: Spot[];       // 訪問スポット
  todos: string[];     // やりたいことリスト
  items: string[];     // 持ち物リスト
  hotels: Hotel[];     // 宿泊施設
  emergencies: Emergency[]; // 緊急連絡先
}
```

## URL共有の仕組み

1. Tripデータを JSON 文字列化
2. lz-string で圧縮（`compressToEncodedURIComponent`）
3. URLのクエリパラメータ `?data=xxx` として付与
4. `history.replaceState` でリロードせずにURL更新
5. 共有先で自動的にデータ復元

## 今後の拡張予定

- [ ] PDF出力機能（react-to-print または html2pdf.js）
- [ ] ドラッグ&ドロップでの並び替え
- [ ] 日付ごとのスケジュール管理
- [ ] オフライン対応（Service Worker）
- [ ] 写真添付機能

## ライセンス

MIT License
