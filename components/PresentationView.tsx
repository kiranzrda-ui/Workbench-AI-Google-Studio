
import React, { useState } from 'react';
import { MLModel } from '../types';

interface PresentationViewProps {
  models: MLModel[];
}

const SLIDES = [
  {
    id: 'intro',
    title: 'Aura AI Workbench',
    subtitle: 'Agentic Governance & Model Lifecycle Orchestration',
    type: 'cover'
  },
  {
    id: 'problem',
    title: 'The Enterprise Gap',
    subtitle: 'High-Volume ML Management is Broken',
    content: [
      { type: 'stat', label: 'Manual Audit Time', value: '450 hrs/mo' },
      { type: 'stat', label: 'Unmonitored Models', value: '140+' },
      { type: 'list', items: [
        'Model sprawl creates opaque technical debt.',
        'Lineage tracking is manual and error-prone.',
        'Disconnected datasets lead to "Model Decay" going unnoticed for weeks.'
      ]}
    ]
  },
  {
    id: 'solution',
    title: 'Agentic Intelligence',
    subtitle: 'Beyond Static Dashboards',
    content: [
      { type: 'text', text: 'Aura uses a centralized LLM Reasoning Core (Gemini 3) to act as a proactive "Lead Scientist".' },
      { type: 'grid', items: [
        { title: 'Semantic Search', text: 'Ask for models like humans talk, not via SQL.' },
        { title: 'Proactive Recovery', text: 'Detects drift and suggests retraining before failures.' },
        { title: 'Governance as Code', text: 'Automated lineage and PHI detection.' }
      ]}
    ]
  },
  {
    id: 'scenarios',
    title: 'Functional Scenarios',
    subtitle: 'Demonstrated Value in Production',
    content: [
      { type: 'scenario', name: 'Compliance Audit', text: '"Who owns FraudGuard and what is its data source?"', result: '90% faster documentation retrieval.' },
      { type: 'scenario', name: 'Operational Health', text: '"Why is Revenue for Retail v2 dropping?"', result: 'Automated Root Cause Analysis (RCA).' },
      { type: 'scenario', name: 'Strategic Growth', text: '"Compare top 3 models by annual revenue impact."', result: 'Empowering CFOs with transparent AI ROI.' }
    ]
  },
  {
    id: 'tech',
    title: 'Technical Architecture',
    subtitle: 'Robust, Scalable, Secure',
    content: [
      { type: 'tech-map', items: [
        { layer: 'Agentic Core', tech: 'Google Gemini 3 Pro/Flash' },
        { layer: 'Metadata Store', tech: 'Postgres + Vector Embeddings' },
        { layer: 'Data Layer', tech: 'S3 / Azure Blob / Feature Store Connectors' },
        { layer: 'UX Layer', tech: 'React 19 + Tailwind + Recharts' }
      ]}
    ]
  },
  {
    id: 'finances',
    title: 'Monthly Run Rate',
    subtitle: 'Phase 2 Cost Optimization (MVP Stage)',
    content: [
      { type: 'cost-table', items: [
        { item: 'LLM API (Gemini)', cost: '$350', note: 'Flash (90%) + Pro (10%)' },
        { item: 'Cloud Infrastructure', cost: '$180', note: 'Hosting + Storage + VNet' },
        { item: 'Monitoring & Logs', cost: '$90', note: 'DataDog / CloudWatch' },
        { item: 'Maintenance (Dev)', cost: '$0', note: 'In-house Lab allocation' }
      ]},
      { type: 'summary', total: '$620 / mo', roi: 'Est. 340% Monthly Savings' }
    ]
  },
  {
    id: 'funding',
    title: 'Funding Ask',
    subtitle: 'The Road to Enterprise Production',
    content: [
      { type: 'milestone', date: 'Q3 2024', goal: 'Integration with Databricks/Snowflake.' },
      { type: 'milestone', date: 'Q4 2024', goal: 'Autonomous Agentic Self-Healing (Phase 3).' },
      { type: 'ask', amount: '$45,000', note: 'Seed funding for Phase 2 Integration & Pilot Deployment.' }
    ]
  }
];

const PresentationView: React.FC<PresentationViewProps> = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const next = () => setCurrentSlide(prev => Math.min(prev + 1, SLIDES.length - 1));
  const back = () => setCurrentSlide(prev => Math.max(prev - 1, 0));
  
  const handlePrint = () => {
    // 1. Get the HTML of the print-area
    const printArea = document.querySelector('.print-area');
    if (!printArea) {
      window.print(); // Fallback
      return;
    }

    // 2. Open a new window (breakout)
    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    if (!printWindow) {
      // If blocked by popup blocker, fallback to standard print
      window.print();
      return;
    }

    // 3. Write the deck HTML and styles to the new window
    printWindow.document.write(`
      <html>
        <head>
          <title>Aura AI Workbench - Investment Deck</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
          <style>
            body { 
              font-family: 'Inter', sans-serif;
              margin: 0;
              padding: 0;
              background: white;
            }
            @page { 
              size: landscape; 
              margin: 0; 
            }
            .print-slide { 
              width: 100vw;
              height: 100vh;
              page-break-after: always; 
              display: flex;
              flex-direction: column;
              overflow: hidden;
              position: relative;
            }
            /* Reset Tailwinds default hidden for our print area */
            .print-area { display: block !important; }
            .hidden { display: none !important; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          </style>
        </head>
        <body>
          <div class="print-area">
            ${printArea.innerHTML}
          </div>
          <script>
            // Wait for Tailwind to process and fonts to load
            window.onload = () => {
              setTimeout(() => {
                window.print();
                // Close the tab after printing (optional, user experience choice)
                // window.close(); 
              }, 1000);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const slide = SLIDES[currentSlide];

  const renderSlideContent = (currentSlideData: typeof SLIDES[0]) => {
    if (currentSlideData.type === 'cover') {
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
           <div className="px-6 py-2 bg-purple-100 text-purple-600 rounded-full text-xs font-bold uppercase tracking-widest">Innovation Board Deck</div>
           <h1 className="text-6xl font-black text-slate-900 tracking-tight leading-tight">
             {currentSlideData.title}
           </h1>
           <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
             {currentSlideData.subtitle}
           </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full">
        <div className="mb-8 shrink-0">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">{currentSlideData.title}</h2>
          <p className="text-lg text-indigo-500 font-bold mt-2">{currentSlideData.subtitle}</p>
        </div>

        <div className="flex-1 overflow-hidden pr-4">
          {currentSlideData.content?.map((item: any, idx: number) => {
            switch(item.type) {
              case 'stat': 
                return (
                  <div key={idx} className="inline-block mr-12 mb-8">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                    <p className="text-5xl font-black text-slate-900">{item.value}</p>
                  </div>
                );
              case 'list':
                return (
                  <div key={idx} className="space-y-4 mt-4">
                    {item.items.map((li: string, i: number) => (
                      <div key={i} className="flex items-start gap-4">
                         <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs shrink-0 mt-0.5 font-bold">✓</div>
                         <p className="text-lg text-slate-600 font-medium">{li}</p>
                      </div>
                    ))}
                  </div>
                );
              case 'grid':
                return (
                  <div key={idx} className="grid grid-cols-3 gap-6">
                     {item.items.map((gridItem: any, i: number) => (
                       <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                          <h4 className="font-bold text-slate-900 mb-2">{gridItem.title}</h4>
                          <p className="text-sm text-slate-500 leading-relaxed">{gridItem.text}</p>
                       </div>
                     ))}
                  </div>
                );
              case 'scenario':
                return (
                  <div key={idx} className="mb-4 p-5 bg-white border border-slate-200 rounded-3xl shadow-sm flex items-center justify-between gap-8">
                     <div className="flex-1">
                       <div className="text-[10px] font-bold text-purple-600 uppercase mb-1">{item.name}</div>
                       <p className="text-lg font-bold text-slate-800 italic">{item.text}</p>
                     </div>
                     <div className="text-right">
                       <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Impact</div>
                       <p className="text-md font-black text-emerald-600">{item.result}</p>
                     </div>
                  </div>
                );
              case 'cost-table':
                return (
                  <div key={idx} className="bg-white border border-slate-200 rounded-3xl overflow-hidden mb-6 shadow-sm">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                         <tr>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category Item</th>
                            <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monthly Cost</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Allocation Detail</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {item.items.map((row: any, i: number) => (
                           <tr key={i}>
                              <td className="px-6 py-4 text-sm font-bold text-slate-800">{row.item}</td>
                              <td className="px-6 py-4 text-right text-sm font-mono font-bold text-indigo-600">{row.cost}</td>
                              <td className="px-6 py-4 text-xs text-slate-400 italic font-medium">{row.note}</td>
                           </tr>
                         ))}
                      </tbody>
                    </table>
                  </div>
                );
              case 'summary':
                return (
                  <div key={idx} className="flex justify-between items-center bg-indigo-600 rounded-3xl p-8 text-white">
                     <div>
                        <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-1">Estimated Run-Rate</p>
                        <p className="text-5xl font-black">{item.total}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-1">Efficiency Ratio</p>
                        <p className="text-3xl font-black text-emerald-400">{item.roi}</p>
                     </div>
                  </div>
                );
              case 'tech-map':
                return (
                  <div key={idx} className="space-y-4">
                     {item.items.map((techItem: any, i: number) => (
                       <div key={i} className="flex items-center gap-6">
                          <div className="w-40 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">{techItem.layer}</div>
                          <div className="flex-1 bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between">
                             <span className="font-mono text-sm font-bold text-slate-700">{techItem.tech}</span>
                             <div className="flex gap-1">
                                <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                                <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                                <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
                );
              case 'milestone':
                return (
                  <div key={idx} className="flex items-center gap-6 mb-4">
                     <div className="w-24 text-[11px] font-black text-indigo-500 uppercase tracking-tighter">{item.date}</div>
                     <div className="flex-1 p-4 bg-slate-50 rounded-2xl border-l-4 border-l-indigo-600 font-bold text-slate-700">{item.goal}</div>
                  </div>
                );
              case 'ask':
                return (
                  <div key={idx} className="mt-8 text-center p-10 bg-gradient-to-br from-purple-500 to-indigo-700 rounded-[40px] text-white">
                     <p className="text-[11px] font-bold uppercase tracking-[0.4em] mb-4 opacity-80">Project Request</p>
                     <h3 className="text-7xl font-black mb-4">{item.amount}</h3>
                     <p className="text-xl font-medium opacity-90">{item.note}</p>
                  </div>
                );
              default: return null;
            }
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-slate-900 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none print:hidden">
        <div className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Main Interactive Slide */}
      <div className="w-full max-w-5xl aspect-video bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 z-10 print:hidden">
        <div className="h-2 w-full bg-gradient-to-r from-purple-500 via-indigo-600 to-purple-500"></div>
        <div className="px-12 py-8 flex justify-between items-center bg-slate-50/50">
          <div>
            <h4 className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.3em]">Aura Innovation Lab</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-slate-400">Section {currentSlide + 1}</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span className="text-xs font-medium text-slate-400 italic">Board Deck</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button 
               onClick={handlePrint}
               className="text-[10px] bg-white border border-slate-200 px-4 py-2 rounded-xl text-indigo-600 font-bold hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-sm active:scale-95"
             >
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
               Download PDF
             </button>
             <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20">A</div>
          </div>
        </div>

        <div className="flex-1 px-12 py-10 flex flex-col overflow-hidden">
          {renderSlideContent(slide)}
        </div>

        <div className="px-12 py-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
          <div className="flex gap-2">
            <button 
              onClick={back}
              disabled={currentSlide === 0}
              className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-300 transition-all disabled:opacity-30 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
              onClick={next}
              disabled={currentSlide === SLIDES.length - 1}
              className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700 transition-all disabled:opacity-30 shadow-lg shadow-indigo-500/20"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <div className="flex gap-1.5 items-center">
            {SLIDES.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-200'}`}></div>
            ))}
          </div>
        </div>
      </div>

      {/* 
          OFF-SCREEN PRINT AREA (Always in DOM)
          This div is what the breakout window clones.
      */}
      <div className="hidden print-area">
        {SLIDES.map((s, i) => (
          <div key={i} className="print-slide p-12 bg-white">
             <div className="flex justify-between items-center mb-8 border-b pb-4 border-slate-100">
                <div>
                   <h4 className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Aura Innovation Lab</h4>
                   <p className="text-[9px] text-slate-400">Section {i+1} of {SLIDES.length}</p>
                </div>
                <div className="text-xl font-bold text-slate-900">AURA <span className="text-indigo-600">WORKBENCH</span></div>
             </div>
             <div className="flex-1 flex flex-col min-h-0">
                {renderSlideContent(s)}
             </div>
             <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between text-[8px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                <span>Proprietary & Confidential</span>
                <span>Board Presentation Deck 2024</span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PresentationView;
