import type { Mission } from '../types';

export const DEFAULT_MISSIONS: Mission[] = [
  // Daily Missions
  {
    id: 'd-seasoncenter',
    name: '毎日活躍度報酬',
    type: 'daily',
    category: 'daily',
    image: '🔑',
    description: 'シーズンセンターの箱',
    bgImage: '/missions/season_center.png',
  },
  {
    id: 'd-ギルド出席',
    name: 'ギルド出席',
    type: 'daily',
    category: 'daily',
    image: '🏚️',
    renderType: 'checkbox',
    description: 'ルオラさんに話しかけよう',
    bgImage: '/missions/guild_attendance.png',
  },
  {
    id: 'd-ギルド輸送',
    name: 'ギルド輸送',
    type: 'daily',
    category: 'daily',
    image: '🏚️',
    renderType: 'checkbox',
    description: 'ダグラスさんに話しかけよう',
    bgImage: '/missions/guild_transport.png',
  },
  {
    id: 'd-不安定な空間',
    name: '不安定な空間',
    type: 'daily',
    category: 'daily',
    image: '🌌',
    renderType: 'checkbox',
    description: '特殊ミッションのクリア確認',
    bgImage: '/missions/unstable_space.png',
  },
  {
    id: 'w-pioneer',
    name: '開拓局の依頼',
    type: 'daily',
    category: 'daily',
    image: '🎖️',
    description: '名声が欲しい方はどうぞ',
    bgImage: '/missions/pioneer.png',
  },
  {
    id: 'd-boss-keys',
    name: 'ボス戦利品の鍵',
    type: 'daily',
    category: 'daily',
    image: '👹',
    renderType: 'stock',
    metadata: { stockType: 'boss' },
    bgImage: '/missions/boss_keys.png',
  },
  {
    id: 'd-elite-keys',
    name: '精鋭戦利品の鍵',
    type: 'daily',
    category: 'daily',
    image: '💀',
    renderType: 'stock',
    metadata: { stockType: 'elite' },
    bgImage: '/missions/elite_keys.png',
  },
  {
    id: 'd-mysterious-store',
    name: '神秘ストア',
    type: 'daily',
    category: 'daily',
    image: '🔮',
    renderType: 'checkbox',
    description: 'ストアをチェック',
    bgImage: '/missions/mysterious_store.png',
  },
  {
    id: 'e-guild-dance',
    name: 'ギルドダンス',
    type: 'event',
    category: 'daily',
    image: '💃',
    description: '金曜 19:30 - 19:55 開催',
    metadata: {
      activeDays: ['Friday'],
      //activeTimeRange: { start: '19:30', end: '19:55' }
    },
    bgImage: '/missions/guild_dance.png'
  },
  {
    id: 'e-guild-hunt',
    name: 'ギルドハント',
    type: 'event',
    category: 'daily',
    image: '🏹',
    description: '金・土・日 10:00 - 22:00 開催',
    metadata: {
      activeDays: ['Friday', 'Saturday', 'Sunday'],
      //activeTimeRange: { start: '10:00', end: '22:00' }
    },
    bgImage: '/missions/guild_hunt.png'
  },

  // Weekly Missions
  {
    id: 'w-world-raid',
    name: 'ワールドレイド',
    type: 'weekly',
    category: 'weekly',
    image: '🌍',
    renderType: 'store', // Use list style for 3 items
    subItems: [
      { id: 'day1', name: '1日目' },
      { id: 'day2', name: '2日目' },
      { id: 'day3', name: '3日目' }
    ],
    bgImage: '/missions/world_raid.png',
  },
  {
    id: 'd-カラフルストア',
    name: 'カラフルストア',
    type: 'weekly',
    category: 'weekly',
    image: '💎',
    renderType: 'store',
    subItems: [
      { id: 'rose', name: 'ローズジェム' },
      { id: 'friend', name: '友情ポイント' },
      { id: 'gc', name: 'GC' },
      { id: 'fame', name: '名声' }
    ],
    bgImage: '/missions/colorful_store.png',
  },
  {
    id: 'd-シーズンストア',
    name: 'シーズンストア',
    type: 'weekly',
    category: 'weekly',
    image: '🍂',
    renderType: 'checkbox',
    description: '上級素材・虚蝕・パワーパーツ',
    bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'd-モジュール',
    name: 'モジュール交換',
    type: 'weekly',
    category: 'weekly',
    image: '⚙️',
    renderType: 'checkbox',
    description: '分解・交換',
    bgImage: '/missions/module_exchange.png',
  },
  {
    id: 'w-guild',
    name: 'ギルド週間活躍度報酬',
    type: 'weekly',
    category: 'weekly',
    image: '📊',
    renderType: 'checkbox',
    bgImage: '/missions/guild_weekly.png',
  },
  {
    id: 'w-ruins',
    name: 'レグディニス遺跡',
    type: 'weekly',
    category: 'weekly',
    image: '🏰',
    renderType: 'ruins',
    metadata: {
      resetInterval: 'bi-weekly'
    },
    bgImage: '/missions/regdinus_ruins.png',
  },
  {
    id: 'w-raid',
    name: '浮島レイド（神竜の枷）',
    type: 'weekly',
    category: 'weekly',
    image: '🐉',
    renderType: 'raid',
    subItems: [
      { id: 'ice', name: '氷竜' },
      { id: 'dark', name: '闇竜' },
      { id: 'light', name: '光竜' }
    ],
    bgImage: '/missions/floating_island_raid.png',
  },
];
