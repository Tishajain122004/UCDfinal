package com.ucdmin

import android.app.usage.UsageStats
import android.app.usage.UsageStatsManager
import android.app.AppOpsManager
import android.content.Context
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.graphics.drawable.BitmapDrawable
import android.os.Build
import android.provider.Settings
import android.util.Base64
import com.facebook.react.bridge.*
import java.io.ByteArrayOutputStream
import java.util.*

class AppUsageModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "AppUsageModule"

    @ReactMethod
    fun hasUsagePermission(promise: Promise) {
        try {
            val context = reactApplicationContext
            val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
            val mode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                appOps.unsafeCheckOpNoThrow(
                    AppOpsManager.OPSTR_GET_USAGE_STATS,
                    android.os.Process.myUid(),
                    context.packageName
                )
            } else {
                appOps.checkOpNoThrow(
                    AppOpsManager.OPSTR_GET_USAGE_STATS,
                    android.os.Process.myUid(),
                    context.packageName
                )
            }

            var granted = (mode == AppOpsManager.MODE_ALLOWED)
            if (!granted) {
                val usm = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
                val now = System.currentTimeMillis()
                val stats = usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, now - 1000 * 60 * 60, now)
                granted = !stats.isNullOrEmpty()
            }
            promise.resolve(granted)
        } catch (e: Exception) {
            promise.reject("HAS_USAGE_ERR", e)
        }
    }

    @ReactMethod
    fun openUsageSettings() {
        val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        reactApplicationContext.startActivity(intent)
    }

    @ReactMethod
    fun getDailyUsage(promise: Promise) {
        try {
            val usm = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
            val endTime = System.currentTimeMillis()
            val startTime = endTime - 1000 * 60 * 60 * 24

            val stats: List<UsageStats> = usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, startTime, endTime)
            val result = WritableNativeArray()
            val pm = reactApplicationContext.packageManager
            val bins = IntArray(24) { 0 }

            for (usage in stats) {
                if (usage.totalTimeInForeground <= 0) continue
                // Skip non-launchable/system services such as Settings, installers, device services
                val hasLauncher = try { pm.getLaunchIntentForPackage(usage.packageName) != null } catch (_: Exception) { false }
                if (!hasLauncher) continue
                if (usage.packageName == reactApplicationContext.packageName) continue

                var appName = usage.packageName
                var iconBase64 = ""
                try {
                    val ai: ApplicationInfo = pm.getApplicationInfo(usage.packageName, 0)
                    appName = pm.getApplicationLabel(ai).toString()
                    val iconDrawable = pm.getApplicationIcon(ai)
                    if (iconDrawable is BitmapDrawable) {
                        val bitmap = iconDrawable.bitmap
                        val stream = ByteArrayOutputStream()
                        bitmap.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, stream)
                        iconBase64 = Base64.encodeToString(stream.toByteArray(), Base64.DEFAULT)
                    }
                } catch (_: Exception) {
                    // Fallback to package name only when app info is not visible
                }

                val totalMinutes = (usage.totalTimeInForeground / 1000 / 60).toInt()
                val cal = Calendar.getInstance()
                cal.timeInMillis = usage.lastTimeUsed
                val h = cal.get(Calendar.HOUR_OF_DAY)
                if (h in 0..23) bins[h] += totalMinutes

                val map = WritableNativeMap()
                map.putString("packageName", usage.packageName)
                map.putString("appName", appName)
                map.putInt("totalTime", totalMinutes)
                map.putString("icon", iconBase64)

                result.pushMap(map)
            }

            val finalRes = WritableNativeMap()
            finalRes.putArray("apps", result)

            val binsArray = WritableNativeArray()
            bins.forEach { binsArray.pushInt(it) }
            finalRes.putArray("bins", binsArray)

            promise.resolve(finalRes)
        } catch (e: Exception) {
            promise.reject("USAGE_ERROR", e)
        }
    }

    @ReactMethod
    fun getWeeklyUsage(promise: Promise) {
        try {
            val context = reactApplicationContext
            val pm = context.packageManager
            val usm = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

            val endTime = System.currentTimeMillis()
            val startTime = endTime - 7L * 24L * 60L * 60L * 1000L

            val stats: List<UsageStats> = usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, startTime, endTime)

            // Prepare buckets for 7 days ending today. Index 6 -> today, 0 -> 6 days ago
            val calendar = Calendar.getInstance()
            calendar.timeInMillis = endTime
            calendar.set(Calendar.HOUR_OF_DAY, 0)
            calendar.set(Calendar.MINUTE, 0)
            calendar.set(Calendar.SECOND, 0)
            calendar.set(Calendar.MILLISECOND, 0)
            val todayStart = calendar.timeInMillis
            val dayMs = 24L * 60L * 60L * 1000L
            val weekStart = todayStart - 6L * dayMs

            data class AppAgg(var minutes: Int)

            val perDayPerApp: Array<MutableMap<String, AppAgg>> = Array(7) { mutableMapOf() }
            val dayTotals = IntArray(7) { 0 }

            for (usage in stats) {
                if (usage.totalTimeInForeground <= 0) continue
                val pkg = usage.packageName
                val totalMinutes = (usage.totalTimeInForeground / 1000 / 60).toInt()

                // Bucket by the start of the daily interval instead of lastTimeUsed
                val bucketStart = normalizeToDayStart(usage.firstTimeStamp)
                val idx = (((bucketStart - weekStart) / dayMs)).toInt()
                if (idx !in 0..6) continue

                val appMap = perDayPerApp[idx]
                val agg = appMap.getOrPut(pkg) { AppAgg(0) }
                agg.minutes += totalMinutes
                dayTotals[idx] += totalMinutes
            }

            val daysArray = WritableNativeArray()
            for (i in 0 until 7) {
                val dayStart = todayStart - (6 - i).toLong() * 24L * 60L * 60L * 1000L
                val dayMap = WritableNativeMap()

                // Label like Mon, Tue, ... and date yyyy-MM-dd
                val dayCal = Calendar.getInstance()
                dayCal.timeInMillis = dayStart
                val dayLabel = dayCal.getDisplayName(Calendar.DAY_OF_WEEK, Calendar.SHORT, Locale.getDefault()) ?: "Day"

                dayMap.putString("label", dayLabel)
                dayMap.putDouble("date", dayStart.toDouble())
                dayMap.putInt("totalMinutes", dayTotals[i])

                val appsArray = WritableNativeArray()
                val appEntries = perDayPerApp[i].entries
                    .sortedByDescending { it.value.minutes }

                for ((pkg, agg) in appEntries) {
                    // Only include launchable user apps, exclude this app itself
                    val hasLauncher = try { pm.getLaunchIntentForPackage(pkg) != null } catch (_: Exception) { false }
                    if (!hasLauncher) continue
                    if (pkg == context.packageName) continue
                    var appName = pkg
                    var iconBase64 = ""
                    try {
                        val ai: ApplicationInfo = pm.getApplicationInfo(pkg, 0)
                        appName = pm.getApplicationLabel(ai).toString()
                        val iconDrawable = pm.getApplicationIcon(ai)
                        if (iconDrawable is BitmapDrawable) {
                            val bitmap = iconDrawable.bitmap
                            val stream = ByteArrayOutputStream()
                            bitmap.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, stream)
                            iconBase64 = Base64.encodeToString(stream.toByteArray(), Base64.DEFAULT)
                        }
                    } catch (_: Exception) {
                        // Fallback when package visibility restricts resolving app info
                    }

                    val appMap = WritableNativeMap()
                    appMap.putString("packageName", pkg)
                    appMap.putString("appName", appName)
                    appMap.putInt("totalMinutes", agg.minutes)
                    appMap.putString("icon", iconBase64)
                    appsArray.pushMap(appMap)
                }

                dayMap.putArray("apps", appsArray)
                daysArray.pushMap(dayMap)
            }

            val finalRes = WritableNativeMap()
            finalRes.putArray("days", daysArray)
            promise.resolve(finalRes)
        } catch (e: Exception) {
            promise.reject("WEEKLY_USAGE_ERROR", e)
        }
    }

    private fun normalizeToDayStart(timeMillis: Long): Long {
        val cal = Calendar.getInstance()
        cal.timeInMillis = timeMillis
        cal.set(Calendar.HOUR_OF_DAY, 0)
        cal.set(Calendar.MINUTE, 0)
        cal.set(Calendar.SECOND, 0)
        cal.set(Calendar.MILLISECOND, 0)
        return cal.timeInMillis
    }
}