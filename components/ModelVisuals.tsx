
import React, { useMemo } from 'react';
import { MLModel, Persona } from '../types';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, Cell, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter, ZAxis
} from 'recharts';

interface ModelVisualsProps {
  models: MLModel[];
  persona: Persona;
}

const ModelVisuals: React.FC<ModelVisualsProps> = ({ models, persona }) => {
  const trending = useMemo(() => [...models].sort((a, b) => b.usage - a.usage).slice(0, 3), [models]);
  const struggling = useMemo(() => [...models].sort((a, b) => b.error_rate - a.error_rate).slice(0, 2), [models]);
  const topImpact = useMemo(() => [...models].sort((a, b) => b.revenue_impact - a.revenue_impact).slice(0, 5), [models]);
  const highGrowth = useMemo(() => [...models].sort((a, b) => b.user_growth - a.user_growth).slice(0, 1)[0], [models]);

  const totalRevenue = useMemo(() => models.reduce((acc, m) => acc + m.revenue_impact, 0), [models]);
  const avgGrowth = useMemo(() => models.length > 0 ? (models.reduce((acc, m) => acc + m.user_growth, 0) / models.length).toFixed(1) : '0', [models]);

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
    return models.slice(0, 30).map(m => ({
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

  const colors = ['#7c3aed', '#059669', '#d97706', '#db2777', '#4f46e5'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      if (!data) return null;
      return (
        <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xl z-50">
          <p className="text-[10px] font-bold text-slate-800 mb-1">{data.name || 'Unknown Asset'}</p>
          <div className="space-y-0.5">
             <div className="text-[9px] flex justify-between gap-4">
               <span className="text-slate-500">Revenue:</span>
               <span className="text-emerald-600 font-mono font-bold">${((data.revenue || 0) / 1000).toFixed(0)}k</span>
             </div>
             <div className="text-[9px] flex justify-between gap-4">
               <span className="text-slate-500">Growth:</span>
               <span className="text-purple-600 font-mono font-bold">+{data.growth || 0}%</span>
             </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-500/30 transition-all shadow-sm group">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Impact</div>
          <div className="text-lg font-bold text-slate-900">${(totalRevenue / 1000000).toFixed(1)}M</div>
          <div className="text-[9px] text-emerald-600 mt-1 flex items-center gap-1 font-bold">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            Global Revenue
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-purple-500/30 transition-all shadow-sm group">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Avg Growth</div>
          <div className="text-lg font-bold text-slate-900">{avgGrowth}%</div>
          <div className="text-[9px] text-purple-600 mt-1 flex items-center gap-1 font-bold">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></span>
            Adoption Rate
          </div>
        </div>
      </div>

      <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-4 flex items-center justify-between">
          Fleet Health
          <span className="text-[8px] font-normal text-slate-400 lowercase italic">Monitoring {models.length} assets</span>
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center p-2 bg-emerald-50 rounded-xl border border-emerald-100">
            <div className="text-lg font-bold text-emerald-700 leading-none">{healthStats.Healthy}</div>
            <div className="text-[8px] text-emerald-600 font-bold uppercase mt-1">Healthy</div>
          </div>
          <div className="flex flex-col items-center p-2 bg-amber-50 rounded-xl border border-amber-100">
            <div className="text-lg font-bold text-amber-700 leading-none">{healthStats.Degraded}</div>
            <div className="text-[8px] text-amber-600 font-bold uppercase mt-1">Degraded</div>
          </div>
          <div className="flex flex-col items-center p-2 bg-rose-50 rounded-xl border border-rose-100">
            <div className="text-lg font-bold text-rose-700 leading-none">{healthStats.Critical}</div>
            <div className="text-[8px] text-rose-600 font-bold uppercase mt-1">Critical</div>
          </div>
        </div>
      </section>

      <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <h3 className="text-xs font-bold text-purple-700 uppercase tracking-widest mb-4">Technical Alpha (Top 3)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarComparisonData}>
              <PolarGrid stroke="#94a3b8" strokeOpacity={0.5} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#334155', fontSize: 10, fontWeight: 700 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              {trending.map((m, i) => (
                <Radar
                  key={m.id}
                  name={m.name}
                  dataKey={m.name}
                  stroke={colors[i % colors.length]}
                  strokeWidth={2}
                  fill={colors[i % colors.length]}
                  fillOpacity={0.5}
                />
              ))}
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '10px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                itemStyle={{ fontSize: '10px', fontWeight: 700 }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '15px', fontWeight: 600 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-6">Revenue Correlation</h3>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <XAxis type="number" dataKey="revenue" hide />
              <YAxis type="number" dataKey="growth" hide />
              <ZAxis type="number" dataKey="accuracy" range={[20, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Scatter name="Models" data={correlationData}>
                {correlationData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.revenue > 1500000 ? '#10b981' : (entry.growth > 15 ? '#8b5cf6' : '#cbd5e1')} 
                    fillOpacity={0.6}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-4">Value Portfolio</h3>
        <div className="space-y-4">
          {topImpact.map((m, i) => (
            <div key={m.id} className="group relative">
              <div className="flex justify-between items-end mb-1">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-800 font-bold truncate max-w-[180px] group-hover:text-purple-600 transition-colors">{m.name}</span>
                  <span className="text-[8px] text-slate-400 font-medium">{m.domain} • +{m.user_growth}% growth</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">${(m.revenue_impact / 1000).toFixed(0)}k</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-1000"
                  style={{ width: `${(m.revenue_impact / (topImpact[0]?.revenue_impact || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ModelVisuals;
