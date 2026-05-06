import { useState, useEffect } from 'react';
import { User, MapPin, Info, ArrowLeft, Star, FileText, Video } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

function PublicProfileView({ userId, onBack }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          setError(true);
        }
      } catch (e) {
        console.error("Error fetching profile:", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 animate-in fade-in duration-500">
      <button 
        onClick={onBack}
        className="text-[#1D4ED8] font-bold text-xl flex items-center gap-2 mb-8 hover:underline"
      >
        <ArrowLeft className="w-6 h-6" /> Terug naar vorige pagina
      </button>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 border-4 border-[#1D4ED8] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-2xl font-bold text-[#1D4ED8]">Profiel laden...</p>
        </div>
      ) : error || !profile ? (
        <div className="bg-white p-12 rounded-[2rem] shadow-md border-2 border-red-100 text-center">
          <h2 className="text-3xl font-extrabold text-red-600 mb-4">Profiel niet gevonden</h2>
          <p className="text-xl text-gray-600">Deze gebruiker bestaat mogelijk niet meer.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border-2 border-gray-100">
          <div className="bg-[var(--color-brand-dark)] p-12 text-white flex flex-col sm:flex-row items-center sm:items-start gap-8 relative">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-lg shrink-0 overflow-hidden">
               {profile.avatar ? (
                 <img src={profile.avatar} alt="Profielfoto" className="w-full h-full object-cover" />
               ) : (
                 <User className="w-16 h-16 text-[#1D4ED8]" />
               )}
            </div>
            <div className="text-center sm:text-left pt-2">
              <h1 className="text-5xl font-extrabold mb-2">{profile.name}</h1>
              <p className="text-2xl text-blue-200 capitalize font-medium mb-4 flex items-center justify-center sm:justify-start gap-2">
                <MapPin className="w-6 h-6" /> {profile.city || 'Geen stad opgegeven'}
              </p>
              {profile.role === 'helper' && (
                <div className="inline-flex items-center gap-2 bg-[#1D4ED8] bg-opacity-30 border border-blue-400 px-4 py-2 rounded-xl text-lg font-bold">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" /> Nieuwe Helper
                </div>
              )}
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="mb-10">
              <h2 className="text-3xl font-extrabold text-[var(--color-brand-dark)] flex items-center gap-3 mb-4">
                <Info className="w-8 h-8 text-[#1D4ED8]" /> Over mij
              </h2>
              <div className="bg-[#F8FAFC] p-8 rounded-2xl border-2 border-gray-100">
                <p className="text-2xl text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {profile.aboutMe || 'Deze gebruiker heeft nog geen informatie over zichzelf toegevoegd.'}
                </p>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-3xl font-extrabold text-[var(--color-brand-dark)] flex items-center gap-3 mb-4">
                <Video className="w-8 h-8 text-[#1D4ED8]" /> Introductievideo
              </h2>
              <div className="bg-[#F8FAFC] p-8 rounded-2xl border-2 border-gray-100 flex items-center justify-center min-h-[200px]">
                {profile.videoUrl ? (
                  <video src={profile.videoUrl} controls className="w-full max-w-2xl rounded-xl shadow-lg"></video>
                ) : (
                  <p className="text-xl text-gray-500 font-medium italic">
                    Deze helper heeft nog geen introductievideo toegevoegd.
                  </p>
                )}
              </div>
            </div>
            
            {profile.role === 'helper' && profile.skills && (
              <div>
                <h2 className="text-3xl font-extrabold text-[var(--color-brand-dark)] flex items-center gap-3 mb-4">
                  <FileText className="w-8 h-8 text-[#1D4ED8]" /> Vaardigheden
                </h2>
                <div className="flex flex-wrap gap-4">
                  {profile.skills.split(',').map((skill, index) => (
                    <span key={index} className="px-6 py-3 bg-blue-50 text-[#1D4ED8] font-bold text-xl rounded-xl border border-blue-100">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PublicProfileView;
