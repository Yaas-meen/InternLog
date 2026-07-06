import { BookOpen, FileText, Camera, Zap, Shield, Download } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title:       'Daily Log Entries',
    description: 'Write your daily tasks in a clean, structured format. Each entry is timestamped and saved to your personal logbook.',
    color:       '#71A5DE',
    bg:          '#EF4FF',
  },
  {
    icon: Camera,
    title:       'Scan Physical Logbooks',
    description: 'Take a photo of your handwritten logbook page. Our AI reads and extracts the text automatically.',
    color:       '#71A5DE',
    bg:          '#EBF4FF',
  },
  {
    icon: FileText,
    title:       'Weekly & Monthly Reports',
    description: 'Generate professional PDF reports grouped by week or month, ready for supervisor review and submission.',
    color:       '#71A5DE',
    bg:          '#DBEAFE',
  },
  {
    icon: Zap,
    title:       'AI-Powered Summaries',
    description:  `Get an AI-written professional summary of your week's activities — no writing skills required.`,
    color:       '#71A5DE',
    bg:          '#DBEAFE',
  },
  {
    icon: Shield,
    title:       'Supervisor Review',
    description: 'Your supervisor logs in to review, leave remarks, and mark entries as verified — all in one place.',
    color:       '#1E293B',
    bg:          '#E2E8F0',
  },
  {
    icon: Download,
    title:       'PDF Export',
    description: 'Download your complete logbook as a formatted PDF at any time. Share with your institution instantly.',
    color:       '#1E293B',
    bg:          '#E2E8F0',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <p className="font-mono text-xs uppercase tracking-[0.2em] mb-3"
            style={{ color: '#71A5DE' }}>
            Everything you need
          </p>
          <h2 className="font-serif text-3xl font-semibold md:text-4xl"
            style={{ color: '#1E293B' }}>
            Your entire SIWES journey, organised
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description, color, bg }) => (
            <div key={title}
              className="rounded-xl border p-6 transition hover:-translate-y-1 hover:shadow-md"
              style={{ borderColor: '#E2E8F0' }}>
              <div className="mb-4 inline-flex rounded-lg p-2.5"
                style={{ background: bg }}>
                <Icon size={20} style={{ color }} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#1E293B' }}>
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}