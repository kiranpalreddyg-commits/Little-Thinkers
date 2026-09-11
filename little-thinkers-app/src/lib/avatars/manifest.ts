// src/lib/avatars/manifest.ts — generated from the 4a mock
// PNGs live in public/avatars/ (copied from this handoff's assets/avatars/).
// NOTE: the bundled PNGs are cut from reference art for mockup purposes only.
// Replace with commissioned/licensed art before shipping — see README "Assets".

export type AvatarId = string; // e.g. 'g02', 'h11', 'p04'

export interface AvatarGroup {
  id: string;
  label: string;
  avatars: AvatarId[];
}

export const AVATAR_GROUPS: AvatarGroup[] = [
  {
    id: 'heroes-explorers',
    label: 'Heroes & explorers',
    avatars: ['n05', 'n06', 'g02', 'g03', 'g04', 'g05', 'g06', 'g11', 'g13', 'g14', 'h01', 'h02', 'h04', 'h05', 'h06', 'h07', 'h11', 'h13'],
  },
  {
    id: 'sleuths-makers',
    label: 'Sleuths & makers',
    avatars: ['n04', 'n08', 'n09', 'n11', 'n12', 'g01', 'g09', 'g10', 'g12', 'g15', 'h08', 'h09', 'h12', 'h14', 'h15'],
  },
  {
    id: 'animal-pals',
    label: 'Animal pals',
    avatars: ['p01', 'p04', 'n01', 'n02', 'n03', 'n07', 'n10', 'g08', 'm15'],
  },
  {
    id: 'kids-friends',
    label: 'Kids & friends',
    avatars: ['p02', 'p03', 'p05', 'p06', 'p07', 'p08', 'g07', 'm01', 'm02', 'm04', 'm05', 'm06', 'm07', 'm08', 'm09', 'm10', 'm11', 'm12', 'm13', 'm14'],
  },
];

export const ALL_AVATARS: AvatarId[] = AVATAR_GROUPS.flatMap((g) => g.avatars);
export const DEFAULT_AVATAR: AvatarId = ALL_AVATARS[0];
export const avatarSrc = (id: AvatarId) => `/avatars/${id}.png`;
export const AVATAR_COUNT = 62;
