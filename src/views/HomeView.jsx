import { useState, useEffect, useRef } from 'react';
import { Search, Wrench, Sprout, Home, CheckCircle2, User, Star, MapPin, X, Check, Calendar, Euro, FileText, Send, Clock, ShieldCheck, Video, MessageSquare, Lock, Unlock, Phone, LayoutDashboard, ChevronRight, Smartphone, Hammer, PlusCircle, LogOut, Settings } from 'lucide-react';
import { mockStudents, mockOpenRequests, mockMyDashboardRequests } from '../data/mockData';
import StudentModal from '../components/StudentModal';

function HomeView({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const results = mockStudents.filter(s => 
      s.specialty.toLowerCase().includes(query) || 
      s.description.toLowerCase().includes(query) ||
      s.name.toLowerCase().includes(query) ||
      s.location.toLowerCase().includes(query) ||
      (query.includes("tuin") && s.specialty.toLowerCase().includes("tuin")) ||
      (query.includes("schoon") && s.specialty.toLowerCase().includes("poets") || s.specialty.toLowerCase().includes("schoonmaken")) ||
      (query.includes("poets") && s.specialty.toLowerCase().includes("schoon"))
    );
    
    setSearchResults(results);
    setHasSearched(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <>
      <header className="px-4 py-16 md:py-20 text-center max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight text-[var(--color-brand-dark)]">
          Hulp aan huis <br /> <span className="text-[#1D4ED8]">voor een zorgeloze dag</span>
        </h1>
        <p className="text-2xl md:text-3xl mb-12 text-gray-800 font-medium max-w-3xl mx-auto">
          Studenten uit de buurt helpen u bij kleine klusjes, tuinonderhoud en lichte huishoudelijke taken.
        </p>

        {/* Call to Action Blocks */}
        <div className="flex flex-col md:flex-row gap-6 max-w-4xl mx-auto mb-12">
           <div className="flex-1 bg-[#1D4ED8] p-8 md:p-10 rounded-[2rem] shadow-2xl text-white flex flex-col items-center justify-center border-4 border-transparent hover:border-blue-300 transition-all group">
              <h3 className="text-4xl font-extrabold mb-2">Ik zoek hulp</h3>
              <p className="text-xl text-blue-100 mb-8 font-medium">Voor ouderen en gezinnen</p>
              <button 
                onClick={() => onNavigate('plaats-klus')}
                className="w-full py-5 px-6 bg-white text-[#1D4ED8] font-extrabold text-2xl rounded-2xl group-hover:bg-blue-50 transition-colors shadow-lg focus:ring-8 focus:ring-white/50"
              >
                Plaats direct uw klus
              </button>
           </div>
           
           <div className="flex-1 bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl text-[var(--color-brand-dark)] flex flex-col items-center justify-center border-4 border-gray-100 hover:border-[#1D4ED8] transition-all group">
              <h3 className="text-4xl font-extrabold mb-2">Ik wil helpen</h3>
              <p className="text-xl text-gray-500 mb-8 font-medium">Voor studenten en scholieren</p>
              <button 
                onClick={() => onNavigate('open-klussen')}
                className="w-full py-5 px-6 bg-[var(--color-brand-dark)] text-white font-extrabold text-2xl rounded-2xl group-hover:bg-[#122b4d] transition-colors shadow-lg focus:ring-8 focus:ring-[#122b4d]/50"
              >
                Bekijk openstaande klussen
              </button>
           </div>
        </div>

        <p className="text-2xl md:text-3xl text-gray-600 font-bold mb-16 italic font-serif">
          "Klusje aan Huis verbindt vertrouwde buurtgenoten voor een helpende hand"
        </p>

        {/* Subtle Search Bar */}
        <div className="max-w-3xl mx-auto bg-gray-50 p-6 md:p-8 rounded-[2rem] border-2 border-gray-200">
          <p className="text-xl text-gray-600 font-medium mb-4 text-left">Hulp nodig bij het vinden van iets specifieks? Zoek hier door de website:</p>
          <div className="flex flex-col sm:flex-row shadow-sm rounded-xl overflow-hidden border-2 border-gray-300 focus-within:border-[#1D4ED8] transition-colors bg-white">
            <div className="hidden sm:flex items-center pl-4 pr-2 bg-white">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Bijv. tuin, schoonmaken..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full text-xl p-4 outline-none bg-white text-[var(--color-brand-dark)] placeholder-gray-400 font-medium"
            />
            <button 
              onClick={handleSearch}
              className="bg-gray-200 text-gray-700 px-8 py-4 sm:py-0 text-xl font-bold hover:bg-[#1D4ED8] hover:text-white transition-colors focus:outline-none">
              Zoeken
            </button>
          </div>
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div className="mt-12 text-left max-w-3xl mx-auto">
             <div className="bg-yellow-50 border-l-8 border-yellow-400 p-6 rounded-2xl mb-8">
               <p className="text-xl text-yellow-900 font-bold flex items-center gap-3">
                 <Search className="w-6 h-6 shrink-0" /> Deze zoekresultaten zijn ter oriëntatie. Ontvang direct reacties van deze studenten door een hulpvraag te plaatsen!
               </p>
             </div>

            <h3 className="text-3xl font-bold mb-6">Beschikbare studenten ter oriëntatie ({searchResults.length})</h3>
            
            {searchResults.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl shadow-md border-2 border-gray-200 text-center">
                <p className="text-2xl text-gray-600">Geen studenten gevonden voor deze zoekterm. Probeer iets als "tuin" of "schoonmaken".</p>
              </div>
            ) : (
              <div className="space-y-6">
                {searchResults.map((student) => (
                  <div key={student.id} className="bg-white p-6 rounded-3xl shadow-lg border-2 border-transparent hover:border-[#1D4ED8] transition-all flex flex-col sm:flex-row items-center sm:items-start gap-6 relative">
                    
                    <div className="bg-[#E6F0FA] w-20 h-20 rounded-full flex-shrink-0 flex items-center justify-center text-[#1D4ED8] mx-auto sm:mx-0">
                      <User className="w-10 h-10" />
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
                          <h4 className="text-3xl font-extrabold text-[var(--color-brand-dark)]">{student.name}</h4>
                          <span className="flex items-center justify-center sm:justify-start gap-1 text-gray-600 font-medium text-xl">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            {student.location}
                          </span>
                        </div>
                        <p className="text-[#1D4ED8] font-bold text-2xl">{student.specialty}</p>
                      </div>
                      
                      <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
                        <div className="flex items-center gap-1 text-[#D97706] font-bold text-2xl bg-orange-50 px-4 py-1 rounded-full border border-orange-200">
                          <Star className="w-6 h-6 fill-current" />
                          <span>{student.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center sm:w-48 w-full shrink-0 mt-4 sm:mt-0 sm:border-l-2 sm:border-gray-100 sm:pl-6">
                      <button 
                        onClick={() => setSelectedStudent(student)}
                        className="w-full py-3 px-4 bg-[var(--color-brand-dark)] text-white font-bold text-xl rounded-xl hover:bg-[#122b4d] transition-colors shadow focus:ring-4 focus:ring-blue-300"
                      >
                        Bekijk profiel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </header>

      {/* Services Section */}
      <section className="py-24 px-4 bg-white border-t-4 border-gray-100 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-[var(--color-brand-dark)] mb-12">Veelgevraagde Diensten</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            
            <div className="bg-[var(--color-brand-light)] p-10 md:p-12 rounded-3xl shadow-xl border-4 border-transparent hover:border-[#1D4ED8] transition-all flex flex-col items-center cursor-pointer text-center group">
              <div className="bg-[#F0F5FA] p-8 rounded-full mb-6 group-hover:bg-[#E0EDF8] transition-colors">
                <Home className="w-16 h-16 md:w-20 md:h-20 text-[var(--color-brand-dark)] group-hover:text-[#1D4ED8] transition-colors" />
              </div>
              <h3 className="text-3xl font-extrabold mb-4 text-[var(--color-brand-dark)]">Schoonmaken</h3>
              <p className="text-2xl text-gray-700 font-medium leading-relaxed">Voor een schoon en opgeruimd huis.</p>
            </div>

            <div className="bg-[var(--color-brand-light)] p-10 md:p-12 rounded-3xl shadow-xl border-4 border-transparent hover:border-[#1D4ED8] transition-all flex flex-col items-center cursor-pointer text-center group">
              <div className="bg-[#F0F5FA] p-8 rounded-full mb-6 group-hover:bg-[#E0EDF8] transition-colors">
                <Wrench className="w-16 h-16 md:w-20 md:h-20 text-[var(--color-brand-dark)] group-hover:text-[#1D4ED8] transition-colors" />
              </div>
              <h3 className="text-3xl font-extrabold mb-4 text-[var(--color-brand-dark)]">Kleine reparaties</h3>
              <p className="text-2xl text-gray-700 font-medium leading-relaxed">Denk aan lampen ophangen of meubels monteren.</p>
            </div>

            <div className="bg-[var(--color-brand-light)] p-10 md:p-12 rounded-3xl shadow-xl border-4 border-transparent hover:border-[#1D4ED8] transition-all flex flex-col items-center cursor-pointer text-center group">
              <div className="bg-[#F0F5FA] p-8 rounded-full mb-6 group-hover:bg-[#E0EDF8] transition-colors">
                <Sprout className="w-16 h-16 md:w-20 md:h-20 text-[var(--color-brand-dark)] group-hover:text-[#1D4ED8] transition-colors" />
              </div>
              <h3 className="text-3xl font-extrabold mb-4 text-[var(--color-brand-dark)]">Tuinonderhoud</h3>
              <p className="text-2xl text-gray-700 font-medium leading-relaxed">Uw tuin netjes, zonder dat het u moeite kost.</p>
            </div>

            <div className="bg-[var(--color-brand-light)] p-10 md:p-12 rounded-3xl shadow-xl border-4 border-transparent hover:border-[#1D4ED8] transition-all flex flex-col items-center cursor-pointer text-center group">
              <div className="bg-[#F0F5FA] p-8 rounded-full mb-6 group-hover:bg-[#E0EDF8] transition-colors">
                <Smartphone className="w-16 h-16 md:w-20 md:h-20 text-[var(--color-brand-dark)] group-hover:text-[#1D4ED8] transition-colors" />
              </div>
              <h3 className="text-3xl font-extrabold mb-4 text-[var(--color-brand-dark)]">Elektronische hulp</h3>
              <p className="text-2xl text-gray-700 font-medium leading-relaxed">Hulp bij uw telefoon, tablet of computerproblemen.</p>
            </div>

            <div className="bg-[var(--color-brand-light)] p-10 md:p-12 rounded-3xl shadow-xl border-4 border-transparent hover:border-[#1D4ED8] transition-all flex flex-col items-center cursor-pointer text-center group">
              <div className="bg-[#F0F5FA] p-8 rounded-full mb-6 group-hover:bg-[#E0EDF8] transition-colors">
                <Hammer className="w-16 h-16 md:w-20 md:h-20 text-[var(--color-brand-dark)] group-hover:text-[#1D4ED8] transition-colors" />
              </div>
              <h3 className="text-3xl font-extrabold mb-4 text-[var(--color-brand-dark)]">Meubelmontage</h3>
              <p className="text-2xl text-gray-700 font-medium leading-relaxed">Hulp bij het in elkaar zetten van bijvoorbeeld een kast.</p>
            </div>

            <div className="bg-[#F0FDF4] p-10 md:p-12 rounded-3xl shadow-xl border-4 border-green-200 hover:border-green-500 transition-all flex flex-col items-center cursor-pointer text-center group">
              <div className="bg-green-100 p-8 rounded-full mb-6 group-hover:bg-green-200 transition-colors shadow-sm">
                <PlusCircle className="w-16 h-16 md:w-20 md:h-20 text-green-700" />
              </div>
              <h3 className="text-3xl font-extrabold mb-4 text-green-900">Uw klus hier</h3>
              <p className="text-2xl text-green-800 font-medium leading-relaxed">Heeft u een ander klusje? Plaats het op de site en een student uit de buurt helpt u graag!</p>
            </div>

          </div>
        </div>
      </section>

      {/* Note: In HomeView, no onAccept is passed, preventing Accepteer from showing */}
      <StudentModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
    </>
  );
}

export default HomeView;
