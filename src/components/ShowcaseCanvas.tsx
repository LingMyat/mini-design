'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  TemplateWithPages, 
  DeviceFrameType 
} from '@/lib/types';
import { ShowcaseIframe } from './ShowcaseIframe';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  Share2, 
  Check, 
  Smartphone, 
  Tablet, 
  Layers, 
  ChevronLeft, 
  ChevronRight, 
  Grid, 
  Sliders, 
  Move,
  RotateCcw,
  Sun,
  Moon
} from 'lucide-react';

interface ShowcaseCanvasProps {
  template: TemplateWithPages;
}

export function ShowcaseCanvas({ template }: ShowcaseCanvasProps) {
  const [zoom, setZoom] = useState<number>(100);
  const [viewMode, setViewMode] = useState<'canvas' | 'focus'>('canvas');
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [deviceFrame, setDeviceFrame] = useState<DeviceFrameType>(template.device_frame || 'mobile');
  const [canvasTheme, setCanvasTheme] = useState<'light' | 'dark'>('light');
  const [isCopied, setIsCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Panning state
  const [isPanning, setIsPanning] = useState(false);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isHandToolActive, setIsHandToolActive] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Dimensions based on device frame
  const getDeviceDimensions = () => {
    switch (deviceFrame) {
      case 'tablet':
        return { width: 768, height: 1024, label: 'iPad 768 × 1024' };
      case 'frameless':
        return { width: 440, height: 900, label: 'Fluid 440 × 900' };
      case 'mobile':
      default:
        return { width: 390, height: 844, label: 'iPhone 390 × 844' };
    }
  };

  const { width: frameWidth, height: frameHeight } = getDeviceDimensions();

  // Handle Share link copy
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Keyboard navigation for Focus mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode === 'focus') {
        if (e.key === 'ArrowRight' || e.key === ' ') {
          setActivePageIndex((prev) => Math.min(prev + 1, template.pages.length - 1));
        } else if (e.key === 'ArrowLeft') {
          setActivePageIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === 'Escape') {
          setViewMode('canvas');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, template.pages.length]);

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isHandToolActive || e.button === 1 || e.altKey) {
      setIsPanning(true);
      setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPanPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const resetView = () => {
    setZoom(100);
    setPanPosition({ x: 0, y: 0 });
  };

  const activePage = template.pages[activePageIndex];

  return (
    <div 
      className={`fixed inset-0 flex flex-col select-none overflow-hidden ${
        canvasTheme === 'dark' 
          ? 'bg-[#0f1117] text-zinc-100' 
          : 'bg-[#eceef2] text-zinc-800'
      }`}
    >
      {/* ============================================================== */}
      {/* TOP FIGMA-STYLE HEADER TOOLBAR */}
      {/* ============================================================== */}
      <header 
        className={`h-14 px-4 flex items-center justify-between border-b z-30 transition-colors backdrop-blur-md ${
          canvasTheme === 'dark'
            ? 'bg-[#151722]/90 border-zinc-800/80 shadow-lg shadow-black/20'
            : 'bg-white/90 border-zinc-200/90 shadow-sm'
        }`}
      >
        {/* Left: Project Branding & Details */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-indigo-500/20">
            FS
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold tracking-tight truncate max-w-[240px] sm:max-w-md">
                {template.name}
              </h1>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                canvasTheme === 'dark' 
                  ? 'bg-zinc-800 text-zinc-300 border border-zinc-700/60' 
                  : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
              }`}>
                {template.pages.length} {template.pages.length === 1 ? 'screen' : 'screens'}
              </span>
            </div>
            <span className="text-[10px] text-zinc-400">
              Figma Showcase Presentation · View Only
            </span>
          </div>
        </div>

        {/* Center: View Controls & Device Switcher */}
        <div className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-zinc-200/50 dark:bg-zinc-800/50 border border-zinc-300/40 dark:border-zinc-700/40">
          <button
            onClick={() => setViewMode('canvas')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'canvas'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Gallery Board</span>
          </button>
          <button
            onClick={() => setViewMode('focus')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'focus'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Focus Slide</span>
          </button>

          <div className="w-[1px] h-4 bg-zinc-300 dark:bg-zinc-700 mx-1" />

          {/* Device Frame Buttons */}
          <button
            onClick={() => setDeviceFrame('mobile')}
            title="Mobile (390 × 844)"
            className={`p-1.5 rounded-lg transition-all ${
              deviceFrame === 'mobile'
                ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeviceFrame('tablet')}
            title="Tablet (768 × 1024)"
            className={`p-1.5 rounded-lg transition-all ${
              deviceFrame === 'tablet'
                ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Zoom, Share, Theme, Fullscreen */}
        <div className="flex items-center gap-1.5">
          {/* Zoom Controls (Active in Canvas Mode) */}
          {viewMode === 'canvas' && (
            <div className="hidden sm:flex items-center bg-zinc-200/50 dark:bg-zinc-800/50 border border-zinc-300/40 dark:border-zinc-700/40 rounded-xl p-0.5 mr-1">
              <button
                onClick={() => setZoom((z) => Math.max(30, z - 15))}
                className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={resetView}
                className="px-2 py-1 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 rounded-lg"
                title="Reset Zoom to 100%"
              >
                {zoom}%
              </button>
              <button
                onClick={() => setZoom((z) => Math.min(200, z + 15))}
                className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsHandToolActive(!isHandToolActive)}
                className={`p-1.5 rounded-lg transition-all ${
                  isHandToolActive 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-zinc-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700'
                }`}
                title="Hand Tool (Pan Canvas)"
              >
                <Move className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Theme Switcher */}
          <button
            onClick={() => setCanvasTheme(canvasTheme === 'light' ? 'dark' : 'light')}
            className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition"
            title={canvasTheme === 'light' ? 'Switch to Dark Canvas' : 'Switch to Light Canvas'}
          >
            {canvasTheme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Share Link Button */}
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all active:scale-95 ml-1"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ============================================================== */}
      {/* MAIN VIEW AREA */}
      {/* ============================================================== */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className={`flex-1 relative overflow-auto ${
          isHandToolActive || isPanning ? 'cursor-grab active:cursor-grabbing' : ''
        }`}
        style={{
          backgroundImage: canvasTheme === 'light'
            ? 'radial-gradient(circle, #d5d8de 1px, transparent 1px)'
            : 'radial-gradient(circle, #222634 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      >
        {template.pages.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 rounded-2xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-3xl mb-4">
              📄
            </div>
            <h2 className="text-lg font-bold">No pages added to this template yet</h2>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm">
              Use the admin dashboard to add HTML showcase pages to this presentation template.
            </p>
          </div>
        ) : viewMode === 'canvas' ? (
          /* ========================================================== */
          /* 1. GALLERY / FIGMA HORIZONTAL BOARD VIEW (Matching Image)  */
          /* ========================================================== */
          <div 
            className="min-h-full min-w-max p-12 flex items-start justify-center transition-transform duration-75 origin-top-left"
            style={{
              transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoom / 100})`,
              transformOrigin: 'top left',
            }}
          >
            <div className="flex gap-10 items-start">
              {template.pages.map((page, index) => (
                <div 
                  key={page.id} 
                  className="flex flex-col group"
                  style={{ width: `${frameWidth}px` }}
                >
                  {/* Figma-style Screen Frame Title */}
                  <div className="flex items-center justify-between px-1 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-semibold text-zinc-400 dark:text-zinc-500">
                        0{index + 1}
                      </span>
                      <h3 className="text-xs font-semibold text-zinc-700 dark:text-zinc-200 tracking-tight truncate max-w-[260px]">
                        {page.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition">
                      <button
                        onClick={() => {
                          setActivePageIndex(index);
                          setViewMode('focus');
                        }}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-indigo-600 hover:text-white transition"
                        title="Open in Focus Mode"
                      >
                        Enlarge ⤢
                      </button>
                    </div>
                  </div>

                  {/* Device Screen Frame Container */}
                  <div 
                    className={`relative overflow-hidden transition-all duration-300 ${
                      deviceFrame === 'mobile'
                        ? 'rounded-[44px] ring-1 ring-black/10 dark:ring-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-[9px] border-zinc-900 bg-black'
                        : deviceFrame === 'tablet'
                        ? 'rounded-[32px] ring-1 ring-black/10 dark:ring-white/10 shadow-2xl border-[12px] border-zinc-900 bg-black'
                        : 'rounded-2xl ring-1 ring-black/10 dark:ring-white/10 shadow-2xl border-[4px] border-zinc-800 bg-black'
                    }`}
                    style={{
                      width: `${frameWidth}px`,
                      height: `${frameHeight}px`
                    }}
                  >
                    {/* iPhone Dynamic Island Simulation for Mobile */}
                    {deviceFrame === 'mobile' && (
                      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20 pointer-events-none flex items-center justify-end pr-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 ring-1 ring-zinc-800" />
                      </div>
                    )}

                    {/* Frame HTML Render */}
                    <div className="w-full h-full bg-[#0b0c16]">
                      <ShowcaseIframe htmlCode={page.html_code} title={page.name} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ========================================================== */
          /* 2. FOCUS / SINGLE SLIDE PRESENTATION MODE                  */
          /* ========================================================== */
          <div className="min-h-full flex flex-col items-center justify-between p-6">
            {/* Top Info */}
            <div className="text-center mb-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-500 font-bold">
                Screen {activePageIndex + 1} of {template.pages.length}
              </span>
              <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mt-0.5">
                {activePage?.name}
              </h2>
            </div>

            {/* Central Slide Screen */}
            <div className="relative flex items-center justify-center max-w-full">
              {/* Prev Button */}
              <button
                onClick={() => setActivePageIndex((prev) => Math.max(0, prev - 1))}
                disabled={activePageIndex === 0}
                className="absolute -left-14 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur border border-zinc-300 dark:border-zinc-700 flex items-center justify-center shadow-lg disabled:opacity-20 hover:scale-105 active:scale-95 transition z-20"
                title="Previous Screen (Left Arrow)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Device Frame */}
              <div 
                className={`relative overflow-hidden transition-all duration-300 ${
                  deviceFrame === 'mobile'
                    ? 'rounded-[46px] border-[10px] border-zinc-900 bg-black shadow-[0_30px_90px_rgba(0,0,0,0.4)] ring-1 ring-white/10'
                    : 'rounded-2xl border-[6px] border-zinc-800 bg-black shadow-2xl ring-1 ring-white/10'
                }`}
                style={{
                  width: `${frameWidth}px`,
                  height: `${frameHeight}px`
                }}
              >
                {deviceFrame === 'mobile' && (
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20 pointer-events-none" />
                )}
                <div className="w-full h-full bg-[#0b0c16]">
                  {activePage && (
                    <ShowcaseIframe htmlCode={activePage.html_code} title={activePage.name} />
                  )}
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={() => setActivePageIndex((prev) => Math.min(template.pages.length - 1, prev + 1))}
                disabled={activePageIndex === template.pages.length - 1}
                className="absolute -right-14 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur border border-zinc-300 dark:border-zinc-700 flex items-center justify-center shadow-lg disabled:opacity-20 hover:scale-105 active:scale-95 transition z-20"
                title="Next Screen (Right Arrow)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Screen Thumbnail Strip */}
            <div className="mt-6 flex items-center gap-2 overflow-x-auto max-w-full p-2 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
              {template.pages.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setActivePageIndex(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
                    activePageIndex === idx
                      ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-black/20 flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="truncate max-w-[130px]">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* BOTTOM FOOTER STATUS BAR */}
      {/* ============================================================== */}
      <footer 
        className={`h-7 px-4 flex items-center justify-between text-[11px] border-t z-20 ${
          canvasTheme === 'dark'
            ? 'bg-[#151722] border-zinc-800/80 text-zinc-400'
            : 'bg-white border-zinc-200 text-zinc-500'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Client Presentation
          </span>
          <span>·</span>
          <span>Device: {deviceFrame.toUpperCase()} ({frameWidth} × {frameHeight}px)</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Press Space or Drag to pan</span>
          <span>·</span>
          <span>Esc to exit focus</span>
        </div>
      </footer>
    </div>
  );
}
