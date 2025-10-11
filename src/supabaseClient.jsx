import { createClient } from '@supabase/supabase-js'

// Pegue essas informações no painel do seu projeto Supabase
// em Settings -> API
const supabaseUrl = 'https://dqmvqpuffzntucgtrphe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxbXZxcHVmZnpudHVjZ3RycGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MzcwNDMsImV4cCI6MjA3NTExMzA0M30.NK0303eqP7TuTOHyZeINNRFygZWh8pHtrWcf97OSKyc';

// Cria e exporta o cliente Supabase para ser usado em qualquer lugar do app
export const supabase = createClient(supabaseUrl, supabaseKey);