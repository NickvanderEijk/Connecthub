import { useState } from 'react';
import { FileText, Sprout, Tag, Euro, Send } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

function PlaatsKlusView({ onSubmit, loggedInUser }) {
  const [titel, setTitel] = useState('');
  const [omschrijving, setOmschrijving] = useState('');
  const [categorie, setCategorie] = useState('Tuin');
  const [vergoeding, setVergoeding] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!loggedInUser) {
      alert("Je moet ingelogd zijn om een klus te plaatsen.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'jobs'), {
        titel,
        omschrijving,
        categorie,
        vergoeding: parseFloat(vergoeding.replace(',', '.')),
        userId: loggedInUser.uid,
        status: 'open',
        createdAt: serverTimestamp()
      });
      
      alert("Bedankt! Je klus is succesvol geplaatst.");
      onSubmit();
    } catch (err) {
      console.error("Fout bij het plaatsen van de klus:", err);
      alert("Er ging iets mis. Probeer het later opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden">
        
        <div className="bg-[var(--color-brand-dark)] p-8 md:p-12 text-white text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Plaats een Klus</h1>
          <p className="text-2xl text-gray-300 font-medium">Bereik direct helpers in jouw buurt!</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
          
          <div>
            <label className="block text-2xl font-bold mb-3 text-[var(--color-brand-dark)] flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#1D4ED8]" /> Titel van de klus
            </label>
            <input 
              required 
              value={titel}
              onChange={e => setTitel(e.target.value)}
              type="text" 
              placeholder="Bijv. Wasmachine verplaatsen of Tuin aanharken" 
              className="w-full text-2xl p-5 outline-none bg-[#F8FAFC] border-2 border-gray-200 rounded-2xl focus:border-[#1D4ED8] focus:ring-4 focus:ring-blue-100 transition-all font-medium" 
            />
          </div>

          <div>
            <label className="block text-2xl font-bold mb-3 text-[var(--color-brand-dark)] flex items-center gap-2">
              <Sprout className="w-6 h-6 text-[#1D4ED8]" /> Uitgebreide omschrijving
            </label>
            <textarea 
              required 
              value={omschrijving}
              onChange={e => setOmschrijving(e.target.value)}
              rows="4" 
              placeholder="Omschrijf duidelijk wat er moet gebeuren..." 
              className="w-full text-2xl p-5 outline-none bg-[#F8FAFC] border-2 border-gray-200 rounded-2xl focus:border-[#1D4ED8] focus:ring-4 focus:ring-blue-100 transition-all font-medium resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-2xl font-bold mb-3 text-[var(--color-brand-dark)] flex items-center gap-2">
                <Tag className="w-6 h-6 text-[#1D4ED8]" /> Categorie
              </label>
              <select 
                value={categorie}
                onChange={e => setCategorie(e.target.value)}
                className="w-full text-2xl p-5 outline-none bg-[#F8FAFC] border-2 border-gray-200 rounded-2xl focus:border-[#1D4ED8] focus:ring-4 focus:ring-blue-100 transition-all font-medium appearance-none cursor-pointer"
              >
                <option value="Tuin">Tuin</option>
                <option value="Huishouden">Huishouden</option>
                <option value="ICT">ICT</option>
                <option value="Boodschappen">Boodschappen</option>
              </select>
            </div>

            <div>
              <label className="block text-2xl font-bold mb-3 text-[var(--color-brand-dark)] flex items-center gap-2">
                <Euro className="w-6 h-6 text-[#1D4ED8]" /> Vergoeding in euro's
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-5 text-2xl font-bold text-gray-500">€</span>
                <input 
                  required 
                  value={vergoeding}
                  onChange={e => setVergoeding(e.target.value)}
                  type="number" 
                  step="0.5"
                  min="0"
                  placeholder="Bijv. 15.00" 
                  className="w-full text-2xl p-5 pl-12 outline-none bg-white border-2 border-gray-200 rounded-2xl focus:border-[#1D4ED8] focus:ring-4 focus:ring-blue-100 transition-all font-medium" 
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t-2 border-gray-100">
            <button 
              disabled={loading}
              type="submit" 
              className="w-full flex justify-center items-center gap-4 py-6 px-8 bg-[#1D4ED8] text-white font-extrabold text-3xl rounded-2xl hover:bg-[#1E3A8A] transition-colors shadow-2xl focus:ring-8 focus:ring-blue-300 disabled:opacity-50"
            >
              <Send className="w-8 h-8" /> {loading ? 'Bezig met plaatsen...' : 'Plaats Klus'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default PlaatsKlusView;
