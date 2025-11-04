package com.ucdmin

import android.app.AppOpsManager
import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.graphics.*
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.os.Process
import android.provider.Settings
import android.util.Log
import com.facebook.react.bridge.*
import java.io.File
import java.io.FileOutputStream
import java.util.*

class AppUsageModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    private val context: Context = reactContext
    override fun getName() = "AppUsageModule"

    @ReactMethod
    fun getUsageStats(promise: Promise) {
        try {
            if (!hasUsagePermission()) {
                openUsageAccessSettings()
                promise.reject("PERMISSION_DENIED", "Usage access not granted")
                return
            }

            val usageStatsManager =
                context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

            // Get the last 7 days of data (Monday to Sunday cycle)
            val cal = Calendar.getInstance()
            val today = cal.get(Calendar.DAY_OF_WEEK)
            
            // Calculate days back to Monday
            val daysBackToMonday = if (today == Calendar.SUNDAY) 6 else today - Calendar.MONDAY
            
            // Set to Monday 00:00 of this week
            cal.add(Calendar.DAY_OF_YEAR, -daysBackToMonday)
            cal.set(Calendar.HOUR_OF_DAY, 0)
            cal.set(Calendar.MINUTE, 0)
            cal.set(Calendar.SECOND, 0)
            cal.set(Calendar.MILLISECOND, 0)
            
            val weekStartTime = cal.timeInMillis
            val endTime = System.currentTimeMillis()

            // Get today's start time for today's apps list
            val todayCal = Calendar.getInstance().apply {
                set(Calendar.HOUR_OF_DAY, 0)
                set(Calendar.MINUTE, 0)
                set(Calendar.SECOND, 0)
                set(Calendar.MILLISECOND, 0)
            }
            val todayStartTime = todayCal.timeInMillis

            // Storage for daily usage: Map<DayIndex, Map<PackageName, TimeMs>>
            val dailyUsageMap = mutableMapOf<Int, MutableMap<String, Long>>()
            for (i in 0..6) {
                dailyUsageMap[i] = mutableMapOf()
            }

            val events = usageStatsManager.queryEvents(weekStartTime, endTime)
            val lastEventMap = mutableMapOf<String, Pair<Int, Long>>()

            val event = UsageEvents.Event()
            while (events.hasNextEvent()) {
                events.getNextEvent(event)
                val pkg = event.packageName ?: continue
                val eventType = event.eventType
                val timestamp = event.timeStamp

                // Calculate which day this event belongs to (0=Monday, 6=Sunday)
                val eventCal = Calendar.getInstance().apply { timeInMillis = timestamp }
                val eventDayOfWeek = eventCal.get(Calendar.DAY_OF_WEEK)
                val dayIndex = if (eventDayOfWeek == Calendar.SUNDAY) 6 else eventDayOfWeek - Calendar.MONDAY

                when (eventType) {
                    UsageEvents.Event.ACTIVITY_RESUMED,
                    UsageEvents.Event.MOVE_TO_FOREGROUND -> {
                        lastEventMap[pkg] = Pair(eventType, timestamp)
                    }

                    UsageEvents.Event.ACTIVITY_PAUSED,
                    UsageEvents.Event.ACTIVITY_STOPPED,
                    UsageEvents.Event.MOVE_TO_BACKGROUND -> {
                        val lastEvent = lastEventMap[pkg]
                        if (lastEvent != null) {
                            val duration = timestamp - lastEvent.second
                            if (duration > 0 && duration < 24 * 60 * 60 * 1000) {
                                // Add to the day where the session started
                                val startCal = Calendar.getInstance().apply { timeInMillis = lastEvent.second }
                                val startDayOfWeek = startCal.get(Calendar.DAY_OF_WEEK)
                                val startDayIndex = if (startDayOfWeek == Calendar.SUNDAY) 6 else startDayOfWeek - Calendar.MONDAY
                                
                                dailyUsageMap[startDayIndex]?.let { dayMap ->
                                    dayMap[pkg] = dayMap.getOrDefault(pkg, 0L) + duration
                                }
                            }
                        }
                        lastEventMap[pkg] = Pair(eventType, timestamp)
                    }

                    UsageEvents.Event.SCREEN_INTERACTIVE -> {
                        for ((p, eventPair) in lastEventMap) {
                            if (eventPair.first == UsageEvents.Event.ACTIVITY_RESUMED) {
                                lastEventMap[p] = Pair(UsageEvents.Event.ACTIVITY_RESUMED, timestamp)
                            }
                        }
                    }

                    UsageEvents.Event.SCREEN_NON_INTERACTIVE -> {
                        for ((p, eventPair) in lastEventMap) {
                            if (eventPair.first == UsageEvents.Event.ACTIVITY_RESUMED) {
                                val duration = timestamp - eventPair.second
                                if (duration > 0 && duration < 24 * 60 * 60 * 1000) {
                                    val startCal = Calendar.getInstance().apply { timeInMillis = eventPair.second }
                                    val startDayOfWeek = startCal.get(Calendar.DAY_OF_WEEK)
                                    val startDayIndex = if (startDayOfWeek == Calendar.SUNDAY) 6 else startDayOfWeek - Calendar.MONDAY
                                    
                                    dailyUsageMap[startDayIndex]?.let { dayMap ->
                                        dayMap[p] = dayMap.getOrDefault(p, 0L) + duration
                                    }
                                }
                                lastEventMap[p] = Pair(UsageEvents.Event.SCREEN_NON_INTERACTIVE, timestamp)
                            }
                        }
                    }
                }
            }

            // Handle apps still running
            for ((pkg, eventPair) in lastEventMap) {
                if (eventPair.first == UsageEvents.Event.ACTIVITY_RESUMED) {
                    val duration = endTime - eventPair.second
                    if (duration > 0 && duration < 24 * 60 * 60 * 1000) {
                        val startCal = Calendar.getInstance().apply { timeInMillis = eventPair.second }
                        val startDayOfWeek = startCal.get(Calendar.DAY_OF_WEEK)
                        val startDayIndex = if (startDayOfWeek == Calendar.SUNDAY) 6 else startDayOfWeek - Calendar.MONDAY
                        
                        dailyUsageMap[startDayIndex]?.let { dayMap ->
                            dayMap[pkg] = dayMap.getOrDefault(pkg, 0L) + duration
                        }
                    }
                }
            }

            // Calculate total time for each day
            val weeklyData = Arguments.createArray()
            for (i in 0..6) {
                val dayTotal = dailyUsageMap[i]?.values?.sum() ?: 0L
                weeklyData.pushDouble(dayTotal.toDouble())
            }

            // Get today's usage for app list
            val todayDayOfWeek = Calendar.getInstance().get(Calendar.DAY_OF_WEEK)
            val todayIndex = if (todayDayOfWeek == Calendar.SUNDAY) 6 else todayDayOfWeek - Calendar.MONDAY
            val todayUsageMap = dailyUsageMap[todayIndex] ?: mutableMapOf()

            val pm = context.packageManager
            val result = Arguments.createArray()
            var totalTime = 0L

            val installedApps = pm.getInstalledApplications(0)
            
            for (appInfo in installedApps) {
                try {
                    val pkg = appInfo.packageName
                    
                    if ((appInfo.flags and ApplicationInfo.FLAG_SYSTEM) != 0) continue
                    if (pm.getLaunchIntentForPackage(pkg) == null) continue
                    
                    val timeMs = todayUsageMap[pkg] ?: 0L
                    
                    val name = pm.getApplicationLabel(appInfo).toString()
                    val iconUri = saveAppIcon(pm.getApplicationIcon(appInfo), pkg)

                    val map = Arguments.createMap().apply {
                        putString("appName", name)
                        putString("packageName", pkg)
                        putString("iconUri", iconUri)
                        putString("timeFormatted", formatTime(timeMs))
                        putDouble("timeMs", timeMs.toDouble())
                    }
                    result.pushMap(map)
                    
                    totalTime += timeMs
                } catch (e: Exception) {
                    Log.w("AppUsageModule", "Error loading ${appInfo.packageName}: ${e.message}")
                }
            }

            Log.d("AppUsageModule", "Total apps: ${result.size()}, Total time today: $totalTime ms (${formatTime(totalTime)})")

            val response = Arguments.createMap().apply {
                putString("totalTime", formatTime(totalTime))
                putDouble("totalTimeMs", totalTime.toDouble())
                putArray("apps", result)
                putArray("weeklyData", weeklyData) // Add weekly data for chart
            }

            promise.resolve(response)
        } catch (e: Exception) {
            Log.e("AppUsageModule", "Error fetching usage", e)
            promise.reject("ERROR", e)
        }
    }

    private fun hasUsagePermission(): Boolean {
        val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        val mode = appOps.checkOpNoThrow("android:get_usage_stats", Process.myUid(), context.packageName)
        return mode == AppOpsManager.MODE_ALLOWED
    }

    private fun openUsageAccessSettings() {
        val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(intent)
    }

    private fun saveAppIcon(icon: Drawable, pkg: String): String {
        return try {
            val bitmap = if (icon is BitmapDrawable) icon.bitmap else {
                val bmp = Bitmap.createBitmap(
                    icon.intrinsicWidth.coerceAtLeast(1),
                    icon.intrinsicHeight.coerceAtLeast(1),
                    Bitmap.Config.ARGB_8888
                )
                val canvas = Canvas(bmp)
                icon.setBounds(0, 0, canvas.width, canvas.height)
                icon.draw(canvas)
                bmp
            }
            val file = File(context.cacheDir, "$pkg.png")
            FileOutputStream(file).use { bitmap.compress(Bitmap.CompressFormat.PNG, 90, it) }
            "file://${file.absolutePath}"
        } catch (e: Exception) {
            Log.e("AppUsageModule", "Icon save failed for $pkg: ${e.message}")
            ""
        }
    }

    private fun formatTime(ms: Long): String {
        val mins = ms / 60000
        val hrs = mins / 60
        val rem = mins % 60
        return if (hrs > 0) "${hrs}h ${rem}m" else "${rem}m"
    }
}