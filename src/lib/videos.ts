// Videos of the making process.
// To add one: put the .mp4 in public/videos/ and fill in `src` (e.g. "/videos/drying.mp4").
// Dates are written as YYYY-MM-DD. Entries without `src` show a "video coming soon" card.

export type MakingVideo = {
  title: string;
  src?: string;
  poster?: string;
  recordedOn?: string;
  madeOn?: string;
};

export const MAKING_VIDEOS: MakingVideo[] = [
  { title: "Selecting fresh ginger & garlic" },
  { title: "Washing and peeling" },
  { title: "Slicing and drying" },
  { title: "Grinding and sieving" },
  { title: "Packing and labelling" },
];

export function formatVideoDate(date?: string) {
  if (!date) return "To be added";
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
