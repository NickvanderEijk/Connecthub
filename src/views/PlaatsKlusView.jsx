import { useState, useEffect, useRef } from 'react';
import { Search, Wrench, Sprout, Home, CheckCircle2, User, Star, MapPin, X, Check, Calendar, Euro, FileText, Send, Clock, ShieldCheck, Video, MessageSquare, Lock, Unlock, Phone, LayoutDashboard, ChevronRight, Smartphone, Hammer, PlusCircle, LogOut, Settings } from 'lucide-react';
import { mockStudents, mockOpenRequests, mockMyDashboardRequests } from '../data/mockData';
import StudentModal from '../components/StudentModal';

// Below are unchanged views
function PlaatsKlusView({ onSubmit, loggedInUser }) {
  const [duur, setDuur] = useState('');
  const [uurloon, setUurloon] = useState('');
  const [location, setLocation] = useState(loggedInUser?.city || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Bedankt voor uw aanvraag! Deze is succesvol geplaatst en direct zichtbaar op uw Dashboard.");
    onSubmit();
  };

  const getNumberFromDuur = (duurStr) => {
    const match = duurStr.match(/(\d+([.,]\d+)?)/);
    if (match) return parseFloat(match[0].replace(',', '.'));
    return null;
  };

  const parsedDuur = getNumberFromDuur(duur);
  const parsedUurloon = parseFloat(uurloon.replace(',', '.'));
  const total = (parsedDuur && !isNaN(parsedUurloon)) ? (parsedDuur * parsedUurloon).toFixed(2) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden">
        
        <div className="bg-[var(--color-brand-dark)] p-8 md:p-12 text-white text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Plaats een Hulpvraag</h1>
          <p className="text-2xl text-gray-300 font-medium">Binnen enkele minuten zichtbaar voor gemotiveerde studenten in uw buurt.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
          
          <div>
            <label className="block text-2xl font-bold mb-3 text-[var(--color-brand-dark)] flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#1D4ED8]" /> Titel van de klus
            </label>
            <input required type="text" placeholder="Bijv. Wasmachine verplaatsen of Tuin aanharken" className="w-full text-2xl p-5 outline-none bg-[#F8FAFC] border-2 border-gray-200 rounded-2xl focus:border-[#1D4ED8] focus:ring-4 focus:ring-blue-100 transition-all font-medium" />
          </div>

          <div>
            <label className="block text-2xl font-bold mb-3 text-[var(--color-brand-dark)] flex items-center gap-2">
              <Sprout className="w-6 h-6 text-[#1D4ED8]" /> Omschrijving
            </label>
            <textarea required rows="4" placeholder="Omschrijf duidelijk wat er moet gebeuren..." className="w-full text-2xl p-5 outline-none bg-[#F8FAFC] border-2 border-gray-200 rounded-2xl focus:border-[#1D4ED8] focus:ring-4 focus:ring-blue-100 transition-all font-medium resize-none"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-2xl font-bold mb-3 text-[var(--color-brand-dark)] flex items-center gap-2">
                <MapPin className="w-6 h-6 text-[#1D4ED8]" /> Locatie
              </label>
              <input value={location} onChange={e => setLocation(e.target.value)} required type="text" placeholder="Straat of Wijk" className="w-full text-2xl p-5 outline-none bg-[#F8FAFC] border-2 border-gray-200 rounded-2xl focus:border-[#1D4ED8] focus:ring-4 focus:ring-blue-100 transition-all font-medium" />
            </div>

            <div>
              <label className="block text-2xl font-bold mb-3 text-[var(--color-brand-dark)] flex items-center gap-2">
                <Calendar className="w-6 h-6 text-[#1D4ED8]" /> Datum (of Indicatie)
              </label>
              <input required type="text" placeholder="Bijv. Komende zaterdag" className="w-full text-2xl p-5 outline-none bg-[#F8FAFC] border-2 border-gray-200 rounded-2xl focus:border-[#1D4ED8] focus:ring-4 focus:ring-blue-100 transition-all font-medium" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#F0F5FA] p-8 rounded-2xl border-2 border-[#BCD4EC]">
            <div>
              <label className="block text-2xl font-bold mb-3 text-[var(--color-brand-dark)] flex items-center gap-2">
                <Clock className="w-6 h-6 text-[#1D4ED8]" /> Verwachte duur
              </label>
              <input 
                value={duur}
                onChange={(e) => setDuur(e.target.value)}
                required 
                type="text" 
                placeholder="Bijv. '2 uur' of 'een halve dag'" 
                className="w-full text-2xl p-5 outline-none bg-white border-2 border-gray-200 rounded-2xl focus:border-[#1D4ED8] focus:ring-4 focus:ring-blue-100 transition-all font-medium" 
              />
            </div>

            <div>
              <label className="block text-2xl font-bold mb-1 text-[var(--color-brand-dark)] flex items-center gap-2">
                <Euro className="w-6 h-6 text-[#1D4ED8]" /> Uurloon
              </label>
              <p className="text-sm text-gray-500 font-bold mb-3">Tip: Een gemiddeld uurloon voor studenten ligt tussen de €15 en €20.</p>
              <div className="relative flex items-center">
                <span className="absolute left-5 text-2xl font-bold text-gray-500">€</span>
                <input 
                  value={uurloon}
                  onChange={(e) => setUurloon(e.target.value)}
                  required 
                  type="number" 
                  step="0.5"
                  min="0"
                  placeholder="15" 
                  className="w-full text-2xl p-5 pl-12 outline-none bg-white border-2 border-gray-200 rounded-2xl focus:border-[#1D4ED8] focus:ring-4 focus:ring-blue-100 transition-all font-medium" 
                />
              </div>
            </div>
          </div>

          <div className="bg-[#E6F0FA] p-6 rounded-2xl border-2 border-[#1D4ED8] shadow flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div>
              <span className="text-2xl font-bold text-[var(--color-brand-dark)] flex justify-center md:justify-start items-center gap-2">
                <Euro className="w-8 h-8 text-[#1D4ED8]" /> Totaalindicatie
              </span>
              <p className="text-gray-500 font-bold ml-0 md:ml-10 text-lg">Automatisch berekend (duur x uurloon)</p>
            </div>
            <span className="text-4xl font-extrabold text-[#1D4ED8]">
              {total ? `€ ${total.replace('.', ',')}` : '€ -,-'}
            </span>
          </div>

          <div className="pt-6 border-t-2 border-gray-100">
            <button type="submit" className="w-full flex justify-center items-center gap-4 py-6 px-8 bg-[#1D4ED8] text-white font-extrabold text-3xl rounded-2xl hover:bg-[#1E3A8A] transition-colors shadow-2xl focus:ring-8 focus:ring-blue-300">
              <Send className="w-8 h-8" /> Hulpvraag Plaatsen
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default PlaatsKlusView;
