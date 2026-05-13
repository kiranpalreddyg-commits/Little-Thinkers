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
      };
      localStorage.setItem(this.storageKey, JSON.stringify(defaultDb));
      return defaultDb;
    }
    return JSON.parse(stored);
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

  createChild(parentId: string, name: string, age: number, gameplayMode: string = 'smart') {
    const db = this.getDb();
    
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
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.children.push(newChild);
    this.setDb(db);
    
    return newChild;
  }

  reset() {
    const defaultDb = {
      parents: MOCK_PARENTS,
      children: MOCK_CHILDREN,
      users: [
        ...MOCK_PARENTS.map(p => ({ id: p.id, email: p.email, password: p.password, role: p.role })),
      ],
    };
    localStorage.setItem(this.storageKey, JSON.stringify(defaultDb));
  }
}

export const mockDb = new MockDatabase();