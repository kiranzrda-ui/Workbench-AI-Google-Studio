
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ShapPlot: React.FC<{ modelId?: string }> = ({ modelId }) => {
  const shapData = [
    { feature: 'Trans. Volume', impact: 0.42 },
    { feature: 'Location Tier', impact: -0.15 },
    { feature: 'Cat. Popularity', impact: 0.28 },
    { feature: 'Avg Basket', impact: 0.12 },
    { feature: 'Promotion Flag', impact: -0.34 },
    { feature: 'DOW Cycle', impact: 0.05 },
  ].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

  // High contrast vibrant palette from radar charts
  const colors = ['#7c3aed', '#db2777', '#059669', '#d97706', '#4f46e5', '#3b82f6'];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Feature Impact (Global SHAP)</h4>
        <div className="flex gap-4">
           <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-[9px] font-bold text-slate-400">POS.</span>
           </div>
           <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-rose-500"></div>
              <span className="text-[9px] font-bold text-slate-400">NEG.</span>
           </div>
        </div>
      </div>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={shapData} margin={{ left: -20 }}>
            <XAxis type="number" hide />
            <YAxis 
              dataKey="feature" 
              type="category" 
              tick={{ fill: '#64748b', fontSize: 9, fontWeight: 700 }} 
              width={100}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }}
              contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '10px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="impact" radius={[0, 6, 6, 0]} barSize={12}>
              {shapData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.impact > 0 ? colors[index % colors.length] : '#f43f5e'} 
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[9px] text-slate-400 mt-4 leading-relaxed font-medium italic">
        * Vibe-Check: Feature impact scores normalized across current validation split.
      </p>
    </div>
  );
};

export default ShapPlot;
