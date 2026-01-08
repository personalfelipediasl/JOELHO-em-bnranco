import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Info, Activity, ClipboardList, ChevronRight, Search, X, Dumbbell, ShieldCheck, ListChecks, ChevronDown, ChevronUp, Calendar, ArrowRight, AlertCircle, Heart } from 'lucide-react';
import { EXERCISES, TRANSLATIONS, PREDEFINED_WORKOUTS } from './constants';
import { Exercise, UserData, Language, ReadyWorkout } from './types';
import { Button, VideoPlayer, ScreenWrapper, Header, getIcon, Timer, SetCard } from './components';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt');
  const t = (key: string): string => TRANSLATIONS[key]?.[language] || key;
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};

const getVideoLabels = (t: (key: string) => string) => ({
  tapToWatch: t('tapToWatch'),
  watchNow: t('watchNow'),
  loading: t('loadingVideo'),
  demo: t('demoVideo'),
  placeholder: t('insertSpace')
});

const useUserData = () => {
  const [data, setData] = useState<UserData>(() => {
    const saved = localStorage.getItem('kneeGuideData');
    return saved ? JSON.parse(saved) : { favorites: [], notes: {}, customPlans: {}, activeWorkout: [] };
  });

  useEffect(() => {
    localStorage.setItem('kneeGuideData', JSON.stringify(data));
  }, [data]);

  const saveActiveWorkout = (ids: string[]) => setData(prev => ({ ...prev, activeWorkout: ids }));
  const clearActiveWorkout = () => setData(prev => ({ ...prev, activeWorkout: [] }));
  const toggleFavorite = (id: string) => setData(prev => ({ ...prev, favorites: prev.favorites.includes(id) ? prev.favorites.filter(fid => fid !== id) : [...prev.favorites, id] }));
  const updateNote = (id: string, text: string) => setData(prev => ({ ...prev, notes: { ...prev.notes, [id]: text } }));
  const updatePlan = (id: string, text: string) => setData(prev => ({ ...prev, customPlans: { ...prev.customPlans, [id]: text } }));

  return { data, saveActiveWorkout, clearActiveWorkout, toggleFavorite, updateNote, updatePlan };
};

const HomeScreen = ({ userData, clearWorkout }: { userData: UserData; clearWorkout: () => void }) => {
  const navigate = useNavigate();
  const { t, setLanguage, language } = useLanguage();
  const [showResumeModal, setShowResumeModal] = useState(false);

  useEffect(() => {
    if (userData.activeWorkout.length > 0) setShowResumeModal(true);
  }, [userData]);

  return (
    <ScreenWrapper className="justify-center items-center p-8">
      <div className="absolute top-4 right-4 flex gap-2">
         <button onClick={() => setLanguage('pt')} className={`text-xl ${language === 'pt' ? 'opacity-100' : 'opacity-40'}`}>🇧🇷</button>
         <button onClick={() => setLanguage('en')} className={`text-xl ${language === 'en' ? 'opacity-100' : 'opacity-40'}`}>🇺🇸</button>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-white">{t('guideTitle')} <span className="text-primary-500">{t('guideSubtitle')}</span></h1>
        <p className="text-neutral-500 mt-4 max-w-xs">{t('homeDesc')}</p>
      </div>

      <Button fullWidth onClick={() => navigate('/intro')}>{t('startBtn')}</Button>

      {showResumeModal && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-surface p-6 rounded-2xl border border-neutral-800 text-center w-full">
            <h2 className="text-xl font-bold mb-2">{t('resumeTitle')}</h2>
            <p className="text-neutral-400 mb-6">{t('resumeDesc')}</p>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={() => { clearWorkout(); setShowResumeModal(false); }}>{t('no')}</Button>
              <Button onClick={() => { setShowResumeModal(false); navigate('/active-workout'); }}>{t('yes')}</Button>
            </div>
          </div>
        </div>
      )}
    </ScreenWrapper>
  );
};

const IntroScreen = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  return (
    <ScreenWrapper>
      <Header onBack={() => navigate('/')} />
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <section><h2 className="text-2xl font-bold flex items-center gap-2"><Info className="text-primary-500" /> {t('forWhoTitle')}</h2><p className="text-neutral-400 mt-2">{t('forWhoDesc')}</p></section>
        <section className="bg-surface p-4 rounded-xl border border-neutral-800"><h2 className="text-lg font-bold text-red-500 mb-1">{t('problemTitle')}</h2><p className="text-neutral-400">{t('problemDesc')}</p></section>
        <section className="bg-surface p-4 rounded-xl border border-neutral-800"><h2 className="text-lg font-bold text-green-500 mb-1">{t('solutionTitle')}</h2><p className="text-neutral-400">{t('solutionDesc')}</p></section>
        <Button fullWidth onClick={() => navigate('/menu')}>{t('accessBtn')}</Button>
      </div>
    </ScreenWrapper>
  );
};

const MenuScreen = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  return (
    <ScreenWrapper>
      <Header title={t('principalHeader')} onBack={() => navigate('/intro')} />
      <div className="flex-1 p-6 space-y-6 flex flex-col justify-center">
        <button onClick={() => navigate('/recommendation')} className="bg-surface p-6 rounded-2xl border border-neutral-800 flex items-center gap-4 hover:border-primary-500 transition-all text-left group">
          <ShieldCheck className="w-8 h-8 text-primary-500" />
          <div className="flex-1">
            <h3 className="text-lg font-bold group-hover:text-primary-500">{t('recWorkoutTitle')}</h3>
            <p className="text-sm text-neutral-500">{t('recWorkoutSub')}</p>
          </div>
          <ChevronRight />
        </button>
        <button onClick={() => navigate('/workout-context')} className="bg-surface p-6 rounded-2xl border border-neutral-800 flex items-center gap-4 hover:border-primary-500 transition-all text-left group">
          <ListChecks className="w-8 h-8 text-primary-500" />
          <div className="flex-1">
            <h3 className="text-lg font-bold group-hover:text-primary-500">{t('adaptTitle')}</h3>
            <p className="text-sm text-neutral-500">{t('adaptSub')}</p>
          </div>
          <ChevronRight />
        </button>
      </div>
    </ScreenWrapper>
  );
};

const RecommendationScreen = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const freq2x = PREDEFINED_WORKOUTS.filter(w => w.frequency === '2x');
  const freq3x = PREDEFINED_WORKOUTS.filter(w => w.frequency === '3x');

  return (
    <ScreenWrapper>
      <Header title={t('recScreenTitle')} onBack={() => navigate('/menu')} />
      <div className="flex-1 p-6 overflow-y-auto space-y-10">
        <div className="text-center"><h2 className="text-2xl font-bold">{t('sugTitle')}</h2><p className="text-neutral-500 text-sm mt-1">{t('sugDesc')}</p></div>

        <div className="space-y-12">
           <div>
              <h3 className="text-primary-500 font-black text-xl mb-4 border-b border-neutral-800 pb-2">{t('workout2x')}</h3>
              <div className="space-y-4">{freq2x.map(w => (
                <button key={w.id} onClick={() => navigate(`/ready-workout/${w.id}`)} className="w-full bg-surface border border-neutral-800 p-5 rounded-2xl flex items-center justify-between group">
                  <div className="flex items-center gap-4 text-left"><Calendar className="text-neutral-500 group-hover:text-primary-500" /><div><h4 className="font-bold group-hover:text-primary-500">{w.title[language]}</h4><p className="text-xs text-neutral-500">{w.exercises.length} exercícios • {w.sets} séries</p></div></div>
                  <ChevronRight className="text-neutral-700" />
                </button>
              ))}</div>
           </div>
           <div>
              <h3 className="text-primary-500 font-black text-xl mb-4 border-b border-neutral-800 pb-2">{t('workout3x')}</h3>
              <div className="space-y-4">{freq3x.map(w => (
                <button key={w.id} onClick={() => navigate(`/ready-workout/${w.id}`)} className="w-full bg-surface border border-neutral-800 p-5 rounded-2xl flex items-center justify-between group">
                  <div className="flex items-center gap-4 text-left"><Calendar className="text-neutral-500 group-hover:text-primary-500" /><div><h4 className="font-bold group-hover:text-primary-500">{w.title[language]}</h4><p className="text-xs text-neutral-500">{w.exercises.length} exercícios • {w.sets} séries</p></div></div>
                  <ChevronRight className="text-neutral-700" />
                </button>
              ))}</div>
           </div>
        </div>

        <div className="bg-surface/50 border border-neutral-800 p-6 rounded-2xl space-y-4">
           <div className="flex items-center gap-2 text-primary-500 font-black uppercase tracking-tighter text-sm"><AlertCircle className="w-4 h-4" /> {t('important')}</div>
           <p className="text-neutral-400 text-sm">{t('impText1')} <span className="text-white font-bold">{t('feelSafe')}</span>{t('impText2')}</p>
           <p className="text-white text-sm font-bold">{t('impText3')}</p>
           <p className="text-primary-400 text-sm italic">{t('weightInstruction')}</p>
        </div>
      </div>
    </ScreenWrapper>
  );
};

const ReadyWorkoutExecutionScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useLanguage();
  const workoutId = location.pathname.split('/').pop();
  const workout = PREDEFINED_WORKOUTS.find(w => w.id === workoutId);
  const [openId, setOpenId] = useState<string | null>(null);

  if (!workout) return <ScreenWrapper><Header onBack={() => navigate(-1)} /><div>Workout not found</div></ScreenWrapper>;

  const exercises = workout.exercises.map(id => EXERCISES.find(e => e.id === id)).filter((e): e is Exercise => !!e);

  return (
    <ScreenWrapper>
      <Header title={workout.title[language]} onBack={() => navigate('/recommendation')} />
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        <Timer title={t('timerTitle')} hint={t('timerHint')} />
        <h2 className="text-xl font-black text-center text-white py-2 tracking-widest uppercase">BOM TREINO 💪</h2>

        {exercises.map((ex, i) => {
          const isOpen = openId === ex.id;
          return (
            <div key={ex.id} className={`rounded-xl border border-neutral-800 overflow-hidden ${isOpen ? 'bg-surface shadow-xl' : 'bg-black'}`}>
               <button onClick={() => setOpenId(isOpen ? null : ex.id)} className="w-full p-4 flex items-center justify-between bg-surface/30">
                  <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-neutral-800 text-[10px] font-bold flex items-center justify-center text-neutral-400">{i+1}</span><h3 className="font-bold text-neutral-200">{ex.name[language]}</h3></div>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-primary-500" /> : <ChevronDown className="w-4 h-4 text-neutral-600" />}
               </button>
               {isOpen && (
                 <div className="p-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
                    <VideoPlayer videoUrl={ex.videoUrl} labels={getVideoLabels(t)} />
                    <div className="bg-black/40 p-3 rounded-lg border border-neutral-800 text-xs leading-relaxed text-neutral-300"><span className="text-primary-500 font-bold uppercase">{t('quickFixLabel')}:</span> {ex.quickFix[language]}</div>
                    <div className="space-y-3">
                       <p className="text-[10px] uppercase font-black text-neutral-600 text-center">{t('setsRecommended')}</p>
                       <div className="grid grid-cols-2 gap-2">
                          {[...Array(workout.sets)].map((_, idx) => (
                            <SetCard 
                              key={idx} 
                              index={idx} 
                              reps="15" 
                              restLabel={t('intervalValue')} 
                              serieLabel={t('serie')} 
                              repLabel={t('repeticao')} 
                              cargaLabel={t('carga')} 
                            />
                          ))}
                       </div>
                    </div>
                 </div>
               )}
            </div>
          );
        })}
      </div>
      <div className="p-4 bg-black border-t border-neutral-800 sticky bottom-0">
        <Button fullWidth onClick={() => navigate('/final')}>{t('finishWorkout')}</Button>
      </div>
    </ScreenWrapper>
  );
};

const WorkoutContextScreen = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  return (
    <ScreenWrapper>
      <Header title={t('understandTitle')} onBack={() => navigate('/menu')} />
      <div className="flex-1 flex flex-col justify-center p-8 text-center space-y-8">
        <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mx-auto border border-neutral-800"><ClipboardList className="text-primary-500 w-8 h-8" /></div>
        <h2 className="text-xl font-bold">{t('adaptCardTitle')}</h2>
        <p className="text-neutral-400 text-sm leading-relaxed">{t('adaptText1')}</p>
        <p className="text-neutral-400 text-sm leading-relaxed">{t('adaptText2')}</p>
        <Button fullWidth onClick={() => navigate('/workout-setup')}>{t('proceed')} <ArrowRight className="ml-2 w-4 h-4" /></Button>
      </div>
    </ScreenWrapper>
  );
};

const WorkoutSetupScreen = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [count, setCount] = useState(4);
  return (
    <ScreenWrapper>
      <Header title={t('setupTitle')} onBack={() => navigate('/workout-context')} />
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-10">
        <h2 className="text-xl font-bold text-center">{t('howMany')}</h2>
        <div className="flex items-center gap-6">
          <button onClick={() => setCount(Math.max(1, count - 1))} className="w-14 h-14 bg-surface rounded-xl border border-neutral-800 text-2xl font-bold">-</button>
          <span className="text-6xl font-black text-primary-500">{count}</span>
          <button onClick={() => setCount(Math.min(10, count + 1))} className="w-14 h-14 bg-surface rounded-xl border border-neutral-800 text-2xl font-bold">+</button>
        </div>
        <Button fullWidth onClick={() => navigate(`/workout-select/${count}`)}>{t('chooseExercises')}</Button>
      </div>
    </ScreenWrapper>
  );
};

const WorkoutSelectionScreen = ({ saveWorkout }: { saveWorkout: (ids: string[]) => void }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useLanguage();
  const count = parseInt(location.pathname.split('/').pop() || '4');
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState('');

  const exercises = EXERCISES.filter(ex => ex.name[language].toLowerCase().includes(query.toLowerCase()));

  const handleToggle = (id: string) => {
    if (selected.includes(id)) setSelected(selected.filter(s => s !== id));
    else if (selected.length < count) setSelected([...selected, id]);
  };

  return (
    <ScreenWrapper>
      <Header title={`${t('chooseTitle')} (${selected.length}/${count})`} onBack={() => navigate('/workout-setup')} />
      <div className="p-4 bg-black sticky top-14 z-20">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 w-5 h-5 text-neutral-500" />
          <input className="w-full bg-surface border border-neutral-800 p-3 pl-11 rounded-xl text-white outline-none" placeholder={t('searchPlaceholder')} value={query} onChange={e => setQuery(e.target.value)} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {exercises.map(ex => {
          const isSelected = selected.includes(ex.id);
          return (
            <button key={ex.id} onClick={() => handleToggle(ex.id)} className={`w-full p-4 rounded-xl border text-left transition-all ${isSelected ? 'border-primary-500 bg-primary-500/10' : 'border-neutral-800 bg-surface'}`}>
               <h4 className={`font-bold ${isSelected ? 'text-primary-500' : 'text-white'}`}>{ex.name[language]}</h4>
            </button>
          );
        })}
      </div>
      <div className="p-4 bg-black border-t border-neutral-800">
        <Button fullWidth disabled={selected.length < count} onClick={() => { saveWorkout(selected); navigate('/active-workout'); }}>{t('startWorkout')}</Button>
      </div>
    </ScreenWrapper>
  );
};

const ActiveWorkoutScreen = ({ userData }: { userData: UserData }) => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [openId, setOpenId] = useState<string | null>(null);
  const exList = userData.activeWorkout.map(id => EXERCISES.find(e => e.id === id)).filter((e): e is Exercise => !!e);

  return (
    <ScreenWrapper>
      <Header title={t('activeTitle')} onBack={() => navigate('/menu')} />
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
         {exList.map((ex, i) => (
           <div key={ex.id} className="bg-surface rounded-xl border border-neutral-800 overflow-hidden">
             <button onClick={() => setOpenId(openId === ex.id ? null : ex.id)} className="w-full p-4 flex items-center justify-between">
                <div className="flex items-center gap-3"><span className="text-primary-500 font-bold">{i+1}</span><h3 className="font-bold">{ex.name[language]}</h3></div>
                {openId === ex.id ? <ChevronUp /> : <ChevronDown />}
             </button>
             {openId === ex.id && (
               <div className="p-4 space-y-4 border-t border-neutral-800">
                  <VideoPlayer videoUrl={ex.videoUrl} labels={getVideoLabels(t)} />
                  <p className="text-sm text-neutral-400">{ex.quickFix[language]}</p>
               </div>
             )}
           </div>
         ))}
      </div>
      <div className="p-4 bg-black border-t border-neutral-800 sticky bottom-0">
        <Button fullWidth onClick={() => navigate('/final')}>{t('finishWorkout')}</Button>
      </div>
    </ScreenWrapper>
  );
};

const FinalScreen = ({ clearWorkout }: { clearWorkout: () => void }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  return (
    <ScreenWrapper className="justify-center items-center text-center p-8">
      <CheckCircle className="w-20 h-20 text-primary-500 mb-6" />
      <h2 className="text-3xl font-bold mb-4">{t('congratsTitle')}</h2>
      <p className="text-neutral-500 mb-10 leading-relaxed">{t('congratsDesc')}</p>
      <Button fullWidth onClick={() => { clearWorkout(); navigate('/'); }}>{t('backHome')}</Button>
    </ScreenWrapper>
  );
};

const App = () => {
  const userMethods = useUserData();
  return (
    <LanguageProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomeScreen userData={userMethods.data} clearWorkout={userMethods.clearActiveWorkout} />} />
          <Route path="/intro" element={<IntroScreen />} />
          <Route path="/menu" element={<MenuScreen />} />
          <Route path="/workout-context" element={<WorkoutContextScreen />} />
          <Route path="/workout-setup" element={<WorkoutSetupScreen />} />
          <Route path="/workout-select/:count" element={<WorkoutSelectionScreen saveWorkout={userMethods.saveActiveWorkout} />} />
          <Route path="/active-workout" element={<ActiveWorkoutScreen userData={userMethods.data} />} />
          <Route path="/recommendation" element={<RecommendationScreen />} />
          <Route path="/ready-workout/:id" element={<ReadyWorkoutExecutionScreen />} />
          <Route path="/final" element={<FinalScreen clearWorkout={userMethods.clearActiveWorkout} />} />
        </Routes>
      </HashRouter>
    </LanguageProvider>
  );
};

export default App;