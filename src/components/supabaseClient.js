// src/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase URL and Key
const supabaseUrl = 'https://jpmbjzjpreqeytdpjzwq.supabase.co' // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwbWJqempwcmVxZXl0ZHBqendxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5ODg4OTksImV4cCI6MjA0ODU2NDg5OX0.jjjlaU1B6tyA9kFYh-UKOa1wBhxAgKgHia-B8gjtAms'

// Create a Supabase client instance
const supabase = createClient(supabaseUrl, supabaseKey);

// Export the supabase instance for use in other files
export default supabase;
