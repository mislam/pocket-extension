// polyfil for window.performance.now
var performance = window.performance || {}
var performanceNow =
   performance.now ||
   performance.hasOwnProperty('mozNow') ||
   performance.hasOwnProperty('msNow') ||
   performance.hasOwnProperty('oNow') ||
   performance.hasOwnProperty('webkitNow') ||
   function () {
      return new Date().getTime()
   }

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
export const hrtime = (previousTimestamp?: number[]) => {
   var clocktime = performanceNow.call(performance) * 1e-3
   var seconds = Math.floor(clocktime)
   var nanoseconds = Math.floor((clocktime % 1) * 1e9)
   if (previousTimestamp) {
      seconds = seconds - previousTimestamp[0]
      nanoseconds = nanoseconds - previousTimestamp[1]
      if (nanoseconds < 0) {
         seconds--
         nanoseconds += 1e9
      }
   }
   return [seconds, nanoseconds]
}
