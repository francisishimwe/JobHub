import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder'

    console.log('Creating Supabase client with URL:', supabaseUrl)
    console.log('Service key available:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
    console.log('Anon key available:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    // Create a server-side Supabase client with service role key for admin operations
    return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    })
}
