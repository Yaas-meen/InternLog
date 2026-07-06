import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const plans = [
  {
    name:     'Free',
    price:    '₦0',
    period:   'forever',
    desc:     'Everything a SIWES student needs.',
    features: [
      'Unlimited daily log entries',
      'Weekly & monthly PDF reports',
      'AI-powered weekly summary',
      'Supervisor review portal',
      'Image upload & OCR scanning',
    ],
    cta:     'Get started free',
    href:    '/register',
    primary: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <p className="font-mono text-xs uppercase tracking-[0.2em] mb-3"
            style={{ color: '#71A5DE' }}>
            Pricing
          </p>
          <h2 className="font-serif text-3xl font-semibold md:text-4xl"
            style={{ color: '#1E293B' }}>
            Free for every Nigerian student
          </h2>
          <p className="mt-4 text-sm" style={{ color: '#64748B' }}>
            No hidden fees. No credit card. Just your logbook.
          </p>
        </div>

        <div className="mx-auto max-w-md">
          {plans.map(({ name, price, period, desc, features, cta, href }) => (
            <div key={name}
              className="rounded-2xl border-2 p-8 text-center shadow-lg"
              style={{ borderColor: '#71A5DE', background: '#F8F9FB' }}>

              <p className="font-mono text-xs uppercase tracking-widest mb-3"
                style={{ color: '#71A5DE' }}>
                {name}
              </p>

              <div className="mb-2">
                <span className="font-serif text-5xl font-bold"
                  style={{ color: '#1E293B' }}>
                  {price}
                </span>
                <span className="text-sm ml-2" style={{ color: '#64748B' }}>
                  / {period}
                </span>
              </div>

              <p className="text-sm mb-8" style={{ color: '#64748B' }}>{desc}</p>

              <ul className="space-y-3 mb-8 text-left">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm"
                    style={{ color: '#1E293B' }}>
                    <Check size={16} style={{ color: '#71A5DE', flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link to={href}
                className="block w-full py-3 rounded-lg text-sm font-semibold text-white text-center transition hover:-translate-y-0.5"
                style={{ background: '#71A5DE' }}>
                {cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}