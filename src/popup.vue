<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import navigation from '@/components/navigation.vue'
</script>

<template>
   <navigation />
   <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'slide-fade'" mode="out-in">
         <component :is="Component" />
      </transition>
   </router-view>
</template>
