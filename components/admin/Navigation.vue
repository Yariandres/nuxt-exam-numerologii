<script setup lang="ts">
const user = useSupabaseUser();
const routes = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: 'i-heroicons-home' },
  {
    name: 'Settings',
    path: '/admin/settings',
    icon: 'i-heroicons-cog-6-tooth',
  },
  {
    name: 'Sessions',
    path: '/admin/sessions',
    icon: 'i-heroicons-user-group',
  },
  {
    name: 'Exams Area',
    path: '/',
    icon: 'i-heroicons-pencil-square',
  },
];

const logout = async () => {
  await useSupabaseClient().auth.signOut();
  navigateTo('/auth');
};

const isOpen = ref(false);
</script>

<template>
  <nav class="shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <h1 class="text-xl font-bold text-gray-50">Admin Panel</h1>
          </div>

          <!-- Desktop Navigation Links -->
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <NuxtLink
              v-for="route in routes"
              :key="route.path"
              :to="route.path"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium"
              :class="[
                $route.path === route.path
                  ? 'border-b-2 border-green-500 text-gray-50'
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
          <div class="hidden sm:flex sm:items-center">
            <span class="text-sm text-gray-500 mr-4">{{ user?.email }}</span>
            <UButton color="red" variant="soft" size="sm" @click="logout">
              Logout
            </UButton>
          </div>

          <!-- Mobile menu button -->
          <div class="sm:hidden">
            <UButton
              color="gray"
              variant="ghost"
              @click="isOpen = !isOpen"
              class="inline-flex items-center justify-center p-2"
            >
              <UIcon
                :name="isOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'"
                class="w-6 h-6"
              />
            </UButton>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-show="isOpen" class="sm:hidden">
        <div class="pt-2 pb-3 space-y-1">
          <NuxtLink
            v-for="route in routes"
            :key="route.path"
            :to="route.path"
            class="flex items-center px-3 py-2 text-base font-medium"
            :class="[
              $route.path === route.path
                ? 'bg-green-500/10 border-l-4 border-green-500 text-green-500'
                : 'text-gray-500 hover:bg-gray-700/10 hover:text-gray-300',
            ]"
            @click="isOpen = false"
          >
            <UIcon :name="route.icon" class="w-5 h-5 mr-3" />
            {{ route.name }}
          </NuxtLink>
        </div>
        <!-- Mobile menu footer -->
        <div class="pt-4 pb-3 border-t border-gray-700">
          <div class="px-3 space-y-3">
            <p class="text-sm text-gray-500">{{ user?.email }}</p>
            <UButton
              color="red"
              variant="soft"
              size="sm"
              @click="logout"
              class="w-full"
            >
              Logout
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
