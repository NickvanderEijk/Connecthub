import { useState, useEffect, useRef } from 'react';
import { Search, Wrench, Sprout, Home, CheckCircle2, User, Star, MapPin, X, Check, Calendar, Euro, FileText, Send, Clock, ShieldCheck, Video, MessageSquare, Lock, Unlock, Phone, LayoutDashboard, ChevronRight, Smartphone, Hammer, PlusCircle, LogOut, Settings } from 'lucide-react';
import { mockStudents, mockOpenRequests, mockMyDashboardRequests } from '../data/mockData';
import StudentModal from '../components/StudentModal';

function HelperDashboardView({ loggedInUser, onNavigate }) {
  const [activeTab, setActiveTab] = useState('lopend'); // 'lopend' or 'geaccepteerd'

  const mockLopend = [
    { id: 101, title: 'Tuin aanharken', location: 'Groningen Zuid', fee: '€ 15,- / uur', postedBy: 'Meneer de Boer', distance: '1.2 km', status: 'Wacht op reactie' },
    { id: 102, title: 'Boodschappen doen t/m zaterdag', location: 'Helpman', fee: '€ 17,50 / uur', postedBy: 'Mevrouw Visser', distance: '3.0 km', status: 'Wacht op reactie' }
  ];

  const mockGeaccepteerd = [
    { id: 201, title: 'Schoonmaken woonkamer', location: 'Groningen Centrum', address: 'Hoofdstraat 12A, Groningen', fee: '€ 20,- / uur', postedBy: 'Mevrouw Jansen', phone: '050-1234567', date: 'Morgen, 14:00' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
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
           Lopende Reacties ({mockLopend.length})
         </button>
         <button 
           onClick={() => setActiveTab('geaccepteerd')} 
           className={`px-8 py-4 rounded-xl text-2xl font-bold transition-all ${activeTab === 'geaccepteerd' ? 'bg-[#1D4ED8] text-white shadow-lg' : 'bg-white text-gray-600 border-2 border-gray-200 hover:bg-gray-50'}`}
         >
           Geaccepteerd ({mockGeaccepteerd.length})
         </button>
      </div>

      {activeTab === 'lopend' && (
         <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
           {mockLopend.map(req => (
             <div key={req.id} className="bg-white rounded-3xl p-8 shadow-sm border-2 border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
               <div>
                  <h3 className="text-3xl font-extrabold text-[var(--color-brand-dark)] mb-2">{req.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-gray-600 font-bold text-lg mb-2">
                    <span className="flex items-center gap-1"><User className="w-5 h-5"/> {req.postedBy}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-5 h-5"/> {req.location} ({req.distance})</span>
                    <span className="flex items-center gap-1 text-[#1D4ED8]"><Euro className="w-5 h-5"/> {req.fee}</span>
                  </div>
               </div>
               <div className="bg-[#FFFBEB] text-yellow-700 border border-yellow-300 px-6 py-3 rounded-xl font-bold text-xl flex items-center gap-2">
                 <Clock className="w-6 h-6" /> {req.status}
               </div>
             </div>
           ))}
         </div>
      )}

      {activeTab === 'geaccepteerd' && (
         <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           {mockGeaccepteerd.map(req => (
             <div key={req.id} className="bg-[#F8FAFC] rounded-3xl p-8 shadow-md border-2 border-[#1D4ED8] border-opacity-30 relative overflow-hidden">
               <div className="absolute top-0 right-0 bg-[#1D4ED8] text-white px-6 py-2 rounded-bl-3xl font-bold text-lg flex items-center gap-2">
                 <CheckCircle2 className="w-5 h-5" /> Gematched
               </div>
               
               <div className="flex flex-col lg:flex-row gap-8 mt-4">
                 <div className="flex-1">
                    <h3 className="text-4xl font-extrabold text-[var(--color-brand-dark)] mb-6">{req.title}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                       <div>
                         <span className="text-gray-500 font-bold uppercase tracking-wider text-sm">Datum & Tijd</span>
                         <p className="text-2xl font-extrabold text-[var(--color-brand-dark)] mt-1 flex items-center gap-2">
                           <Calendar className="text-[#1D4ED8] w-6 h-6" /> {req.date}
                         </p>
                       </div>
                       <div>
                         <span className="text-gray-500 font-bold uppercase tracking-wider text-sm">Tarief</span>
                         <p className="text-2xl font-extrabold text-green-700 mt-1 flex items-center gap-2 bg-[#F0FDF4] px-4 py-2 w-max rounded-xl">
                           <Euro className="text-green-700 w-6 h-6" /> {req.fee}
                         </p>
                       </div>
                       <div className="md:col-span-2 pt-4 border-t border-gray-100">
                         <span className="text-gray-500 font-bold uppercase tracking-wider text-sm">Exact Adres</span>
                         <p className="text-2xl font-extrabold text-[var(--color-brand-dark)] mt-1 flex items-center gap-2 bg-blue-50 px-4 py-3 rounded-xl">
                           <MapPin className="text-[#1D4ED8] w-7 h-7 shrink-0" /> {req.address}
                         </p>
                       </div>
                    </div>
                 </div>

                 <div className="lg:w-80 flex flex-col gap-4 justify-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-extrabold text-2xl text-[var(--color-brand-dark)]">{req.postedBy}</p>
                        <p className="text-gray-500 flex items-center gap-1 font-medium"><Phone className="w-4 h-4"/> {req.phone}</p>
                      </div>
                    </div>
                    
                    <button className="w-full py-4 bg-[#1D4ED8] text-white font-extrabold text-xl rounded-xl hover:bg-[#1E3A8A] transition-colors shadow focus:ring-4 focus:ring-blue-300 flex items-center justify-center gap-2">
                      <MessageSquare className="w-6 h-6" /> Start Chat
                    </button>
                 </div>
               </div>
             </div>
           ))}
         </div>
      )}

    </div>
  );
}

export default HelperDashboardView;
