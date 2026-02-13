
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { MLModel } from '../../types';

interface ComparisonChartProps {
  models: MLModel[];
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({ models }) => {
  if (!models || models.length < 1) return null;

  // Radar Data for visual depth
  const metrics = [
    { metric: 'Accuracy', full: 100 },
    { metric: 'Latency (Inv)', full: 100 },
    { metric: 'Throughput', full: 100 },
    { metric: 'Health', full: 100 },
    { metric: 'Efficiency', full: 100 },
  ];

  const radarData = metrics.map(m => {
    const entry: any = { subject: m.metric };
    models.forEach(model => {
      let val = 0;
      if (m.metric === 'Accuracy') val = model.accuracy * 100;
      if (m.metric === 'Latency (Inv)') val = Math.max(0, 100 - (model.latency / 2));
      if (m.metric === 'Throughput') val = Math.min(100, model.throughput / 10);
      if (m.metric === 'Health') val = (1 - model.error_rate) * 100;
      if (m.metric === 'Efficiency') val = 100 - model.cpu_util;
      entry[model.name] = val;
    });
    return entry;
  });

  const colors = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b'];

  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 shadow-2xl">
      <h3 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-wider">Metric Comparison</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            {models.map((m, i) => (
              <Radar
                key={m.id}
                name={m.name}
                dataKey={m.name}
                stroke={colors[i % colors.length]}
                fill={colors[i % colors.length]}
                fillOpacity={0.4}
              />
            ))}
            <Tooltip 
               contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
               itemStyle={{ fontSize: 12 }}
            />
            <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComparisonChart;
