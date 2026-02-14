import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ilcubiamtvpwtpcxeqbm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsY3ViaWFtdHZwd3RwY3hlcWJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNzQ4MTcsImV4cCI6MjA4NDg1MDgxN30.HhnyxM5dORyNfJ5SsFKtaoUDCn8PiDlBoPSirzzU9oo'; // copy from API settings

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
