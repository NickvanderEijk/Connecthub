import { useState } from 'react';
import { Search, Wrench, Sprout, Home, User, Star, MapPin, Calendar, Euro, Clock, Smartphone, Hammer, PlusCircle } from 'lucide-react';
import { mockStudents } from '../data/mockData';
import StudentModal from '../components/StudentModal';

function HomeView({ onNavigate, loggedInUser }) {
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

  // DASHBOARD VOOR INGELOGDE GEBRUIKERS
  if (loggedInUser) {
    if (loggedInUser.role === 'hulpvrager') {
      return (
        <div className="py-24 px-4 max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-5xl md:text-6xl font-extrabold text-[var(--color-brand-dark)] mb-6">Welkom, {loggedInUser.firstName || loggedInUser.name}!</h1>
          <p className="text-2xl text-gray-700 mb-12 font-medium">Fijn dat u er weer bent. Klaar om een klusje uit handen te geven?</p>
          
          <button 
             onClick={() => onNavigate('plaats-klus')}
             className="flex items-center mx-auto gap-4 py-8 px-12 bg-green-600 text-white font-extrabold text-3xl md:text-5xl rounded-[2rem] hover:bg-green-700 transition-all transform hover:scale-105 shadow-2xl focus:ring-8 focus:ring-green-300"
          >
             <PlusCircle className="w-12 h-12 md:w-16 md:h-16" /> Plaats een nieuwe klus
          </button>

          <div className="mt-16 bg-[#F8FAFC] p-8 border-2 border-gray-200 rounded-[2rem] text-left">
            <h3 className="text-3xl font-extrabold text-[var(--color-brand-dark)] mb-4">Mijn Openstaande Klussen</h3>
            <p className="text-xl text-gray-600 mb-6 font-medium">Kijk in uw persoonlijke dashboard voor lopende aanvragen en reacties van studenten.</p>
            <button onClick={() => onNavigate('mijn-dashboard')} className="py-4 px-8 bg-[var(--color-brand-dark)] text-white font-bold text-2xl rounded-2xl hover:bg-[#122b4d] shadow">Naar Mijn Dashboard &rarr;</button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="py-24 px-4 max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-5xl md:text-6xl font-extrabold text-[var(--color-brand-dark)] mb-6">Hoi {loggedInUser.firstName || loggedInUser.name},</h1>
          <p className="text-2xl text-gray-700 mb-12 font-medium">Er zoeken mensen in jouw buurt naar een helpende hand!</p>
          
          <button 
             onClick={() => onNavigate('open-klussen')}
             className="flex items-center mx-auto gap-4 py-8 px-12 bg-[#1D4ED8] text-white font-extrabold text-3xl md:text-5xl rounded-[2rem] hover:bg-[#1E3A8A] transition-all transform hover:scale-105 shadow-2xl focus:ring-8 focus:ring-blue-300"
          >
             <Search className="w-12 h-12 md:w-16 md:h-16" /> Bekijk Beschikbare Klussen
          </button>

          <div className="mt-16 bg-[#F8FAFC] p-8 border-2 border-gray-200 rounded-[2rem] text-left">
            <h3 className="text-3xl font-extrabold text-[var(--color-brand-dark)] mb-4">Jouw Planning</h3>
            <p className="text-xl text-gray-600 mb-6 font-medium">Controleer je geaccepteerde klussen en inkomsten in je dashboard.</p>
            <button onClick={() => onNavigate('helper-dashboard')} className="py-4 px-8 bg-[var(--color-brand-dark)] text-white font-bold text-2xl rounded-2xl hover:bg-[#122b4d] shadow">Naar Mijn Planning &rarr;</button>
          </div>
        </div>
      );
    }
  }

  // WELKOMSTPAGINA VOOR GASTEN
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
              <p className="text-xl text-blue-100 mb-8 font-medium">Plaats een klusje in twee minuten!</p>
              <button 
                onClick={() => onNavigate('hulpvrager-registratie')}
                className="w-full py-5 px-6 bg-white text-[#1D4ED8] font-extrabold text-2xl rounded-2xl group-hover:bg-blue-50 transition-colors shadow-lg focus:ring-8 focus:ring-white/50"
              >
                Meld je aan als Hulpvrager
              </button>
           </div>
           
           <div className="flex-1 bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl text-[var(--color-brand-dark)] flex flex-col items-center justify-center border-4 border-gray-100 hover:border-[#1D4ED8] transition-all group">
              <h3 className="text-4xl font-extrabold mb-2">Ik ben student</h3>
              <p className="text-xl text-gray-500 mb-8 font-medium">Verdien bij en help mensen in je stad.</p>
              <button 
                onClick={() => onNavigate('helper-registratie')}
                className="w-full py-5 px-6 bg-[var(--color-brand-dark)] text-white font-extrabold text-2xl rounded-2xl group-hover:bg-[#122b4d] transition-colors shadow-lg focus:ring-8 focus:ring-[#122b4d]/50"
              >
                Word Helper
              </button>
           </div>
        </div>

        <p className="text-2xl md:text-3xl text-gray-600 font-bold mb-16 italic font-serif">
          "Klusje aan Huis verbindt vertrouwde buurtgenoten voor een helpende hand"
        </p>

        {/* Subtle Search Bar */}
        <div className="max-w-3xl mx-auto bg-gray-50 p-6 md:p-8 rounded-[2rem] border-2 border-gray-200">
          <p className="text-xl text-gray-600 font-medium mb-4 text-left">Oriënteren? Zoek alvast naar specialisaties:</p>
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
                 <Search className="w-6 h-6 shrink-0" /> Registreer je om direct met deze studenten te chatten!
               </p>
             </div>

            <h3 className="text-3xl font-bold mb-6">Beschikbare studenten ({searchResults.length})</h3>
            
            {searchResults.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl shadow-md border-2 border-gray-200 text-center">
                <p className="text-2xl text-gray-600">Geen studenten gevonden voor deze zoekterm.</p>
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
            <div className="bg-[var(--color-brand-light)] p-10 md:p-12 rounded-3xl shadow-xl flex flex-col items-center">
              <div className="bg-[#F0F5FA] p-8 rounded-full mb-6">
                <Home className="w-16 h-16 md:w-20 md:h-20 text-[var(--color-brand-dark)]" />
              </div>
              <h3 className="text-3xl font-extrabold mb-4 text-[var(--color-brand-dark)]">Schoonmaken</h3>
            </div>
            <div className="bg-[var(--color-brand-light)] p-10 md:p-12 rounded-3xl shadow-xl flex flex-col items-center">
              <div className="bg-[#F0F5FA] p-8 rounded-full mb-6">
                <Wrench className="w-16 h-16 md:w-20 md:h-20 text-[var(--color-brand-dark)]" />
              </div>
              <h3 className="text-3xl font-extrabold mb-4 text-[var(--color-brand-dark)]">Kleine reparaties</h3>
            </div>
            <div className="bg-[var(--color-brand-light)] p-10 md:p-12 rounded-3xl shadow-xl flex flex-col items-center">
              <div className="bg-[#F0F5FA] p-8 rounded-full mb-6">
                <Sprout className="w-16 h-16 md:w-20 md:h-20 text-[var(--color-brand-dark)]" />
              </div>
              <h3 className="text-3xl font-extrabold mb-4 text-[var(--color-brand-dark)]">Tuinonderhoud</h3>
            </div>
          </div>
        </div>
      </section>
      
      <StudentModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
    </>
  );
}

export default HomeView;
