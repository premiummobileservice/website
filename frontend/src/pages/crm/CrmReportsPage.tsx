import React from 'react';
import { Download, TrendingUp, Filter, Users, CheckCircle2, Clock, Smartphone } from 'lucide-react';

export const CrmReportsPage: React.FC = () => {
  const exportCsv = () => {
    const rows = [
      ['Ref Code', 'Date', 'Customer Name', 'Phone', 'Device', 'Issue', 'Area', 'Status', 'Quotation', 'Source'],
      ['PMR-849201', '2025-01-18', 'Aditya Rao', '9880011223', 'iPhone 13 Pro', 'Screen Replacement', 'Koramangala', 'in_repair', '4500', 'Website'],
      ['PMR-719302', '2025-01-19', 'Pooja Hegde', '9845022334', 'Samsung S22 Ultra', 'Battery Replacement', 'Indiranagar', 'approved', '2800', 'Google Ads'],
      ['PMR-619283', '2025-01-19', 'Rohan Mehta', '9900112233', 'MacBook Air M1', 'Charging Port', 'Whitefield', 'completed', '3500', 'Organic'],
      ['PMR-519284', '2025-01-20', 'Deepa Nair', '9886012345', 'OnePlus 11', 'Water Damage', 'HSR Layout', 'completed', '4200', 'Website'],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PMR_Bangalore_Operations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Reports & Performance Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Conversion funnel, marketing source attribution, and technician workload
          </p>
        </div>

        <button
          onClick={exportCsv}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Operations CSV</span>
        </button>
      </div>

      {/* Funnel Overview */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-4">6-Step Conversion Funnel</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { step: '1. Enquiries', count: 142, rate: '100%' },
            { step: '2. Contacted', count: 135, rate: '95%' },
            { step: '3. Collected', count: 118, rate: '83%' },
            { step: '4. Diagnosed', count: 114, rate: '80%' },
            { step: '5. Approved', count: 98, rate: '69%' },
            { step: '6. Completed', count: 94, rate: '66%' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                {item.step}
              </span>
              <div className="text-2xl font-extrabold text-white">{item.count}</div>
              <span className="text-[11px] text-cyan-400 font-mono font-bold mt-1 block">
                {item.rate}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Sources and Turnaround */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Marketing Attribution */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <h3 className="text-sm font-bold text-white mb-4">Enquiry Sources Breakdown</h3>
          <div className="space-y-3">
            {[
              { source: 'Website Direct Booking', count: 68, pct: 48, color: 'bg-cyan-500' },
              { source: 'Google Ads (Search & Maps)', count: 42, pct: 30, color: 'bg-teal-500' },
              { source: 'Organic Search (Bangalore)', count: 20, pct: 14, color: 'bg-blue-500' },
              { source: 'Customer Referrals', count: 12, pct: 8, color: 'bg-purple-500' },
            ].map((src, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">{src.source}</span>
                  <span className="font-mono text-white font-semibold">
                    {src.count} ({src.pct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div className={`h-full rounded-full ${src.color}`} style={{ width: `${src.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Turnaround by Bangalore Hub */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <h3 className="text-sm font-bold text-white mb-4">Bangalore Hub Logistics Turnaround</h3>
          <div className="space-y-3">
            {[
              { zone: 'Koramangala & HSR (South Hub)', avg: '22 Hours Average Handover', onTime: '96%' },
              { zone: 'Indiranagar & CBD (East Hub)', avg: '18 Hours Average Handover', onTime: '98%' },
              { zone: 'Whitefield & Bellandur (Tech Corridor)', avg: '28 Hours Average Handover', onTime: '92%' },
              { zone: 'Jayanagar & BTM (Heritage Zone)', avg: '24 Hours Average Handover', onTime: '94%' },
            ].map((hub, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-white">{hub.zone}</div>
                  <div className="text-slate-400 text-[11px]">{hub.avg}</div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-400">{hub.onTime}</span>
                  <div className="text-[10px] text-slate-500">On-Time SLA</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
