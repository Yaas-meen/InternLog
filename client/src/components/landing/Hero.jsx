import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import LogEntryCard from './LogEntryCard';

export default function Hero() {
  return (
    <section id="top" style={{ background: '#F8F9FB', overflow: 'hidden' }}>
      <div className="mx-auto grid max-w-6xl items-center gap-16 px-6 py-20 md:grid-cols-2 md:py-28">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em]"
            style={{ color: '#71A5DE' }}>
            Built for Nigerian SIWES students
          </p>

            <h1 className="text-5xl font-bold leading-tight mb-6"
              style={{ color: '#1E293B' }}>
              Your{' '}
              <span style={{
                background:            'linear-gradient(135deg, #71A5DE, #83B0E1)',
                WebkitBackgroundClip:  'text',
                WebkitTextFillColor:   'transparent',
                backgroundClip:        'text',
              }}>
                SIWES Journey
              </span>
              <br />Simplified
            </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed"
            style={{ color: '#1E293BB3' }}>
            Write your daily entry in under two minutes, even without data.
            InternLog turns six months of logs into a report that's ready
            for submission.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/register"
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5"
              style={{ background: '#71A5DE' }}>
              Start your logbook
              <ArrowRight size={16} />
            </Link>
            <a href="#how-it-works"
              className="text-sm font-semibold underline underline-offset-4 transition"
              style={{ color: '#1E293B', textDecorationColor: '#1E293B50' }}>
              See how it works
            </a>
          </div>

          <p className="mt-6 text-xs" style={{ color: '#1E293B80' }}>
            Free for every student · No card required · Works without internet
          </p>
        </div>

        <div className="flex justify-center md:justify-end">
          <LogEntryCard />
        </div>
      </div>
    </section>
  );
}