import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-20" style={{ background: '#1E293B' }}>
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] mb-4"
          style={{ color: '#71A5DE' }}>
          Start today
        </p>
        <h2 className="font-serif text-3xl font-semibold text-white md:text-4xl mb-5">
          Don't let your SIWES log fall behind.
        </h2>
        <p className="text-sm leading-relaxed mb-8"
          style={{ color: '#ffffff80' }}>
          Thousands of Nigerian interns use InternLog to stay organised,
          get supervisor approval, and submit clean reports on time.
        </p>
        <Link to="/register"
          className="inline-flex items-center gap-2 rounded-lg px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
          style={{ background: '#71A5DE' }}>
          Start your logbook — it's free
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}