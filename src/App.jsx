import { useState, useEffect, useRef } from 'react';
import { Home, User, LayoutDashboard, Calendar, LogOut, Settings } from 'lucide-react';
import HomeView from './views/HomeView';
import PlaatsKlusView from './views/PlaatsKlusView';
import HulpvragerRegistratieView from './views/HulpvragerRegistratieView';
import OpenKlussenView from './views/OpenKlussenView';
import HelperRegistratieView from './views/HelperRegistratieView';
import MijnDashboardView from './views/MijnDashboardView';
import HelperDashboardView from './views/HelperDashboardView';
import LoginView from './views/LoginView';
import MatchFlowView from './views/MatchFlowView';
import AccountSettingsView from './views/AccountSettingsView';
import PublicProfileView from './views/PublicProfileView';

import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './lib/firebase';

function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'plaats-klus', 'open-klussen', 'helper-registratie', 'hulpvrager-registratie', 'mijn-dashboard', 'match-flow', 'account-settings', 'login'
  const [activeMatchData, setActiveMatchData] = useState(null); // { student, request }
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Haal profiel uit Firestore
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLoggedInUser({ ...docSnap.data(), uid: user.uid });
        } else {
          setLoggedInUser({ email: user.email, uid: user.uid, role: 'hulpvrager' });
        }
      } else {
        setLoggedInUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigate = (view, data = null) => {
    setIsUserMenuOpen(false);
    if (view === 'plaats-klus' && !loggedInUser) {
      setCurrentView('hulpvrager-registratie');
    } else {
      if (view === 'profiel') {
        setSelectedUserId(data);
      }
      setCurrentView(view);
    }
  };

  const handleStartMatch = (student, request) => {
    setActiveMatchData({ student, request });
    setCurrentView('match-flow');
  };

  return (
    <div className="h-screen relative bg-[var(--color-brand-light)] text-[var(--color-brand-dark)] font-sans antialiased text-lg flex flex-col overflow-hidden">
      
      {/* Navbar */}
      <nav className="bg-[var(--color-brand-dark)] text-white p-4 shadow-md border-b-4 border-[#1D4ED8] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div 
            onClick={() => setCurrentView('home')}
            className="text-3xl font-extrabold tracking-wide flex items-center gap-3 cursor-pointer hover:text-gray-200 transition-colors"
          >
            <Home className="w-10 h-10 text-white" />
            <span>Klusje aan Huis</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
             
             {(!loggedInUser || loggedInUser.role === 'hulpvrager') && (
               <button 
                 onClick={() => handleNavigate('plaats-klus')}
                 className={`px-6 py-3 font-bold text-xl rounded-xl transition-colors shadow-lg focus:ring-4 focus:ring-blue-300 w-full sm:w-auto ${currentView === 'plaats-klus' || currentView === 'hulpvrager-registratie' ? 'bg-[#1E3A8A] text-white ring-2 ring-white' : 'bg-[#1D4ED8] text-white hover:bg-[#1E3A8A]'}`}
               >
                 Ik zoek hulp
               </button>
             )}

             {(!loggedInUser) && (
               <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                 <button 
                   onClick={() => setCurrentView('helper-registratie')}
                   className={`px-6 py-3 font-bold text-xl rounded-xl transition-colors shadow focus:ring-4 focus:ring-white w-full sm:w-auto ${currentView === 'helper-registratie' ? 'bg-white text-[#1D4ED8]' : 'bg-[#1D4ED8] border-2 border-white text-white hover:bg-[#1E3A8A]'}`}
                 >
                   Word helper
                 </button>
                 <button 
                   onClick={() => setCurrentView('login')}
                   className="px-6 py-3 font-bold text-xl rounded-xl transition-colors shadow focus:ring-4 focus:ring-blue-300 w-full sm:w-auto bg-white text-[#1D4ED8] hover:bg-gray-100"
                 >
                   Inloggen
                 </button>
               </div>
             )}

             {loggedInUser?.role === 'hulpvrager' && (
               <button 
                 onClick={() => setCurrentView('mijn-dashboard')}
                 className={`hidden md:flex px-6 py-3 font-extrabold text-xl rounded-xl transition-all items-center gap-2 border-2 ${currentView === 'mijn-dashboard' ? 'bg-white text-[#1D4ED8] border-white shadow-lg' : 'bg-[#1D4ED8] text-white border-blue-400 hover:bg-[#1E3A8A] border-[#1E3A8A] shadow'}`}
               >
                 <LayoutDashboard className="w-6 h-6" /> Mijn Hulpvragen
               </button>
             )}

             {loggedInUser?.role === 'helper' && (
               <>
                 <button 
                   onClick={() => setCurrentView('open-klussen')}
                   className={`px-6 py-3 font-bold text-xl rounded-xl transition-colors shadow focus:ring-4 focus:ring-white w-full sm:w-auto ${currentView === 'open-klussen' ? 'bg-white text-[#1D4ED8]' : 'bg-[var(--color-brand-light)] text-[var(--color-brand-dark)] hover:bg-gray-200'}`}
                 >
                   Vind Klussen
                 </button>
                 <button 
                   onClick={() => setCurrentView('helper-dashboard')}
                   className={`hidden md:flex px-6 py-3 font-extrabold text-xl rounded-xl transition-all items-center gap-2 border-2 ${currentView === 'helper-dashboard' ? 'bg-white text-[#1D4ED8] border-white shadow-lg' : 'bg-[#1D4ED8] text-white border-blue-400 hover:bg-[#1E3A8A] border-[#1E3A8A] shadow'}`}
                 >
                   <Calendar className="w-6 h-6" /> Mijn Planning
                 </button>
               </>
             )}
             
             {/* Mobile only icon for Dashboard */}
             <button 
               onClick={() => setCurrentView('mijn-dashboard')}
               className="md:hidden w-full px-6 py-3 border-2 border-[#1E3A8A] rounded-xl flex items-center justify-center gap-2 font-bold text-xl"
             >
               <LayoutDashboard className="w-6 h-6" /> Mijn Dashboard
             </button>

             {/* Avatar Dropdown */}
             <div className="relative ml-0 md:ml-4 mt-2 md:mt-0" ref={menuRef}>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all focus:ring-4 focus:ring-blue-300 ${loggedInUser ? 'bg-[#1D4ED8] border-white text-white' : 'bg-gray-200 border-[#1E3A8A] text-[#1E3A8A] hover:bg-white'}`}
                >
                  {loggedInUser ? <span className="text-2xl font-extrabold">{loggedInUser.firstName?.[0] || 'U'}</span> : <User className="w-8 h-8" />}
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border-2 border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-300 text-gray-800">
                     {!loggedInUser ? (
                       <div className="p-6">
                          <h4 className="font-extrabold text-xl mb-2 text-[var(--color-brand-dark)]">Welkom bij Klusje aan Huis</h4>
                          <p className="text-gray-600 mb-6 font-medium">Wilt u zich registreren of inloggen?</p>
                          <div className="flex flex-col gap-3">
                            <button onClick={() => { setIsUserMenuOpen(false); setCurrentView('helper-registratie'); }} className="w-full py-3 bg-[#1D4ED8] text-white font-bold rounded-xl hover:bg-[#1E3A8A]">
                               Ik ben een Helper
                            </button>
                            <button onClick={() => { setIsUserMenuOpen(false); setCurrentView('hulpvrager-registratie'); }} className="w-full py-3 bg-[var(--color-brand-dark)] text-white font-bold rounded-xl hover:bg-gray-900">
                               Ik ben een Hulpzoeker
                            </button>
                            <button onClick={() => { setIsUserMenuOpen(false); setCurrentView('login'); }} className="w-full py-3 mt-3 bg-white text-[#1D4ED8] border-2 border-[#1D4ED8] font-bold rounded-xl hover:bg-blue-50 transition-colors">
                               Inloggen
                            </button>
                          </div>
                       </div>
                     ) : (
                       <div>
                          <div className="bg-[#F8FAFC] p-6 border-b-2 border-gray-100 flex items-center gap-4">
                            <div className="w-14 h-14 bg-[#1D4ED8] rounded-full flex items-center justify-center text-white font-extrabold text-2xl shadow-inner border-2 border-white">
                              {loggedInUser.firstName?.[0] || 'U'}
                            </div>
                            <div>
                              <p className="font-bold text-xl text-[var(--color-brand-dark)]">{loggedInUser.name}</p>
                              <p className="text-sm text-gray-500 capitalize font-medium">{loggedInUser.role} profiel</p>
                            </div>
                          </div>
                          <div className="flex flex-col p-2">
                             {loggedInUser.role === 'helper' ? (
                               <button onClick={() => { setIsUserMenuOpen(false); setCurrentView('helper-dashboard'); }} className="flex items-center gap-4 w-full text-left p-4 hover:bg-blue-50 transition-colors rounded-xl font-bold text-lg text-gray-700">
                                 <Calendar className="w-6 h-6 text-[#1D4ED8]" /> Mijn Planning
                               </button>
                             ) : (
                               <button onClick={() => { setIsUserMenuOpen(false); setCurrentView('mijn-dashboard'); }} className="flex items-center gap-4 w-full text-left p-4 hover:bg-blue-50 transition-colors rounded-xl font-bold text-lg text-gray-700">
                                 <LayoutDashboard className="w-6 h-6 text-[#1D4ED8]" /> Mijn Hulpvragen
                               </button>
                             )}
                             <button onClick={() => { setIsUserMenuOpen(false); setCurrentView('account-settings'); }} className="flex items-center gap-4 w-full text-left p-4 hover:bg-blue-50 transition-colors rounded-xl font-bold text-lg text-gray-700">
                               <Settings className="w-6 h-6 text-[#1D4ED8]" /> Profiel beheren
                             </button>
                             <div className="my-2 border-t-2 border-gray-100"></div>
                             <button onClick={() => { setIsUserMenuOpen(false); signOut(auth); setCurrentView('home'); }} className="flex items-center gap-4 w-full text-left p-4 hover:bg-red-50 transition-colors rounded-xl font-bold text-lg text-red-600">
                               <LogOut className="w-6 h-6" /> Uitloggen
                             </button>
                          </div>
                       </div>
                     )}
                  </div>
                )}
             </div>

          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      {authLoading ? (
         <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-[#1D4ED8] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[#1D4ED8] font-bold">Laden...</p>
         </div>
      ) : (
        <main className="flex-1 overflow-y-auto pb-32">
          {currentView === 'home' && <HomeView onNavigate={handleNavigate} loggedInUser={loggedInUser} />}
          {currentView === 'plaats-klus' && <PlaatsKlusView onSubmit={() => setCurrentView('home')} loggedInUser={loggedInUser} />}
          {currentView === 'hulpvrager-registratie' && <HulpvragerRegistratieView onComplete={() => setCurrentView('home')} onLoginClick={() => handleNavigate('login')} />}
          {currentView === 'open-klussen' && <OpenKlussenView loggedInUser={loggedInUser} onNavigate={handleNavigate} />}
          {currentView === 'helper-registratie' && <HelperRegistratieView onNext={() => setCurrentView('home')} onLoginClick={() => handleNavigate('login')} />}
          {currentView === 'mijn-dashboard' && <MijnDashboardView onMatch={handleStartMatch} onNavigate={handleNavigate} loggedInUser={loggedInUser} />}
          {currentView === 'helper-dashboard' && <HelperDashboardView loggedInUser={loggedInUser} onNavigate={handleNavigate} />}
          {currentView === 'login' && <LoginView onLogin={(user) => { setCurrentView('home'); }} onNavigate={handleNavigate} />}
          {currentView === 'match-flow' && <MatchFlowView matchData={activeMatchData} onBack={() => handleNavigate('mijn-dashboard')} />}
          {currentView === 'account-settings' && <AccountSettingsView loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} onBack={() => handleNavigate(loggedInUser?.role === 'helper' ? 'helper-dashboard' : 'mijn-dashboard')} />}
          {currentView === 'profiel' && <PublicProfileView userId={selectedUserId} onBack={() => handleNavigate('mijn-dashboard')} />}
        </main>
      )}

    </div>
  )
}

export default App;
