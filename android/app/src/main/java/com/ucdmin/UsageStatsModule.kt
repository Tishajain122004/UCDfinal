package com.ucdmin

import android.app.usage.UsageStats
import android.app.usage.UsageStatsManager
import android.content.Context
import com.facebook.react.bridge.*
import java.util.*

class UsageStatsModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "UsageStatsModule"
    }

    @ReactMethod
    fun getUsageStats(promise: Promise) {
        try {
            val usageStatsManager =
                reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

            val endTime = System.currentTimeMillis()
            val startTime = endTime - 1000 * 60 * 60 * 24 // last 24 hours

            val stats: List<UsageStats> =
                usageStatsManager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, startTime, endTime)

            val result = Arguments.createArray()

            for (usage in stats) {
                val appData = Arguments.createMap()
                appData.putString("packageName", usage.packageName)
                appData.putDouble("totalTimeForeground", (usage.totalTimeInForeground / 1000).toDouble()) // in seconds
                result.pushMap(appData)
            }

            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("ERR_USAGE_STATS", e.message)
        }
    }
}
