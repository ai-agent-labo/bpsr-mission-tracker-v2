import type { Mission } from '../types';

export const DEFAULT_MISSIONS: Mission[] = [
  // Daily Missions
  {
    id: 'd-login',
    name: 'ログイン',
    type: 'daily',
    category: 'daily',
    image: '🔑',
    description: '1日1回ログインしてデイリー達成',
    bgImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'w-pioneer',
    name: '開拓者褒章',
    type: 'daily',
    category: 'daily',
    image: '🎖️',
    bgImage: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'd-不安定',
    name: '不安定',
    type: 'daily',
    category: 'daily',
    image: '🌌',
    renderType: 'checkbox',
    description: '特殊ミッションのクリア確認',
    bgImage: 'https://images.unsplash.com/photo-1614850523296-d088224ddc74?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'd-シーズンストア',
    name: 'シーズンストア',
    type: 'daily',
    category: 'daily',
    image: '🍂',
    renderType: 'checkbox',
    description: '上級素材・虚蝕・パワーパーツ',
    bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'd-ギルド輸送',
    name: 'ギルド輸送',
    type: 'daily',
    category: 'daily',
    image: '🏚️',
    renderType: 'checkbox',
    description: '',
    bgImage: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'd-モジュール',
    name: 'モジュール',
    type: 'daily',
    category: 'daily',
    image: '⚙️',
    renderType: 'checkbox',
    description: '分解・交換',
    bgImage: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'd-boss-keys',
    name: 'ボス戦利品の鍵',
    type: 'daily',
    category: 'daily',
    image: '👹',
    renderType: 'stock',
    metadata: { stockType: 'boss' },
    bgImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'd-elite-keys',
    name: '精鋭戦利品の鍵',
    type: 'daily',
    category: 'daily',
    image: '💀',
    renderType: 'stock',
    metadata: { stockType: 'elite' },
    bgImage: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'd-mysterious-store',
    name: '神秘ストア',
    type: 'daily',
    category: 'daily',
    image: '🔮',
    renderType: 'checkbox',
    description: 'ストアをチェック',
    bgImage: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&q=80&w=400',
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
      activeTimeRange: { start: '19:30', end: '19:55' }
    },
    bgImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=400'
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
      activeTimeRange: { start: '10:00', end: '22:00' }
    },
    bgImage: 'https://images.unsplash.com/photo-1493606371202-618002bf0907?auto=format&fit=crop&q=80&w=400'
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
    bgImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=400',
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
    bgImage: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'w-guild',
    name: 'ギルド週間活躍度報酬',
    type: 'weekly',
    category: 'weekly',
    image: '📊',
    renderType: 'checkbox',
    bgImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=400',
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
    bgImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400',
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
    bgImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400',
  },
];
