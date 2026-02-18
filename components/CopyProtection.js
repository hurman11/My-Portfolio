'use client';

import { useEffect } from 'react';

export default function CopyProtection() {
    useEffect(() => {
        const preventContext = (e) => e.preventDefault();
        const preventCopy = (e) => e.preventDefault();
        const preventCut = (e) => e.preventDefault();
        const preventKeydown = (e) => {
            if (e.ctrlKey && (e.key === 'u' || e.key === 'c' || e.key === 'a')) {
                e.preventDefault();
            }
        };

        document.addEventListener('contextmenu', preventContext);
        document.addEventListener('copy', preventCopy);
        document.addEventListener('cut', preventCut);
        document.addEventListener('keydown', preventKeydown);

        return () => {
            document.removeEventListener('contextmenu', preventContext);
            document.removeEventListener('copy', preventCopy);
            document.removeEventListener('cut', preventCut);
            document.removeEventListener('keydown', preventKeydown);
        };
    }, []);

    return null;
}
