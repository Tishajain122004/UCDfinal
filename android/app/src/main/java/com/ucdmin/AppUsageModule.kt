package com.ucdmin

import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Environment
import com.facebook.react.bridge.*
import java.io.File
import java.io.FileOutputStream
import java.util.*

class AppUsageModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "AppUsageModule"

    @ReactMethod
    fun getAppUsage(promise: Promise) {
        try {
            val usageStatsManager =
                reactContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

            val endTime = System.currentTimeMillis()
            val startTime = endTime - 24 * 60 * 60 * 1000 // last 24 hours

            val events = usageStatsManager.queryEvents(startTime, endTime)
            val usageMap = mutableMapOf<String, Long>()

            var lastResumedMap = mutableMapOf<String, Long>()

            while (events.hasNextEvent()) {
                val event = UsageEvents.Event()
                events.getNextEvent(event)

                if (event.packageName == null) continue

                when (event.eventType) {
                    UsageEvents.Event.ACTIVITY_RESUMED -> {
                        lastResumedMap[event.packageName] = event.timeStamp
                    }

                    UsageEvents.Event.ACTIVITY_PAUSED,
                    UsageEvents.Event.ACTIVITY_STOPPED -> {
                        val start = lastResumedMap[event.packageName]
                        if (start != null && event.timeStamp > start) {
                            val duration = event.timeStamp - start
                            usageMap[event.packageName] =
                                usageMap.getOrDefault(event.packageName, 0L) + duration
                            lastResumedMap.remove(event.packageName)
                        }
                    }
                }
            }

            // Handle unclosed sessions (still running)
            val now = System.currentTimeMillis()
            for ((pkg, start) in lastResumedMap) {
                usageMap[pkg] = usageMap.getOrDefault(pkg, 0L) + (now - start)
            }

            val pm = reactContext.packageManager
            val appList = usageMap
                .mapNotNull { (pkg, time) ->
                    try {
                        val ai = pm.getApplicationInfo(pkg, 0)
                        val appName = pm.getApplicationLabel(ai).toString()
                        val iconUri = saveAppIconToCache(ai)
                        val formatted = formatDuration(time)
                        mapOf(
                            "appName" to appName,
                            "packageName" to pkg,
                            "iconUri" to iconUri,
                            "timeFormatted" to formatted,
                            "timeMs" to time
                        )
                    } catch (e: Exception) {
                        null
                    }
                }
                .filter { isUserApp(pm, it["packageName"] as String) }
                .sortedByDescending { it["timeMs"] as Long }
                .take(10)

            val result = WritableNativeArray()
            for (app in appList) {
                val map = WritableNativeMap()
                app.forEach { (key, value) ->
                    when (value) {
                        is String -> map.putString(key, value)
                        is Long -> map.putDouble(key, value.toDouble())
                    }
                }
                result.pushMap(map)
            }

            promise.resolve(result)
        } catch (e: Exception) {
            e.printStackTrace()
            promise.reject("ERROR", e.message)
        }
    }

    private fun formatDuration(ms: Long): String {
        val seconds = ms / 1000
        val hours = seconds / 3600
        val minutes = (seconds % 3600) / 60
        return when {
            hours > 0 -> "${hours}h ${minutes}m"
            minutes > 0 -> "${minutes}m"
            else -> "${seconds}s"
        }
    }

    private fun isUserApp(pm: PackageManager, packageName: String): Boolean {
        return try {
            val ai = pm.getApplicationInfo(packageName, 0)
            (ai.flags and ApplicationInfo.FLAG_SYSTEM) == 0 &&
                    pm.getLaunchIntentForPackage(packageName) != null
        } catch (e: Exception) {
            false
        }
    }

    private fun saveAppIconToCache(ai: ApplicationInfo): String {
        val pm = reactContext.packageManager
        val icon = pm.getApplicationIcon(ai)
        val file = File(reactContext.cacheDir, "${ai.packageName}.png")
        if (!file.exists()) {
            val bitmap = (icon as android.graphics.drawable.BitmapDrawable).bitmap
            FileOutputStream(file).use { out ->
                bitmap.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, out)
            }
        }
        return Uri.fromFile(file).toString()
    }
}
