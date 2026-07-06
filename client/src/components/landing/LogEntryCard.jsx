import { Check, FileCheck2 } from 'lucide-react';

export default function LogEntryCard() {
  return (
    <div className="relative">
      {/* Perforated edge */}
      <div className="absolute -left-3 top-6 bottom-6 hidden w-3 sm:block"
        style={{
          backgroundImage: 'radial-gradient(circle, transparent 3px, #F8F9FB 3.5px)',
          backgroundSize:  '12px 16px',
        }} aria-hidden />

      <div className="relative w-full max-w-sm rounded-xl border bg-white p-6 shadow-xl"
        style={{ borderColor: '#1E293B15' }}>

        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest"
              style={{ color: '#1E293B70' }}>
              Day 084 · Week 12
            </p>
            <h3 className="mt-1 font-serif text-xl font-semibold"
              style={{ color: '#1E293B' }}>
              Tue, 14 Oct
            </h3>
          </div>
          <div className="-rotate-6 rounded border-2 px-2 py-1 text-[10px] font-bold uppercase tracking-wider"
            style={{ borderColor: '#71A5DE', color: '#71A5DE' }}>
            Verified
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed" style={{ color: '#1E293BB3' }}>
          Configured the JWT refresh-token flow for the internal auth service
          and paired with a teammate to test edge cases.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {['Node.js', 'Auth', 'Testing'].map((tag) => (
            <span key={tag} className="rounded-full px-3 py-1 text-xs font-medium"
              style={{ background: '#F8F9FB', color: '#1E293BB3' }}>
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-dashed pt-4 text-xs font-medium"
          style={{ borderColor: '#1E293B25', color: '#71A5DE' }}>
          <FileCheck2 size={14} />
          Included in this week's report
        </div>
      </div>

      {/* Badge */}
      <div className="absolute -top-4 -right-3 sm:-right-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-white shadow-lg"
        style={{ background: '#1E293B' }}>
        <Check size={12} />
        Entry saved
      </div>
    </div>
  );
}