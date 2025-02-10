<template>
  <div class="min-h-screen flex flex-col">
    <header class="ml-auto">
      <nav
        class="max-w-7xl mx-auto flex justify-between items-center py-4 px-4 sm:px-6 lg:px-8"
      >
        <StudentNavigation />
      </nav>
    </header>

    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

    <footer>
      <div class="flex justify-center my-4">
        <p class="text-gray-500 text-sm">
          <span class="font-bold text-pink-300">&copy;</span>
          {{ new Date().getFullYear() }}
          <a
            href="https://www.linkedin.com/in/yari-herrera-9677a9160/"
            class="hover:text-gray-200"
            >Yari Herrera for
          </a>
          <a
            href="https://www.szkolanumerologii.pl/"
            class="hover:text-pink-500 text-pink-300 underline"
            >SzkolaNumerologii</a
          >
        </p>
      </div>
    </footer>
  </div>
</template>
