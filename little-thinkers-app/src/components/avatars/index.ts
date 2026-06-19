import { AvatarBird } from './AvatarBird';
import { AvatarBear } from './AvatarBear';
import { AvatarGhost } from './AvatarGhost';
import { AvatarChick } from './AvatarChick';
import { AvatarUnicorn } from './AvatarUnicorn';
import { AvatarGnome } from './AvatarGnome';
import { AvatarMonkey } from './AvatarMonkey';
import { AvatarBat } from './AvatarBat';
import { AvatarFish } from './AvatarFish';
import { AvatarKnight } from './AvatarKnight';
import { AvatarAlien } from './AvatarAlien';
import { AvatarWitch } from './AvatarWitch';
import { AvatarWalrus } from './AvatarWalrus';
import { AvatarElf } from './AvatarElf';

export { AvatarBird, AvatarBear, AvatarGhost, AvatarChick, AvatarUnicorn, AvatarGnome, AvatarMonkey, AvatarBat, AvatarFish, AvatarKnight, AvatarAlien, AvatarWitch, AvatarWalrus, AvatarElf };

export const AVATARS = [
  { id: 'bird'    as const, component: AvatarBird,    name: 'Blue Bird',        bg: '#DBEAFE', accent: '#3B82F6' },
  { id: 'bear'    as const, component: AvatarBear,    name: 'Golden Bear',      bg: '#FEF3C7', accent: '#D97706' },
  { id: 'ghost'   as const, component: AvatarGhost,   name: 'Pink Ghost',       bg: '#FCE7F3', accent: '#EC4899' },
  { id: 'chick'   as const, component: AvatarChick,   name: 'Little Chick',     bg: '#FEF9C3', accent: '#CA8A04' },
  { id: 'unicorn' as const, component: AvatarUnicorn, name: 'Rainbow Unicorn',  bg: '#F3E8FF', accent: '#9333EA' },
  { id: 'gnome'   as const, component: AvatarGnome,   name: 'Forest Gnome',     bg: '#DCFCE7', accent: '#16A34A' },
  { id: 'monkey'  as const, component: AvatarMonkey,  name: 'Jungle Monkey',    bg: '#FFF7ED', accent: '#EA580C' },
  { id: 'bat'     as const, component: AvatarBat,     name: 'Night Bat',        bg: '#EDE9FE', accent: '#6366F1' },
  { id: 'fish'    as const, component: AvatarFish,    name: 'Goldie Fish',      bg: '#FEF3C7', accent: '#F97316' },
  { id: 'knight'  as const, component: AvatarKnight,  name: 'Bold Knight',      bg: '#DBEAFE', accent: '#1D4ED8' },
  { id: 'alien'   as const, component: AvatarAlien,   name: 'Zap Alien',        bg: '#F0FDF4', accent: '#22C55E' },
  { id: 'witch'   as const, component: AvatarWitch,   name: 'Star Witch',       bg: '#EDE9FE', accent: '#7C3AED' },
  { id: 'walrus'  as const, component: AvatarWalrus,  name: 'Cool Walrus',      bg: '#E0F2FE', accent: '#0891B2' },
  { id: 'elf'     as const, component: AvatarElf,     name: 'Swift Elf',        bg: '#D1FAE5', accent: '#059669' },
];

export type AvatarEntry = typeof AVATARS[number];
