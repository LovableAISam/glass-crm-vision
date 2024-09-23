import { useEffect, useRef, useState } from "react";

const COPIED_TIMEOUT = 3000;

function useCopyToClipboard(text: string) {
  const [copied, setCopied] = useState(false);

  const timeoutId = useRef<any>(null!);

  useEffect(() => {
    if (copied) {
      timeoutId.current = setTimeout(() => setCopied(false), COPIED_TIMEOUT);
    }

    return () => {
      clearTimeout(timeoutId.current);
    };
  }, [copied]);

  const handleCopy = (callback?: () => void) => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    setCopied(true);

    if (typeof callback === 'function') {
      callback();
    }
  };

  return {
    copied,
    handleCopy
  }
}

export default useCopyToClipboard;