import { useEffect, useState } from "react";

const getScrollProgress = () => {
  const doc = document.documentElement;
  const scrollTop = doc.scrollTop || document.body.scrollTop;
  const scrollHeight = doc.scrollHeight - doc.clientHeight;
  if (scrollHeight <= 0) return 0;
  return Math.min(Math.max(scrollTop / scrollHeight, 0), 1);
};

export const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handle = () => setProgress(getScrollProgress());
    handle();
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return progress;
};
