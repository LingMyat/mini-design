import React from 'react';
import { notFound } from 'next/navigation';
import { getTemplateWithPagesBySlugAndToken } from '@/lib/data-service';
import { ShowcaseCanvas } from '@/components/ShowcaseCanvas';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface ShowcasePageProps {
  params: Promise<{
    slug: string;
    token: string;
  }>;
}

export async function generateMetadata(
  props: ShowcasePageProps
): Promise<Metadata> {
  const { slug, token } = await props.params;
  const template = await getTemplateWithPagesBySlugAndToken(slug, token);
  if (!template) {
    return {
      title: 'Presentation Not Found | HTML Showcase',
    };
  }
  return {
    title: `${template.name} — HTML Showcase`,
    description: `Interactive HTML design presentation for ${template.name}`,
  };
}

export default async function ShowcasePage(props: ShowcasePageProps) {
  const { slug, token } = await props.params;
  const template = await getTemplateWithPagesBySlugAndToken(slug, token);

  if (!template) {
    notFound();
  }

  return <ShowcaseCanvas template={template} />;
}
