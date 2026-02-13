
import React from 'react';
import { MLModel, Persona } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid, Legend } from 'recharts';

interface ModelVisualsProps {
  models: MLModel[];
  persona: Persona;
}

const ModelVisuals: React.FC<ModelVisualsProps> = ({ models, persona }) => {
  // Sort for trends
  const trending = [...models].sort((a, b) => b.usage - a.usage).slice(0, 3);
  const struggling = [...models].sort((a, b) => b.error_rate - a.error_rate).slice(0, 2);

  // Sample data for revenue/growth
  const revenueData = [
    { name: 'Jan', val: 4000 },
    { name: 'Feb', val: 3000 },
    { name: 'Mar', val: 2000 },
    { name: 'Apr', val: 2780 },
    { name: 'May', val: 1890 },
    { name: 'Jun', val: 2390 },
    { name: 'Jul', val: 3490 },
  ];

  // Mock historical drift data for the top 3 trending models
  const driftTrendData = [
    { month: 'Jan', [trending[0]?.name]: 0.02, [trending[1]?.name]: 0.01, [trending[2]?.name]: 0.04 },
    { month: 'Feb', [trending[0]?.name]: 0.03, [trending[1]?.name]: 0.02, [trending[2]?.name]: 0.03 },
    { month: 'Mar', [trending[0]?.name]: 0.02, [trending[1]?.name]: 0.05, [trending[2]?.name]: 0.06 },
    { month: 'Apr', [trending[0]?.name]: 0.05, [trending[1]?.name]: 0.08, [trending[2]?.name]: 0.05 },
    { month: 'May', [trending[0]?.name]: 0.04, [trending[1]?.name]: 0.11, [trending[2]?.name]: 0.04 },
    { month: 'Jun', [trending[0]?.name]: 0.06, [trending[1]?.name]: 0.09, [trending[2]?.name]: 0.07 },
    { month: 'Jul', [trending[0]?.name]: trending[0]?.data_drift || 0.05, [trending[1]?.name]: trending[1]?.data_drift || 0.1, [trending[2]?.name]: trending[2]?.data_drift || 0.06 },
  ];

  const colors = ['#6366f1', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20">
      {persona === 'Supervisor' && (
        <section className="bg-slate-800/40 p-5 rounded-2xl border border-rose-500/20">
          <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-4">Urgent Governance</h3>
          <div className="space-y-3">
             {struggling.map(m => (
               <div key={m.id} className="flex items-center gap-3 p-2 bg-rose-500/5 rounded-lg border border-rose-500/10">
                 <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></div>
                 <div className="flex-1">
                   <div className="text-xs font-bold text-slate-200">{m.name}</div>
                   <div className="text-[10px] text-slate-500">Drift: {(m.data_drift * 100).toFixed(1)}% | Error: {(m.error_rate * 100).toFixed(1)}%</div>
                 </div>
               </div>
             ))}
          </div>
        </section>
      )}

      {/* NEW: Data Drift Trends Section */}
      <section className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest">Model Drift Trends</h3>
          <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Last 6 Months</span>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={driftTrendData}>
              <XAxis dataKey="month" hide />
              <YAxis hide domain={[0, 0.2]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '10px' }}
                itemStyle={{ fontSize: '10px' }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '9px', paddingTop: '10px' }} />
              {trending.map((m, i) => (
                <Line 
                  key={m.id} 
                  type="monotone" 
                  dataKey={m.name} 
                  stroke={colors[i % colors.length]} 
                  strokeWidth={2} 
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[9px] text-slate-500 mt-3 italic text-center">
          Tracking PSI (Population Stability Index) across production endpoints.
        </p>
      </section>

      <section className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700">
        <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">Network Growth</h3>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '10px' }}
              />
              <Area type="monotone" dataKey="val" stroke="#6366f1" fillOpacity={1} fill="url(#colorPv)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-between items-center text-[10px] text-slate-500 font-bold">
           <span>Aggregate Revenue Contribution</span>
           <span className="text-emerald-400">+12.4% vs prev</span>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Trending Now</h3>
        {trending.map(m => (
          <div key={m.id} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex items-center justify-between hover:bg-slate-800 transition-colors">
            <div className="flex-1 min-w-0 pr-4">
              <div className="text-xs font-bold text-slate-200 truncate">{m.name}</div>
              <div className="text-[10px] text-slate-500">{m.usage.toLocaleString()} reqs / min</div>
            </div>
            <div className="flex flex-col items-end shrink-0">
               <span className="text-[10px] text-emerald-400 font-bold">98.2% Sla</span>
               <div className="w-12 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[90%]"></div>
               </div>
            </div>
          </div>
        ))}
      </section>

      <section className="bg-indigo-600/10 p-5 rounded-2xl border border-indigo-500/20 text-center">
        <div className="text-2xl mb-2">💎</div>
        <h4 className="text-xs font-bold text-indigo-300 uppercase mb-1">Hidden Gem of the Week</h4>
        <div className="text-sm font-bold text-white">Manufacturing QC Vision v1.1</div>
        <p className="text-[10px] text-slate-400 mt-2">
          High precision (99.1%) with extremely low latency (12ms). Ideal for high-speed conveyor tasks.
        </p>
        <button className="mt-4 text-[10px] font-bold text-indigo-400 border border-indigo-400/30 px-4 py-2 rounded-lg hover:bg-indigo-400 hover:text-white transition-all">
          Explore Model
        </button>
      </section>
    </div>
  );
};

export default ModelVisuals;
