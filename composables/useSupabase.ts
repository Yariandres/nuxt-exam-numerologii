import { createClient } from '@supabase/supabase-js';
import { ref } from 'vue';

export const useSupabase = () => {
  const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
  const supabaseKey = useRuntimeConfig().public.supabaseKey;

  const supabase = createClient(supabaseUrl, supabaseKey);

  return {
    supabase,
  };
};
