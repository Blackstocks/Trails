// supabaseClient.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bcsmnuztfjlxnmkfonow.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjc21udXp0ZmpseG5ta2Zvbm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzMzE0NjQsImV4cCI6MjA0NjkwNzQ2NH0.OfOBmE_NbdQdJGLzoqmT86ZrBKiw7W2hgKH42oqv_cs';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
