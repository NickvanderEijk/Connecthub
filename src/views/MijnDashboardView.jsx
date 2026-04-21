import { useState, useEffect, useRef } from 'react';
import { Search, Wrench, Sprout, Home, CheckCircle2, User, Star, MapPin, X, Check, Calendar, Euro, FileText, Send, Clock, ShieldCheck, Video, MessageSquare, Lock, Unlock, Phone, LayoutDashboard, ChevronRight, Smartphone, Hammer, PlusCircle, LogOut, Settings } from 'lucide-react';
import { mockStudents, mockOpenRequests, mockMyDashboardRequests } from '../data/mockData';
import StudentModal from '../components/StudentModal';

function MijnDashboardView({ onMatch, onNavigate }) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // When viewing details of a task and a student responded
  const handleStudentClick = (student) => {
    setSelectedStudent(student);
  };

  const handleAcceptStudent = () => {
    if (selectedStudent && selectedTask) {
      onMatch(selectedStudent, selectedTask);
      setSelectedStudent(null);
      setSelectedTask(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      
      {!selectedTask ? (
        <>
          <div className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
               <h1 className="text-5xl font-extrabold mb-4 text-[var(--color-brand-dark)]">Mijn Hulpvragen</h1>
               <p className="text-2xl text-gray-700 font-medium">Bekijk uw geplaatste klussen en ontvang reacties van studenten.</p>
            </div>
            <button 
              onClick={() => onNavigate('plaats-klus')}
              className="px-8 py-4 bg-[#1D4ED8] text-white font-extrabold text-2xl rounded-2xl shadow hover:bg-[#1E3A8A]"
            >
              + Nieuwe Hulpvraag
            </button>
          </div>

          <div className="grid grid-cols-1 gap-8">
             {mockMyDashboardRequests.map(req => (
               <div key={req.id} onClick={() => setSelectedTask(req)} className="bg-white rounded-[2rem] p-8 shadow-md border-2 border-gray-100 hover:border-[#1D4ED8] transition-colors cursor-pointer group">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                     <h2 className="text-3xl font-extrabold text-[var(--color-brand-dark)] group-hover:text-[#1D4ED8]">{req.title}</h2>
                     <span className="bg-[#E6F0FA] text-[#1D4ED8] font-bold px-4 py-2 rounded-xl text-lg flex items-center gap-2">
                       <MessageSquare className="w-5 h-5"/> {req.responses.length} Reacties
                     </span>
                  </div>
                  <div className="flex items-center gap-6 text-xl text-gray-500 font-bold mb-4">
                     <span className="flex items-center gap-2"><MapPin className="w-5 h-5"/> {req.location}</span>
                     <span className="flex items-center gap-2"><Calendar className="w-5 h-5"/> {req.date}</span>
                     <span className="flex items-center gap-2"><Euro className="w-5 h-5"/> {req.fee}</span>
                  </div>
                  <p className="text-2xl text-gray-600 truncate">{req.description}</p>
               </div>
             ))}
          </div>
        </>
      ) : (
        <>
          <button onClick={() => setSelectedTask(null)} className="text-[#1D4ED8] font-bold text-xl flex items-center gap-2 mb-8 hover:underline">
             &larr; Terug naar Mijn Hulpvragen
          </button>

          <div className="bg-white rounded-[2rem] p-10 shadow-lg border-2 border-gray-100 mb-12 relative overflow-hidden">
             {/* Design accent */}
             <div className="absolute top-0 left-0 w-4 h-full bg-[#1D4ED8]"></div>
             <h1 className="text-4xl font-extrabold text-[var(--color-brand-dark)] mb-4">{selectedTask.title}</h1>
             <p className="text-2xl text-gray-700 leading-relaxed max-w-4xl">{selectedTask.description}</p>
          </div>

          <h3 className="text-3xl font-extrabold text-[var(--color-brand-dark)] mb-6 flex items-center gap-3">
             <MessageSquare className="w-8 h-8" /> Ze willen u helpen! ({selectedTask.responses.length})
          </h3>

          <div className="space-y-6">
            {selectedTask.responses.map(student => (
              <div key={student.id} className="bg-white p-6 rounded-3xl shadow-md border-2 border-[#E6F0FA] flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
                  <div className="flex items-center gap-6">
                     <div className="bg-[#E6F0FA] w-20 h-20 rounded-full flex items-center justify-center text-[#1D4ED8] shrink-0 border-4 border-white shadow">
                       <User className="w-10 h-10" />
                     </div>
                     <div>
                        <h4 className="text-3xl font-extrabold text-[var(--color-brand-dark)]">{student.name}</h4>
                        <div className="flex items-center gap-2 text-[#D97706] font-bold text-xl mt-1">
                          <Star className="w-5 h-5 fill-current" /> {student.rating}
                        </div>
                     </div>
                  </div>
                  <button 
                    onClick={() => handleStudentClick(student)}
                    className="w-full sm:w-auto mt-4 sm:mt-0 py-4 px-8 bg-[#E6F0FA] text-[#1D4ED8] font-extrabold text-xl rounded-xl border-2 border-[#BCD4EC] hover:bg-[#BCD4EC] transition-colors"
                  >
                    Bekijk Profiel
                  </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* When in the Dashboard context, we supply an onAccept handler to the Modal */}
      <StudentModal 
        student={selectedStudent} 
        onClose={() => setSelectedStudent(null)} 
        onAccept={handleAcceptStudent} 
      />
    </div>
  );
}

export default MijnDashboardView;
