<script setup>
import { reactive, onMounted } from 'vue'

defineProps({
   msg: String,
})

const state = reactive({ count: 0 })

onMounted(async () => {
   if (chrome && chrome.storage !== undefined) {
      state.count = (await chrome.storage.sync.get('count')).count
   }
})

function increment() {
   state.count++
   chrome && chrome.storage && chrome.storage.sync.set({ count: state.count })
   console.log(`Count is now: ${state.count}`)
}
</script>

<template>
   <div class="m-4">
      <h1 class="text-3xl font-semibold">
         {{ msg }}
         <span class="text-purple-500">Vite</span> + <span class="text-green-500">Vue 3</span> +
         <span class="text-blue-500">Tailwind CSS</span>
      </h1>

      <p class="my-4">
         Recommended IDE setup:
         <a href="https://code.visualstudio.com/" target="_blank">VSCode</a>
         +
         <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
      </p>

      <p class="my-4">
         Docs:
         <a href="https://laravel-vite.dev/guide/quick-start.html" target="_blank">Vite</a>
         |
         <a href="https://vuejs.org/guide" target="_blank">Vue 3</a>
         |
         <a href="https://tailwindcss.com/docs" target="_blank">Tailwind CSS</a>
      </p>

      Click here:
      <button type="button" @click="increment">count is: {{ state.count }}</button>
      <p class="my-4">
         Edit
         <code class="text-amber-700">components/HelloWorld.vue</code> to test hot module
         replacement.
      </p>
   </div>
</template>

<style scoped>
a {
   @apply text-green-500 underline;
}
button {
   @apply px-1 bg-slate-400 border border-slate-600 rounded-sm;
}
</style>
