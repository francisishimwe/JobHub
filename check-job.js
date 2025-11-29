const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkJob() {
    const jobId = '2b1dabfe-05fb-47ab-a0ff-9491d1b77d9b';
    console.log(`Checking for job with ID: ${jobId}`);

    const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

    if (error) {
        console.error('Error fetching job:', error);
    } else {
        console.log('Job found:', data);
    }
}

checkJob();
