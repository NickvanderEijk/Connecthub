import { useState, useEffect, useRef } from 'react';
import { Search, Wrench, Sprout, Home, CheckCircle2, User, Star, MapPin, X, Check, Calendar, Euro, FileText, Send, Clock, ShieldCheck, Video, MessageSquare, Lock, Unlock, Phone, LayoutDashboard, ChevronRight, Smartphone, Hammer, PlusCircle, LogOut, Settings } from 'lucide-react';
import { mockStudents, mockOpenRequests, mockMyDashboardRequests } from '../data/mockData';
import StudentModal from '../components/StudentModal';

function OpenKlussenView() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-5xl font-extrabold mb-4 text-[var(--color-brand-dark)]">Openstaande Klussen</h1>
        <p className="text-2xl text-gray-700 font-medium">Reageer direct op hulpvragen bij jou in de buurt en help iemand uit de brand!</p>
      </div>
      <div className="space-y-8">
        {mockOpenRequests.map((req) => (
          <div key={req.id} className="bg-white p-8 md:p-10 rounded-3xl shadow-lg border-2 border-transparent hover:border-[#1D4ED8] transition-all flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="flex-1 w-full text-center md:text-left">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-4">
                <h2 className="text-4xl font-extrabold text-[var(--color-brand-dark)]">{req.title}</h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <span className="flex items-center gap-2 bg-[#E6F0FA] text-[#1D4ED8] px-4 py-2 rounded-xl font-bold text-xl">
                    <MapPin className="w-5 h-5" /> {req.location}
                  </span>
                  <span className="flex items-center gap-2 bg-[#F0FDF4] text-green-700 border border-green-200 px-4 py-2 rounded-xl font-bold text-xl">
                    <Euro className="w-5 h-5" /> {req.fee}
                  </span>
                </div>
              </div>
              <p className="text-2xl text-gray-700 font-medium mb-6 leading-relaxed">
                {req.description}
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-6 text-xl text-gray-500 font-bold border-t-2 border-gray-100 pt-6 mt-4">
                <div className="flex items-center gap-2">
                  <User className="w-6 h-6 text-gray-400" /> Aangevraagd door: <span className="text-[var(--color-brand-dark)]">{req.postedBy}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-6 h-6 text-gray-400" /> Wanneer: <span className="text-[var(--color-brand-dark)]">{req.date}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center w-full md:w-64 shrink-0 mt-4 md:mt-0 md:border-l-2 md:border-gray-100 md:pl-8 py-4">
              <button 
                onClick={() => alert(`Bedankt voor je interesse! Je bericht ten aanzien van '${req.title}' is verzonden naar ${req.postedBy}. Zij beslissen of ze met je matchen.`)}
                className="w-full py-5 px-6 bg-[var(--color-brand-dark)] text-white font-extrabold text-2xl rounded-2xl hover:bg-[#122b4d] transition-colors shadow-xl focus:ring-8 focus:ring-blue-300"
              >
                Ik wil helpen!
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OpenKlussenView;
