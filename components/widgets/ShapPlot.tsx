
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ShapPlot: React.FC<{ modelId?: string }> = ({ modelId }) => {
  const shapData = [
    { feature: 'Last 24h Transactions', impact: 0.42 },
    { feature: 'User Location Tier', impact: -0.15 },
    { feature: 'Product category Popularity', impact: 0.28 },
    { feature: 'Historical Avg Basket', impact: 0.12 },
    { feature: 'Promotion Flag', impact: -0.34 },
    { feature: 'Day of Week', impact: 0.05 },
  ].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Feature Impact (SHAP)</h3>
        <span className="text-[10px] text-indigo-400">Global Summary</span>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={shapData} margin={{ left: 40 }}>
            <XAxis type="number" hide />
            <YAxis 
              dataKey="feature" 
              type="category" 
              tick={{ fill: '#94a3b8', fontSize: 10 }} 
              width={120}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
            />
            <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
              {shapData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.impact > 0 ? '#10b981' : '#f43f5e'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[10px] text-slate-500 mt-4 leading-relaxed">
        Positive values (Green) increase the model's output, while negative values (Red) decrease it.
        This summary represents global feature importance across the validation set.
      </p>
    </div>
  );
};

export default ShapPlot;
