import React, { useState } from 'react';
import { Palette, Check, Plus, Menu, Home, Compass, Award, X } from 'lucide-react';

// --- HUMANE AVATAR SVGS (Inspired by Reference Image 2) ---

const AvatarBird = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(0, 5)">
      {/* Feet */}
      <rect x="35" y="75" width="8" height="15" rx="4" fill="#F59E0B"/>
      <rect x="57" y="75" width="8" height="15" rx="4" fill="#F59E0B"/>
      {/* Wings */}
      <path d="M 20 50 Q 5 60 15 75 Q 25 60 25 50" fill="#2563EB"/>
      <path d="M 80 50 Q 95 60 85 75 Q 75 60 75 50" fill="#2563EB"/>
      {/* Body */}
      <circle cx="50" cy="45" r="35" fill="#3B82F6"/>
      {/* Belly */}
      <circle cx="50" cy="55" r="20" fill="#60A5FA"/>
      {/* Eyes */}
      <circle cx="38" cy="35" r="5" fill="#1E3A8A"/>
      <circle cx="62" cy="35" r="5" fill="#1E3A8A"/>
      {/* Beak */}
      <path d="M 43 42 L 57 42 L 50 52 Z" fill="#FBBF24"/>
      {/* Hair Tuft */}
      <path d="M 45 10 Q 50 0 55 10 Q 50 5 45 10" fill="#2563EB"/>
    </g>
  </svg>
);

const AvatarBear = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(0, 5)">
      {/* Ears */}
      <circle cx="25" cy="25" r="14" fill="#D97706"/>
      <circle cx="75" cy="25" r="14" fill="#D97706"/>
      <circle cx="25" cy="25" r="7" fill="#F59E0B"/>
      <circle cx="75" cy="25" r="7" fill="#F59E0B"/>
      {/* Body/Head */}
      <circle cx="50" cy="50" r="38" fill="#F59E0B"/>
      {/* Snout */}
      <ellipse cx="50" cy="62" rx="20" ry="16" fill="#FDE68A"/>
      {/* Nose */}
      <ellipse cx="50" cy="56" rx="7" ry="5" fill="#78350F"/>
      {/* Mouth */}
      <path d="M 45 65 Q 50 70 50 65 Q 50 70 55 65" fill="none" stroke="#78350F" strokeWidth="2" strokeLinecap="round"/>
      {/* Eyes */}
      <circle cx="36" cy="42" r="4.5" fill="#78350F"/>
      <circle cx="64" cy="42" r="4.5" fill="#78350F"/>
    </g>
  </svg>
);

const AvatarGhost = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(0, 5)">
      {/* Body */}
      <path d="M 20 50 C 20 20, 80 20, 80 50 L 80 80 Q 72.5 90, 65 80 Q 57.5 90, 50 80 Q 42.5 90, 35 80 Q 27.5 90, 20 80 Z" fill="#F9A8D4"/>
      {/* Eyes */}
      <circle cx="38" cy="45" r="4" fill="#831843"/>
      <circle cx="62" cy="45" r="4" fill="#831843"/>
      {/* Smile */}
      <path d="M 45 55 Q 50 60 55 55" fill="none" stroke="#831843" strokeWidth="3" strokeLinecap="round"/>
    </g>
  </svg>
);

const AvatarChick = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(0, 5)">
      {/* Feet */}
      <rect x="40" y="75" width="6" height="12" rx="3" fill="#EA580C"/>
      <rect x="54" y="75" width="6" height="12" rx="3" fill="#EA580C"/>
      {/* Body */}
      <ellipse cx="50" cy="50" rx="30" ry="32" fill="#FBBF24"/>
      {/* Wings */}
      <ellipse cx="20" cy="55" rx="8" ry="15" fill="#F59E0B"/>
      <ellipse cx="80" cy="55" rx="8" ry="15" fill="#F59E0B"/>
      {/* Comb */}
      <circle cx="45" cy="15" r="6" fill="#EF4444"/>
      <circle cx="55" cy="15" r="6" fill="#EF4444"/>
      <circle cx="50" cy="10" r="7" fill="#EF4444"/>
      {/* Eyes */}
      <circle cx="40" cy="40" r="4" fill="#78350F"/>
      <circle cx="60" cy="40" r="4" fill="#78350F"/>
      {/* Beak */}
      <ellipse cx="50" cy="48" rx="8" ry="5" fill="#EA580C"/>
    </g>
  </svg>
);

const Cloud = ({ className }) => (
  <svg viewBox="0 0 100 50" fill="white" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M25 45C11.1929 45 0 33.8071 0 20C0 6.19288 11.1929 -5 25 -5C36.7581 -5 46.6174 3.12564 49.3339 14.1206C51.6213 11.5831 55.0592 10 58.8235 10C65.578 10 71.1824 15.0063 72.1818 21.5037C73.8003 19.3406 76.4385 18 79.4118 18C84.2831 18 88.2353 21.9523 88.2353 26.8235C88.2353 27.2435 88.2059 27.6565 88.1498 28.0607C94.8872 29.5085 100 35.5398 100 42.6471C100 50.5746 93.5746 57 85.6471 57H25C11.1929 57 0 45.8071 0 32C0 23.3644 4.37255 15.7534 11.0505 11.4588C13.8821 5.06649 20.3546 0.555555 28.1111 0.555555C37.0097 0.555555 44.4287 6.89966 46.2163 15.3444C49.1915 11.9523 53.6496 9.88889 58.5556 9.88889C67.7603 9.88889 75.2222 17.3508 75.2222 26.5556C75.2222 27.8732 75.0694 29.155 74.7839 30.3846C81.1687 31.7925 86 37.4913 86 44.3333C86 52.0653 79.732 58.3333 72 58.3333H25C11.1929 58.3333 0 47.1405 0 33.3333Z" />
  </svg>
);


// --- THEME DEFINITIONS ---
const THEMES = {
  mint: {
    id: 'mint',
    name: 'Minty Fresh',
    bg: '#2DD4BF', // teal-400
    cardBg: 'rgba(20, 184, 166, 0.4)', // teal-500/40
    border: '#0F766E', // teal-700
    text: '#115E59', // teal-800
    accent: '#FBBF24', // amber-400
    shadow: 'rgba(15, 118, 110, 0.4)',
  },
  sunshine: {
    id: 'sunshine',
    name: 'Sunshine',
    bg: '#FCD34D', // amber-300
    cardBg: 'rgba(245, 158, 11, 0.3)', // amber-500/30
    border: '#B45309', // amber-700
    text: '#78350F', // amber-900
    accent: '#F472B6', // pink-400
    shadow: 'rgba(180, 83, 9, 0.3)',
  },
  candy: {
    id: 'candy',
    name: 'Cotton Candy',
    bg: '#F9A8D4', // pink-300
    cardBg: 'rgba(236, 72, 153, 0.3)', // pink-500/30
    border: '#BE185D', // pink-700
    text: '#831843', // pink-900
    accent: '#38BDF8', // sky-400
    shadow: 'rgba(190, 24, 93, 0.3)',
  },
  lavender: {
    id: 'lavender',
    name: 'Lavender',
    bg: '#C4B5FD', // violet-300
    cardBg: 'rgba(139, 92, 246, 0.3)', // violet-500/30
    border: '#6D28D9', // violet-700
    text: '#4C1D95', // violet-900
    accent: '#34D399', // emerald-400
    shadow: 'rgba(109, 40, 217, 0.3)',
  }
};

const AVATARS = [
  { id: 'bird', component: AvatarBird, name: 'Blue Bird' },
  { id: 'bear', component: AvatarBear, name: 'Golden Bear' },
  { id: 'ghost', component: AvatarGhost, name: 'Pink Ghost' },
  { id: 'chick', component: AvatarChick, name: 'Little Chick' },
];

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [themeId, setThemeId] = useState('mint');
  const [avatarId, setAvatarId] = useState('bird');
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  
  const theme = THEMES[themeId];
  const ActiveAvatar = AVATARS.find(a => a.id === avatarId).component;

  const handleThemeCycle = () => {
    const themeKeys = Object.keys(THEMES);
    const currentIndex = themeKeys.indexOf(themeId);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    setThemeId(themeKeys[nextIndex]);
  };

  return (
    <div 
      className="min-h-screen font-sans pb-28 overflow-x-hidden transition-colors duration-500"
      style={{ backgroundColor: theme.bg }}
    >
      
      {/* HEADER */}
      <header className="px-4 py-5 flex items-center justify-between sticky top-0 z-50">
        <button 
          onClick={handleThemeCycle}
          className="w-14 h-14 bg-white/30 hover:bg-white/50 backdrop-blur-md border-4 rounded-2xl flex items-center justify-center transition-all active:scale-95"
          style={{ borderColor: theme.border, color: theme.text }}
        >
          <Palette className="w-7 h-7 stroke-[2.5]" />
        </button>

        <div className="flex gap-4">
          <div 
            className="flex items-center gap-2 bg-white px-5 py-2 rounded-2xl border-4"
            style={{ borderColor: theme.border, boxShadow: `0 6px 0 ${theme.shadow}` }}
          >
            <span className="text-xl">⚡</span>
            <span className="font-black text-xl" style={{ color: theme.text }}>120</span>
          </div>
          
          <button 
            onClick={() => setIsAvatarModalOpen(true)}
            className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border-4 overflow-hidden active:scale-95 transition-transform"
            style={{ borderColor: theme.border, boxShadow: `0 6px 0 ${theme.shadow}` }}
          >
            <ActiveAvatar className="w-10 h-10 mt-2" />
          </button>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 md:px-0 flex flex-col gap-6 relative">
        
        {/* HERO ENVIRONMENT SCENE */}
        <section className="relative h-64 flex items-center justify-center mt-[-20px]">
          {/* Animated Clouds */}
          <Cloud className="absolute top-10 -left-6 w-32 opacity-80 animate-float" style={{ animationDelay: '0s', animationDuration: '8s' }} />
          <Cloud className="absolute top-4 right-10 w-24 opacity-60 animate-float" style={{ animationDelay: '1s', animationDuration: '6s' }} />
          <Cloud className="absolute top-28 -right-12 w-40 opacity-90 animate-float" style={{ animationDelay: '2s', animationDuration: '10s' }} />

          {/* Active Mascot in the world */}
          <div className="relative z-10 w-48 h-48 animate-float">
            <ActiveAvatar className="w-full h-full drop-shadow-2xl" />
          </div>
        </section>

        {/* PROGRESS CARD (Uniform Style) */}
        <div 
          className="rounded-[2rem] p-6 border-4 relative overflow-hidden"
          style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
        >
          <div className="flex items-center gap-5 mb-4">
            <div className="w-16 h-16 bg-white rounded-[1.25rem] border-4 flex items-center justify-center shrink-0" style={{ borderColor: theme.border }}>
              <span className="text-3xl">🏠</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-end mb-2">
                <span className="text-white font-black text-base tracking-wide drop-shadow-md">Day 14 Adventure</span>
                <span className="text-white font-bold text-sm drop-shadow-md">Home Base 📍</span>
              </div>
              <div className="w-full h-6 bg-black/20 rounded-full overflow-hidden border-2 border-white/50 relative shadow-inner">
                <div className="w-3/4 h-full rounded-full relative" style={{ backgroundColor: theme.accent }}>
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-white/30 rounded-t-full"></div>
                </div>
                <span className="absolute right-3 top-0.5 text-xs font-black text-white drop-shadow-md">15 / 20 ⚡</span>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN TITLE */}
        <div className="flex items-center justify-between px-2 mt-2">
          <h2 className="text-2xl font-black text-white drop-shadow-md tracking-tight">Daily Brain Games!</h2>
        </div>

        {/* GAME LIST (Strictly Uniform, Tactile Cards) */}
        <div className="flex flex-col gap-5">
          
          {[
            { title: 'Word Pop', desc: 'Crack the secret word', icon: '📝', points: 10, completed: true },
            { title: 'Connection Quest', desc: 'Spot what links them', icon: '🔗', points: 5, completed: false },
            { title: 'Memory Flip', desc: 'Flip, match, WIN!', icon: '🃏', points: 5, completed: false },
          ].map((game, i) => (
            <div 
              key={i}
              className="group bg-white rounded-[2rem] p-5 flex items-center gap-5 border-4 transition-transform active:translate-y-[4px] cursor-pointer"
              style={{ 
                borderColor: theme.border,
                boxShadow: `0 8px 0 ${theme.shadow}`
              }}
            >
              <div 
                className="w-16 h-16 rounded-[1.25rem] border-4 flex items-center justify-center shrink-0"
                style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
              >
                <span className="text-3xl drop-shadow-md">{game.icon}</span>
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-black leading-tight mb-1" style={{ color: theme.text }}>{game.title}</h3>
                <p className="text-slate-500 font-bold text-sm">{game.desc}</p>
              </div>
              
              <div className="flex flex-col items-center justify-center">
                 <span className="font-black text-sm mb-1.5 flex items-center" style={{ color: theme.text }}>
                   {game.points} ⚡
                 </span>
                 <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center border-4 transition-colors"
                    style={{ 
                      backgroundColor: game.completed ? theme.accent : '#F1F5F9',
                      borderColor: game.completed ? theme.border : '#CBD5E1',
                      color: game.completed ? theme.text : '#94A3B8'
                    }}
                 >
                   {game.completed ? <Check className="w-7 h-7 stroke-[3]" /> : <Plus className="w-7 h-7 stroke-[3]" />}
                 </div>
              </div>
            </div>
          ))}

          {/* Button to show more games */}
          <button 
            className="w-full py-5 text-white font-black text-xl rounded-[2rem] border-4 transition-transform active:translate-y-[4px] flex items-center justify-center gap-2 mt-2"
            style={{ 
              backgroundColor: theme.cardBg, 
              borderColor: theme.border,
              boxShadow: `0 8px 0 ${theme.shadow}` 
            }}
          >
            See 2 more games
          </button>
        </div>

        {/* EXPLORE & LEARN (Uniform style horizontal scroll) */}
        <div className="mt-8 mb-10">
          <h2 className="text-2xl font-black text-white drop-shadow-md tracking-tight px-2 mb-5">Curiosity Zone</h2>
          
          <div className="flex gap-5 overflow-x-auto pb-6 snap-x px-2 hide-scrollbar">
            
            <div 
              className="min-w-[280px] bg-white rounded-[2rem] p-6 border-4 snap-center cursor-pointer active:translate-y-[4px] transition-transform"
              style={{ borderColor: theme.border, boxShadow: `0 8px 0 ${theme.shadow}` }}
            >
               <div className="flex gap-4 mb-4">
                 <div className="w-16 h-16 rounded-[1.25rem] border-4 flex items-center justify-center text-3xl" style={{ backgroundColor: theme.bg, borderColor: theme.border }}>
                   🔬
                 </div>
                 <div className="flex-1 flex items-center">
                   <h3 className="text-xl font-black" style={{ color: theme.text }}>Tell Me Why?</h3>
                 </div>
               </div>
               <p className="text-slate-600 font-bold text-base mb-5 leading-tight">Why do matches catch fire?</p>
               <div 
                 className="text-center font-black py-3 rounded-xl border-4"
                 style={{ backgroundColor: theme.cardBg, borderColor: theme.border, color: theme.text }}
               >
                 Discover
               </div>
            </div>

            <div 
              className="min-w-[280px] bg-white rounded-[2rem] p-6 border-4 snap-center cursor-pointer active:translate-y-[4px] transition-transform"
              style={{ borderColor: theme.border, boxShadow: `0 8px 0 ${theme.shadow}` }}
            >
               <div className="flex gap-4 mb-4">
                 <div className="w-16 h-16 rounded-[1.25rem] border-4 flex items-center justify-center text-3xl" style={{ backgroundColor: theme.bg, borderColor: theme.border }}>
                   📚
                 </div>
                 <div className="flex-1 flex items-center">
                   <h3 className="text-xl font-black" style={{ color: theme.text }}>Story Time</h3>
                 </div>
               </div>
               <p className="text-slate-600 font-bold text-base mb-5 leading-tight">The Brave Little Robot</p>
               <div 
                 className="text-center font-black py-3 rounded-xl border-4"
                 style={{ backgroundColor: theme.cardBg, borderColor: theme.border, color: theme.text }}
               >
                 Read Story
               </div>
            </div>

          </div>
        </div>

      </main>

      {/* BOTTOM NAVIGATION - Uniform thick borders */}
      <div className="fixed bottom-6 left-0 w-full px-4 z-40 flex justify-center">
        <nav 
          className="bg-white rounded-[2.5rem] border-4 flex justify-between items-center px-4 py-3 w-full max-w-sm"
          style={{ borderColor: theme.border, boxShadow: `0 8px 30px rgba(0,0,0,0.2)` }}
        >
          {[
            { id: 'home', icon: Home },
            { id: 'explore', icon: Compass },
            { id: 'add', icon: Plus, isPrimary: true },
            { id: 'badges', icon: Award },
            { id: 'menu', icon: Menu },
          ].map((item) => (
            item.isPrimary ? (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)} 
                className="w-16 h-16 rounded-full flex items-center justify-center border-4 transform -mt-10 active:translate-y-[4px] transition-transform"
                style={{ backgroundColor: theme.accent, borderColor: theme.border, boxShadow: `0 6px 0 ${theme.shadow}` }}
              >
                <Plus className="w-8 h-8 stroke-[3] text-white drop-shadow-md" />
              </button>
            ) : (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center transition-all ${activeTab === item.id ? 'border-4' : 'text-slate-400'}`}
                style={activeTab === item.id ? { backgroundColor: theme.cardBg, borderColor: theme.border, color: theme.text } : {}}
              >
                <item.icon className="w-7 h-7 stroke-[2.5]" />
              </button>
            )
          ))}
        </nav>
      </div>

      {/* AVATAR SELECTION MODAL */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div 
            className="bg-white w-full max-w-sm rounded-[2rem] border-4 p-6 relative animate-in zoom-in-95 duration-200"
            style={{ borderColor: theme.border, boxShadow: `0 12px 0 ${theme.shadow}` }}
          >
            <button 
              onClick={() => setIsAvatarModalOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200"
            >
              <X className="w-6 h-6 stroke-[3]" />
            </button>

            <h3 className="text-2xl font-black mb-6 text-center" style={{ color: theme.text }}>Choose your friend!</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => { setAvatarId(avatar.id); setIsAvatarModalOpen(false); }}
                  className={`flex flex-col items-center justify-center p-4 rounded-[1.5rem] border-4 transition-transform active:scale-95 ${avatarId === avatar.id ? 'bg-slate-50' : 'bg-white'}`}
                  style={{ borderColor: avatarId === avatar.id ? theme.border : '#E2E8F0' }}
                >
                  <avatar.component className="w-20 h-20 mb-3" />
                  <span className="font-bold text-slate-700">{avatar.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .animate-float { animation: float 5s ease-in-out infinite; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default App;