import { useState, useEffect, useRef } from 'react';
import { Search, Wrench, Sprout, Home, CheckCircle2, User, Star, MapPin, X, Check, Calendar, Euro, FileText, Send, Clock, ShieldCheck, Video, MessageSquare, Lock, Unlock, Phone, LayoutDashboard, ChevronRight, Smartphone, Hammer, PlusCircle, LogOut, Settings } from 'lucide-react';
import { mockStudents, mockOpenRequests, mockMyDashboardRequests } from '../data/mockData';
import StudentModal from '../components/StudentModal';

function AccountSettingsView({ loggedInUser, setLoggedInUser, onBack }) {
  const [activeTab, setActiveTab] = useState('persoonlijk');
  
  // Local state for editing
  const [formData, setFormData] = useState({ ...loggedInUser });

  const handleSave = (e) => {
    e.preventDefault();
    setLoggedInUser(formData);
    alert('Wijzigingen zijn succesvol opgeslagen en direct doorgevoerd in de app!');
  };

  const navItems = [
    { id: 'persoonlijk', label: 'Persoonlijk', icon: User },
    { id: 'contact', label: 'Contact & Adres', icon: MapPin },
    { id: 'beveiliging', label: 'Beveiliging', icon: Lock },
    { id: 'presentatie', label: 'Presentatie', icon: Video },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <div className="w-full md:w-1/3">
        <button onClick={onBack} className="text-[#1D4ED8] font-bold text-xl hover:underline mb-8 flex items-center gap-2">
          &larr; Terug naar Dashboard
        </button>
        <div className="bg-white rounded-[2rem] shadow-xl p-6 border-2 border-gray-100">
          <h2 className="text-2xl font-extrabold text-[var(--color-brand-dark)] mb-6 px-4">Profielbeheer</h2>
          <nav className="flex flex-col gap-2">
            {navItems.map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-4 px-6 py-4 rounded-xl text-xl font-bold transition-all text-left ${activeTab === item.id ? 'bg-[#1D4ED8] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <item.icon className="w-6 h-6" /> {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-2/3">
        <div className="bg-white rounded-[2rem] shadow-xl border-2 border-gray-100 p-8 md:p-12">
           <form onSubmit={handleSave} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              
              {activeTab === 'persoonlijk' && (
                 <>
                   <h3 className="text-3xl font-extrabold text-[var(--color-brand-dark)] mb-8 border-b-2 pb-4">Persoonlijke Gegevens</h3>
                   
                   <div className="flex items-center gap-8 bg-[#F8FAFC] p-6 rounded-2xl border-2 border-gray-100 mb-8">
                      <div className="w-24 h-24 bg-[#1D4ED8] rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg shrink-0">
                        {formData.avatar ? <img src={formData.avatar} className="w-full h-full object-cover" /> : <span className="text-4xl font-extrabold text-white">{formData.firstName?.[0] || 'U'}</span>}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-800">Profielfoto</h4>
                        <p className="text-gray-500 font-medium mb-3">Een duidelijke foto wekt vertrouwen.</p>
                        <button type="button" className="px-6 py-2 bg-white border-2 border-[#1D4ED8] text-[#1D4ED8] font-bold rounded-xl hover:bg-blue-50 transition-colors">Wijzig Foto</button>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div>
                       <label className="block text-xl font-bold mb-2 text-gray-700">Voornaam</label>
                       <input value={formData.firstName || ''} onChange={e => setFormData({...formData, firstName: e.target.value})} type="text" className="w-full text-xl p-4 bg-[#F8FAFC] border-2 border-gray-200 rounded-xl focus:border-[#1D4ED8] outline-none" />
                     </div>
                     <div>
                       <label className="block text-xl font-bold mb-2 text-gray-700">Achternaam</label>
                       <input value={formData.lastName || ''} onChange={e => setFormData({...formData, lastName: e.target.value})} type="text" className="w-full text-xl p-4 bg-[#F8FAFC] border-2 border-gray-200 rounded-xl focus:border-[#1D4ED8] outline-none" />
                     </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div>
                       <label className="block text-xl font-bold mb-2 text-gray-700">Leeftijd</label>
                       <input value={formData.age || ''} onChange={e => setFormData({...formData, age: e.target.value})} type="number" className="w-full text-xl p-4 bg-[#F8FAFC] border-2 border-gray-200 rounded-xl focus:border-[#1D4ED8] outline-none" />
                     </div>
                     <div>
                       <label className="block text-xl font-bold mb-2 text-gray-700">Woonplaats</label>
                       <input value={formData.city || ''} onChange={e => setFormData({...formData, city: e.target.value})} type="text" className="w-full text-xl p-4 bg-[#F8FAFC] border-2 border-gray-200 rounded-xl focus:border-[#1D4ED8] outline-none" />
                     </div>
                   </div>
                 </>
              )}

              {activeTab === 'contact' && (
                 <>
                   <h3 className="text-3xl font-extrabold text-[var(--color-brand-dark)] mb-8 border-b-2 pb-4">Contact & Adres</h3>
                   <div>
                     <label className="block text-xl font-bold mb-2 text-gray-700">Telefoonnummer</label>
                     <input value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} type="tel" className="w-full text-xl p-4 bg-[#F8FAFC] border-2 border-gray-200 rounded-xl focus:border-[#1D4ED8] outline-none" />
                   </div>
                   <div>
                     <label className="block text-xl font-bold mb-2 text-gray-700">Straat en huisnummer</label>
                     <input value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} type="text" className="w-full text-xl p-4 bg-[#F8FAFC] border-2 border-gray-200 rounded-xl focus:border-[#1D4ED8] outline-none" />
                   </div>
                 </>
              )}

              {activeTab === 'beveiliging' && (
                 <>
                   <h3 className="text-3xl font-extrabold text-[var(--color-brand-dark)] mb-8 border-b-2 pb-4">Beveiliging</h3>
                   <div>
                     <label className="block text-xl font-bold mb-2 text-gray-700">E-mailadres</label>
                     <input value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} type="email" className="w-full text-xl p-4 bg-[#F8FAFC] border-2 border-gray-200 rounded-xl focus:border-[#1D4ED8] outline-none" />
                     <p className="text-gray-500 mt-2 font-medium">Wij sturen notificaties naar dit adres.</p>
                   </div>
                   <div className="pt-8 border-t-2 mt-8">
                     <label className="block text-xl font-bold mb-2 text-gray-700">Nieuw wachtwoord</label>
                     <input type="password" placeholder="Minimaal 8 tekens" className="w-full text-xl p-4 bg-[#F8FAFC] border-2 border-gray-200 rounded-xl focus:border-[#1D4ED8] outline-none" />
                   </div>
                 </>
              )}

              {activeTab === 'presentatie' && (
                 <>
                   <h3 className="text-3xl font-extrabold text-[var(--color-brand-dark)] mb-8 border-b-2 pb-4">Uw Presentatie</h3>
                   {loggedInUser?.role === 'helper' ? (
                     <>
                       <div>
                         <label className="block text-xl font-bold mb-2 text-gray-700">Mijn Motivatie</label>
                         <textarea value={formData.aboutMe || ''} onChange={e => setFormData({...formData, aboutMe: e.target.value})} rows="5" className="w-full text-xl p-4 bg-[#F8FAFC] border-2 border-gray-200 rounded-xl focus:border-[#1D4ED8] outline-none resize-none"></textarea>
                       </div>
                       <div className="mt-8">
                         <label className="block text-xl font-bold mb-2 text-gray-700">Video-introductie</label>
                         <div className="p-8 border-4 border-dashed border-gray-200 bg-[#F8FAFC] rounded-2xl text-center">
                            <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="font-bold text-gray-600 text-xl">Geen video geüpload</p>
                            <button type="button" className="mt-4 px-6 py-3 bg-white border-2 border-[#1D4ED8] text-[#1D4ED8] font-bold rounded-xl text-lg hover:bg-blue-50 transition-colors">Upload nieuwe video</button>
                         </div>
                       </div>
                     </>
                   ) : (
                     <div>
                       <label className="block text-xl font-bold mb-2 text-gray-700 flex items-center gap-2"><CheckCircle2 className="text-[#1D4ED8]"/> Huisregels</label>
                       <textarea value={formData.houseRules || ''} onChange={e => setFormData({...formData, houseRules: e.target.value})} rows="4" placeholder="Bijv. liever niet roken." className="w-full text-xl p-4 bg-[#F8FAFC] border-2 border-gray-200 rounded-xl focus:border-[#1D4ED8] outline-none resize-none"></textarea>
                       <p className="text-gray-500 mt-2 font-medium">Dit helpt de helper om zich voor te bereiden op het bezoek.</p>
                     </div>
                   )}
                 </>
              )}

              <div className="pt-8 border-t-2 mt-8 flex justify-end">
                <button type="submit" className="px-10 py-4 bg-green-600 text-white font-extrabold text-2xl rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200">
                  Wijzigingen Opslaan
                </button>
              </div>

           </form>
        </div>
      </div>
    </div>
  );
}

export default AccountSettingsView;
