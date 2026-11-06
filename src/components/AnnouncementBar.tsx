export default function AnnouncementBar({ text }: { text: string }) {
  return (
    <div className="bg-brand-forest px-4 py-2 text-center text-xs font-medium tracking-wide text-brand-ivory sm:text-sm">
      <p className="mx-auto max-w-5xl truncate">{text}</p>
    </div>
  );
}
