import { useState, useEffect } from 'react';
import { MapPin, Euro, User, Clock } from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

function OpenKlussenView({ loggedInUser, onNavigate }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingTo, setApplyingTo] = useState(null);
  const [myApplications, setMyApplications] = useState([]);

  useEffect(() => {
    // Haal alle openstaande klussen op
    const q = query(
      collection(db, 'jobs'),
      where('status', '==', 'open')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Filter out jobs created by the current user just to be clean
      const filtered = loggedInUser ? data.filter(job => job.userId !== loggedInUser.uid) : data;
      setJobs(filtered);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching jobs:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [loggedInUser]);

  useEffect(() => {
    // Haal alle applicaties van deze helper op om de UI te updaten ('Al gereageerd')
    if (!loggedInUser || loggedInUser.role !== 'helper') return;
    
    const q = query(
      collection(db, 'applications'),
      where('helperId', '==', loggedInUser.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setMyApplications(snapshot.docs.map(doc => doc.data().jobId));
    });

    return () => unsub();
  }, [loggedInUser]);

  const handleApply = async (job) => {
    if (!loggedInUser) {
      alert("U moet ingelogd zijn als helper om te kunnen reageren.");
      onNavigate('login');
      return;
    }

    if (loggedInUser.role !== 'helper') {
      alert("Alleen helpers kunnen reageren op klussen.");
      return;
    }

    if (myApplications.includes(job.id)) {
      alert("Je hebt al gereageerd op deze klus.");
      return;
    }

    setApplyingTo(job.id);
    try {
      await addDoc(collection(db, 'applications'), {
        jobId: job.id,
        helperId: loggedInUser.uid,
        status: 'pending',
        paidSeeker: false,
        paidHelper: false,
        createdAt: serverTimestamp()
      });
      
      alert(`Bedankt voor je interesse! Je bericht is succesvol geplaatst.`);
      onNavigate('helper-dashboard');
    } catch (error) {
      console.error("Error applying to job:", error);
      alert("Er ging iets mis bij het reageren. Probeer het later opnieuw.");
    } finally {
      setApplyingTo(null);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Net geplaatst";
    const date = timestamp.toDate();
    return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 animate-in fade-in duration-500">
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-5xl font-extrabold mb-4 text-[var(--color-brand-dark)]">Openstaande Klussen</h1>
        <p className="text-2xl text-gray-700 font-medium">Reageer direct op hulpvragen bij jou in de buurt en help iemand uit de brand!</p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 border-4 border-[#1D4ED8] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-2xl font-bold text-[#1D4ED8]">Klussen laden...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white p-12 rounded-[2rem] shadow-md border-2 border-gray-100 text-center">
           <h2 className="text-3xl font-extrabold text-[var(--color-brand-dark)] mb-4">Geen klussen gevonden</h2>
           <p className="text-xl text-gray-600">Er staan momenteel geen hulpvragen open. Kom later nog eens terug!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {jobs.map((job) => {
            const hasApplied = myApplications.includes(job.id);

            return (
              <div key={job.id} className="bg-white p-8 md:p-10 rounded-3xl shadow-lg border-2 border-transparent hover:border-[#1D4ED8] transition-all flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="flex-1 w-full text-center md:text-left">
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-4">
                    <h2 className="text-4xl font-extrabold text-[var(--color-brand-dark)]">{job.titel}</h2>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                      <span className="flex items-center gap-2 bg-[#E6F0FA] text-[#1D4ED8] px-4 py-2 rounded-xl font-bold text-xl">
                        <MapPin className="w-5 h-5" /> In de buurt
                      </span>
                      <span className="flex items-center gap-2 bg-[#F0FDF4] text-green-700 border border-green-200 px-4 py-2 rounded-xl font-bold text-xl">
                        <Euro className="w-5 h-5" /> Totaal: €{(job.totaalbedrag || 0).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                  <p className="text-2xl text-gray-700 font-medium mb-6 leading-relaxed">
                    {job.beschrijving}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-6 text-xl text-gray-500 font-bold border-t-2 border-gray-100 pt-6 mt-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-6 h-6 text-gray-400" /> Geplaatst: <span className="text-[var(--color-brand-dark)]">{formatDate(job.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-6 h-6 text-gray-400" /> Uurloon: <span className="text-[var(--color-brand-dark)]">€{(job.uurloon || 0).toFixed(2).replace('.', ',')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center w-full md:w-64 shrink-0 mt-4 md:mt-0 md:border-l-2 md:border-gray-100 md:pl-8 py-4">
                  <button 
                    disabled={applyingTo === job.id || hasApplied}
                    onClick={() => handleApply(job)}
                    className={`w-full py-5 px-6 font-extrabold text-2xl rounded-2xl transition-colors shadow-xl focus:ring-8 text-white ${hasApplied ? 'bg-gray-400 cursor-not-allowed' : 'bg-[var(--color-brand-dark)] hover:bg-[#122b4d] focus:ring-blue-300'}`}
                  >
                    {hasApplied ? 'Al gereageerd' : (applyingTo === job.id ? 'Bezig...' : 'Ik wil helpen!')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OpenKlussenView;
