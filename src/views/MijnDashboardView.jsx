import { useState, useEffect } from 'react';
import { MapPin, Calendar, Euro, MessageSquare, User, PlusCircle, CheckCircle, Info, Lock, Unlock } from 'lucide-react';
import { collection, query, where, onSnapshot, getDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';

function MijnDashboardView({ onMatch, onNavigate, loggedInUser }) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [klussen, setKlussen] = useState([]);
  const [loading, setLoading] = useState(true);

  // States voor reacties
  const [taskApplications, setTaskApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  useEffect(() => {
    if (!loggedInUser) return;

    const q = query(
      collection(db, 'jobs'),
      where('userId', '==', loggedInUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(document => ({
        id: document.id,
        ...document.data()
      }));
      setKlussen(data);
      setLoading(false);
      
      // Update selectedTask realtime als die open staat zonder het aan de dependency array toe te voegen
      setSelectedTask(prev => {
        if (!prev) return prev;
        const updatedTask = data.find(t => t.id === prev.id);
        return updatedTask || prev;
      });
    }, (error) => {
      console.error("Error fetching jobs:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [loggedInUser]);

  useEffect(() => {
    if (!selectedTask) return;
    setLoadingApps(true);
    console.log("Fetching applications for jobId:", selectedTask.id);

    const q = query(
      collection(db, 'applications'),
      where('jobId', '==', selectedTask.id)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const apps = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      console.log("Found applications:", apps);
      
      const hydrated = await Promise.all(apps.map(async (app) => {
        try {
          console.log("Fetching user profile for helperId:", app.helperId);
          const userRef = doc(db, 'users', app.helperId);
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
             console.log("User not found for helperId:", app.helperId);
             return null;
          }
          
          const userData = userSnap.data();
          if (!userData) return null;
          
          return { ...app, helper: userData };
        } catch (e) {
          console.error("Error hydrating application helper:", e);
          return null;
        }
      }));

      setTaskApplications(hydrated.filter(a => a !== null));
      setLoadingApps(false);
    }, (error) => {
      console.error("Error fetching applications:", error);
      setLoadingApps(false);
    });

    return () => unsubscribe();
  }, [selectedTask?.id]);

  const handleAcceptHelper = async (appId) => {
    if (!window.confirm("Weet je zeker dat je deze student wilt accepteren voor de klus? Andere reacties worden dan afgewezen.")) return;
    
    try {
      const batch = writeBatch(db);
      
      // 1. Update de klus status naar 'in_progress'
      const jobRef = doc(db, 'jobs', selectedTask.id);
      batch.update(jobRef, { status: 'in_progress' });
      
      // 2. Update alle applications voor deze klus
      taskApplications.forEach(app => {
        const appRef = doc(db, 'applications', app.id);
        if (app.id === appId) {
          batch.update(appRef, { status: 'accepted' });
        } else {
          batch.update(appRef, { status: 'rejected' });
        }
      });
      
      await batch.commit();
      alert("Succes! Je hebt de student geaccepteerd.");
    } catch (error) {
      console.error("Error accepting helper:", error);
      alert("Er ging iets mis bij het accepteren. Probeer het later opnieuw.");
    }
  };

  const handlePayServiceFee = async (appId) => {
    try {
      const appRef = doc(db, 'applications', appId);
      await writeBatch(db).update(appRef, { paidSeeker: true }).commit();
      alert("Betaling geslaagd! (Simulatie)");
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Fout bij het verwerken van de betaling.");
    }
  };

  // Functie om de datum mooi te formatteren
  const formatDate = (timestamp) => {
    if (!timestamp) return "Net geplaatst";
    const date = timestamp.toDate();
    return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 animate-in fade-in duration-500">
      
      {!selectedTask ? (
        <>
          <div className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
               <h1 className="text-5xl font-extrabold mb-4 text-[var(--color-brand-dark)]">Mijn Hulpvragen</h1>
               <p className="text-2xl text-gray-700 font-medium">Bekijk uw geplaatste klussen en ontvang reacties van studenten.</p>
            </div>
            <button 
              onClick={() => onNavigate('plaats-klus')}
              className="px-8 py-4 bg-[#1D4ED8] text-white font-extrabold text-2xl rounded-2xl shadow hover:bg-[#1E3A8A] flex items-center gap-3"
            >
              <PlusCircle className="w-6 h-6" /> Nieuwe Hulpvraag
            </button>
          </div>

          {loading ? (
             <div className="text-center py-20">
               <div className="w-16 h-16 border-4 border-[#1D4ED8] border-t-transparent rounded-full animate-spin mx-auto"></div>
               <p className="mt-4 text-2xl font-bold text-[#1D4ED8]">Klussen laden...</p>
             </div>
          ) : klussen.length === 0 ? (
             <div className="bg-white rounded-[2rem] p-12 shadow-md border-2 border-gray-100 text-center">
               <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                 <MessageSquare className="w-12 h-12 text-[#1D4ED8]" />
               </div>
               <h2 className="text-3xl font-extrabold text-[var(--color-brand-dark)] mb-4">U heeft nog geen hulpvragen geplaatst.</h2>
               <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">Klik op de knop hieronder om uw eerste klus te plaatsen en direct zichtbaar te zijn voor studenten in de buurt.</p>
               <button 
                 onClick={() => onNavigate('plaats-klus')}
                 className="px-8 py-4 bg-green-600 text-white font-extrabold text-2xl rounded-2xl shadow hover:bg-green-700"
               >
                 Plaats uw eerste klus
               </button>
             </div>
          ) : (
             <div className="grid grid-cols-1 gap-8">
                {klussen.map(req => (
                  <div key={req.id} onClick={() => setSelectedTask(req)} className="bg-white rounded-[2rem] p-8 shadow-md border-2 border-gray-100 hover:border-[#1D4ED8] transition-colors cursor-pointer group relative overflow-hidden">
                     {req.status === 'in_progress' && (
                       <div className="absolute top-0 right-0 bg-green-600 text-white px-6 py-2 rounded-bl-3xl font-bold text-lg flex items-center gap-2">
                         <CheckCircle className="w-5 h-5" /> Voorzien
                       </div>
                     )}
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 mt-2">
                        <h2 className="text-3xl font-extrabold text-[var(--color-brand-dark)] group-hover:text-[#1D4ED8]">{req.titel}</h2>
                        {req.status !== 'in_progress' && (
                          <span className="bg-[#E6F0FA] text-[#1D4ED8] font-bold px-4 py-2 rounded-xl text-lg flex items-center gap-2">
                            <MessageSquare className="w-5 h-5"/> Bekijk Reacties
                          </span>
                        )}
                     </div>
                     <div className="flex items-center gap-6 text-xl text-gray-500 font-bold mb-4">
                        <span className="flex items-center gap-2"><MapPin className="w-5 h-5"/> {loggedInUser?.city || 'Lokaal'}</span>
                        <span className="flex items-center gap-2"><Calendar className="w-5 h-5"/> {formatDate(req.createdAt)}</span>
                        <span className="flex items-center gap-2"><Euro className="w-5 h-5"/> Totaal: €{(req.totaalbedrag || 0).toFixed(2).replace('.', ',')}</span>
                     </div>
                     <p className="text-2xl text-gray-600 line-clamp-2">{req.beschrijving}</p>
                  </div>
                ))}
             </div>
          )}
        </>
      ) : (
        <>
          <button onClick={() => setSelectedTask(null)} className="text-[#1D4ED8] font-bold text-xl flex items-center gap-2 mb-8 hover:underline">
             &larr; Terug naar Mijn Hulpvragen
          </button>

          <div className="bg-white rounded-[2rem] p-10 shadow-lg border-2 border-gray-100 mb-12 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-4 h-full bg-[#1D4ED8]"></div>
             {selectedTask.status === 'in_progress' && (
                <div className="absolute top-0 right-0 bg-green-600 text-white px-6 py-2 rounded-bl-3xl font-bold text-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Voorzien
                </div>
             )}
             <div className="flex justify-between items-start mb-4">
                <h1 className="text-4xl font-extrabold text-[var(--color-brand-dark)]">{selectedTask.titel}</h1>
                <span className="text-2xl font-bold text-[#1D4ED8] bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 mt-6 md:mt-0">
                  €{(selectedTask.totaalbedrag || 0).toFixed(2).replace('.', ',')}
                </span>
             </div>
             <p className="text-2xl text-gray-700 leading-relaxed max-w-4xl">{selectedTask.beschrijving}</p>
             <div className="mt-6 flex items-center gap-6 text-lg text-gray-500 font-bold">
               <span>Geschat: {selectedTask.aantalUren} uur</span>
               <span>Uurloon: €{(selectedTask.uurloon || 0).toFixed(2).replace('.', ',')}</span>
             </div>
          </div>

          <h3 className="text-3xl font-extrabold text-[var(--color-brand-dark)] mb-6 flex items-center gap-3">
             <MessageSquare className="w-8 h-8" /> {selectedTask.status === 'in_progress' ? 'Uw geaccepteerde helper' : `Ze willen u helpen! (${taskApplications.filter(a => a.status === 'pending').length})`}
          </h3>

          {loadingApps ? (
             <div className="text-center py-10">
               <div className="w-10 h-10 border-4 border-[#1D4ED8] border-t-transparent rounded-full animate-spin mx-auto"></div>
             </div>
          ) : taskApplications.length === 0 ? (
             <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
                <p className="text-2xl text-gray-600 font-medium">Nog even geduld. Zodra studenten in de buurt op uw klus reageren, verschijnen ze hier!</p>
             </div>
          ) : (
             <div className="space-y-6">
               {taskApplications
                  .filter(app => selectedTask.status === 'in_progress' ? app.status === 'accepted' : app.status === 'pending')
                  .map(app => (
                 <div key={app.id} className={`bg-white p-6 rounded-3xl shadow-md border-2 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 ${app.status === 'accepted' ? 'border-green-300 bg-green-50' : 'border-[#E6F0FA]'}`}>
                     <div className="flex items-center gap-6">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center shrink-0 border-4 shadow ${app.status === 'accepted' ? 'bg-green-200 text-green-700 border-white' : 'bg-[#E6F0FA] text-[#1D4ED8] border-white'}`}>
                          {app.helper.avatar ? <img src={app.helper.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" /> : <User className="w-10 h-10" />}
                        </div>
                        <div>
                           <h4 className="text-3xl font-extrabold text-[var(--color-brand-dark)]">{app.helper.name}</h4>
                           <div className="flex items-center gap-2 font-bold text-lg mt-1">
                             {app.status === 'accepted' ? (
                               <span className="text-green-700 flex items-center gap-1"><CheckCircle className="w-5 h-5"/> Geaccepteerd</span>
                             ) : (
                               <span className="text-orange-500">Kandidaat</span>
                             )}
                           </div>
                        </div>
                     </div>
                     <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                       <button 
                         onClick={() => onNavigate('profiel', app.helperId)}
                         className={`py-4 px-8 font-extrabold text-xl rounded-xl border-2 transition-colors ${app.status === 'accepted' ? 'bg-white text-green-700 border-green-300 hover:bg-green-100' : 'bg-[#E6F0FA] text-[#1D4ED8] border-[#BCD4EC] hover:bg-[#BCD4EC]'}`}
                       >
                         Bekijk Profiel
                       </button>
                       {app.status === 'pending' && selectedTask.status !== 'in_progress' && (
                         <button 
                           onClick={() => handleAcceptHelper(app.id)}
                           className="py-4 px-8 bg-green-600 text-white font-extrabold text-xl rounded-xl border-2 border-green-700 hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                         >
                           <CheckCircle className="w-6 h-6" /> Accepteer Helper
                         </button>
                       )}
                     </div>
                 </div>
               ))}
             </div>
          )}

          {selectedTask.status === 'in_progress' && taskApplications.find(a => a.status === 'accepted') && (
            <div className="mt-8 bg-blue-50 p-8 rounded-3xl border-2 border-blue-200">
               <h3 className="text-3xl font-extrabold text-[var(--color-brand-dark)] mb-4">Bevestig de afspraak</h3>
               
               {(() => {
                 const acceptedApp = taskApplications.find(a => a.status === 'accepted');
                 
                 if (!acceptedApp.paidSeeker) {
                   return (
                     <div className="flex flex-col sm:flex-row items-center gap-4">
                       <button 
                         onClick={() => handlePayServiceFee(acceptedApp.id)}
                         className="py-4 px-8 bg-[#1D4ED8] text-white font-extrabold text-xl rounded-xl hover:bg-[#1E3A8A] transition-colors shadow-lg flex items-center justify-center gap-2"
                       >
                         <Euro className="w-6 h-6" /> Betaal €1,- Servicekosten
                       </button>
                       <div className="relative group cursor-pointer">
                         <Info className="w-8 h-8 text-[#1D4ED8]" />
                         <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-72 p-4 bg-gray-900 text-white text-sm rounded-xl shadow-xl z-10 text-center">
                           Waarom betaal ik dit? ConnectHub vraagt een kleine bijdrage van €1,- van beide partijen om het platform te onderhouden en veiligheid te bieden. Pas na betaling worden de chatfunctie en het exacte adres vrijgegeven om misbruik buiten het platform om te voorkomen.
                           <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900"></div>
                         </div>
                       </div>
                     </div>
                   );
                 }
                 
                 if (acceptedApp.paidSeeker && !acceptedApp.paidHelper) {
                   return (
                     <div className="flex items-center gap-3 text-orange-600 font-bold text-xl bg-orange-50 p-4 rounded-xl border border-orange-200">
                       <Lock className="w-6 h-6" /> Wachten tot de tegenpartij de servicekosten heeft voldaan...
                     </div>
                   );
                 }

                 return (
                   <div className="space-y-6">
                     <div className="flex items-center gap-3 text-green-700 font-bold text-xl bg-green-50 p-4 rounded-xl border border-green-200">
                       <Unlock className="w-6 h-6" /> Betalingen voltooid! Adres en chat ontgrendeld.
                     </div>
                     <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                          <p className="text-gray-500 font-bold uppercase text-sm mb-1">Exacte Locatie</p>
                          <p className="text-2xl font-extrabold text-[var(--color-brand-dark)] flex items-center gap-2">
                             <MapPin className="w-6 h-6 text-[#1D4ED8]" /> {selectedTask.exactAddress || 'Niet opgegeven'}
                          </p>
                        </div>
                        <button className="py-4 px-8 bg-[#1D4ED8] text-white font-extrabold text-xl rounded-xl hover:bg-[#1E3A8A] transition-colors shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto">
                          <MessageSquare className="w-6 h-6" /> Start Chat
                        </button>
                     </div>
                   </div>
                 );
               })()}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MijnDashboardView;
