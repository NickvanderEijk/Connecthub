import { useState, useEffect, useRef } from 'react';
import { Search, Wrench, Sprout, Home, CheckCircle2, User, Star, MapPin, X, Check, Calendar, Euro, FileText, Send, Clock, ShieldCheck, Video, MessageSquare, Lock, Unlock, Phone, LayoutDashboard, ChevronRight, Smartphone, Hammer, PlusCircle, LogOut, Settings } from 'lucide-react';
import { mockStudents, mockOpenRequests, mockMyDashboardRequests } from '../data/mockData';
import StudentModal from '../components/StudentModal';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

function HelperRegistratieView({ onNext, onLoginClick }) {
  const [step, setStep] = useState(0);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [school, setSchool] = useState('');
  const [city, setCity] = useState('');
  const [idFile, setIdFile] = useState(null);
  const [motivation, setMotivation] = useState('');
  const [videoFile, setVideoFile] = useState(null);

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
    setStep((s) => s + 1);
  };

  const handleStep4Submit = async (e) => {
    e.preventDefault();
    const wordCount = motivation.trim().split(/\s+/).filter(w => w.length > 0).length;
    if (wordCount < 50) {
      alert(`Je motivatie moet minimaal 50 woorden bevatten. Huidig aantal: ${wordCount}`);
      return;
    }
    
    if (loading) return;
    setLoading(true);
    try {
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Save profile data to Firestore 'users' collection
      const userData = {
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        age,
        school,
        city,
        aboutMe: motivation,
        role: 'helper',
        email: email,
        phone: 'Nog niet opgegeven',
        address: 'Nog niet opgegeven',
        avatar: null,
        uid: user.uid
      };
      
      await setDoc(doc(db, 'users', user.uid), userData);
      
      if (document.body) {
         // 3. Move to Thank You screen
         setStep(5);
         
         // We pass the user up to App so they redirect
         if (onNext) onNext(userData);
      }
      
    } catch (err) {
      console.error("Registratie fout:", err);
      if (err.code === 'auth/email-already-in-use') {
         alert('Dit e-mailadres is al in gebruik. Probeer in te loggen.');
      } else {
         alert(`Er ging iets mis: ${err.message}. Probeer het later opnieuw.`);
      }
    } finally {
      if (document.body) setLoading(false);
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
           <span className={step >= 1 ? 'text-[#1D4ED8]' : ''}>Account</span>
           <span className={step >= 2 ? 'text-[#1D4ED8]' : ''}>Basisprofiel</span>
           <span className={step >= 3 ? 'text-[#1D4ED8]' : ''}>Veiligheid</span>
           <span className={step >= 4 ? 'text-[#1D4ED8]' : ''}>Presentatie</span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="mb-12 text-center md:text-left">
         <h1 className="text-5xl font-extrabold mb-4 text-[var(--color-brand-dark)]">Word Helper bij Klusje aan Huis</h1>
         <p className="text-2xl text-gray-700 font-medium">Verdien bij, doe relevante ervaring op en help ouderen in uw eigen buurt met dagelijkse klusjes.</p>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border-2 border-[#E6F0FA] mb-12">
        
        {step === 0 && (
          <>
            <div className="bg-[#1D4ED8] p-8 md:p-10 text-white">
              <h2 className="text-4xl font-extrabold mb-4">De 4-Stappen Vertrouwens-ladder</h2>
            </div>
            
            <div className="p-8 md:p-12 space-y-10">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                 <div className="bg-[#E6F0FA] text-[#1D4ED8] w-16 h-16 rounded-full flex items-center justify-center text-3xl font-extrabold shrink-0 border-4 border-[#BCD4EC]">1</div>
                 <div>
                   <h3 className="text-3xl font-extrabold text-[var(--color-brand-dark)] mb-2">Account aanmaken</h3>
                 </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                 <div className="bg-[#E6F0FA] text-[#1D4ED8] w-16 h-16 rounded-full flex items-center justify-center text-3xl font-extrabold shrink-0 border-4 border-[#BCD4EC]">2</div>
                 <div>
                   <h3 className="text-3xl font-extrabold text-[var(--color-brand-dark)] mb-2">Basisprofiel</h3>
                 </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                 <div className="bg-[#E6F0FA] text-[#1D4ED8] w-16 h-16 rounded-full flex items-center justify-center text-3xl font-extrabold shrink-0 border-4 border-[#BCD4EC]">3</div>
                 <div>
                   <h3 className="text-3xl font-extrabold text-[var(--color-brand-dark)] mb-2">Veiligheid (AVG)</h3>
                 </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                 <div className="bg-[#E6F0FA] text-[#1D4ED8] w-16 h-16 rounded-full flex items-center justify-center text-3xl font-extrabold shrink-0 border-4 border-[#BCD4EC]">4</div>
                 <div>
                   <h3 className="text-3xl font-extrabold text-[var(--color-brand-dark)] mb-2">Presentatie (De 'Airbnb-vibe')</h3>
                 </div>
              </div>
            </div>

            <div className="p-8 md:p-12 border-t-2 border-gray-100 bg-[#F8FAFC] flex flex-col sm:flex-row justify-between items-center gap-6">
               <button onClick={() => setStep(1)} className="w-full sm:w-auto px-10 py-5 bg-[#1D4ED8] text-white font-extrabold text-2xl rounded-2xl shadow hover:bg-[#1E3A8A]">Start Registratie</button>
               <button onClick={onLoginClick} className="font-bold text-xl text-[#1D4ED8] hover:underline">Al geregistreerd? Inloggen</button>
            </div>
          </>
        )}

        {step > 0 && step < 5 && (
          <div className="p-8 bg-[#F8FAFC] border-b-2 border-gray-100">
            {renderProgressBar()}
          </div>
        )}

        {step > 0 && (
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
                  <input required value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Bijv. student@studentenmail.nl" className="w-full text-2xl p-5 outline-none bg-[#F8FAFC] border-2 border-gray-200 rounded-2xl focus:border-[#1D4ED8] focus:ring-4 focus:ring-blue-100 transition-all font-medium" />
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
                <div className="pt-6">
                  <button type="submit" className="w-full py-6 px-10 bg-[#1D4ED8] text-white font-extrabold text-3xl rounded-2xl hover:bg-[#1E3A8A] transition-colors shadow-2xl focus:ring-8 focus:ring-blue-300">
                    Volgende
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleNextStep} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center md:text-left mb-8">
                  <h2 className="text-4xl font-extrabold text-[var(--color-brand-dark)]">Basisprofiel</h2>
                  <p className="text-xl text-gray-600 font-medium">Laten we doorgaan met wat basisgegevens.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-2xl font-bold mb-3 text-[var(--color-brand-dark)] flex items-center gap-2">
                      <User className="w-6 h-6 text-[#1D4ED8]" /> Voornaam
                    </label>
                    <input required value={firstName} onChange={e => setFirstName(e.target.value)} type="text" placeholder="Bijv. Tim" className="w-full text-2xl p-5 outline-none bg-[#F8FAFC] border-2 border-gray-200 rounded-2xl focus:border-[#1D4ED8] focus:ring-4 focus:ring-blue-100 transition-all font-medium" />
                  </div>
                  <div>
                    <label className="block text-2xl font-bold mb-3 text-[var(--color-brand-dark)] flex items-center gap-2">
                      <User className="w-6 h-6 text-[#1D4ED8]" /> Achternaam
                    </label>
                    <input required value={lastName} onChange={e => setLastName(e.target.value)} type="text" placeholder="Bijv. Jansen" className="w-full text-2xl p-5 outline-none bg-[#F8FAFC] border-2 border-gray-200 rounded-2xl focus:border-[#1D4ED8] focus:ring-4 focus:ring-blue-100 transition-all font-medium" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <label className="block text-2xl font-bold mb-3 text-[var(--color-brand-dark)]">Leeftijd</label>
                    <input required value={age} onChange={e => setAge(e.target.value)} type="number" min="15" placeholder="18" className="w-full text-2xl p-5 outline-none bg-[#F8FAFC] border-2 border-gray-200 rounded-2xl focus:border-[#1D4ED8] focus:ring-4 focus:ring-blue-100 transition-all font-medium" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-2xl font-bold mb-3 text-[var(--color-brand-dark)]">Woonplaats</label>
                    <input required value={city} onChange={e => setCity(e.target.value)} type="text" placeholder="Bijv. Groningen" className="w-full text-2xl p-5 outline-none bg-[#F8FAFC] border-2 border-gray-200 rounded-2xl focus:border-[#1D4ED8] focus:ring-4 focus:ring-blue-100 transition-all font-medium" />
                  </div>
                </div>
                <div>
                  <label className="block text-2xl font-bold mb-3 text-[var(--color-brand-dark)]">School/Studie</label>
                  <input required value={school} onChange={e => setSchool(e.target.value)} type="text" placeholder="Bijv. Rijksuniversiteit Groningen" className="w-full text-2xl p-5 outline-none bg-[#F8FAFC] border-2 border-gray-200 rounded-2xl focus:border-[#1D4ED8] focus:ring-4 focus:ring-blue-100 transition-all font-medium" />
                </div>
                <div className="pt-6 flex gap-4">
                  <button type="button" onClick={() => setStep(1)} className="w-1/3 py-6 rounded-2xl bg-gray-200 text-gray-700 font-extrabold text-2xl hover:bg-gray-300 transition-colors">Terug</button>
                  <button type="submit" className="w-2/3 py-6 bg-[#1D4ED8] text-white font-extrabold text-3xl rounded-2xl hover:bg-[#1E3A8A] transition-colors shadow-2xl focus:ring-8 focus:ring-blue-300">
                    Volgende
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleNextStep} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center md:text-left mb-8">
                  <h2 className="text-4xl font-extrabold text-[var(--color-brand-dark)]">Veiligheid (AVG)</h2>
                  <p className="text-xl text-gray-600 font-medium">Verifieer je identiteit voor een betrouwbaar netwerk.</p>
                </div>
                
                <div className="bg-[#E6F0FA] p-8 md:p-12 rounded-2xl border-2 border-[#BCD4EC] text-center">
                  <ShieldCheck className="w-20 h-20 text-[#1D4ED8] mx-auto mb-6" />
                  <h3 className="text-3xl font-bold text-[var(--color-brand-dark)] mb-4">Upload Identiteitsbewijs</h3>
                  <p className="text-xl text-gray-700 font-bold mb-8 max-w-2xl mx-auto">Uw gegevens worden versleuteld opgeslagen conform de AVG-richtlijnen. Uitsluitend voor verificatiedoeleinden (geen opslag).</p>
                  
                  <div className="relative overflow-hidden inline-block cursor-pointer group">
                     <button type="button" className="py-5 px-10 bg-white border-2 border-[#1D4ED8] text-[#1D4ED8] font-extrabold text-2xl rounded-2xl group-hover:bg-blue-50 transition-colors shadow">
                        {idFile ? idFile.name : 'Selecteer Bestand'}
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
                  <button type="submit" className="w-2/3 py-6 bg-[#1D4ED8] text-white font-extrabold text-3xl rounded-2xl hover:bg-[#1E3A8A] transition-colors shadow-xl focus:ring-8 focus:ring-blue-300">Volgende</button>
                </div>
              </form>
            )}

            {step === 4 && (
              <form onSubmit={handleStep4Submit} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center md:text-left mb-8">
                  <h2 className="text-4xl font-extrabold text-[var(--color-brand-dark)]">Presentatie</h2>
                  <p className="text-xl text-gray-600 font-medium">Vertel ons waarom jij de ideale helper bent.</p>
                </div>

                <div>
                  <label className="block text-2xl font-bold mb-3 text-[var(--color-brand-dark)] flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-[#1D4ED8]" /> Motivatie
                  </label>
                  <p className="text-lg text-gray-500 font-medium mb-3">Minimaal 50 woorden.</p>
                  <textarea required value={motivation} onChange={e => setMotivation(e.target.value)} rows="6" placeholder="Vertel iets over jezelf, je vaardigheden en waarom je graag anderen in de buurt helpt..." className="w-full text-xl p-5 outline-none bg-[#F8FAFC] border-2 border-gray-200 rounded-2xl focus:border-[#1D4ED8] focus:ring-4 focus:ring-blue-100 transition-all font-medium resize-none"></textarea>
                  <div className={`text-right mt-2 font-bold ${motivation.trim().split(/\s+/).filter(w => w.length > 0).length >= 50 ? 'text-green-600' : 'text-gray-500'}`}>
                    {motivation.trim().split(/\s+/).filter(w => w.length > 0).length} / 50 woorden
                  </div>
                </div>

                <div className="bg-[#F8FAFC] p-8 rounded-2xl border-2 border-gray-200 text-center">
                  <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-[var(--color-brand-dark)] mb-2">Video-introductie (Optioneel)</h3>
                  <p className="text-xl text-gray-600 font-medium mb-6">Een korte video vergroot je kans op een match drastisch!</p>
                  
                  <div className="relative overflow-hidden inline-block cursor-pointer group">
                     <button type="button" className="py-4 px-8 bg-white border-2 border-gray-300 text-gray-700 font-bold text-xl rounded-xl group-hover:bg-gray-50 transition-colors shadow-sm">
                        {videoFile ? videoFile.name : 'Upload Video'}
                     </button>
                     <input 
                       type="file" 
                       accept="video/*" 
                       onChange={e => setVideoFile(e.target.files[0])} 
                       className="absolute left-0 top-0 opacity-0 cursor-pointer h-full w-full" 
                     />
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button type="button" onClick={() => setStep(3)} className="w-1/3 py-6 rounded-2xl bg-gray-200 text-gray-700 font-extrabold text-2xl hover:bg-gray-300 transition-colors">Terug</button>
                  <button disabled={loading} type="submit" className="w-2/3 py-6 bg-green-600 text-white font-extrabold text-3xl rounded-2xl hover:bg-green-700 transition-colors shadow-xl focus:ring-8 focus:ring-green-200">
                    {loading ? 'Bezig met opslaan...' : 'Account afronden'}
                  </button>
                </div>
              </form>
            )}

            {step === 5 && (
              <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                <div className="bg-[#F0FDF4] border-4 border-green-200 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                  <CheckCircle2 className="w-20 h-20 text-green-600" />
                </div>
                <h2 className="text-5xl font-extrabold text-[var(--color-brand-dark)] mb-6">Bedankt!</h2>
                <p className="text-3xl text-gray-700 font-medium max-w-3xl mx-auto leading-relaxed mb-10">
                  Je profiel wordt nu gecontroleerd. Zodra je geverifieerd bent (groen vinkje), kun je reageren op klussen!
                </p>
                <button onClick={() => onNavigate && onNavigate('helper-dashboard')} className="py-6 px-12 bg-[#1D4ED8] text-white font-extrabold text-3xl rounded-2xl hover:bg-[#1E3A8A] transition-colors shadow-2xl focus:ring-8 focus:ring-blue-300">
                  Naar mijn Dashboard &rarr;
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default HelperRegistratieView;
