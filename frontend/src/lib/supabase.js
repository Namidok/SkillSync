import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://gtyyaplmaxjtjlcqftve.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eXlhcGxtYXhqdGpsY3FmdHZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1Njc5ODEsImV4cCI6MjA5NzE0Mzk4MX0.-103ufNnFgKXNMYPnTz32INhKt_0oUZuIJ7oiKXeA2c'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
