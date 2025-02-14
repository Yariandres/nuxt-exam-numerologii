<template>
  <div class="min-h-screen flex flex-col">
    <AdminNavigation />
    <main class="flex-1">
      <slot />
    </main>

    <footer>
      <div class="flex justify-center my-4">
        <p class="text-gray-500 text-sm">
          <span class="font-bold text-pink-300">&copy;</span>
          {{ new Date().getFullYear() }}
        </p>
      </div>
    </footer>
  </div>
</template>
