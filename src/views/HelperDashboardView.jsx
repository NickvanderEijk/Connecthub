import { useState, useEffect } from 'react';
import { User, MapPin, Euro, Clock, CheckCircle2, Calendar, Phone, MessageSquare, Trash2, Info, Lock, Unlock } from 'lucide-react';
import { collection, query, where, onSnapshot, getDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

function HelperDashboardView({ loggedInUser, onNavigate }) {
  const [activeTab, setActiveTab] = useState('lopend'); // 'lopend' or 'geaccepteerd'
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loggedInUser) return;

    const q = query(
      collection(db, 'applications'),
      where('helperId', '==', loggedInUser.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const appsData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      
      // Hydrate applications with job details
      const hydratedApps = await Promise.all(appsData.map(async (app) => {
        try {
          const jobRef = doc(db, 'jobs', app.jobId);
          const jobSnap = await getDoc(jobRef);
          if (jobSnap.exists()) {
            return { ...app, job: jobSnap.data() };
          }
          return { ...app, job: null }; // Job might be deleted
        } catch (e) {
          console.error("Error fetching job for application", e);
          return { ...app, job: null };
        }
      }));
      
      // Filter out corrupted/deleted jobs
      const validApps = hydratedApps.filter(app => app.job !== null);
      
      setApplications(validApps);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [loggedInUser]);

  const handleDeleteApplication = async (appId) => {
    if (!window.confirm("Weet je zeker dat je deze reactie wilt intrekken?")) return;
    try {
      await deleteDoc(doc(db, 'applications', appId));
      alert("Reactie is ingetrokken.");
    } catch (error) {
      console.error("Error deleting application: ", error);
      alert("Er ging iets mis bij het intrekken.");
    }
  };

  const handlePayServiceFee = async (appId) => {
    try {
      const appRef = doc(db, 'applications', appId);
      import('firebase/firestore').then(({ writeBatch }) => {
        writeBatch(db).update(appRef, { paidHelper: true }).commit();
        alert("Betaling geslaagd! (Simulatie)");
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Fout bij het verwerken van de betaling.");
    }
  };

  const lopendeReacties = applications.filter(app => app.status === 'pending');
  const geaccepteerdeReacties = applications.filter(app => app.status === 'accepted');

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 animate-in fade-in duration-500">
      <div className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-5xl font-extrabold mb-4 text-[var(--color-brand-dark)]">Mijn Planning</h1>
           <p className="text-2xl text-gray-700 font-medium">Beheer hier je aanvragen en aanstaande afspraken.</p>
        </div>
        <button 
          onClick={() => onNavigate('open-klussen')}
          className="px-8 py-4 bg-[#1D4ED8] text-white font-extrabold text-2xl rounded-2xl shadow hover:bg-[#1E3A8A]"
        >
          Vind meer Klussen
        </button>
      </div>

      <div className="flex gap-4 mb-8">
         <button 
           onClick={() => setActiveTab('lopend')} 
           className={`px-8 py-4 rounded-xl text-2xl font-bold transition-all ${activeTab === 'lopend' ? 'bg-[#1D4ED8] text-white shadow-lg' : 'bg-white text-gray-600 border-2 border-gray-200 hover:bg-gray-50'}`}
         >
           Lopende Reacties ({lopendeReacties.length})
         </button>
         <button 
           onClick={() => setActiveTab('geaccepteerd')} 
           className={`px-8 py-4 rounded-xl text-2xl font-bold transition-all ${activeTab === 'geaccepteerd' ? 'bg-[#1D4ED8] text-white shadow-lg' : 'bg-white text-gray-600 border-2 border-gray-200 hover:bg-gray-50'}`}
         >
           Geaccepteerd ({geaccepteerdeReacties.length})
         </button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 border-4 border-[#1D4ED8] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-2xl font-bold text-[#1D4ED8]">Laden...</p>
        </div>
      ) : activeTab === 'lopend' ? (
         <div className="grid grid-cols-1 gap-6">
           {lopendeReacties.length === 0 ? (
             <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
               <p className="text-2xl text-gray-600 font-medium">Je hebt nog niet gereageerd op klussen.</p>
             </div>
           ) : (
             lopendeReacties.map(app => (
               <div key={app.id} className="bg-white rounded-3xl p-8 shadow-sm border-2 border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                 <div className="flex-1">
                    <h3 className="text-3xl font-extrabold text-[var(--color-brand-dark)] mb-2">{app.job.titel}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-gray-600 font-bold text-lg mb-2">
                      <span className="flex items-center gap-1"><MapPin className="w-5 h-5"/> In de buurt</span>
                      <span className="flex items-center gap-1 text-[#1D4ED8]">
                        <Euro className="w-5 h-5"/> €{(app.job.totaalbedrag || 0).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                 </div>
                 <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                   <div className="bg-[#FFFBEB] text-yellow-700 border border-yellow-300 px-6 py-4 rounded-xl font-bold text-xl flex items-center justify-center gap-2 whitespace-nowrap">
                     <Clock className="w-6 h-6" /> Wacht op reactie
                   </div>
                   <button 
                     onClick={() => handleDeleteApplication(app.id)}
                     className="px-6 py-4 border-2 border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-bold text-xl flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                   >
                     <Trash2 className="w-6 h-6" /> Reactie intrekken
                   </button>
                 </div>
               </div>
             ))
           )}
         </div>
      ) : (
         <div className="grid grid-cols-1 gap-8">
           {geaccepteerdeReacties.length === 0 ? (
             <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
               <p className="text-2xl text-gray-600 font-medium">Nog geen geaccepteerde klussen. Zodra een hulpvrager je reactie accepteert, vind je hier de contactgegevens.</p>
             </div>
           ) : (
             geaccepteerdeReacties.map(app => (
               <div key={app.id} className="bg-[#F8FAFC] rounded-3xl p-8 shadow-md border-2 border-[#1D4ED8] border-opacity-30 relative overflow-hidden">
                 <div className="absolute top-0 right-0 bg-[#1D4ED8] text-white px-6 py-2 rounded-bl-3xl font-bold text-lg flex items-center gap-2">
                   <CheckCircle2 className="w-5 h-5" /> Gematched
                 </div>
                 
                 <div className="flex flex-col lg:flex-row gap-8 mt-4">
                   <div className="flex-1">
                      <h3 className="text-4xl font-extrabold text-[var(--color-brand-dark)] mb-6">{app.job.titel}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                         <div>
                           <span className="text-gray-500 font-bold uppercase tracking-wider text-sm">Tarief</span>
                           <p className="text-2xl font-extrabold text-green-700 mt-1 flex items-center gap-2 bg-[#F0FDF4] px-4 py-2 w-max rounded-xl">
                             <Euro className="text-green-700 w-6 h-6" /> €{(app.job.totaalbedrag || 0).toFixed(2).replace('.', ',')}
                           </p>
                         </div>
                      </div>
                   </div>
                   <div className="lg:w-80 flex flex-col gap-4 justify-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative">
                      {!app.paidHelper ? (
                        <>
                          <div className="flex flex-col items-center gap-4">
                            <button 
                              onClick={() => handlePayServiceFee(app.id)}
                              className="w-full py-4 bg-[#1D4ED8] text-white font-extrabold text-lg rounded-xl hover:bg-[#1E3A8A] transition-colors shadow-lg flex items-center justify-center gap-2"
                            >
                              <Euro className="w-5 h-5" /> Betaal €1,- Servicekosten
                            </button>
                            <div className="relative group cursor-pointer w-full text-center">
                              <span className="text-[#1D4ED8] font-bold underline text-sm flex justify-center items-center gap-1">
                                <Info className="w-4 h-4" /> Waarom betalen?
                              </span>
                              <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-64 p-4 bg-gray-900 text-white text-xs rounded-xl shadow-xl z-10 text-left">
                                ConnectHub vraagt een kleine bijdrage van €1,- van beide partijen om het platform te onderhouden en veiligheid te bieden. Pas na betaling worden de chatfunctie en het exacte adres vrijgegeven.
                                <div className="absolute right-1/2 translate-x-1/2 top-full w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : app.paidHelper && !app.paidSeeker ? (
                        <div className="flex items-center gap-3 text-orange-600 font-bold text-sm bg-orange-50 p-4 rounded-xl border border-orange-200">
                          <Lock className="w-5 h-5 shrink-0" /> Wachten tot klant servicekosten heeft voldaan...
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-4 mb-2">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                              <MapPin className="w-8 h-8 text-[#1D4ED8]" />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-gray-500 uppercase">Exacte Locatie</p>
                              <p className="font-extrabold text-lg text-[var(--color-brand-dark)] leading-tight">{app.job.exactAddress || 'Niet opgegeven'}</p>
                            </div>
                          </div>
                          <button className="w-full py-4 bg-[#1D4ED8] text-white font-extrabold text-xl rounded-xl hover:bg-[#1E3A8A] transition-colors shadow focus:ring-4 focus:ring-blue-300 flex items-center justify-center gap-2">
                            <MessageSquare className="w-6 h-6" /> Start Chat
                          </button>
                        </>
                      )}
                   </div>
                 </div>
               </div>
             ))
           )}
         </div>
      )}
    </div>
  );
}

export default HelperDashboardView;
