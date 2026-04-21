import { useState, useEffect, useRef } from 'react';
import { Search, Wrench, Sprout, Home, CheckCircle2, User, Star, MapPin, X, Check, Calendar, Euro, FileText, Send, Clock, ShieldCheck, Video, MessageSquare, Lock, Unlock, Phone, LayoutDashboard, ChevronRight, Smartphone, Hammer, PlusCircle, LogOut, Settings } from 'lucide-react';
import { mockStudents, mockOpenRequests, mockMyDashboardRequests } from '../data/mockData';
import StudentModal from '../components/StudentModal';

function MatchFlowView({ matchData, onBack }) {
  const [isPaid, setIsPaid] = useState(false);
  const [demoView, setDemoView] = useState('hulpzoeker'); // 'hulpzoeker' of 'student'

  if (!matchData) {
    onBack();
    return null;
  }

  const { student, request } = matchData;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      
      {!isPaid ? (
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden text-center border-4 border-[#1D4ED8]">
          <div className="bg-[#E6F0FA] p-12 relative border-b-4 border-[#BCD4EC]">
            <CheckCircle2 className="w-24 h-24 text-[#1D4ED8] mx-auto mb-6" />
            <h1 className="text-5xl font-extrabold text-[var(--color-brand-dark)] mb-4">De Match is bijna rond!</h1>
            <p className="text-2xl text-gray-700 font-medium max-w-2xl mx-auto mb-6">
              Je hebt zojuist <strong className="text-[var(--color-brand-dark)]">{student.name}</strong> geaccepteerd voor de klus:
            </p>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-left max-w-2xl mx-auto">
               <span className="text-[#1D4ED8] font-bold uppercase tracking-wide">Jouw hulpvraag</span>
               <h3 className="text-3xl font-extrabold text-[var(--color-brand-dark)] mt-2">{request.title}</h3>
            </div>
          </div>

          <div className="p-12">
            <p className="text-2xl text-gray-800 font-medium leading-relaxed mb-10 max-w-2xl mx-auto">
              Om de contactgegevens, het exacte adres en de chatfunctie te ontgrendelen, vragen we van beide partijen een kleine, eenmalige bemiddelingsbijdrage van <strong className="text-3xl text-green-700">€ 3,99</strong>. Deze koppeling geldt specifiek voor deze klus.
            </p>
            
            <div className="bg-gray-100 rounded-3xl p-10 flex flex-col items-center justify-center border-dashed border-4 border-gray-300 mb-10 relative overflow-hidden group">
              <Lock className="w-20 h-20 text-gray-400 mb-4 z-10" />
              <h3 className="text-3xl font-extrabold text-gray-400 z-10">Chat & Gegevens Vergrendeld</h3>
              <p className="text-xl text-gray-500 font-medium z-10 mt-2">Betaal om in gesprek te gaan.</p>
            </div>

            <button 
              onClick={() => setIsPaid(true)}
              className="w-full md:w-3/4 mx-auto py-6 px-10 bg-green-600 text-white font-extrabold text-3xl rounded-2xl hover:bg-green-700 transition-colors shadow-2xl focus:ring-8 focus:ring-green-200 flex items-center justify-center gap-4"
            >
              <Euro className="w-8 h-8" /> Betaal € 3,99 via iDeal
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden mt-8">

           <div className="bg-green-600 p-8 flex flex-col md:flex-row items-center justify-between gap-4 text-white">
             <div className="flex items-center gap-4">
               <Unlock className="w-12 h-12" />
               <h1 className="text-4xl font-extrabold">Betaling Gelukt!</h1>
             </div>
             <div className="bg-green-800 p-2 rounded-xl flex gap-2">
                <button 
                  onClick={() => setDemoView('hulpzoeker')}
                  className={`px-4 py-2 font-bold rounded-lg transition-colors ${demoView === 'hulpzoeker' ? 'bg-white text-green-900' : 'text-white hover:bg-green-700'}`}
                >Vooraanzicht Oudere</button>
                <button 
                  onClick={() => setDemoView('student')}
                  className={`px-4 py-2 font-bold rounded-lg transition-colors ${demoView === 'student' ? 'bg-white text-green-900' : 'text-white hover:bg-green-700'}`}
                >Vooraanzicht Student</button>
             </div>
           </div>

           <div className="p-8 md:p-12">
              
              {demoView === 'hulpzoeker' ? (
                <div className="space-y-8">
                  <h2 className="text-3xl font-extrabold text-[var(--color-brand-dark)]">Je kunt nu contact opnemen met {student.name}</h2>
                  
                  <div className="bg-[#E6F0FA] p-8 rounded-2xl border-2 border-[#BCD4EC] shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start">
                     <div className="bg-white w-24 h-24 rounded-full flex-shrink-0 flex items-center justify-center text-[#1D4ED8] shadow">
                       <User className="w-12 h-12" />
                     </div>
                     <div className="flex-1 w-full space-y-4">
                       <p className="text-3xl text-[var(--color-brand-dark)] font-bold flex items-center gap-3">
                         <User /> {student.fullName}
                       </p>
                       <p className="text-3xl text-[var(--color-brand-dark)] font-bold flex items-center gap-3">
                         <Phone /> {student.phone}
                       </p>
                       <button className="mt-4 w-full md:w-auto py-5 px-8 bg-[#1D4ED8] text-white font-extrabold text-2xl rounded-xl hover:bg-[#1E3A8A] transition-colors shadow focus:ring-8 focus:ring-blue-200 flex items-center justify-center gap-3">
                         <MessageSquare className="w-8 h-8" /> Start Chat
                       </button>
                     </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <h2 className="text-3xl font-extrabold text-[var(--color-brand-dark)] flex items-center gap-3">
                    <CheckCircle2 className="text-green-600" /> Je bent geaccepteerd voor de klus!
                  </h2>
                  <div className="bg-white p-6 rounded-2xl border-2 border-gray-200">
                    <h3 className="text-2xl font-bold text-[var(--color-brand-dark)]">{request.title}</h3>
                    <p className="text-gray-500 font-bold mt-2">Vergoeding: {request.fee} | Datum: {request.date}</p>
                  </div>
                  
                  <div className="bg-[#F0FDF4] p-8 rounded-2xl border-2 border-green-200 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start">
                     <div className="flex-1 w-full space-y-6">
                       <div>
                         <span className="text-gray-500 font-bold uppercase tracking-wider">Aangevraagd door</span>
                         <p className="text-3xl font-extrabold text-[var(--color-brand-dark)] mt-1">Mevrouw Jansen</p>
                       </div>
                       <div>
                         <span className="text-gray-500 font-bold uppercase tracking-wider">Exacte Locatie</span>
                         <p className="text-3xl font-extrabold text-[var(--color-brand-dark)] mt-1 flex items-center gap-2">
                           <MapPin className="text-[#1D4ED8] w-8 h-8" /> {request.location}
                         </p>
                       </div>
                       <button className="mt-4 w-full md:w-auto py-5 px-8 bg-[#1D4ED8] text-white font-extrabold text-2xl rounded-xl hover:bg-[#1E3A8A] transition-colors shadow focus:ring-8 focus:ring-blue-200 flex items-center justify-center gap-3">
                         <MessageSquare className="w-8 h-8" /> Start Chat met Mevrouw Jansen
                       </button>
                     </div>
                  </div>
                </div>
              )}

              <div className="mt-12 bg-gray-50 border-l-8 border-gray-300 p-8 rounded-xl">
                 <h4 className="text-2xl font-bold text-gray-800 mb-2">Veiligheids- en AVG-verklaring</h4>
                 <p className="text-xl text-gray-600 leading-relaxed font-medium">
                   Bovenstaande persoonsgegevens zijn vertrouwelijk en mogen uitsluitend worden gebruikt voor het uitvoeren van deze via Klusje aan Huis gemaakte afspraak. Na het afronden van de klus verzoeken wij uw communicatie veilig via dit platform af te handelen.
                 </p>
              </div>

              <div className="mt-10 text-center">
                 <button onClick={onBack} className="text-2xl font-bold text-[#1D4ED8] hover:underline">
                   &larr; Terug naar het dashboard
                 </button>
              </div>

           </div>
        </div>
      )}
    </div>
  );
}

export default MatchFlowView;
