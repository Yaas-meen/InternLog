const steps = [
  {
    number: '01',
    title:  'Register as an intern',
    desc:   'Create your free account using your student email and department. No credit card required.',
  },
  {
    number: '02',
    title:  'Log your daily tasks',
    desc:   'Each day, write what you did, how many hours you worked, and upload a photo if you use a physical logbook.',
  },
  {
    number: '03',
    title:  'Get your supervisor to review',
    desc:   'Share your login link with your supervisor. They review entries, leave remarks, and mark them verified.',
  },
  {
    number: '04',
    title:  'Download your report',
    desc:   'Generate a professional PDF report for weekly or monthly review. Submit it to your institution in seconds.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20" style={{ background: '#F8F9FB' }}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <p className="font-mono text-xs uppercase tracking-[0.2em] mb-3"
            style={{ color: '#71A5DE' }}>
            Simple process
          </p>
          <h2 className="font-serif text-3xl font-semibold md:text-4xl"
            style={{ color: '#1E293B' }}>
            Up and running in minutes
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ number, title, desc }) => (
            <div key={number} className="relative">
              <div className="mb-4 font-mono text-4xl font-bold"
                style={{ color: '#71A5DE' }}>
                {number}
              </div>
              <h3 className="font-semibold mb-2 text-base"
                style={{ color: '#1E293B' }}>
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}