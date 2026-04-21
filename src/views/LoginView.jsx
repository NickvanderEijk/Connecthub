import { useState, useEffect, useRef } from 'react';
import { Search, Wrench, Sprout, Home, CheckCircle2, User, Star, MapPin, X, Check, Calendar, Euro, FileText, Send, Clock, ShieldCheck, Video, MessageSquare, Lock, Unlock, Phone, LayoutDashboard, ChevronRight, Smartphone, Hammer, PlusCircle, LogOut, Settings } from 'lucide-react';
import { mockStudents, mockOpenRequests, mockMyDashboardRequests } from '../data/mockData';
import StudentModal from '../components/StudentModal';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

function LoginView({ onLogin, onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Haal profiel details op voor rollen specificatie (helper of hulpvrager)
      const docRef = doc(db, 'users', userCredential.user.uid);
      const docSnap = await getDoc(docRef);
      
      let userData = { email: userCredential.user.email, role: 'hulpvrager', uid: userCredential.user.uid };
      if (docSnap.exists()) {
        userData = { ...docSnap.data(), uid: userCredential.user.uid };
      }
      
      onLogin(userData); 
    } catch (err) {
      console.error(err);
      setError('E-mailadres of wachtwoord onjuist. Controleer uw gegevens.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2rem] shadow-2xl p-10 md:p-14 border-2 border-gray-100 relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-3 bg-[#1D4ED8]"></div>
        
        <button onClick={() => onNavigate('home')} className="text-[#1D4ED8] font-bold text-lg hover:underline mb-8 flex items-center gap-2">
          &larr; Terug naar Home
        </button>

        <h1 className="text-4xl font-extrabold text-[var(--color-brand-dark)] mb-3 text-center">Welkom Terug</h1>
        <p className="text-xl text-gray-500 font-medium mb-10 text-center">Log in om verder te gaan in de app.</p>

        {error && (
          <div className="bg-red-50 text-red-600 border-2 border-red-200 p-4 rounded-xl mb-8 font-bold text-center text-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
           <div>
             <label className="block text-xl font-bold mb-2 text-gray-700">E-mailadres</label>
             <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Bijv. student@studentenmail.nl" className="w-full text-xl p-5 bg-[#F8FAFC] border-2 border-gray-200 rounded-xl focus:border-[#1D4ED8] outline-none transition-all" />
           </div>
           <div>
             <label className="block text-xl font-bold mb-2 text-gray-700 flex justify-between">
                <span>Wachtwoord</span>
                <span className="text-[#1D4ED8] text-sm hover:underline cursor-pointer">Vergeten?</span>
             </label>
             <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Vul uw wachtwoord in" className="w-full text-xl p-5 bg-[#F8FAFC] border-2 border-gray-200 rounded-xl focus:border-[#1D4ED8] outline-none transition-all" />
           </div>

           <button disabled={loading} type="submit" className="w-full mt-4 py-6 bg-[#1D4ED8] text-white font-extrabold text-2xl rounded-xl hover:bg-[#1E3A8A] transition-colors shadow-xl focus:ring-8 focus:ring-blue-300 flex items-center justify-center gap-3">
             <Lock className="w-6 h-6" /> {loading ? 'Bezig met inloggen...' : 'Veilig Inloggen'}
           </button>
        </form>

        <div className="mt-8 text-center border-t-2 border-gray-100 pt-8">
           <p className="text-gray-500 font-bold mb-4">Nog geen account?</p>
           <div className="flex gap-4 justify-center">
              <button onClick={() => onNavigate('helper-registratie')} className="text-[#1D4ED8] font-bold hover:underline">Word Helper</button>
              <span className="text-gray-300">|</span>
              <button onClick={() => onNavigate('hulpvrager-registratie')} className="text-[#1D4ED8] font-bold hover:underline">Plaats Klus</button>
           </div>
        </div>
      </div>
    </div>
  );
}

export default LoginView;
