
import React, { useState, useEffect } from 'react';
import { ExternalAsset } from '../../types';

interface ExternalScanProps {
  assets: ExternalAsset[];
  onImport: (asset: ExternalAsset) => void;
}

const ExternalScan: React.FC<ExternalScanProps> = ({ assets, onImport }) => {
  const [isScanning, setIsScanning] = useState(true);
  const [importingId, setImportingId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsScanning(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isScanning) {
    return (
      <div className="bg-slate-800/40 rounded-2xl p-8 border border-indigo-500/20 text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-100 mb-1">Scanning External Registries...</h3>
          <p className="text-[10px] text-slate-500">Handshaking with HuggingFace Hub, Azure AI, and Bedrock</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">External Discovery results</span>
        <span className="text-[9px] text-slate-500">{assets.length} assets found</span>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {assets.map(asset => {
          const isImporting = importingId === asset.id;
          return (
            <div key={asset.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex gap-4 items-center group hover:border-indigo-500/50 transition-all">
              <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center shrink-0 border border-slate-700">
                <span className="text-lg">{asset.source === 'HuggingFace' ? '🤗' : (asset.source === 'Azure AI' ? '☁️' : '📦')}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="text-xs font-bold text-slate-100 truncate">{asset.name}</h4>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter ${
                    asset.source === 'HuggingFace' ? 'bg-amber-500/10 text-amber-500' : 
                    asset.source === 'Azure AI' ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'
                  }`}>
                    {asset.source}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 truncate">{asset.description}</p>
              </div>
              <button 
                onClick={() => {
                  setImportingId(asset.id);
                  setTimeout(() => {
                    onImport(asset);
                    setImportingId(null);
                  }, 1200);
                }}
                disabled={isImporting}
                className={`text-[10px] px-3 py-1.5 rounded-lg border transition-all font-bold ${
                  isImporting 
                    ? 'bg-slate-900 border-slate-700 text-slate-500 animate-pulse' 
                    : 'bg-indigo-600/10 border-indigo-600/30 text-indigo-400 hover:bg-indigo-600 hover:text-white'
                }`}
              >
                {isImporting ? 'Syncing...' : 'Import'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExternalScan;
