'use client';

import React, { useState, useEffect } from 'react';
import { 
  Template, 
  ShowcasePage, 
  TemplateWithPages, 
  DeviceFrameType 
} from '@/lib/types';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Copy, 
  Check, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  Database, 
  Layers, 
  Sparkles, 
  RefreshCw,
  X,
  FileCode,
  CheckCircle2,
  Sun,
  Moon
} from 'lucide-react';
import { ShowcaseIframe } from '@/components/ShowcaseIframe';
import { samplePagesHtml, generateRandomToken, slugify } from '@/lib/sample-data';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function AdminPage() {
  const [adminTheme, setAdminTheme] = useState<'light' | 'dark'>('dark');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [selectedTemplateWithPages, setSelectedTemplateWithPages] = useState<TemplateWithPages | null>(null);
  const [loadingPages, setLoadingPages] = useState(false);

  // Modals & Panels
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [templateForm, setTemplateForm] = useState<{
    id?: string;
    name: string;
    slug: string;
    token: string;
    device_frame: DeviceFrameType;
  }>({
    name: '',
    slug: '',
    token: generateRandomToken(25),
    device_frame: 'mobile'
  });

  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [pageForm, setPageForm] = useState<{
    name: string;
    html_code: string;
  }>({
    name: '',
    html_code: ''
  });

  const [previewPage, setPreviewPage] = useState<ShowcasePage | null>(null);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [copiedLinkIndex, setCopiedLinkIndex] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Initialize theme from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('html_showcase_admin_theme');
      if (saved === 'light' || saved === 'dark') {
        setAdminTheme(saved);
      }
    }
  }, []);

  const toggleTheme = () => {
    const next = adminTheme === 'dark' ? 'light' : 'dark';
    setAdminTheme(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('html_showcase_admin_theme', next);
    }
  };

  // Show temporary feedback toast
  const showToast = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3000);
  };

  // 1. Load Templates
  const loadTemplates = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/templates');
      const data = await res.json();
      if (Array.isArray(data)) {
        setTemplates(data);
        if (data.length > 0 && !selectedTemplateId) {
          setSelectedTemplateId(data[0].id);
        }
      }
    } catch (e) {
      console.error('Failed to load templates:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  // 2. Load Selected Template Pages
  const loadTemplatePages = async (templateId: string) => {
    try {
      setLoadingPages(true);
      const res = await fetch(`/api/templates/${templateId}`);
      const data = await res.json();
      if (data && data.id) {
        setSelectedTemplateWithPages(data);
      }
    } catch (e) {
      console.error('Failed to load template pages:', e);
    } finally {
      setLoadingPages(false);
    }
  };

  useEffect(() => {
    if (selectedTemplateId) {
      loadTemplatePages(selectedTemplateId);
    } else {
      setSelectedTemplateWithPages(null);
    }
  }, [selectedTemplateId]);

  // 3. Template CRUD
  const handleOpenCreateTemplate = () => {
    setTemplateForm({
      name: '',
      slug: '',
      token: generateRandomToken(25),
      device_frame: 'mobile'
    });
    setIsTemplateModalOpen(true);
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateForm.name.trim()) return;

    try {
      const isEdit = Boolean(templateForm.id);
      const url = isEdit ? `/api/templates/${templateForm.id}` : '/api/templates';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: templateForm.name,
          slug: templateForm.slug || slugify(templateForm.name),
          device_frame: templateForm.device_frame
        })
      });

      const saved = await res.json();
      if (saved && saved.id) {
        setIsTemplateModalOpen(false);
        showToast(isEdit ? 'Template updated successfully!' : 'New template created!');
        await loadTemplates();
        setSelectedTemplateId(saved.id);
      }
    } catch (e) {
      console.error('Failed to save template:', e);
    }
  };

  const handleDeleteTemplate = async (templateId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete template "${name}" and all its pages?`)) return;

    try {
      const res = await fetch(`/api/templates/${templateId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Template deleted');
        if (selectedTemplateId === templateId) {
          setSelectedTemplateId(null);
        }
        await loadTemplates();
      }
    } catch (e) {
      console.error('Failed to delete template:', e);
    }
  };

  // 4. Page CRUD
  const handleOpenAddPage = () => {
    setEditingPageId(null);
    setPageForm({
      name: '',
      html_code: samplePagesHtml[0].html_code
    });
    setIsPageModalOpen(true);
  };

  const handleOpenEditPage = (page: ShowcasePage) => {
    setEditingPageId(page.id);
    setPageForm({
      name: page.name,
      html_code: page.html_code
    });
    setIsPageModalOpen(true);
  };

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplateId || !pageForm.name.trim() || !pageForm.html_code.trim()) return;

    try {
      const isEdit = Boolean(editingPageId);
      const url = isEdit 
        ? `/api/templates/${selectedTemplateId}/pages/${editingPageId}`
        : `/api/templates/${selectedTemplateId}/pages`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageForm)
      });

      if (res.ok) {
        setIsPageModalOpen(false);
        showToast(isEdit ? 'Page updated successfully!' : 'Page added to template!');
        await loadTemplatePages(selectedTemplateId);
        await loadTemplates();
      }
    } catch (e) {
      console.error('Failed to save page:', e);
    }
  };

  const handleDeletePage = async (pageId: string, pageName: string) => {
    if (!selectedTemplateId) return;
    if (!confirm(`Delete page "${pageName}"?`)) return;

    try {
      const res = await fetch(`/api/templates/${selectedTemplateId}/pages/${pageId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showToast('Page removed');
        await loadTemplatePages(selectedTemplateId);
        await loadTemplates();
      }
    } catch (e) {
      console.error('Failed to delete page:', e);
    }
  };

  // 5. Page Sorting (Up / Down)
  const handleMovePage = async (currentIndex: number, direction: 'up' | 'down') => {
    if (!selectedTemplateWithPages) return;
    const pages = [...selectedTemplateWithPages.pages];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= pages.length) return;

    // Swap
    const temp = pages[currentIndex];
    pages[currentIndex] = pages[targetIndex];
    pages[targetIndex] = temp;

    // Optimistic UI update
    setSelectedTemplateWithPages({
      ...selectedTemplateWithPages,
      pages
    });

    try {
      const orderedPageIds = pages.map(p => p.id);
      await fetch(`/api/templates/${selectedTemplateWithPages.id}/pages`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedPageIds })
      });
      showToast('Page order updated');
    } catch (e) {
      console.error('Failed to reorder pages:', e);
      loadTemplatePages(selectedTemplateWithPages.id);
    }
  };

  // Helper to copy public link
  const copyPublicUrl = (slug: string, token: string, id: string) => {
    if (typeof window !== 'undefined') {
      const fullUrl = `${window.location.origin}/${slug}/${token}`;
      navigator.clipboard.writeText(fullUrl);
      setCopiedLinkIndex(id);
      setTimeout(() => setCopiedLinkIndex(null), 2000);
      showToast('Public showcase link copied to clipboard!');
    }
  };

  const getPublicUrl = (slug: string, token: string) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/${slug}/${token}`;
    }
    return `/${slug}/${token}`;
  };

  // Seed sample data
  const handleSeedData = async () => {
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      if (res.ok) {
        showToast('Sample presentation template loaded!');
        await loadTemplates();
      }
    } catch (e) {
      console.error('Failed to seed:', e);
    }
  };

  const isLight = adminTheme === 'light';

  const sqlSchemaText = `-- HTML Showcase Supabase Tables
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  token VARCHAR(25) NOT NULL UNIQUE,
  device_frame TEXT DEFAULT 'mobile',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  html_code TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public templates" ON templates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public pages" ON pages FOR ALL USING (true) WITH CHECK (true);`;

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-200 ${
      isLight ? 'bg-[#f4f5f8] text-zinc-900' : 'bg-zinc-950 text-zinc-100'
    }`}>
      {/* ============================================================== */}
      {/* TOAST NOTIFICATION */}
      {/* ============================================================== */}
      {actionMessage && (
        <div className="fixed top-5 right-5 z-50 bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* ADMIN HEADER */}
      {/* ============================================================== */}
      <header className={`border-b px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 transition-colors ${
        isLight
          ? 'border-zinc-200 bg-white/95 text-zinc-900 shadow-xs'
          : 'border-zinc-800/80 bg-zinc-900/90 text-white backdrop-blur'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-black text-sm text-white shadow-lg shadow-indigo-500/20">
            FS
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-base font-bold tracking-tight">
                HTML Showcase Admin
              </h1>
              <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border ${
                isLight 
                  ? 'bg-zinc-100 text-zinc-600 border-zinc-200' 
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700/50'
              }`}>
                Secret Console
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Create templates, manage HTML pages, and generate client public presentation links.
            </p>
          </div>
        </div>

        {/* Database Status & Actions */}
        <div className="flex items-center gap-2.5">
          {/* Light / Dark Mode Switcher */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
              isLight
                ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-300'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
            }`}
            title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {isLight ? (
              <>
                <Moon className="w-3.5 h-3.5 text-zinc-600" />
                <span>Dark Mode</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Light Mode</span>
              </>
            )}
          </button>

          {/* Supabase Status Indicator */}
          <button
            onClick={() => setIsSqlModalOpen(true)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
              isSupabaseConfigured
                ? isLight
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                  : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/70'
                : isLight
                  ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                  : 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-950/70'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>
              {isSupabaseConfigured ? 'Supabase Connected' : 'Local Storage Mode'}
            </span>
            <span className="text-[10px] opacity-70 underline">SQL Schema</span>
          </button>

          {/* Seed Demo Button */}
          <button
            onClick={handleSeedData}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
              isLight
                ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-300'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
            }`}
            title="Load sample screens"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Load Sample Screens</span>
          </button>

          {/* New Template Button */}
          <button
            onClick={handleOpenCreateTemplate}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Template</span>
          </button>
        </div>
      </header>

      {/* ============================================================== */}
      {/* MAIN TWO-COLUMN WORKSPACE */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* ------------------------------------------------------------ */}
        {/* LEFT COLUMN: TEMPLATES LIST */}
        {/* ------------------------------------------------------------ */}
        <div className={`w-full lg:w-96 border-b lg:border-b-0 lg:border-r p-4 overflow-y-auto flex flex-col gap-3 transition-colors ${
          isLight ? 'border-zinc-200 bg-white' : 'border-zinc-800/80 bg-zinc-900/40'
        }`}>
          <div className="flex items-center justify-between px-1">
            <h2 className={`text-xs font-bold uppercase tracking-wider ${
              isLight ? 'text-zinc-500' : 'text-zinc-400'
            }`}>
              Templates ({templates.length})
            </h2>
            <button
              onClick={loadTemplates}
              className={`p-1 transition ${isLight ? 'text-zinc-500 hover:text-zinc-800' : 'text-zinc-400 hover:text-white'}`}
              title="Refresh templates"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className={`p-8 text-center text-xs ${isLight ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Loading templates...
            </div>
          ) : templates.length === 0 ? (
            <div className={`p-6 text-center border border-dashed rounded-2xl ${
              isLight ? 'border-zinc-300 bg-zinc-50' : 'border-zinc-800 bg-zinc-900/30'
            }`}>
              <Layers className={`w-8 h-8 mx-auto mb-2 ${isLight ? 'text-zinc-400' : 'text-zinc-600'}`} />
              <p className={`text-xs font-semibold ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>No templates created</p>
              <p className={`text-[11px] mt-1 ${isLight ? 'text-zinc-500' : 'text-zinc-500'}`}>
                Click "+ Create Template" above or load sample screens to start.
              </p>
            </div>
          ) : (
            templates.map((tpl) => {
              const isSelected = tpl.id === selectedTemplateId;
              const publicLink = getPublicUrl(tpl.slug, tpl.token);

              return (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplateId(tpl.id)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer text-left ${
                    isSelected
                      ? isLight
                        ? 'bg-indigo-50/90 border-indigo-400 shadow-sm shadow-indigo-100'
                        : 'bg-indigo-950/30 border-indigo-500/60 shadow-lg shadow-indigo-950/50'
                      : isLight
                        ? 'bg-zinc-50/80 border-zinc-200 hover:border-zinc-300'
                        : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className={`text-sm font-bold leading-snug ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                        {tpl.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                          isLight ? 'bg-zinc-200/70 text-zinc-700' : 'bg-zinc-800/80 text-zinc-400'
                        }`}>
                          /{tpl.slug}
                        </span>
                        <span className="text-[10px] font-semibold text-indigo-500">
                          {tpl.pages_count || 0} pages
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTemplate(tpl.id, tpl.name);
                      }}
                      className={`p-1.5 rounded-lg transition ${
                        isLight ? 'text-zinc-400 hover:text-red-500 hover:bg-zinc-200' : 'text-zinc-500 hover:text-red-400 hover:bg-zinc-800'
                      }`}
                      title="Delete template"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Public Link Box */}
                  <div className={`mt-3 pt-2.5 border-t flex items-center justify-between gap-2 ${
                    isLight ? 'border-zinc-200' : 'border-zinc-800/60'
                  }`}>
                    <span className={`text-[10px] truncate max-w-[190px] ${
                      isLight ? 'text-zinc-500' : 'text-zinc-400'
                    }`}>
                      {publicLink}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyPublicUrl(tpl.slug, tpl.token, tpl.id);
                        }}
                        className={`p-1.5 rounded-lg transition ${
                          isLight ? 'bg-zinc-200/80 hover:bg-zinc-300 text-zinc-700' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white'
                        }`}
                        title="Copy Public Link"
                      >
                        {copiedLinkIndex === tpl.id ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                      <a
                        href={`/${tpl.slug}/${tpl.token}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-600 dark:text-indigo-300 hover:text-white transition"
                        title="Open Public Showcase"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ------------------------------------------------------------ */}
        {/* RIGHT COLUMN: TEMPLATE PAGES MANAGER & REORDERING           */}
        {/* ------------------------------------------------------------ */}
        <div className={`flex-1 p-6 overflow-y-auto transition-colors ${
          isLight ? 'bg-[#f4f5f8]' : 'bg-zinc-950'
        }`}>
          {!selectedTemplateWithPages ? (
            <div className={`h-full flex flex-col items-center justify-center text-center p-8 ${
              isLight ? 'text-zinc-400' : 'text-zinc-500'
            }`}>
              <Layers className={`w-12 h-12 mb-3 ${isLight ? 'text-zinc-300' : 'text-zinc-700'}`} />
              <p className={`text-sm font-semibold ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>Select a template to manage its pages</p>
              <p className={`text-xs mt-1 ${isLight ? 'text-zinc-400' : 'text-zinc-600'}`}>Or create a new template from the top bar.</p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Selected Template Header Card */}
              <div className={`border rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900/80 border-zinc-800'
              }`}>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className={`text-xl font-black ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                      {selectedTemplateWithPages.name}
                    </h2>
                    <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${
                      isLight ? 'bg-zinc-100 text-zinc-600 border-zinc-200' : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                    }`}>
                      Frame: {selectedTemplateWithPages.device_frame}
                    </span>
                  </div>
                  <div className={`flex items-center gap-3 text-xs mt-1.5 ${
                    isLight ? 'text-zinc-500' : 'text-zinc-400'
                  }`}>
                    <span>Token: <code className="text-indigo-500 font-mono font-semibold">{selectedTemplateWithPages.token}</code></span>
                    <span>·</span>
                    <span>{selectedTemplateWithPages.pages.length} screens added</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`/${selectedTemplateWithPages.slug}/${selectedTemplateWithPages.token}`}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                      isLight
                        ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-300'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
                    }`}
                  >
                    <span>View Public Presentation</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={handleOpenAddPage}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add HTML Page</span>
                  </button>
                </div>
              </div>

              {/* Pages List with Sorting */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className={`text-xs font-bold uppercase tracking-wider ${
                    isLight ? 'text-zinc-500' : 'text-zinc-400'
                  }`}>
                    Template Pages ({selectedTemplateWithPages.pages.length})
                  </h3>
                  <span className={`text-[11px] ${isLight ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    Use Up/Down arrows to sort page sequence in presentation
                  </span>
                </div>

                {loadingPages ? (
                  <div className={`p-8 text-center text-xs ${isLight ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    Loading pages...
                  </div>
                ) : selectedTemplateWithPages.pages.length === 0 ? (
                  <div className={`border border-dashed rounded-2xl p-10 text-center ${
                    isLight ? 'border-zinc-300 bg-white' : 'border-zinc-800/80 bg-zinc-900/20'
                  }`}>
                    <FileCode className={`w-10 h-10 mx-auto mb-2 ${isLight ? 'text-zinc-400' : 'text-zinc-600'}`} />
                    <h4 className={`text-sm font-bold ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>No pages in this template yet</h4>
                    <p className={`text-xs mt-1 max-w-sm mx-auto ${isLight ? 'text-zinc-500' : 'text-zinc-500'}`}>
                      Click "+ Add HTML Page" to paste your HTML code and give it a screen name.
                    </p>
                    <button
                      onClick={handleOpenAddPage}
                      className="mt-4 inline-flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add First Page
                    </button>
                  </div>
                ) : (
                  selectedTemplateWithPages.pages.map((page, index) => (
                    <div
                      key={page.id}
                      className={`border rounded-2xl p-4 flex items-center justify-between gap-4 transition shadow-xs ${
                        isLight
                          ? 'bg-white border-zinc-200 hover:border-zinc-300'
                          : 'bg-zinc-900/70 border-zinc-800/80 hover:border-zinc-700/80 text-white'
                      }`}
                    >
                      {/* Left: Reorder arrows & index */}
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleMovePage(index, 'up')}
                            disabled={index === 0}
                            className={`p-1 rounded transition disabled:opacity-20 ${
                              isLight ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white'
                            }`}
                            title="Move Page Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleMovePage(index, 'down')}
                            disabled={index === selectedTemplateWithPages.pages.length - 1}
                            className={`p-1 rounded transition disabled:opacity-20 ${
                              isLight ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white'
                            }`}
                            title="Move Page Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>

                        <span className={`w-7 h-7 rounded-lg border flex items-center justify-center font-mono text-xs font-bold ${
                          isLight 
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-600' 
                            : 'bg-zinc-800 border-zinc-700/60 text-indigo-400'
                        }`}>
                          {index + 1}
                        </span>

                        <div>
                          <h4 className={`text-sm font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                            {page.name}
                          </h4>
                          <span className={`text-[11px] font-mono ${isLight ? 'text-zinc-400' : 'text-zinc-500'}`}>
                            {(page.html_code.length / 1024).toFixed(1)} KB HTML
                          </span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPreviewPage(page)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                            isLight
                              ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200'
                              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border-zinc-700'
                          }`}
                          title="Preview HTML"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </button>

                        <button
                          onClick={() => handleOpenEditPage(page)}
                          className={`p-2 rounded-xl border transition ${
                            isLight
                              ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200'
                              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border-zinc-700'
                          }`}
                          title="Edit page HTML"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeletePage(page.id, page.name)}
                          className={`p-2 rounded-xl border transition ${
                            isLight
                              ? 'bg-zinc-100 hover:bg-red-50 text-zinc-500 hover:text-red-600 border-zinc-200 hover:border-red-200'
                              : 'bg-zinc-800 hover:bg-red-950/80 text-zinc-400 hover:text-red-400 border-zinc-700'
                          }`}
                          title="Delete page"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL: CREATE / EDIT TEMPLATE                                  */}
      {/* ============================================================== */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`border rounded-3xl p-6 w-full max-w-md shadow-2xl text-left animate-in zoom-in-95 ${
            isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-zinc-900 border-zinc-800 text-white'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold">
                {templateForm.id ? 'Edit Template' : 'Create New Template'}
              </h3>
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                className={`p-1 ${isLight ? 'text-zinc-400 hover:text-zinc-700' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTemplate} className="space-y-4">
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                  Template Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mobile Banking App Redesign"
                  value={templateForm.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setTemplateForm({
                      ...templateForm,
                      name,
                      slug: templateForm.slug ? templateForm.slug : slugify(name)
                    });
                  }}
                  className={`w-full rounded-xl px-3.5 py-2 text-sm border focus:outline-hidden focus:ring-2 focus:ring-indigo-500 ${
                    isLight 
                      ? 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder-zinc-400' 
                      : 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                  URL Slug
                </label>
                <input
                  type="text"
                  placeholder="e.g. mobile-banking-app"
                  value={templateForm.slug}
                  onChange={(e) => setTemplateForm({ ...templateForm, slug: slugify(e.target.value) })}
                  className={`w-full rounded-xl px-3.5 py-2 text-sm font-mono border focus:outline-hidden focus:ring-2 focus:ring-indigo-500 ${
                    isLight 
                      ? 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder-zinc-400' 
                      : 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500'
                  }`}
                />
                <span className={`text-[10px] mt-1 block ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  Public URL will be: <code className="text-indigo-500">/{templateForm.slug || 'template-name'}/{templateForm.token}</code>
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={`block text-xs font-semibold ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                    25-Character Public Token
                  </label>
                  <button
                    type="button"
                    onClick={() => setTemplateForm({ ...templateForm, token: generateRandomToken(25) })}
                    className="text-[11px] text-indigo-500 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Regenerate
                  </button>
                </div>
                <input
                  type="text"
                  readOnly
                  value={templateForm.token}
                  className={`w-full rounded-xl px-3.5 py-2 text-sm font-mono border ${
                    isLight 
                      ? 'bg-zinc-100 border-zinc-200 text-zinc-600' 
                      : 'bg-zinc-800/60 border-zinc-700/60 text-zinc-300'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                  Default Device Frame
                </label>
                <select
                  value={templateForm.device_frame}
                  onChange={(e) => setTemplateForm({ ...templateForm, device_frame: e.target.value as DeviceFrameType })}
                  className={`w-full rounded-xl px-3.5 py-2 text-sm border focus:outline-hidden focus:ring-2 focus:ring-indigo-500 ${
                    isLight 
                      ? 'bg-zinc-50 border-zinc-300 text-zinc-900' 
                      : 'bg-zinc-800 border-zinc-700 text-white'
                  }`}
                >
                  <option value="mobile">Mobile Frame (iPhone 390 × 844)</option>
                  <option value="tablet">Tablet Frame (iPad 768 × 1024)</option>
                  <option value="frameless">Frameless / Fluid</option>
                </select>
              </div>

              <div className={`flex justify-end gap-2 pt-3 border-t ${isLight ? 'border-zinc-200' : 'border-zinc-800'}`}>
                <button
                  type="button"
                  onClick={() => setIsTemplateModalOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                    isLight ? 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT HTML PAGE                                    */}
      {/* ============================================================== */}
      {isPageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`border rounded-3xl p-6 w-full max-w-3xl shadow-2xl text-left flex flex-col max-h-[90vh] ${
            isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-zinc-900 border-zinc-800 text-white'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold">
                {editingPageId ? 'Edit Page HTML' : 'Add New Showcase Page'}
              </h3>
              <button
                onClick={() => setIsPageModalOpen(false)}
                className={`p-1 ${isLight ? 'text-zinc-400 hover:text-zinc-700' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePage} className="flex-1 flex flex-col space-y-4 overflow-hidden">
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                  Page / Screen Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design 1 - Top Up - wallet"
                  value={pageForm.name}
                  onChange={(e) => setPageForm({ ...pageForm, name: e.target.value })}
                  className={`w-full rounded-xl px-3.5 py-2 text-sm border focus:outline-hidden focus:ring-2 focus:ring-indigo-500 ${
                    isLight 
                      ? 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder-zinc-400' 
                      : 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500'
                  }`}
                />
              </div>

              <div className="flex-1 flex flex-col min-h-[300px]">
                <div className="flex items-center justify-between mb-1">
                  <label className={`block text-xs font-semibold ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                    HTML Code (Full Document or Snippet) *
                  </label>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Load sample:</span>
                    {samplePagesHtml.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setPageForm({
                            name: s.name,
                            html_code: s.html_code
                          });
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded border transition ${
                          isLight 
                            ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200' 
                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
                        }`}
                      >
                        Sample #{idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  required
                  rows={12}
                  placeholder="Paste your raw HTML code here... <!DOCTYPE html><html>...</html>"
                  value={pageForm.html_code}
                  onChange={(e) => setPageForm({ ...pageForm, html_code: e.target.value })}
                  className={`w-full flex-1 rounded-xl p-3 font-mono text-xs border focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed ${
                    isLight
                      ? 'bg-zinc-50 border-zinc-300 text-zinc-900'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-200'
                  }`}
                />
              </div>

              <div className={`flex justify-between items-center pt-3 border-t ${isLight ? 'border-zinc-200' : 'border-zinc-800'}`}>
                <span className={`text-[11px] ${isLight ? 'text-zinc-500' : 'text-zinc-500'}`}>
                  Tip: Tailwind CSS & standard fonts work automatically inside iframe.
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPageModalOpen(false)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                      isLight ? 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30"
                  >
                    Save Page
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: LIVE PREVIEW PAGE                                       */}
      {/* ============================================================== */}
      {previewPage && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`border rounded-3xl p-6 w-full max-w-lg shadow-2xl flex flex-col items-center ${
            isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-zinc-900 border-zinc-800 text-white'
          }`}>
            <div className="w-full flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold">{previewPage.name}</h3>
                <span className={`text-[11px] ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Live Mockup Preview</span>
              </div>
              <button
                onClick={() => setPreviewPage(null)}
                className={`p-1 ${isLight ? 'text-zinc-400 hover:text-zinc-700' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile frame */}
            <div className="relative w-[360px] h-[640px] rounded-[38px] border-[8px] border-zinc-950 bg-black shadow-2xl overflow-hidden ring-1 ring-white/10">
              <ShowcaseIframe htmlCode={previewPage.html_code} title={previewPage.name} />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: SUPABASE SETUP & SQL SCHEMA                             */}
      {/* ============================================================== */}
      {isSqlModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`border rounded-3xl p-6 w-full max-w-2xl shadow-2xl text-left ${
            isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-zinc-900 border-zinc-800 text-white'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-500" />
                <h3 className="text-base font-bold">Supabase Database Setup</h3>
              </div>
              <button
                onClick={() => setIsSqlModalOpen(false)}
                className={`p-1 ${isLight ? 'text-zinc-400 hover:text-zinc-700' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className={`text-xs mb-3 ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              To connect your own Supabase project, create a project at{' '}
              <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-indigo-500 underline font-semibold">
                supabase.com
              </a>, paste these environment variables into <code className="font-semibold">.env.local</code>, and run the SQL below in Supabase SQL Editor:
            </p>

            <div className={`rounded-xl p-3 border text-xs font-mono mb-3 space-y-1 ${
              isLight ? 'bg-zinc-50 border-zinc-200 text-zinc-800' : 'bg-zinc-950 border-zinc-800 text-zinc-300'
            }`}>
              <div>NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co</div>
              <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key</div>
            </div>

            <div className="relative">
              <pre className={`rounded-xl p-3 border text-[11px] font-mono max-h-56 overflow-y-auto leading-relaxed ${
                isLight ? 'bg-zinc-50 border-zinc-200 text-zinc-800' : 'bg-zinc-950 border-zinc-800 text-zinc-300'
              }`}>
                {sqlSchemaText}
              </pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(sqlSchemaText);
                  setCopiedSql(true);
                  setTimeout(() => setCopiedSql(false), 2000);
                }}
                className="absolute top-2 right-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow"
              >
                {copiedSql ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSql ? 'Copied' : 'Copy SQL'}</span>
              </button>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsSqlModalOpen(false)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                  isLight ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800' : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                }`}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
