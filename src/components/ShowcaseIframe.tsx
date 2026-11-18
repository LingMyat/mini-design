'use client';

import React, { useMemo } from 'react';

interface ShowcaseIframeProps {
  htmlCode: string;
  title: string;
  className?: string;
  scale?: number;
}

export function ShowcaseIframe({
  htmlCode,
  title,
  className = '',
}: ShowcaseIframeProps) {
  // Inject clean scrollbar, reset CSS, and touch swipe listener
  const processedHtml = useMemo(() => {
    if (!htmlCode) return '<!DOCTYPE html><html><body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:#888;">Empty Screen</body></html>';

    // Script to capture horizontal swipe gestures and notify parent window
    const swipeScript = `
      <script>
        (function() {
          var startX = 0;
          var startY = 0;
          var startTime = 0;

          window.addEventListener('touchstart', function(e) {
            if (e.touches && e.touches.length === 1) {
              startX = e.touches[0].clientX;
              startY = e.touches[0].clientY;
              startTime = Date.now();
            }
          }, { passive: true });

          window.addEventListener('touchend', function(e) {
            if (e.changedTouches && e.changedTouches.length === 1) {
              var deltaX = e.changedTouches[0].clientX - startX;
              var deltaY = e.changedTouches[0].clientY - startY;
              var elapsed = Date.now() - startTime;

              // Horizontal swipe: > 40px distance, predominantly horizontal, under 550ms
              if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2 && elapsed < 550) {
                try {
                  window.parent.postMessage({
                    type: 'SHOWCASE_SWIPE',
                    direction: deltaX < 0 ? 'next' : 'prev'
                  }, '*');
                } catch(err) {}
              }
            }
          }, { passive: true });
        })();
      </script>
    `;

    // If it's already a full HTML document, inject viewport meta if missing, smooth font rendering & styling
    if (htmlCode.includes('<html') || htmlCode.includes('<!DOCTYPE')) {
      const hasViewport = htmlCode.includes('name="viewport"') || htmlCode.includes("name='viewport'");
      const viewportMeta = hasViewport ? '' : '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
      const injectStyle = `
        ${viewportMeta}
        <style>
          /* Clean scrollbar styling */
          ::-webkit-scrollbar { width: 4px; height: 4px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: rgba(150, 150, 150, 0.3); border-radius: 4px; }
          ::-webkit-scrollbar-thumb:hover { background: rgba(150, 150, 150, 0.5); }
          * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
          html, body { min-height: 100%; margin: 0; }
        </style>
        ${swipeScript}
      `;
      if (htmlCode.includes('</head>')) {
        return htmlCode.replace('</head>', `${injectStyle}</head>`);
      }
      return `${injectStyle}${htmlCode}`;
    }

    // If raw HTML snippet, wrap in standard boilerplate with Tailwind CDN
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; box-sizing: border-box; }
          body { margin: 0; padding: 16px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
          ::-webkit-scrollbar { width: 4px; height: 4px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: rgba(150, 150, 150, 0.3); border-radius: 4px; }
        </style>
        ${swipeScript}
      </head>
      <body>
        ${htmlCode}
      </body>
      </html>
    `;
  }, [htmlCode]);

  return (
    <iframe
      srcDoc={processedHtml}
      title={title}
      className={`w-full h-full border-0 bg-transparent ${className}`}
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      loading="lazy"
    />
  );
}
