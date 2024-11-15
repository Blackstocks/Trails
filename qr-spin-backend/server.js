// server.js
const express = require('express');
const bodyParser = require('body-parser');
const supabase = require('./supabaseClient');

const app = express();
app.use(bodyParser.json());

// Helper function to calculate hours difference
function hoursDifference(date1, date2) {
  const diffInMs = Math.abs(date2 - date1);
  return diffInMs / (1000 * 60 * 60);
}

// Register Prize Endpoint with 24-hour restriction (silent)
app.post('/api/register-prize', async (req, res) => {
  const { mobile, prize } = req.body;
  const uniqueCode = Math.random().toString(36).substring(2, 10).toUpperCase();

  try {
    // Check if user exists
    let { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('mobile_number', mobile)
      .single();

    if (!user) {
      // Create new user if they don't exist
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert([{ mobile_number: mobile, unique_code: uniqueCode }])
        .single();

      if (userError) throw userError;
      user = newUser;
    }

    // Check user's last prize claim date
    const { data: lastPrize, error: prizeError } = await supabase
      .from('prizes')
      .select('date')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(1)
      .single();

    if (lastPrize) {
      const lastSpinDate = new Date(lastPrize.date);
      const now = new Date();

      // Check if the last spin was within the last 24 hours
      if (hoursDifference(lastSpinDate, now) < 24) {
        return res.status(200).json({ message: 'Prize already claimed today. Try again later.' });
      }
    }

    // Register the new prize
    const { data: prizeData, error: prizeInsertError } = await supabase
      .from('prizes')
      .insert([{ user_id: user.id, prize_name: prize, date: new Date() }]);

    if (prizeInsertError) throw prizeInsertError;

    res.status(200).json({ message: `Prize registered successfully with code: ${user.unique_code}` });
  } catch (error) {
    res.status(500).json({ message: 'Error registering prize', error });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));
