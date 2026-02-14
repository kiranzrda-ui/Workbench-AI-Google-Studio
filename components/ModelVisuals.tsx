
import React, { useMemo } from 'react';
import { MLModel, Persona } from '../types';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, Cell, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter, ZAxis, CartesianGrid
} from 'recharts';

interface ModelVisualsProps {
  models: MLModel[];
  persona: Persona;
}

const ModelVisuals: React.FC<ModelVisualsProps> = ({ models, persona }) => {
  const trending = useMemo(() => [...models].sort((a, b) => b.usage - a.usage).slice(0, 3), [models]);
  const healthStats = useMemo(() => {
    const stats = { Healthy: 0, Degraded: 0, Critical: 0 };
    models.forEach(m => {
      if (m.monitoring_status in stats) {
        stats[m.monitoring_status as keyof typeof stats]++;
      }
    });
    return stats;
  }, [models]);

  const correlationData = useMemo(() => {
    return models.slice(0, 40).map(m => ({
      name: m.name,
      revenue: m.revenue_impact,
      growth: m.user_growth,
      accuracy: m.accuracy,
      domain: m.domain
    }));
  }, [models]);

  const radarComparisonData = useMemo(() => {
    if (trending.length === 0) return [];
    
    const metrics = [
      { name: 'Accuracy' },
      { name: 'Latency' }, 
      { name: 'Data Drift' }
    ];

    return metrics.map(metric => {
      const entry: any = { subject: metric.name };
      trending.forEach(m => {
        if (metric.name === 'Accuracy') {
          entry[m.name] = m.accuracy * 100;
        } else if (metric.name === 'Latency') {
          entry[m.name] = Math.max(0, Math.min(100, (150 - m.latency) * (100 / 150)));
        } else if (metric.name === 'Data Drift') {
          entry[m.name] = Math.max(0, Math.min(100, (0.15 - m.data_drift) * (100 / 0.15)));
        }
      });
      return entry;
    });
  }, [trending]);

  const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      if (!data) return null;
      return (
        <div className="bg-slate-900 border border-slate-700 p-4 rounded-2xl shadow-2xl z-50 text-white min-w-[200px] pointer-events-none">
          <p className="text-xs font-black mb-2 border-b border-slate-800 pb-2">{data.name || 'Unknown Asset'}</p>
          <div className="space-y-1.5">
             <div className="text-[10px] flex justify-between gap-4">
               <span className="text-slate-400 uppercase font-bold tracking-widest">Revenue Impact:</span>
               <span className="text-emerald-400 font-mono font-black">${((data.revenue || 0) / 1000).toLocaleString()}k</span>
             </div>
             <div className="text-[10px] flex justify-between gap-4">
               <span className="text-slate-400 uppercase font-bold tracking-widest">Growth Rate:</span>
               <span className="text-indigo-400 font-mono font-black">+{data.growth || 0}%</span>
             </div>
             <div className="text-[10px] flex justify-between gap-4">
               <span className="text-slate-400 uppercase font-bold tracking-widest">Confidence:</span>
               <span className="text-amber-400 font-mono font-black">{((data.accuracy || 0) * 100).toFixed(1)}%</span>
             </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const totalRevenue = useMemo(() => models.reduce((acc, m) => acc + m.revenue_impact, 0), [models]);
  const avgGrowth = useMemo(() => models.length > 0 ? (models.reduce((acc, m) => acc + m.user_growth, 0) / models.length).toFixed(1) : '0', [models]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-500/30 transition-all shadow-sm group cursor-help relative" title="Aggregated annual value contribution from current ML portfolio">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Portfolio Impact</div>
          <div className="text-lg font-bold text-slate-900">${(totalRevenue / 1000000).toFixed(1)}M</div>
          <div className="text-[9px] text-emerald-600 mt-1 flex items-center gap-1 font-bold">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            Global Revenue Attribution
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-indigo-500/30 transition-all shadow-sm group cursor-help relative" title="Average adoption increase of AI services over the last 30 days">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">System-wide Growth</div>
          <div className="text-lg font-bold text-slate-900">+{avgGrowth}%</div>
          <div className="text-[9px] text-indigo-600 mt-1 flex items-center gap-1 font-bold">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
            Quarterly Adoption Rate
          </div>
        </div>
      </div>

      <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative group">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center justify-between">
          Fleet Health Snapshot
          <span className="text-[8px] font-bold text-slate-400 lowercase italic tracking-tight">Active Pulse • {models.length} Units</span>
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <HealthTile label="Healthy" count={healthStats.Healthy} color="bg-emerald-50 text-emerald-700 border-emerald-100" tooltip="Models performing within 1% of baseline metrics" />
          <HealthTile label="Degraded" count={healthStats.Degraded} color="bg-amber-50 text-amber-700 border-amber-100" tooltip="Models experiencing moderate drift or latency spikes" />
          <HealthTile label="Critical" count={healthStats.Critical} color="bg-rose-50 text-rose-700 border-rose-100" tooltip="Models requiring immediate intervention or retraining" />
        </div>
      </section>

      <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Strategic Radar (Top Tier)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarComparisonData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              {trending.map((m, i) => (
                <Radar
                  key={m.id}
                  name={m.name}
                  dataKey={m.name}
                  stroke={colors[i % colors.length]}
                  strokeWidth={3}
                  fill={colors[i % colors.length]}
                  fillOpacity={0.4}
                />
              ))}
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '16px', color: '#fff', fontSize: '10px' }}
                itemStyle={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '9px' }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', color: '#64748b', paddingTop: '15px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] mb-6">Revenue Correlation Matrix</h3>
        <div className="h-56 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                type="number" 
                dataKey="revenue" 
                name="Revenue" 
                tick={{ fill: '#94a3b8', fontSize: 8, fontWeight: 800 }}
                axisLine={{ stroke: '#f1f5f9' }}
                domain={['auto', 'auto']}
              />
              <YAxis 
                type="number" 
                dataKey="growth" 
                name="Growth" 
                tick={{ fill: '#94a3b8', fontSize: 8, fontWeight: 800 }}
                axisLine={{ stroke: '#f1f5f9' }}
                domain={['auto', 'auto']}
              />
              <ZAxis type="number" dataKey="accuracy" range={[50, 400]} />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#cbd5e1' }} />
              <Scatter name="Revenue Units" data={correlationData}>
                {correlationData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.revenue > 1800000 ? '#10b981' : (entry.growth > 20 ? '#4f46e5' : '#94a3b8')} 
                    fillOpacity={0.7}
                    className="hover:scale-125 transition-all cursor-pointer"
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          {correlationData.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 rounded-xl">
              <span className="text-[10px] font-black text-slate-400 uppercase animate-pulse">Waiting for Data Pipeline...</span>
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-50 pt-4">
           <span>Growth (Y-Axis)</span>
           <span>Impact (X-Axis)</span>
        </div>
      </section>

      <section className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl group-hover:scale-110 transition-transform">💎</div>
         <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Enterprise Value Summary</h3>
         <div className="space-y-4">
            {models.slice(0, 4).map((m, i) => (
               <div key={m.id} className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0 hover:bg-white/5 transition-all rounded-lg p-2 group/item cursor-help" title={`Full version history and audit logs for ${m.name} are available in the Registry.`}>
                  <div>
                     <div className="text-xs font-black group-hover/item:text-indigo-300 transition-colors">{m.name}</div>
                     <div className="text-[8px] text-white/40 uppercase font-bold tracking-widest">{m.domain} • Global Reach</div>
                  </div>
                  <div className="text-right">
                     <div className="text-sm font-black text-emerald-400">${(m.revenue_impact / 1000).toFixed(0)}k</div>
                     <div className="text-[8px] text-white/40 font-bold">ANNUAL ATTRIBUTION</div>
                  </div>
               </div>
            ))}
         </div>
         <button className="w-full mt-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">
            Download Investment Thesis
         </button>
      </section>
    </div>
  );
};

const HealthTile = ({ label, count, color, tooltip }: any) => (
  <div className={`flex flex-col items-center p-3 rounded-2xl border transition-all hover:scale-105 cursor-help ${color}`} title={tooltip}>
    <div className="text-lg font-black leading-none">{count}</div>
    <div className="text-[8px] font-black uppercase mt-1 tracking-widest opacity-80">{label}</div>
  </div>
);

export default ModelVisuals;
