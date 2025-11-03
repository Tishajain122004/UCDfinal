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

            // ⏰ use today's 00:00 as start
            val cal = Calendar.getInstance().apply {
                set(Calendar.HOUR_OF_DAY, 0)
                set(Calendar.MINUTE, 0)
                set(Calendar.SECOND, 0)
                set(Calendar.MILLISECOND, 0)
            }
            val startTime = cal.timeInMillis
            val endTime = System.currentTimeMillis()

            val events = usageStatsManager.queryEvents(startTime, endTime)
            val usageMap = mutableMapOf<String, Long>()
            val lastEventMap = mutableMapOf<String, Pair<Int, Long>>() // event type & timestamp

            val event = UsageEvents.Event()
            while (events.hasNextEvent()) {
                events.getNextEvent(event)
                val pkg = event.packageName ?: continue
                val eventType = event.eventType
                val timestamp = event.timeStamp

                when (eventType) {
                    UsageEvents.Event.ACTIVITY_RESUMED,
                    UsageEvents.Event.MOVE_TO_FOREGROUND -> {
                        // App came to foreground
                        lastEventMap[pkg] = Pair(eventType, timestamp)
                    }

                    UsageEvents.Event.ACTIVITY_PAUSED,
                    UsageEvents.Event.ACTIVITY_STOPPED,
                    UsageEvents.Event.MOVE_TO_BACKGROUND -> {
                        // App went to background/paused
                        val lastEvent = lastEventMap[pkg]
                        if (lastEvent != null) {
                            val duration = timestamp - lastEvent.second
                            if (duration > 0 && duration < 24 * 60 * 60 * 1000) { // sanity check: < 24 hours
                                usageMap[pkg] = usageMap.getOrDefault(pkg, 0L) + duration
                            }
                        }
                        lastEventMap[pkg] = Pair(eventType, timestamp)
                    }

                    UsageEvents.Event.SCREEN_INTERACTIVE -> {
                        // Screen turned on - resume any active app
                        for ((p, eventPair) in lastEventMap) {
                            if (eventPair.first == UsageEvents.Event.ACTIVITY_RESUMED) {
                                lastEventMap[p] = Pair(UsageEvents.Event.ACTIVITY_RESUMED, timestamp)
                            }
                        }
                    }

                    UsageEvents.Event.SCREEN_NON_INTERACTIVE -> {
                        // Screen turned off - calculate time for all active apps
                        for ((p, eventPair) in lastEventMap) {
                            if (eventPair.first == UsageEvents.Event.ACTIVITY_RESUMED) {
                                val duration = timestamp - eventPair.second
                                if (duration > 0 && duration < 24 * 60 * 60 * 1000) {
                                    usageMap[p] = usageMap.getOrDefault(p, 0L) + duration
                                }
                                lastEventMap[p] = Pair(UsageEvents.Event.SCREEN_NON_INTERACTIVE, timestamp)
                            }
                        }
                    }
                }
            }

            // Handle apps still running (add time until now)
            for ((pkg, eventPair) in lastEventMap) {
                if (eventPair.first == UsageEvents.Event.ACTIVITY_RESUMED) {
                    val duration = endTime - eventPair.second
                    if (duration > 0 && duration < 24 * 60 * 60 * 1000) {
                        usageMap[pkg] = usageMap.getOrDefault(pkg, 0L) + duration
                    }
                }
            }

            val pm = context.packageManager
            val result = Arguments.createArray()
            var totalTime = 0L

            // Get all installed apps
            val installedApps = pm.getInstalledApplications(0)
            
            for (appInfo in installedApps) {
                try {
                    val pkg = appInfo.packageName
                    
                    // Skip system apps and apps without launch intent
                    if ((appInfo.flags and ApplicationInfo.FLAG_SYSTEM) != 0) continue
                    if (pm.getLaunchIntentForPackage(pkg) == null) continue
                    
                    val timeMs = usageMap[pkg] ?: 0L
                    
                    // Include all apps, even with 0 usage
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

            Log.d("AppUsageModule", "Total apps: ${result.size()}, Total time: $totalTime ms (${formatTime(totalTime)})")

            // Create response with total time and apps list
            val response = Arguments.createMap().apply {
                putString("totalTime", formatTime(totalTime))
                putDouble("totalTimeMs", totalTime.toDouble())
                putArray("apps", result)
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