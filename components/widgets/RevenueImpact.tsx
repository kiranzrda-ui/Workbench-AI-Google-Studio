
import React from 'react';
import { MLModel } from '../../types';

interface RevenueImpactProps {
  model: MLModel;
  totalPortfolioRevenue?: number;
}

const RevenueImpact: React.FC<RevenueImpactProps> = ({ model, totalPortfolioRevenue = 25000000 }) => {
  if (!model) return null;

  const percentage = (model.revenue_impact / totalPortfolioRevenue) * 100;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden animate-in zoom-in-95 duration-300">
      <div className="bg-emerald-500 h-1.5 w-full"></div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Financial Attribution</h3>
            <h2 className="text-xl font-bold text-slate-800">{model.name}</h2>
          </div>
          <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold border border-emerald-100 uppercase tracking-tighter">
            Profitability: High
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold text-slate-900">${(model.revenue_impact / 1000).toLocaleString()}k</span>
          <span className="text-slate-400 text-sm font-medium">Annual Contribution</span>
        </div>

        <div className="space-y-4 mt-6">
          <div>
            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase mb-1.5">
              <span>Portfolio Share</span>
              <span>{percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000" 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
             <div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Efficiency Score</div>
                <div className="text-sm font-bold text-slate-700">8.4 / 10</div>
             </div>
             <div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">ROI Multiplier</div>
                <div className="text-sm font-bold text-emerald-600">12.2x</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueImpact;
