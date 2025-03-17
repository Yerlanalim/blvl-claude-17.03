import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from './database.types';

export const createClient = () => {
  return createClientComponentClient<Database>();
};

// For direct usage when you don't need type inference
export const supabase = createClientComponentClient();
