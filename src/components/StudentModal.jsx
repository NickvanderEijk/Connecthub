import { useState, useEffect, useRef } from 'react';
import { Search, Wrench, Sprout, Home, CheckCircle2, User, Star, MapPin, X, Check, Calendar, Euro, FileText, Send, Clock, ShieldCheck, Video, MessageSquare, Lock, Unlock, Phone, LayoutDashboard, ChevronRight, Smartphone, Hammer, PlusCircle, LogOut, Settings } from 'lucide-react';

function StudentModal({ student, onClose, onAccept }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => document.body.style.overflow = "auto";
  }, []);

  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-10">
      <div 
         className="absolute inset-0 bg-[#0B192C] bg-opacity-70 backdrop-blur-sm transition-opacity"
         onClick={onClose}
      ></div>
      
      <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col relative z-10 animate-in fade-in zoom-in duration-200">
         
        <div className="bg-[#E6F0FA] p-8 md:p-10 flex justify-between items-start rounded-t-[2rem] border-b-4 border-[#BCD4EC]">
           
           <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
             <div className="bg-white w-28 h-28 md:w-32 md:h-32 rounded-full flex-shrink-0 flex items-center justify-center text-[#1D4ED8] shadow-lg border-4 border-white">
               <User className="w-14 h-14 md:w-16 md:h-16" />
             </div>
             
             <div className="text-center sm:text-left mt-2">
               <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                 <h2 className="text-5xl font-extrabold text-[var(--color-brand-dark)]">{student.name}</h2>
               </div>
               
               <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-4">
                 <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 border-2 border-green-200 px-4 py-2 rounded-full font-bold text-lg shadow-sm">
                   <ShieldCheck className="w-6 h-6" /> ID Geverifieerd
                 </span>
                 {student.hasVideo && (
                   <span className="inline-flex items-center gap-2 bg-[#F0F5FA] text-[#1D4ED8] border-2 border-[#BCD4EC] px-4 py-2 rounded-full font-bold text-lg shadow-sm">
                     <Video className="w-6 h-6" /> Heeft introductievideo
                   </span>
                 )}
               </div>

               <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-4 mt-2">
                 <div className="flex items-center gap-2 text-gray-700 font-bold text-xl bg-white px-4 py-2 rounded-xl shadow-sm">
                   <MapPin className="w-6 h-6 text-[#1D4ED8]" />
                   {student.location}
                 </div>
                 <div className="flex items-center gap-2 text-[#D97706] font-bold text-xl bg-white px-4 py-2 rounded-xl shadow-sm border border-orange-100">
                    <Star className="w-6 h-6 fill-current" />
                    {student.rating} / 5
                 </div>
               </div>
             </div>
           </div>

           <button 
             onClick={onClose}
             className="bg-white p-3 rounded-full hover:bg-gray-200 transition-colors shadow-lg focus:ring-4 text-[var(--color-brand-dark)] focus:outline-none shrink-0"
             aria-label="Sluiten"
           >
             <X className="w-8 h-8 md:w-10 md:h-10" />
           </button>
        </div>

        <div className="p-8 md:p-12 flex-1 space-y-12">
           
           <p className="text-[#1D4ED8] font-extrabold text-3xl pb-4 border-b-4 border-gray-100">
             Specialiteit: {student.specialty}
           </p>

           <section>
             <h3 className="text-4xl font-extrabold text-[var(--color-brand-dark)] mb-6 flex items-center gap-3">
               <User className="w-10 h-10" /> Over mij
             </h3>
             <p className="text-2xl text-gray-800 leading-relaxed font-medium bg-[#F8FAFC] p-8 rounded-2xl border-2 border-gray-100">
               {student.aboutMe}
             </p>
           </section>

           <section>
             <h3 className="text-4xl font-extrabold text-[var(--color-brand-dark)] mb-6 flex items-center gap-3">
               <CheckCircle2 className="w-10 h-10" /> Diensten
             </h3>
             <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
               {student.services.map((service, idx) => (
                 <li key={idx} className="flex items-start gap-4 text-2xl text-gray-800 font-bold bg-white shadow-sm p-6 rounded-2xl border-2 border-[#E6F0FA]">
                   <div className="bg-[#E6F0FA] p-2 rounded-full">
                     <Check className="w-6 h-6 text-[#1D4ED8] shrink-0 stroke-[3]" />
                   </div>
                   <span className="mt-1">{service}</span>
                 </li>
               ))}
             </ul>
           </section>

           <section>
             <h3 className="text-4xl font-extrabold text-[var(--color-brand-dark)] mb-6 flex items-center gap-3">
               <MessageSquare className="w-10 h-10" /> Recensies van buurtbewoners
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {student.reviews.map((review, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100 flex flex-col justify-between">
                     <div>
                        <div className="flex items-center justify-between mb-3">
                           <h4 className="text-2xl font-bold text-[var(--color-brand-dark)]">{review.author}</h4>
                           <div className="flex gap-1 text-[#D97706]">
                              {[...Array(review.rating)].map((_, i) => (
                                 <Star key={i} className="w-5 h-5 fill-current" />
                              ))}
                           </div>
                        </div>
                        <p className="text-xl text-gray-700 italic">"{review.text}"</p>
                     </div>
                     <p className="text-lg text-gray-400 mt-4 font-bold">{review.date}</p>
                  </div>
                ))}
             </div>
           </section>

           {/* IF a context was passed to allow accepting, render the Accept button */}
           {onAccept && (
             <div className="pt-8 border-t-2 border-gray-100">
               <button 
                 onClick={onAccept}
                 className="w-full py-6 md:py-8 px-8 bg-[#1D4ED8] text-white font-extrabold text-3xl md:text-4xl rounded-2xl hover:bg-[#1E3A8A] transition-colors shadow-2xl focus:ring-8 focus:ring-blue-300"
               >
                 Accepteer Student
               </button>
             </div>
           )}
        </div>

      </div>
    </div>
  );
}
export default StudentModal;
