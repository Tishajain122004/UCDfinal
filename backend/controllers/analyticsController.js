const supabase = require('../config/supabaseClient');

// Save today's analytics data
exports.saveTodayAnalytics = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const { total_screen_time_ms, app_usage_data } = req.body;

    if (!total_screen_time_ms || !app_usage_data) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    // Upsert: Insert or update if exists
    const { data, error } = await supabase
      .from('daily_analytics')
      .upsert({
        user_id: userId,
        date: today,
        total_screen_time_ms,
        app_usage_data,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,date'
      })
      .select();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Analytics saved successfully',
      data: data[0]
    });

  } catch (error) {
    console.error('Save analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save analytics',
      error: error.message
    });
  }
};

// Get last 7 days analytics
exports.getWeeklyAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Calculate date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const startDate = sevenDaysAgo.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('daily_analytics')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .order('date', { ascending: true });

    if (error) throw error;

    // Process data for frontend
    const processedData = {
      daily_stats: data.map(item => ({
        date: item.date,
        total_time_ms: item.total_screen_time_ms,
        total_time_formatted: formatTime(item.total_screen_time_ms),
        apps: item.app_usage_data
      })),
      total_screen_time: data.reduce((sum, item) => sum + item.total_screen_time_ms, 0),
      top_apps: calculateTopApps(data)
    };

    res.status(200).json({
      success: true,
      data: processedData
    });

  } catch (error) {
    console.error('Get weekly analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
};

// Helper: Format milliseconds to readable time
function formatTime(ms) {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

// Helper: Calculate top 5 apps from 7 days data
function calculateTopApps(data) {
  const appTotals = {};

  data.forEach(day => {
    const apps = day.app_usage_data;
    apps.forEach(app => {
      if (!appTotals[app.packageName]) {
        appTotals[app.packageName] = {
          packageName: app.packageName,
          appName: app.appName || app.packageName,
          totalTime: 0
        };
      }
      appTotals[app.packageName].totalTime += app.totalTimeInForeground || 0;
    });
  });

  // Convert to array and sort
  return Object.values(appTotals)
    .sort((a, b) => b.totalTime - a.totalTime)
    .slice(0, 5)
    .map(app => ({
      ...app,
      formattedTime: formatTime(app.totalTime)
    }));
}