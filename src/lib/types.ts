export interface InstagramPost {
  id: string;
  media_type: string;
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
}

export interface NavigationProps {
  page: string;
  setPage: (page: string) => void;
  className?: string;
}

export interface ContactInfoProps {
  className?: string;
}

export interface InstagramGridProps {
  className?: string;
}

export interface ThemeToggleProps {
  className?: string;
}

// Add to existing types.ts
declare global {
  interface WindowEventMap {
    themeChange: CustomEvent<'light' | 'dark'>;
  }
}