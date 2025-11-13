package com.ucdmin

import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.util.Base64
import android.util.Log
import com.facebook.react.bridge.*
import java.io.ByteArrayOutputStream
import java.text.SimpleDateFormat
import java.util.*

class AppUsageModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val TAG = "AppUsageModule"

    override fun getName(): String = "AppUsageModule"

    @ReactMethod
    fun getUsageStats(promise: Promise) {
        try {
            val usageStatsManager =
                reactContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
            val pm = reactContext.packageManager

            val calendar = Calendar.getInstance()
            val now = System.currentTimeMillis()
            calendar.set(Calendar.HOUR_OF_DAY, 0)
            calendar.set(Calendar.MINUTE, 0)
            calendar.set(Calendar.SECOND, 0)
            calendar.set(Calendar.MILLISECOND, 0)
            val startOfToday = calendar.timeInMillis

            // ✅ Calculate TODAY usage using UsageEvents for accurate visible time
            val todayDurations = calculateAppUsage(usageStatsManager, startOfToday, now)
            val userAppHints = listOf(
                "youtube", "chrome", "maps", "gmail", "instagram",
                "whatsapp", "facebook", "twitter", "x", "snapchat",
                "telegram", "netflix", "spotify", "amazon", "flipkart", "paytm"
            )

            val appsArray = Arguments.createArray()
            var totalToday = 0L

            todayDurations.entries
                .filter { it.value >= 1000 }
                .sortedByDescending { it.value }
                .forEach { (pkg, duration) ->
                    try {
                        val ai = pm.getApplicationInfo(pkg, 0)
                        val hasLauncher = pm.getLaunchIntentForPackage(pkg) != null
                        val isSystem = (ai.flags and ApplicationInfo.FLAG_SYSTEM) != 0
                        val include = hasLauncher || userAppHints.any { pkg.contains(it, true) }
                        if (!include) return@forEach

                        val appName = pm.getApplicationLabel(ai).toString()
                        val map = Arguments.createMap()
                        map.putString("packageName", pkg)
                        map.putString("appName", appName)
                        map.putDouble("timeMs", duration.toDouble())
                        map.putString("timeFormatted", formatTime(duration))

                        try {
                            val icon = pm.getApplicationIcon(pkg)
                            map.putString("iconUri", "data:image/png;base64,${drawableToBase64(icon)}")
                        } catch (_: Exception) {
                            map.putString("iconUri", null)
                        }

                        appsArray.pushMap(map)
                        totalToday += duration
                    } catch (_: Exception) {}
                }

            // ✅ Last 7 days using same event-based logic
            val weeklyArray = Arguments.createArray()
            val dateFmt = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
            val dayFmt = SimpleDateFormat("EEE", Locale.getDefault())

            for (i in 6 downTo 0) {
                val cal = Calendar.getInstance()
                cal.add(Calendar.DAY_OF_YEAR, -i)
                cal.set(Calendar.HOUR_OF_DAY, 0)
                cal.set(Calendar.MINUTE, 0)
                cal.set(Calendar.SECOND, 0)
                cal.set(Calendar.MILLISECOND, 0)
                val start = cal.timeInMillis

                val endCal = cal.clone() as Calendar
                endCal.set(Calendar.HOUR_OF_DAY, 23)
                endCal.set(Calendar.MINUTE, 59)
                endCal.set(Calendar.SECOND, 59)
                endCal.set(Calendar.MILLISECOND, 999)
                val end = if (i == 0) now else endCal.timeInMillis

                val dayDurations = calculateAppUsage(usageStatsManager, start, end)
                var totalDay = 0L
                val appsForDay = Arguments.createArray()

                dayDurations.entries
                    .filter { it.value >= 1000 }
                    .sortedByDescending { it.value }
                    .forEach { (pkg, dur) ->
                        try {
                            val ai = pm.getApplicationInfo(pkg, 0)
                            val hasLauncher = pm.getLaunchIntentForPackage(pkg) != null
                            val isSystem = (ai.flags and ApplicationInfo.FLAG_SYSTEM) != 0
                            val include = hasLauncher || userAppHints.any { pkg.contains(it, true) }
                            if (!include) return@forEach

                            val appName = pm.getApplicationLabel(ai).toString()
                            val appMap = Arguments.createMap()
                            appMap.putString("packageName", pkg)
                            appMap.putString("appName", appName)
                            appMap.putDouble("timeMs", dur.toDouble())
                            appMap.putString("timeFormatted", formatTime(dur))
                            appsForDay.pushMap(appMap)
                            totalDay += dur
                        } catch (_: Exception) {}
                    }

                val map = Arguments.createMap()
                map.putString("date", dateFmt.format(Date(start)))
                map.putString("label", dayFmt.format(Date(start)))
                map.putDouble("timeMs", totalDay.toDouble())
                map.putString("timeFormatted", formatTime(totalDay))
                map.putBoolean("isToday", i == 0)
                map.putArray("apps", appsForDay)
                weeklyArray.pushMap(map)
            }

            // ✅ Build response
            val response = Arguments.createMap()
            response.putArray("apps", appsArray)
            response.putDouble("totalTimeMs", totalToday.toDouble())
            response.putDouble("totalScreenTime", totalToday.toDouble())
            response.putString("totalTime", formatTime(totalToday))
            response.putArray("weeklyData", weeklyArray)

            promise.resolve(response)
        } catch (e: Exception) {
            Log.e(TAG, "❌ Error: ${e.message}", e)
            promise.reject("ERR", e.message, e)
        }
    }

    /**
     * Uses UsageEvents for exact foreground timing.
     * Avoids duplicates from UsageStatsManager aggregation.
     */
    private fun calculateAppUsage(manager: UsageStatsManager, start: Long, end: Long): Map<String, Long> {
        val map = mutableMapOf<String, Long>()
        val resumed = mutableMapOf<String, Long>()

        try {
            val events = manager.queryEvents(start, end)
            val event = UsageEvents.Event()
            while (events.hasNextEvent()) {
                events.getNextEvent(event)
                when (event.eventType) {
                    UsageEvents.Event.ACTIVITY_RESUMED -> resumed[event.packageName] = event.timeStamp
                    UsageEvents.Event.ACTIVITY_PAUSED -> {
                        val startTime = resumed[event.packageName] ?: 0L
                        if (startTime > 0 && event.timeStamp > startTime) {
                            val dur = event.timeStamp - startTime
                            map[event.packageName] = (map[event.packageName] ?: 0L) + dur
                            resumed.remove(event.packageName)
                        }
                    }
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Event parsing failed: ${e.message}")
        }

        return map
    }

    private fun formatTime(ms: Long): String {
        if (ms < 60000) return "0m"
        val mins = (ms / 60000).toInt()
        val h = mins / 60
        val m = mins % 60
        return when {
            h > 0 && m > 0 -> "${h}h ${m}m"
            h > 0 -> "${h}h"
            m > 0 -> "${m}m"
            else -> "0m"
        }
    }

    private fun drawableToBase64(drawable: Drawable): String {
        val bmp = when (drawable) {
            is BitmapDrawable -> drawable.bitmap
            else -> {
                val width = drawable.intrinsicWidth.takeIf { it > 0 } ?: 96
                val height = drawable.intrinsicHeight.takeIf { it > 0 } ?: 96
                val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
                val canvas = Canvas(bitmap)
                drawable.setBounds(0, 0, canvas.width, canvas.height)
                drawable.draw(canvas)
                bitmap
            }
        }
        val stream = ByteArrayOutputStream()
        bmp.compress(Bitmap.CompressFormat.PNG, 80, stream)
        return Base64.encodeToString(stream.toByteArray(), Base64.NO_WRAP)
    }
}
