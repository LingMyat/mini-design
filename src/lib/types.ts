export type DeviceFrameType = 'mobile' | 'tablet' | 'frameless';

export interface Template {
  id: string;
  name: string;
  slug: string;
  token: string; // 25 random characters
  device_frame: DeviceFrameType;
  created_at: string;
  updated_at: string;
  pages_count?: number;
}

export interface ShowcasePage {
  id: string;
  template_id: string;
  name: string;
  html_code: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface TemplateWithPages extends Template {
  pages: ShowcasePage[];
}
