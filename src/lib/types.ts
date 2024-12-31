export interface InstagramPost {
  id: string;
  media_type: string;
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
}

export interface NavProps {
  page: string;
  setPage: (page: string) => void;
}