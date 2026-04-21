import { useState, useEffect, useRef } from 'react';
import { Search, Wrench, Sprout, Home, CheckCircle2, User, Star, MapPin, X, Check, Calendar, Euro, FileText, Send, Clock, ShieldCheck, Video, MessageSquare, Lock, Unlock, Phone, LayoutDashboard, ChevronRight, Smartphone, Hammer, PlusCircle, LogOut, Settings } from 'lucide-react';
import { mockStudents, mockOpenRequests, mockMyDashboardRequests } from '../data/mockData';
import StudentModal from '../components/StudentModal';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

function HulpvragerRegistratieView({ onComplete, onLoginClick }) {
  const [step, setStep] = useState(1);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  const [idFile, setIdFile] = useState(null);

  const [aboutMe, setAboutMe] = useState('');
  const [houseRules, setHouseRules] = useState('');

  const handleNextStep = (e) => {
    if (e) e.preventDefault();
    if (step === 1) {
      if (password !== confirmPassword) {
        setError('Wachtwoorden komen niet overeen.');
        return;
      }
      if (password.length < 8) {
        setError('Wachtwoord moet minimaal 8 tekens bevatten.');
        return;
      }
      setError('');
    }
    setStep(s => s + 1);
  };

  const handleFinish = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Maak Firebase Auth User
      const resolvedEmail = email || `${firstName.toLowerCase() || 'senior'}@thuismail.nl`;
      const userCredential = await createUserWithEmailAndPassword(auth, resolvedEmail, password);
      const user = userCredential.user;

      // 2. Bewaar profiel in Firestore 'users'
      const userData = {
        name: `${firstName} ${lastName}`, 
        firstName, 
        lastName,
        city, 
        address, 
        age, 
        aboutMe, 
        houseRules,
        role: 'hulpvrager',
        email: resolvedEmail,
        phone: 'Nog niet opgegeven',
        avatar: null,
        uid: user.uid
      };
      
      await setDoc(doc(db, 'users', user.uid), userData);

      // 3. Ga door naar dashboard
      onComplete(userData);
      
    } catch (err) {
      console.error("Registratie fout:", err);
      if (err.code === 'auth/email-already-in-use') {
         setError('Dit e-mailadres is al in gebruik. Probeer in te loggen.');
      } else {
         setError('Er ging iets mis bij de registratie. Probeer het later opnieuw.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderProgressBar = () => {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-4 relative max-w-4xl mx-auto">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-2 bg-gray-200 rounded-full z-0"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2 bg-[#1D4ED8] rounded-full z-0 transition-all duration-500" style={{ width: `${Math.min(((step - 1) / 3), 1) * 100}%` }}></div>
          
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full font-bold text-xl border-4 transition-colors ${step >= s ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]' : 'bg-white text-gray-400 border-gray-200'}`}>
              {step > s ? <Check className="w-6 h-6" /> : s}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-lg font-bold text-gray-500 max-w-4xl mx-auto px-2">
           <span className={step >= 1 ? 'text-[#1D4ED8]' : ''}>1. Account</span>
           <span className={step >= 2 ? 'text-[#1D4ED8]' : ''}>2. Basisprofiel</span>
           <span className={step >= 3 ? 'text-[#1D4ED8]' : ''}>3. Veiligheid</span>
           <span className={step >= 4 ? 'text-[#1D4ED8]' : ''}>4. Instellingen</span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-12 text-center md:text-left">
         <h1 className="text-5xl font-extrabold mb-4 text-[var(--color-brand-dark)]">Maak een profiel aan</h1>
         <p className="text-2xl text-gray-700 font-medium">Voordat u een klus kunt plaatsen, vragen we eenmalig om uw gegevens.</p>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border-2 border-[#E6F0FA] mb-12">
        <div className="p-8 bg-[#F8FAFC] border-b-2 border-gray-100">
          {renderProgressBar()}
        </div>

        <div className="p-8 md:p-12">
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="text-center md:text-left mb-8">
                <h2 className="text-4xl font-extrabold text-[var(--color-brand-dark)]">Account aanmaken</h2>
                <p className="text-xl text-gray-600 font-medium">Laten we beginnen met uw inloggegevens.</p>
              </div>
              
              {error && (
                <div className="bg-red-50 text-red-600 border-2 border-red-200 p-4 rounded-xl font-bold text-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-2xl font-bold mb-3 text-[var(--color-brand-dark)] flex items-center gap-2">
                  <User className="w-6 h-6 text-[#1D4ED8]" /> E-mailadres
                </label>
                <input required value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Bijv. naam@provider.nl" className="w-full text-2xl p-5 outline-none bg-[#F8FAFC] border-2 border-gray-200 rounded-2xl focus:border-[#1D4ED8] focus:ring-4 focus:ring-blue-100 transition-all font-medium" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-2xl font-bold mb-3 text-[var(--color-brand-dark)] flex items-center gap-2">
                     <Lock className="w-6 h-6 text-[#1D4ED8]" /> Wachtwoord
                  </label>
                  <input required value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Minimaal 8 tekens" className="w-full text-2xl p-5 outline-none bg-[#F8FAFC] border-2 border-gray-200 rounded-2xl focus:border-[#1D4ED8] focus:ring-4 focus:ring-blue-100 transition-all font-medium" />
                </div>
                <div>
                  <label className="block text-2xl font-bold mb-3 text-[var(--color-brand-dark)] flex items-center gap-2">
                     <Lock className="w-6 h-6 text-[#1D4ED8]" /> Wachtwoord herhalen
                  </label>
                  <input required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} type="password" placeholder="Herhaal wachtwoord" className="w-full text-2xl p-5 outline-none bg-[#F8FAFC] border-2 border-gray-200 rounded-2xl focus:border-[#1D4ED8] focus:ring-4 focus:ring-blue-100 transition-all font-medium" />
                </div>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
                <button type="submit" className="w-full sm:w-1/2 py-6 px-10 bg-[#1D4ED8] text-white font-extrabold text-3xl rounded-2xl hover:bg-[#1E3A8A] transition-colors shadow-2xl focus:ring-8 focus:ring-blue-300">
                  Volgende
                </button>
                <button type="button" onClick={onLoginClick} className="font-bold text-xl text-[#1D4ED8] hover:underline w-full sm:w-1/2 text-center sm:text-right">Al geregistreerd? Inloggen</button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleNextStep} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="text-center md:text-left mb-8">
                <h2 className="text-4xl font-extrabold text-[var(--color-brand-dark)]">Basisprofiel Hulpvrager</h2>
                <p className="text-xl text-gray-600 font-medium">Laten we doorgaan met wat basisgegevens.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-2xl font-bold mb-3 text-[var(--color-brand-dark)] flex items-center gap-2">
                    <User className="w-6 h-6 text-[#1D4ED8]" /> Voornaam
                  </label>
                  <input required value={firstName} onChange={e => setFirstName(e.target.value)} type="text" placeholder="Bijv. Ans" className="w-full text-2xl p-5 outline-none bg-[#F8FAFC] border-2 border-gray-200 rounded-2xl focus:border-[#1D4ED8] focus:ring-4 focus:ring-blue-100 transition-all font-medium" />
                </div>
                <div>
                  <label className="block text-2xl font-bold mb-3 text-[var(--color-brand-dark)] flex items-center gap-2">
                    <User className="w-6 h-6 text-[#1D4ED8]" /> Achternaam
                  </label>
                  <input required value={lastName} onChange={e => setLastName(e.target.value)} type="text" placeholder="Bijv. Visser" className="w-full text-2xl p-5 outline-none bg-[#F8FAFC] border-2 border-gray-200 rounded-2xl focus:border-[#1D4ED8] focus:ring-4 focus:ring-blue-100 transition-all font-medium" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <label className="block text-2xl font-bold mb-3 text-[var(--color-brand-dark)]">Leeftijd</label>
                  <input required value={age} onChange={e => setAge(e.target.value)} type="number" min="18" placeholder="72" className="w-full text-2xl p-5 outline-none bg-[#F8FAFC] border-2 border-gray-200 rounded-2xl focus:border-[#1D4ED8] focus:ring-4 focus:ring-blue-100 transition-all font-medium" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-2xl font-bold mb-3 text-[var(--color-brand-dark)] flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-[#1D4ED8]" /> Woonplaats
                  </label>
                  <input required value={city} onChange={e => setCity(e.target.value)} type="text" placeholder="Bijv. Groningen" className="w-full text-2xl p-5 outline-none bg-[#F8FAFC] border-2 border-gray-200 rounded-2xl focus:border-[#1D4ED8] focus:ring-4 focus:ring-blue-100 transition-all font-medium" />
                </div>
              </div>

              <div>
                <label className="block text-2xl font-bold mb-3 text-[var(--color-brand-dark)] flex items-center gap-2">
                  <Home className="w-6 h-6 text-[#1D4ED8]" /> Straat en Huisnummer
                </label>
                <input required value={address} onChange={e => setAddress(e.target.value)} type="text" placeholder="Deze informatie is privé" className="w-full text-2xl p-5 outline-none bg-[#F8FAFC] border-2 border-gray-200 rounded-2xl focus:border-[#1D4ED8] focus:ring-4 focus:ring-blue-100 transition-all font-medium" />
              </div>

              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setStep(1)} className="w-1/3 py-6 rounded-2xl bg-gray-200 text-gray-700 font-extrabold text-2xl hover:bg-gray-300 transition-colors">Terug</button>
                <button type="submit" className="w-2/3 py-6 px-10 bg-[#1D4ED8] text-white font-extrabold text-3xl rounded-2xl hover:bg-[#1E3A8A] transition-colors shadow-2xl focus:ring-8 focus:ring-blue-300">
                  Volgende
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleNextStep} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="text-center md:text-left mb-8">
                <h2 className="text-4xl font-extrabold text-[var(--color-brand-dark)]">Veiligheid & Identificatie</h2>
              </div>
              
              <div className="bg-[#E6F0FA] p-8 md:p-12 rounded-2xl border-2 border-[#BCD4EC] text-center">
                <ShieldCheck className="w-20 h-20 text-[#1D4ED8] mx-auto mb-6" />
                <h3 className="text-3xl font-bold text-[var(--color-brand-dark)] mb-4">Identiteitsverificatie</h3>
                <p className="text-xl text-gray-700 font-bold mb-8 max-w-2xl mx-auto">
                  Voor de veiligheid van onze studenten vragen we alle hulpzoekers om zich eenmalig te identificeren. Uw gegevens zijn veilig volgens de AVG.
                </p>
                
                <div className="relative overflow-hidden inline-block cursor-pointer group">
                   <button type="button" className="py-5 px-10 bg-white border-2 border-[#1D4ED8] text-[#1D4ED8] font-extrabold text-2xl rounded-2xl group-hover:bg-blue-50 transition-colors shadow">
                      {idFile ? idFile.name : 'Upload Identiteitsbewijs'}
                   </button>
                   <input 
                     required 
                     type="file" 
                     accept="image/*,.pdf" 
                     onChange={e => setIdFile(e.target.files[0])} 
                     className="absolute left-0 top-0 opacity-0 cursor-pointer h-full w-full" 
                   />
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setStep(2)} className="w-1/3 py-6 rounded-2xl bg-gray-200 text-gray-700 font-extrabold text-2xl hover:bg-gray-300 transition-colors">Terug</button>
                <button type="submit" className="w-2/3 py-6 bg-[#1D4ED8] text-white font-extrabold text-3xl rounded-2xl hover:bg-[#1E3A8A] transition-colors shadow-2xl focus:ring-8 focus:ring-blue-300">Volgende</button>
              </div>
            </form>
          )}

          {step === 4 && (
            <form onSubmit={handleFinish} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="text-center md:text-left mb-8">
                <h2 className="text-4xl font-extrabold text-[var(--color-brand-dark)]">Profielinstellingen</h2>
                <p className="text-xl text-gray-600 font-medium">Studenten vinden het prettig om te weten bij wie ze over de vloer komen.</p>
              </div>

              <div>
                <label className="block text-2xl font-bold mb-3 text-[var(--color-brand-dark)] flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-[#1D4ED8]" /> Over mij / Mijn huishouden
                </label>
                <textarea required value={aboutMe} onChange={e => setAboutMe(e.target.value)} rows="4" placeholder="Bijv. Ik woon alleen met mijn kat en hou van een praatje, of Wij zijn een druk gezin met drie kinderen..." className="w-full text-xl p-5 outline-none bg-[#F8FAFC] border-2 border-gray-200 rounded-2xl focus:border-[#1D4ED8] focus:ring-4 focus:ring-blue-100 transition-all font-medium resize-none"></textarea>
              </div>

              <div>
                <label className="block text-2xl font-bold mb-3 text-[var(--color-brand-dark)] flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-[#1D4ED8]" /> Huisregels (bijv. roken/huisdieren)
                </label>
                <input required value={houseRules} onChange={e => setHouseRules(e.target.value)} type="text" placeholder="Bijv. Wij hebben een hond, graag niet roken binnen." className="w-full text-2xl p-5 outline-none bg-[#F8FAFC] border-2 border-gray-200 rounded-2xl focus:border-[#1D4ED8] focus:ring-4 focus:ring-blue-100 transition-all font-medium" />
              </div>

              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setStep(3)} className="w-1/3 py-6 rounded-2xl bg-gray-200 text-gray-700 font-extrabold text-2xl hover:bg-gray-300 transition-colors">Terug</button>
                <button disabled={loading} type="submit" className="w-2/3 py-6 bg-green-600 text-white font-extrabold text-3xl rounded-2xl hover:bg-green-700 transition-colors shadow-2xl focus:ring-8 focus:ring-green-200">
                  {loading ? 'Bezig met opslaan...' : 'Afronden en Plaats Klus'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

export default HulpvragerRegistratieView;
