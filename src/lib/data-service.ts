import { supabase, isSupabaseConfigured } from './supabase';
import { Template, ShowcasePage, TemplateWithPages, DeviceFrameType } from './types';
import { generateRandomToken, slugify, initialDemoTemplate, samplePagesHtml } from './sample-data';

// Local memory store for fallback when Supabase keys are not set
const LOCAL_STORAGE_KEY_TEMPLATES = 'html_showcase_templates_v1';
const LOCAL_STORAGE_KEY_PAGES = 'html_showcase_pages_v1';

// Server-side fallback in-memory state
let memoryTemplates: Template[] = [
  {
    id: initialDemoTemplate.id,
    name: initialDemoTemplate.name,
    slug: initialDemoTemplate.slug,
    token: initialDemoTemplate.token,
    device_frame: initialDemoTemplate.device_frame,
    created_at: initialDemoTemplate.created_at,
    updated_at: initialDemoTemplate.updated_at,
    pages_count: initialDemoTemplate.pages.length
  }
];

let memoryPages: ShowcasePage[] = [...initialDemoTemplate.pages];

function getLocalStore() {
  if (typeof window === 'undefined') {
    return { templates: memoryTemplates, pages: memoryPages };
  }
  try {
    const rawTemplates = localStorage.getItem(LOCAL_STORAGE_KEY_TEMPLATES);
    const rawPages = localStorage.getItem(LOCAL_STORAGE_KEY_PAGES);
    if (!rawTemplates || !rawPages) {
      localStorage.setItem(LOCAL_STORAGE_KEY_TEMPLATES, JSON.stringify(memoryTemplates));
      localStorage.setItem(LOCAL_STORAGE_KEY_PAGES, JSON.stringify(memoryPages));
      return { templates: memoryTemplates, pages: memoryPages };
    }
    return {
      templates: JSON.parse(rawTemplates) as Template[],
      pages: JSON.parse(rawPages) as ShowcasePage[]
    };
  } catch (e) {
    console.error('Failed reading localStorage', e);
    return { templates: memoryTemplates, pages: memoryPages };
  }
}

function saveLocalStore(templates: Template[], pages: ShowcasePage[]) {
  memoryTemplates = templates;
  memoryPages = pages;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_TEMPLATES, JSON.stringify(templates));
      localStorage.setItem(LOCAL_STORAGE_KEY_PAGES, JSON.stringify(pages));
    } catch (e) {
      console.error('Failed saving localStorage', e);
    }
  }
}

// -------------------------------------------------------------
// TEMPLATES
// -------------------------------------------------------------

export async function getTemplates(): Promise<Template[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: templatesData, error } = await supabase
        .from('templates')
        .select('*, pages(id)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase getTemplates error, falling back:', error.message);
      } else if (templatesData) {
        return templatesData.map((t: any) => ({
          id: t.id,
          name: t.name,
          slug: t.slug,
          token: t.token,
          device_frame: t.device_frame || 'mobile',
          created_at: t.created_at,
          updated_at: t.updated_at,
          pages_count: Array.isArray(t.pages) ? t.pages.length : 0
        }));
      }
    } catch (e) {
      console.error('Error fetching templates from Supabase:', e);
    }
  }

  // Fallback
  const { templates, pages } = getLocalStore();
  return templates.map(t => ({
    ...t,
    pages_count: pages.filter(p => p.template_id === t.id).length
  }));
}

export async function getTemplateById(id: string): Promise<TemplateWithPages | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: template, error: tErr } = await supabase
        .from('templates')
        .select('*')
        .eq('id', id)
        .single();

      if (!tErr && template) {
        const { data: pages, error: pErr } = await supabase
          .from('pages')
          .select('*')
          .eq('template_id', id)
          .order('sort_order', { ascending: true });

        return {
          id: template.id,
          name: template.name,
          slug: template.slug,
          token: template.token,
          device_frame: template.device_frame || 'mobile',
          created_at: template.created_at,
          updated_at: template.updated_at,
          pages: (pages as ShowcasePage[]) || []
        };
      }
    } catch (e) {
      console.error('Error fetching template by id from Supabase:', e);
    }
  }

  // Fallback
  const { templates, pages } = getLocalStore();
  const template = templates.find(t => t.id === id);
  if (!template) return null;
  const templatePages = pages
    .filter(p => p.template_id === id)
    .sort((a, b) => a.sort_order - b.sort_order);

  return {
    ...template,
    pages: templatePages
  };
}

export async function getTemplateWithPagesBySlugAndToken(
  slug: string,
  token: string
): Promise<TemplateWithPages | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: template, error: tErr } = await supabase
        .from('templates')
        .select('*')
        .eq('slug', slug)
        .eq('token', token)
        .single();

      if (!tErr && template) {
        const { data: pages } = await supabase
          .from('pages')
          .select('*')
          .eq('template_id', template.id)
          .order('sort_order', { ascending: true });

        return {
          id: template.id,
          name: template.name,
          slug: template.slug,
          token: template.token,
          device_frame: template.device_frame || 'mobile',
          created_at: template.created_at,
          updated_at: template.updated_at,
          pages: (pages as ShowcasePage[]) || []
        };
      }
    } catch (e) {
      console.error('Error fetching template by slug and token from Supabase:', e);
    }
  }

  // Fallback
  const { templates, pages } = getLocalStore();
  const template = templates.find(t => t.slug === slug && t.token === token);
  if (!template) return null;
  const templatePages = pages
    .filter(p => p.template_id === template.id)
    .sort((a, b) => a.sort_order - b.sort_order);

  return {
    ...template,
    pages: templatePages
  };
}

export async function createTemplate(data: {
  name: string;
  slug?: string;
  device_frame?: DeviceFrameType;
}): Promise<Template> {
  const name = data.name.trim();
  const slug = (data.slug?.trim() || slugify(name));
  const token = generateRandomToken(25);
  const device_frame = data.device_frame || 'mobile';

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: created, error } = await supabase
        .from('templates')
        .insert([{ name, slug, token, device_frame }])
        .select('*')
        .single();

      if (!error && created) {
        return {
          id: created.id,
          name: created.name,
          slug: created.slug,
          token: created.token,
          device_frame: created.device_frame || 'mobile',
          created_at: created.created_at,
          updated_at: created.updated_at,
          pages_count: 0
        };
      }
      console.error('Supabase createTemplate error:', error?.message);
    } catch (e) {
      console.error('Error creating template in Supabase:', e);
    }
  }

  // Fallback
  const { templates, pages } = getLocalStore();
  const newTemplate: Template = {
    id: `template-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name,
    slug,
    token,
    device_frame,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    pages_count: 0
  };

  saveLocalStore([newTemplate, ...templates], pages);
  return newTemplate;
}

export async function updateTemplate(
  id: string,
  data: Partial<Pick<Template, 'name' | 'slug' | 'device_frame'>>
): Promise<Template | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const updatePayload: any = { ...data, updated_at: new Date().toISOString() };
      const { data: updated, error } = await supabase
        .from('templates')
        .update(updatePayload)
        .eq('id', id)
        .select('*')
        .single();

      if (!error && updated) {
        return {
          id: updated.id,
          name: updated.name,
          slug: updated.slug,
          token: updated.token,
          device_frame: updated.device_frame || 'mobile',
          created_at: updated.created_at,
          updated_at: updated.updated_at
        };
      }
    } catch (e) {
      console.error('Error updating template in Supabase:', e);
    }
  }

  // Fallback
  const { templates, pages } = getLocalStore();
  const index = templates.findIndex(t => t.id === id);
  if (index === -1) return null;

  const updated: Template = {
    ...templates[index],
    ...data,
    updated_at: new Date().toISOString()
  };
  templates[index] = updated;
  saveLocalStore([...templates], pages);
  return updated;
}

export async function deleteTemplate(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('templates').delete().eq('id', id);
      if (!error) return true;
      console.error('Error deleting template in Supabase:', error.message);
    } catch (e) {
      console.error('Error deleting template from Supabase:', e);
    }
  }

  // Fallback
  const { templates, pages } = getLocalStore();
  const newTemplates = templates.filter(t => t.id !== id);
  const newPages = pages.filter(p => p.template_id !== id);
  saveLocalStore(newTemplates, newPages);
  return true;
}

// -------------------------------------------------------------
// PAGES
// -------------------------------------------------------------

export async function createPage(
  templateId: string,
  data: { name: string; html_code: string }
): Promise<ShowcasePage> {
  if (isSupabaseConfigured && supabase) {
    try {
      // get max sort_order
      const { data: existingPages } = await supabase
        .from('pages')
        .select('sort_order')
        .eq('template_id', templateId)
        .order('sort_order', { ascending: false })
        .limit(1);

      const nextOrder = existingPages && existingPages.length > 0
        ? (existingPages[0].sort_order + 1)
        : 0;

      const { data: created, error } = await supabase
        .from('pages')
        .insert([{
          template_id: templateId,
          name: data.name.trim() || 'Untitled Page',
          html_code: data.html_code,
          sort_order: nextOrder
        }])
        .select('*')
        .single();

      if (!error && created) {
        return created as ShowcasePage;
      }
      console.error('Supabase createPage error:', error?.message);
    } catch (e) {
      console.error('Error creating page in Supabase:', e);
    }
  }

  // Fallback
  const { templates, pages } = getLocalStore();
  const templatePages = pages.filter(p => p.template_id === templateId);
  const nextOrder = templatePages.length > 0
    ? Math.max(...templatePages.map(p => p.sort_order)) + 1
    : 0;

  const newPage: ShowcasePage = {
    id: `page-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    template_id: templateId,
    name: data.name.trim() || 'Untitled Page',
    html_code: data.html_code,
    sort_order: nextOrder,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  saveLocalStore(templates, [...pages, newPage]);
  return newPage;
}

export async function updatePage(
  pageId: string,
  data: Partial<Pick<ShowcasePage, 'name' | 'html_code' | 'sort_order'>>
): Promise<ShowcasePage | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: updated, error } = await supabase
        .from('pages')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', pageId)
        .select('*')
        .single();

      if (!error && updated) {
        return updated as ShowcasePage;
      }
    } catch (e) {
      console.error('Error updating page in Supabase:', e);
    }
  }

  // Fallback
  const { templates, pages } = getLocalStore();
  const idx = pages.findIndex(p => p.id === pageId);
  if (idx === -1) return null;

  const updated: ShowcasePage = {
    ...pages[idx],
    ...data,
    updated_at: new Date().toISOString()
  };
  pages[idx] = updated;
  saveLocalStore(templates, [...pages]);
  return updated;
}

export async function deletePage(pageId: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('pages').delete().eq('id', pageId);
      if (!error) return true;
    } catch (e) {
      console.error('Error deleting page from Supabase:', e);
    }
  }

  // Fallback
  const { templates, pages } = getLocalStore();
  const newPages = pages.filter(p => p.id !== pageId);
  saveLocalStore(templates, newPages);
  return true;
}

export async function reorderPages(
  templateId: string,
  orderedPageIds: string[]
): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const client = supabase;
      // Upsert or update each sort_order
      const promises = orderedPageIds.map((id, index) =>
        client.from('pages').update({ sort_order: index }).eq('id', id)
      );
      await Promise.all(promises);
      return true;
    } catch (e) {
      console.error('Error reordering pages in Supabase:', e);
    }
  }

  // Fallback
  const { templates, pages } = getLocalStore();
  const updatedPages = pages.map(p => {
    if (p.template_id === templateId) {
      const newOrder = orderedPageIds.indexOf(p.id);
      if (newOrder !== -1) {
        return { ...p, sort_order: newOrder };
      }
    }
    return p;
  });

  saveLocalStore(templates, updatedPages);
  return true;
}

// Function to populate Supabase with sample screens if empty
export async function seedSampleDataToSupabase(): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { count } = await supabase.from('templates').select('*', { count: 'exact', head: true });
    if (count && count > 0) return true;

    // Insert demo template
    const { data: newT, error: tErr } = await supabase
      .from('templates')
      .insert([{
        name: initialDemoTemplate.name,
        slug: initialDemoTemplate.slug,
        token: initialDemoTemplate.token,
        device_frame: initialDemoTemplate.device_frame
      }])
      .select()
      .single();

    if (tErr || !newT) return false;

    const pagesToInsert = initialDemoTemplate.pages.map((p, idx) => ({
      template_id: newT.id,
      name: p.name,
      html_code: p.html_code,
      sort_order: idx
    }));

    await supabase.from('pages').insert(pagesToInsert);
    return true;
  } catch (e) {
    console.error('Error seeding data to Supabase:', e);
    return false;
  }
}
