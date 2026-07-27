import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface SiteContent {
  section_id: string;
  title?: string;
  subtitle?: string;
  description?: string;
  updated_at?: string;
}

export const useSiteContent = (sectionId: string) => {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section_id', sectionId)
        .single();
        
      if (!error && data) {
        setContent(data as SiteContent);
      }
      setLoading(false);
    };

    fetchContent();
  }, [sectionId]);

  return { content, loading };
};
