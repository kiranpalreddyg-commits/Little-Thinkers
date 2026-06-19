import type { ThoughtSpark, BrainJar } from '@/lib/types/rewards';
import { BRAIN_JAR_CAPACITY } from '@/lib/types/rewards';

// Mock data for development/testing
export const MOCK_PARENTS = [
  {
    id: 'parent-1',
    email: 'james@example.com',
    password: 'password123',
    role: 'parent',
    created_at: '2026-05-01T00:00:00Z',
    updated_at: '2026-05-01T00:00:00Z',
    last_login: '2026-05-11T10:00:00Z',
    is_active: true,
  },
];

export const MOCK_CHILDREN = [
  {
    id: 'child-1',
    parent_id: 'parent-1',
    name: 'Aiden',
    age: 8,
    avatar_url: null,
    accessibility_settings: {
      reducedMotion: false,
      colorBlindMode: false,
      dyslexiaFriendlyFont: false,
      textSize: 'medium',
      oneHandedLayout: false,
    },
    gameplay_mode: 'smart',
    coppa_consented: true,
    coppa_consented_at: '2026-05-01T00:00:00Z',
    created_at: '2026-05-01T00:00:00Z',
    updated_at: '2026-05-01T00:00:00Z',
  },
  {
    id: 'child-2',
    parent_id: 'parent-1',
    name: 'Maya',
    age: 14,
    avatar_url: null,
    accessibility_settings: {
      reducedMotion: false,
      colorBlindMode: false,
      dyslexiaFriendlyFont: false,
      textSize: 'medium',
      oneHandedLayout: false,
    },
    gameplay_mode: 'challenge',
    coppa_consented: true,
    coppa_consented_at: '2026-05-02T00:00:00Z',
    created_at: '2026-05-02T00:00:00Z',
    updated_at: '2026-05-02T00:00:00Z',
  },
];

// Mock games
export const MOCK_GAMES = [
  {
    type: 'word-pop',
    name: 'Word Pop',
    description: 'Guess the hidden word by choosing letters — builds vocabulary and word recognition.',
    themedArea: 'Word Woods',
    cognitiveSkill: 'vocabulary',
    bloomsLevel: 'apply',
    difficulties: ['easy', 'medium', 'hard'],
  },
  {
    type: 'connection-quest',
    name: 'Connection Quest',
    description: 'Find the hidden connections between word groups — sharpens analytical reasoning.',
    themedArea: 'Connection Canyon',
    cognitiveSkill: 'logic',
    bloomsLevel: 'analyze',
    difficulties: ['easy', 'medium', 'hard'],
  },
  {
    type: 'memory-flip',
    name: 'Memory Flip',
    description: 'Flip cards to find matching pairs — strengthens working memory and recall.',
    themedArea: 'Memory Marsh',
    cognitiveSkill: 'memory',
    bloomsLevel: 'remember',
    difficulties: ['easy', 'medium', 'hard'],
  },
  {
    type: 'pattern-builder',
    name: 'Pattern Builder',
    description: 'Complete the visual pattern sequence — develops spatial reasoning.',
    themedArea: 'Pattern Peaks',
    cognitiveSkill: 'pattern-recognition',
    bloomsLevel: 'apply',
    difficulties: ['easy', 'medium', 'hard'],
  },
  {
    type: 'grid-logic',
    name: 'Grid Logic',
    description: 'Solve logic puzzles in a grid — builds systematic thinking and problem-solving.',
    themedArea: 'Logic Lab',
    cognitiveSkill: 'logic',
    bloomsLevel: 'evaluate',
    difficulties: ['easy', 'medium', 'hard'],
  },
];

// Mock stories
export const MOCK_STORIES = [
  {
    id: 'story-1',
    title: 'The Kind Octopus',
    cognitiveSkills: ['social-emotional'],
    ageRange: { min: 7, max: 12 },
    theme: 'ocean',
    readingLevel: 'grade_3',
  },
  {
    id: 'story-2',
    title: 'The Brave Little Robot',
    cognitiveSkills: ['social-emotional'],
    ageRange: { min: 8, max: 15 },
    theme: 'technology',
    readingLevel: 'grade_4',
  },
  {
    id: 'story-3',
    title: 'A Garden of Kindness',
    cognitiveSkills: ['social-emotional'],
    ageRange: { min: 7, max: 10 },
    theme: 'nature',
    readingLevel: 'grade_2',
  },
];

// Mock science topics
export const MOCK_SCIENCE_TOPICS = [
  {
    id: 'science-1',
    question: 'Why do matches catch fire?',
    cognitiveSkills: ['curiosity'],
    ageRange: { min: 8, max: 15 },
  },
  {
    id: 'science-2',
    question: 'Why does cooked shrimp turn red?',
    cognitiveSkills: ['curiosity'],
    ageRange: { min: 7, max: 15 },
  },
  {
    id: 'science-3',
    question: 'How do airplanes fly?',
    cognitiveSkills: ['curiosity'],
    ageRange: { min: 8, max: 15 },
  },
];

// Mock daily puzzle
export const MOCK_DAILY_PUZZLE = {
  id: 'puzzle-today',
  type: 'word-pop',
  difficulty: 'medium',
  hint: 'A 5-letter word for something that shines at night',
  createdAt: new Date().toISOString(),
};

// Mock tokens
export const generateMockTokens = (userId: string) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      userId,
      role: 'parent',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
      iss: 'little-thinkers-mock',
    })
  );
  const signature = btoa('mock-signature');
  
  return {
    access_token: `${header}.${payload}.${signature}`,
    refresh_token: `${header}.${payload}.refresh-mock`,
    token_type: 'Bearer',
    expires_in: 3600,
  };
};

// Mock database (persisted in localStorage)
class MockDatabase {
  private storageKey = 'little-thinkers-mock-db';

  private getDb() {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
      const defaultDb = {
        parents: MOCK_PARENTS,
        children: MOCK_CHILDREN,
        users: [
          ...MOCK_PARENTS.map(p => ({ id: p.id, email: p.email, password: p.password, role: p.role })),
        ],
        rewards: [] as ThoughtSpark[],
      };
      localStorage.setItem(this.storageKey, JSON.stringify(defaultDb));
      return defaultDb;
    }
    const db = JSON.parse(stored);
    if (!db.rewards) db.rewards = [];
    return db;
  }

  private setDb(db: any) {
    localStorage.setItem(this.storageKey, JSON.stringify(db));
  }

  registerParent(email: string, password: string) {
    const db = this.getDb();
    const existingUser = db.parents.find((p: any) => p.email === email);
    
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const newParent = {
      id: `parent-${Date.now()}`,
      email,
      password,
      role: 'parent',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login: null,
      is_active: true,
    };

    db.parents.push(newParent);
    db.users.push({
      id: newParent.id,
      email,
      password,
      role: 'parent',
    });

    this.setDb(db);
    return newParent;
  }

  loginParent(email: string, password: string) {
    const db = this.getDb();
    const parent = db.parents.find((p: any) => p.email === email && p.password === password);
    
    if (!parent) {
      throw new Error('Invalid email or password');
    }

    parent.last_login = new Date().toISOString();
    this.setDb(db);
    
    return parent;
  }

  getChildren(parentId: string) {
    const db = this.getDb();
    return db.children.filter((c: any) => c.parent_id === parentId);
  }

  getChild(childId: string) {
    const db = this.getDb();
    return db.children.find((c: any) => c.id === childId);
  }

  createChild(
    parentId: string,
    name: string,
    age: number,
    gameplayMode: string = 'smart',
    coppaConsented: boolean = false,
  ) {
    const db = this.getDb();
    const now = new Date().toISOString();
    const newChild = {
      id: `child-${Date.now()}`,
      parent_id: parentId,
      name,
      age,
      avatar_url: null,
      accessibility_settings: {
        reducedMotion: false,
        colorBlindMode: false,
        dyslexiaFriendlyFont: false,
        textSize: 'medium',
        oneHandedLayout: false,
      },
      gameplay_mode: gameplayMode,
      coppa_consented: coppaConsented,
      coppa_consented_at: coppaConsented ? now : null,
      created_at: now,
      updated_at: now,
    };

    db.children.push(newChild);
    this.setDb(db);
    return newChild;
  }

  updateChild(childId: string, updates: { name?: string; age?: number; gameplay_mode?: string }) {
    const db = this.getDb();
    const child = db.children.find((c: any) => c.id === childId);
    if (!child) throw new Error('Child profile not found');
    if (updates.name !== undefined) child.name = updates.name;
    if (updates.age !== undefined) child.age = updates.age;
    if (updates.gameplay_mode !== undefined) child.gameplay_mode = updates.gameplay_mode;
    child.updated_at = new Date().toISOString();
    this.setDb(db);
    return child;
  }

  updateChildConsent(childId: string, consented: boolean) {
    const db = this.getDb();
    const child = db.children.find((c: any) => c.id === childId);
    if (!child) throw new Error('Child profile not found');
    child.coppa_consented = consented;
    child.coppa_consented_at = consented ? new Date().toISOString() : null;
    child.updated_at = new Date().toISOString();
    this.setDb(db);
    return child;
  }

  getRewards(childId: string): ThoughtSpark[] {
    const db = this.getDb();
    return (db.rewards as ThoughtSpark[]).filter((r) => r.childId === childId);
  }

  addSpark(spark: ThoughtSpark): ThoughtSpark {
    const db = this.getDb();
    db.rewards.push(spark);
    this.setDb(db);
    return spark;
  }

  getBrainJar(childId: string): BrainJar {
    const sparks = this.getRewards(childId);
    const totalSparks = sparks.reduce((sum, s) => sum + s.amount, 0);
    const capacity = BRAIN_JAR_CAPACITY;
    const remainder = totalSparks % capacity;
    const fillPercent = remainder === 0 && totalSparks > 0 ? 100 : (remainder / capacity) * 100;
    return { childId, totalSparks, capacity, fillPercent };
  }

  reset() {
    const defaultDb = {
      parents: MOCK_PARENTS,
      children: MOCK_CHILDREN,
      users: [
        ...MOCK_PARENTS.map(p => ({ id: p.id, email: p.email, password: p.password, role: p.role })),
      ],
      rewards: [] as ThoughtSpark[],
    };
    localStorage.setItem(this.storageKey, JSON.stringify(defaultDb));
  }
}

export const mockDb = new MockDatabase();