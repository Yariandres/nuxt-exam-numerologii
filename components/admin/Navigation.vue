<script setup lang="ts">
const routes = [
  { name: 'Dashboard', path: '/admin', icon: 'i-heroicons-home' },
  {
    name: 'Questions',
    path: '/admin/questions',
    icon: 'i-heroicons-question-mark-circle',
  },
  {
    name: 'Settings',
    path: '/admin/settings',
    icon: 'i-heroicons-cog-6-tooth',
  },
];
</script>

<template>
  <nav class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <h1 class="text-xl font-bold text-gray-900">Admin Panel</h1>
          </div>

          <!-- Navigation Links -->
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <NuxtLink
              v-for="route in routes"
              :key="route.path"
              :to="route.path"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium"
              :class="[
                $route.path === route.path
                  ? 'border-b-2 border-green-500 text-gray-900'
                  : 'text-gray-500 hover:border-b-2 hover:border-gray-300 hover:text-gray-700',
              ]"
            >
              <UIcon :name="route.icon" class="w-5 h-5 mr-2" />
              {{ route.name }}
            </NuxtLink>
          </div>
        </div>

        <!-- Right side -->
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <span class="text-sm text-gray-500 mr-4">{{ 'user.email' }}</span>
            <UButton color="red" variant="soft" size="sm"> Logout </UButton>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
