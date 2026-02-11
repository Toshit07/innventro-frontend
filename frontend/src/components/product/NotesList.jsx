import { motion } from "framer-motion";

const NoteBlock = ({ title, notes, delayOffset = 0 }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
    <p className="text-xs uppercase tracking-[0.3em] text-gold/70">{title}</p>
    <ul className="mt-3 flex flex-wrap gap-2">
      {notes.map((note, index) => (
        <motion.li
          key={`${title}-${note}`}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: delayOffset + index * 0.2 }}
        >
          {note}
        </motion.li>
      ))}
    </ul>
  </div>
);

const NotesList = ({ notes }) => (
  <div className="grid gap-4 md:grid-cols-3">
    <NoteBlock title="Top" notes={notes.top} delayOffset={0} />
    <NoteBlock title="Middle" notes={notes.middle} delayOffset={0.2} />
    <NoteBlock title="Base" notes={notes.base} delayOffset={0.4} />
  </div>
);

export default NotesList;
