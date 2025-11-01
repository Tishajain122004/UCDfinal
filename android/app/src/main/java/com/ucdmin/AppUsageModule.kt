package com.ucdmin

import android.app.AppOpsManager
import android.app.usage.UsageEvents
import android.app.usage.UsageStats
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
import java.text.SimpleDateFormat
import java.util.*
import java.util.concurrent.TimeUnit

class AppUsageModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    private val context: Context = reactContext
    override fun getName() = "AppUsageModule"

    @ReactMethod
    fun getUsageStats(limit: Int, promise: Promise) {
        try {
            if (!hasUsagePermission()) {
                openUsageAccessSettings()
                promise.reject("PERMISSION_DENIED", "Usage access not granted")
                return
            }

            val usageStatsManager =
                context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

            // Get data for last 7 days with daily breakdown
            val result = Arguments.createArray()
            val cal = Calendar.getInstance()
            
            Log.d("AppUsageModule", "===== FETCHING 7 DAYS DATA =====")
            
            // Last 7 days ki data collect karo
            for (i in 0 until 7) {
                val endOfDay = cal.clone() as Calendar
                endOfDay.set(Calendar.HOUR_OF_DAY, 23)
                endOfDay.set(Calendar.MINUTE, 59)
                endOfDay.set(Calendar.SECOND, 59)
                endOfDay.set(Calendar.MILLISECOND, 999)
                
                val startOfDay = cal.clone() as Calendar
                startOfDay.set(Calendar.HOUR_OF_DAY, 0)
                startOfDay.set(Calendar.MINUTE, 0)
                startOfDay.set(Calendar.SECOND, 0)
                startOfDay.set(Calendar.MILLISECOND, 0)

                val dateStr = SimpleDateFormat("dd MMM", Locale.getDefault()).format(cal.time)
                val dayOfWeek = SimpleDateFormat("EEE", Locale.getDefault()).format(cal.time)
                
                Log.d("AppUsageModule", "Processing day: $dayOfWeek $dateStr")
                
                // Is din ka usage stats nikalo
                val dailyUsage = calculateDailyUsageHybrid(
                    usageStatsManager,
                    startOfDay.timeInMillis,
                    endOfDay.timeInMillis,
                    limit
                )

                val dayData = Arguments.createMap().apply {
                    putString("date", dateStr)
                    putString("dayOfWeek", dayOfWeek)
                    putArray("apps", dailyUsage)
                }
                result.pushMap(dayData)
                
                // Previous day pe jao
                cal.add(Calendar.DAY_OF_MONTH, -1)
            }

            Log.d("AppUsageModule", "===== TOTAL DAYS PROCESSED: ${result.size()} =====")
            promise.resolve(result)
        } catch (e: Exception) {
            Log.e("AppUsageModule", "Error fetching usage", e)
            promise.reject("ERROR", e.message ?: "Unknown error")
        }
    }

    @ReactMethod
    fun getTodayUsageStats(limit: Int, promise: Promise) {
        try {
            if (!hasUsagePermission()) {
                openUsageAccessSettings()
                promise.reject("PERMISSION_DENIED", "Usage access not granted")
                return
            }

            val usageStatsManager =
                context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

            // Today's data (midnight to now)
            val cal = Calendar.getInstance()
            cal.set(Calendar.HOUR_OF_DAY, 0)
            cal.set(Calendar.MINUTE, 0)
            cal.set(Calendar.SECOND, 0)
            cal.set(Calendar.MILLISECOND, 0)
            
            val startTime = cal.timeInMillis
            val endTime = System.currentTimeMillis()

            Log.d("AppUsageModule", "Fetching today's data from ${Date(startTime)} to ${Date(endTime)}")
            
            val result = calculateDailyUsageHybrid(usageStatsManager, startTime, endTime, limit)
            promise.resolve(result)
        } catch (e: Exception) {
            Log.e("AppUsageModule", "Error fetching today's usage", e)
            promise.reject("ERROR", e.message ?: "Unknown error")
        }
    }

    // ===== HYBRID APPROACH: Try UsageStats first, fallback to Events =====
    private fun calculateDailyUsageHybrid(
        usageStatsManager: UsageStatsManager,
        startTime: Long,
        endTime: Long,
        limit: Int
    ): WritableArray {
        
        var usageMap = mutableMapOf<String, Long>()
        
        try {
            // ===== METHOD 1: UsageStats API (Preferred) =====
            Log.d("AppUsageModule", "Trying UsageStats API...")
            val stats = usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                startTime,
                endTime
            )
            
            if (stats != null && stats.isNotEmpty()) {
                Log.d("AppUsageModule", "UsageStats returned ${stats.size} entries")
                
                for (usageStats in stats) {
                    val pkg = usageStats.packageName ?: continue
                    val foregroundTime = usageStats.totalTimeInForeground
                    
                    if (foregroundTime > 1000) { // More than 1 second
                        usageMap[pkg] = usageMap.getOrDefault(pkg, 0L) + foregroundTime
                        Log.d("AppUsageModule", "UsageStats: $pkg = ${foregroundTime/1000}s")
                    }
                }
            }
            
            // ===== METHOD 2: If UsageStats is empty or unreliable, use Events =====
            if (usageMap.isEmpty() || usageMap.values.sum() < 10000) {
                Log.d("AppUsageModule", "UsageStats empty or unreliable, using Events API")
                usageMap = calculateFromEventsImproved(usageStatsManager, startTime, endTime).toMutableMap()
            }
            
            // ===== METHOD 3: Last resort - use both and take maximum =====
            if (usageMap.isEmpty()) {
                Log.w("AppUsageModule", "Both methods failed, trying combined approach")
                val eventsMap = calculateFromEventsImproved(usageStatsManager, startTime, endTime)
                usageMap = eventsMap.toMutableMap()
            }
            
            Log.d("AppUsageModule", "Final usageMap size: ${usageMap.size}, total time: ${usageMap.values.sum()/60000}m")
            
        } catch (e: Exception) {
            Log.e("AppUsageModule", "Error in calculateDailyUsageHybrid", e)
        }
        
        // Filter noise (less than 2 seconds)
        val filteredUsage = usageMap.filter { it.value >= 2000 }
        
        Log.d("AppUsageModule", "After filtering: ${filteredUsage.size} apps")
        
        if (filteredUsage.isEmpty()) {
            return Arguments.createArray()
        }
        
        return buildResultArray(filteredUsage, limit)
    }

    // ===== IMPROVED EVENTS CALCULATION =====
    private fun calculateFromEventsImproved(
        usageStatsManager: UsageStatsManager,
        startTime: Long,
        endTime: Long
    ): Map<String, Long> {
        
        val usageMap = mutableMapOf<String, Long>()
        var currentApp: String? = null
        var currentStartTime: Long = 0
        var isScreenOn = true
        
        try {
            val events = usageStatsManager.queryEvents(startTime, endTime)
            if (events == null) {
                Log.e("AppUsageModule", "queryEvents returned null")
                return emptyMap()
            }
            
            val event = UsageEvents.Event()
            var eventCount = 0
            
            while (events.hasNextEvent()) {
                events.getNextEvent(event)
                eventCount++
                
                val pkg = event.packageName ?: continue
                val timestamp = event.timeStamp
                
                when (event.eventType) {
                    UsageEvents.Event.MOVE_TO_FOREGROUND -> {
                        // Stop previous app
                        if (currentApp != null && isScreenOn) {
                            val duration = timestamp - currentStartTime
                            if (duration in 100..43200000) { // 100ms to 12 hours
                                usageMap[currentApp!!] = usageMap.getOrDefault(currentApp!!, 0L) + duration
                                Log.d("AppUsageModule", "Foreground: $currentApp used for ${duration/1000}s")
                            }
                        }
                        
                        // Start new app
                        if (isScreenOn) {
                            currentApp = pkg
                            currentStartTime = timestamp
                        }
                    }
                    
                    UsageEvents.Event.MOVE_TO_BACKGROUND -> {
                        if (currentApp == pkg && isScreenOn) {
                            val duration = timestamp - currentStartTime
                            if (duration in 100..43200000) {
                                usageMap[pkg] = usageMap.getOrDefault(pkg, 0L) + duration
                                Log.d("AppUsageModule", "Background: $pkg used for ${duration/1000}s")
                            }
                            currentApp = null
                        }
                    }
                    
                    UsageEvents.Event.SCREEN_NON_INTERACTIVE -> {
                        isScreenOn = false
                        if (currentApp != null) {
                            val duration = timestamp - currentStartTime
                            if (duration in 100..43200000) {
                                usageMap[currentApp!!] = usageMap.getOrDefault(currentApp!!, 0L) + duration
                                Log.d("AppUsageModule", "Screen OFF: $currentApp used for ${duration/1000}s")
                            }
                            currentApp = null
                        }
                    }
                    
                    UsageEvents.Event.SCREEN_INTERACTIVE -> {
                        isScreenOn = true
                    }
                    
                    UsageEvents.Event.DEVICE_SHUTDOWN -> {
                        if (currentApp != null) {
                            val duration = timestamp - currentStartTime
                            if (duration in 100..43200000) {
                                usageMap[currentApp!!] = usageMap.getOrDefault(currentApp!!, 0L) + duration
                            }
                        }
                        currentApp = null
                        isScreenOn = false
                    }
                }
            }
            
            Log.d("AppUsageModule", "Processed $eventCount events")
            
            // Handle currently running app
            if (currentApp != null && isScreenOn) {
                val duration = endTime - currentStartTime
                if (duration in 100..43200000) {
                    usageMap[currentApp!!] = usageMap.getOrDefault(currentApp!!, 0L) + duration
                    Log.d("AppUsageModule", "Still running: $currentApp for ${duration/1000}s")
                }
            }
            
        } catch (e: Exception) {
            Log.e("AppUsageModule", "Error in calculateFromEventsImproved", e)
        }
        
        Log.d("AppUsageModule", "Events method found ${usageMap.size} apps, total: ${usageMap.values.sum()/60000}m")
        return usageMap
    }

    private fun buildResultArray(usageMap: Map<String, Long>, limit: Int): WritableArray {
        val pm = context.packageManager
        val sorted = usageMap.entries.sortedByDescending { it.value }.take(limit)
        val result = Arguments.createArray()

        Log.d("AppUsageModule", "Building result array from ${sorted.size} apps")

        for ((pkg, timeMs) in sorted) {
            try {
                val info = pm.getApplicationInfo(pkg, 0)
                
                // Skip pure system apps (but keep updated ones like Chrome)
                val isSystemApp = (info.flags and ApplicationInfo.FLAG_SYSTEM) != 0
                val isUpdatedSystemApp = (info.flags and ApplicationInfo.FLAG_UPDATED_SYSTEM_APP) != 0
                
                if (isSystemApp && !isUpdatedSystemApp) {
                    Log.d("AppUsageModule", "Skipping system app: $pkg")
                    continue
                }
                
                // Skip apps without launcher intent
                if (pm.getLaunchIntentForPackage(pkg) == null) {
                    Log.d("AppUsageModule", "Skipping non-launchable app: $pkg")
                    continue
                }

                val name = pm.getApplicationLabel(info).toString()
                val iconUri = saveAppIcon(pm.getApplicationIcon(pkg), pkg)

                Log.d("AppUsageModule", "Adding to result: $name = ${formatTime(timeMs)}")

                val map = Arguments.createMap().apply {
                    putString("appName", name)
                    putString("packageName", pkg)
                    putString("iconUri", iconUri)
                    putString("timeFormatted", formatTime(timeMs))
                    putDouble("timeMs", timeMs.toDouble())
                }
                result.pushMap(map)
            } catch (e: Exception) {
                Log.w("AppUsageModule", "Error loading $pkg: ${e.message}")
            }
        }

        Log.d("AppUsageModule", "Final result array size: ${result.size()}")
        return result
    }

    private fun hasUsagePermission(): Boolean {
        val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        val mode = appOps.checkOpNoThrow(
            AppOpsManager.OPSTR_GET_USAGE_STATS,
            Process.myUid(),
            context.packageName
        )
        return mode == AppOpsManager.MODE_ALLOWED
    }

    private fun openUsageAccessSettings() {
        try {
            val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(intent)
        } catch (e: Exception) {
            Log.e("AppUsageModule", "Failed to open settings", e)
        }
    }

    private fun saveAppIcon(icon: Drawable, pkg: String): String {
        return try {
            val bitmap = if (icon is BitmapDrawable) {
                icon.bitmap
            } else {
                val width = icon.intrinsicWidth.coerceAtLeast(1)
                val height = icon.intrinsicHeight.coerceAtLeast(1)
                val bmp = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
                val canvas = Canvas(bmp)
                icon.setBounds(0, 0, canvas.width, canvas.height)
                icon.draw(canvas)
                bmp
            }
            
            val file = File(context.cacheDir, "$pkg.png")
            FileOutputStream(file).use {
                bitmap.compress(Bitmap.CompressFormat.PNG, 90, it)
            }
            "file://${file.absolutePath}"
        } catch (e: Exception) {
            Log.e("AppUsageModule", "Icon save failed for $pkg: ${e.message}")
            ""
        }
    }

    private fun formatTime(ms: Long): String {
        val totalMinutes = ms / 60000
        val hours = totalMinutes / 60
        val minutes = totalMinutes % 60
        
        return when {
            hours > 0 && minutes > 0 -> "${hours}h ${minutes}m"
            hours > 0 -> "${hours}h"
            minutes > 0 -> "${minutes}m"
            else -> "< 1m"
        }
    }
}