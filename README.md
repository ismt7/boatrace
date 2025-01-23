# boatrace

## 概要

ボートレースの出目や展開を予想するためのツールです。

## リンク集

- [本日のレース](https://www.boatrace.jp/owpc/pc/race/index)
- [ボートレース日和](https://kyoteibiyori.com/)

## Prismaの手順

### データベースの初期化

1. データベースの作成

```bash
npx prisma db push
```

### スキーマの変更をデータベースに反映する

1. マイグレーションの作成

```bash
npx prisma migrate dev --name <migration_name>
```

2. Prisma Clientの再生成

```bash
npx prisma generate
```

### 開発途中で新しいマイグレーションを作成したくない場合

1. データベースのリセット

```bash
npx prisma db push --force-reset
```

2. Prisma Clientの再生成

```bash
npx prisma generate
```

## ボートレース場情報

https://www.boatrace-tokuyama.jp/

## 選手コメント取得スクリプト

ボートレース徳山の選手コメントを取得するためのスクリプト。

```js
Array.from(
  document.querySelectorAll(
    "body > div > div > div > table > tbody > tr > td.col10.comment"
  )
)
  .map((e, i) => `[${i + 1}号艇]${e.innerHTML}`)
  .join("\n");
```
