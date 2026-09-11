// src/lib/theme/themes.ts — generated from the 4a mock
export type ThemeId =
  | 'cocoa'
  | 'field'
  | 'terracotta'
  | 'lagoon'
  | 'pumpkin'
  | 'cyprus'
  | 'tiffany'
  | 'ocean'
  | 'sage'
  | 'burgundy'
  | 'pink'
  | 'clay'
  | 'mantis'
  | 'bridal'
  | 'bubblegum'
  | 'dino'
  | 'cosmo'
  | 'arcade'
  | 'wave'
  | 'court'
  | 'dusk'
  | 'studio'
  | 'turmeric'
  | 'vulcanico';

export interface ThemeTokens {
  id: ThemeId;
  name: string;
  /** page background */        ground: string;
  /** text on ground */         onGround: string;
  /** card surface */           card: string;
  /** soft fill inside cards */ tint: string;
  /** 3px border color */       line: string;
  /** text on card */           ink: string;
  /** secondary text on card */ muted: string;
  /** primary action */         accent: string;
  /** text on accent */         onAccent: string;
  /** hard drop shadow color */ shadow: string;
  /** picker swatch A */        sw1: string;
  /** picker swatch B */        sw2: string;
}

export const THEMES: ThemeTokens[] = [
  { id: 'cocoa', name: 'Cocoa', ground: '#2A1D19', onGround: '#F4EAE4', card: '#3A2A24', tint: '#4A342C', line: '#FF7A59', ink: '#F4EAE4', muted: '#B79E93', accent: '#FF7A59', onAccent: '#2A1209', shadow: 'rgba(255,122,89,.2)', sw1: '#FF7A59', sw2: '#2A1D19' },
  { id: 'field', name: 'Field', ground: '#2E6B4F', onGround: '#F2F7F3', card: '#F2F7F3', tint: '#D6E7DC', line: '#1B4634', ink: '#14301F', muted: '#4E7462', accent: '#E9B949', onAccent: '#2A1F05', shadow: 'rgba(20,48,31,.3)', sw1: '#2E6B4F', sw2: '#E9B949' },
  { id: 'terracotta', name: 'Terracotta', ground: '#F7F3EC', onGround: '#16181C', card: '#FFFFFF', tint: '#F0E5D8', line: '#16181C', ink: '#16181C', muted: '#6E6A62', accent: '#E2603C', onAccent: '#FFF6F2', shadow: 'rgba(22,24,28,.22)', sw1: '#E2603C', sw2: '#16181C' },
  { id: 'lagoon', name: 'Lagoon', ground: '#2BB3A8', onGround: '#06312D', card: '#FFFFFF', tint: '#DCF2EF', line: '#0E6F66', ink: '#0E3B36', muted: '#4E7D77', accent: '#E2700F', onAccent: '#FFF6EE', shadow: 'rgba(14,59,54,.28)', sw1: '#2BB3A8', sw2: '#F5A24A' },
  { id: 'pumpkin', name: 'Pumpkin', ground: '#FD802E', onGround: '#2A1206', card: '#FFF7F0', tint: '#FFE3CE', line: '#233D4C', ink: '#233D4C', muted: '#5E7484', accent: '#233D4C', onAccent: '#FFF7F0', shadow: 'rgba(35,61,76,.3)', sw1: '#FD802E', sw2: '#233D4C' },
  { id: 'cyprus', name: 'Cyprus', ground: '#004741', onGround: '#F0EDE4', card: '#F7F5EF', tint: '#DDE8E3', line: '#004741', ink: '#00302C', muted: '#4F6E69', accent: '#004741', onAccent: '#F0EDE4', shadow: 'rgba(0,48,44,.32)', sw1: '#004741', sw2: '#F0EDE4' },
  { id: 'tiffany', name: 'Tiffany', ground: '#171717', onGround: '#F2F5F4', card: '#212121', tint: '#2B2B2B', line: '#21F1A8', ink: '#F2F5F4', muted: '#9A9A9A', accent: '#21F1A8', onAccent: '#0B1512', shadow: 'rgba(33,241,168,.22)', sw1: '#21F1A8', sw2: '#171717' },
  { id: 'ocean', name: 'Ocean', ground: '#2872A1', onGround: '#FFFFFF', card: '#FFFFFF', tint: '#DCEAF3', line: '#1B5C82', ink: '#143349', muted: '#4C7691', accent: '#2872A1', onAccent: '#FFFFFF', shadow: 'rgba(20,51,73,.3)', sw1: '#2872A1', sw2: '#CBDDE9' },
  { id: 'sage', name: 'Sage', ground: '#ACC8A2', onGround: '#1A2517', card: '#F4F8F2', tint: '#DCE8D6', line: '#1A2517', ink: '#1A2517', muted: '#4F6349', accent: '#1A2517', onAccent: '#ACC8A2', shadow: 'rgba(26,37,23,.28)', sw1: '#ACC8A2', sw2: '#1A2517' },
  { id: 'burgundy', name: 'Burgundy', ground: '#5B0E14', onGround: '#F1E194', card: '#FFF9E4', tint: '#F7EBBE', line: '#5B0E14', ink: '#3F0A0E', muted: '#7A4A4E', accent: '#5B0E14', onAccent: '#F1E194', shadow: 'rgba(63,10,14,.3)', sw1: '#5B0E14', sw2: '#F1E194' },
  { id: 'pink', name: 'Pink', ground: '#FD1843', onGround: '#FFF9FA', card: '#FFFFFF', tint: '#FFE3E9', line: '#C10E31', ink: '#1A1214', muted: '#7A6469', accent: '#FD1843', onAccent: '#FFF9FA', shadow: 'rgba(193,14,49,.3)', sw1: '#FD1843', sw2: '#FFF9FA' },
  { id: 'clay', name: 'Clay', ground: '#D34A32', onGround: '#FFF6F1', card: '#FDEEE7', tint: '#F6D9CD', line: '#8E1B1B', ink: '#3A241F', muted: '#7A5A4C', accent: '#8E1B1B', onAccent: '#F6D9CD', shadow: 'rgba(58,36,31,.28)', sw1: '#D34A32', sw2: '#F6D9CD' },
  { id: 'mantis', name: 'Mantis', ground: '#59C749', onGround: '#12290C', card: '#FFFDF1', tint: '#E8F5E1', line: '#2F7A24', ink: '#16330F', muted: '#4E6B45', accent: '#2F7A24', onAccent: '#FFFDF1', shadow: 'rgba(22,51,15,.28)', sw1: '#59C749', sw2: '#FFFDF1' },
  { id: 'bridal', name: 'Bridal', ground: '#741A2F', onGround: '#FFC6A8', card: '#FFF6F0', tint: '#FFE6D8', line: '#741A2F', ink: '#5C1425', muted: '#96566A', accent: '#741A2F', onAccent: '#FFC6A8', shadow: 'rgba(92,20,37,.3)', sw1: '#741A2F', sw2: '#FFC6A8' },
  { id: 'bubblegum', name: 'Bubblegum', ground: '#FF8FB1', onGround: '#3B0A20', card: '#FFF3F7', tint: '#FFD9E5', line: '#B0104E', ink: '#6B0F35', muted: '#9C5872', accent: '#B0104E', onAccent: '#FFF3F7', shadow: 'rgba(176,16,78,.3)', sw1: '#FF8FB1', sw2: '#B0104E' },
  { id: 'dino', name: 'Dino', ground: '#7BC950', onGround: '#14300B', card: '#F6FBEF', tint: '#DCF0C6', line: '#2F6B18', ink: '#1E4A10', muted: '#587A46', accent: '#2F6B18', onAccent: '#F6FBEF', shadow: 'rgba(30,74,16,.3)', sw1: '#7BC950', sw2: '#2F6B18' },
  { id: 'cosmo', name: 'Cosmo', ground: '#2B2A6E', onGround: '#FFE27A', card: '#F4F3FF', tint: '#DCDAFB', line: '#191850', ink: '#191850', muted: '#5A5893', accent: '#4B48C9', onAccent: '#FFFFFF', shadow: 'rgba(25,24,80,.35)', sw1: '#2B2A6E', sw2: '#FFE27A' },
  { id: 'arcade', name: 'Arcade', ground: '#6C2BD9', onGround: '#F6E7FF', card: '#FBF6FF', tint: '#E9D8FF', line: '#3E1583', ink: '#32126A', muted: '#6F5A96', accent: '#00A886', onAccent: '#FFFFFF', shadow: 'rgba(62,21,131,.35)', sw1: '#6C2BD9', sw2: '#00D3A7' },
  { id: 'wave', name: 'Wave', ground: '#17B8C7', onGround: '#04303A', card: '#F2FBFC', tint: '#CFEFF3', line: '#0A6D79', ink: '#06414A', muted: '#4A7C84', accent: '#C4482A', onAccent: '#FFF3EF', shadow: 'rgba(10,109,121,.3)', sw1: '#17B8C7', sw2: '#FF6B4A' },
  { id: 'court', name: 'Court', ground: '#123A8C', onGround: '#E8F0FF', card: '#F5F8FF', tint: '#D8E4FB', line: '#0B255C', ink: '#0B255C', muted: '#51689C', accent: '#0B255C', onAccent: '#C8FF3D', shadow: 'rgba(11,37,92,.35)', sw1: '#123A8C', sw2: '#C8FF3D' },
  { id: 'dusk', name: 'Dusk', ground: '#3B1F5E', onGround: '#FFD9E8', card: '#F8F2FB', tint: '#E6D6F2', line: '#26123E', ink: '#26123E', muted: '#6B5581', accent: '#C4185C', onAccent: '#FFF2F7', shadow: 'rgba(38,18,62,.35)', sw1: '#3B1F5E', sw2: '#FF4E8B' },
  { id: 'studio', name: 'Studio', ground: '#1F2124', onGround: '#F2F3F4', card: '#2A2D31', tint: '#35383D', line: '#7DA2FF', ink: '#F2F3F4', muted: '#A0A6AE', accent: '#7DA2FF', onAccent: '#0E1526', shadow: 'rgba(125,162,255,.2)', sw1: '#7DA2FF', sw2: '#1F2124' },
  { id: 'turmeric', name: 'Turmeric', ground: '#FFBE0B', onGround: '#2A2312', card: '#FFF8E3', tint: '#FFE9AE', line: '#2A2312', ink: '#2A2312', muted: '#6B5F3C', accent: '#2A2312', onAccent: '#FFBE0B', shadow: 'rgba(42,35,18,.3)', sw1: '#FFBE0B', sw2: '#2A2312' },
  { id: 'vulcanico', name: 'Vulcanico', ground: '#001621', onGround: '#F0EDE9', card: '#05202D', tint: '#0C2E3D', line: '#FF4103', ink: '#F0EDE9', muted: '#8FA6B0', accent: '#FF4103', onAccent: '#FFF3EE', shadow: 'rgba(255,65,3,.22)', sw1: '#FF4103', sw2: '#001621' },
];

export const DEFAULT_THEME: ThemeId = 'cocoa';
export const THEME_IDS = THEMES.map((t) => t.id);
