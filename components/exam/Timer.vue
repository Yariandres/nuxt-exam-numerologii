<script setup lang="ts">
const { formattedTime, isLowTime, isCriticalTime } = useExamTimer();
</script>

<template>
  <div
    class="fixed top-12 p-4 rounded-lg shadow-md transition-all duration-300"
    :class="[
      isCriticalTime
        ? 'bg-red-100 animate-pulse'
        : isLowTime
        ? 'bg-yellow-100'
        : 'bg-gray-100',
    ]"
  >
    <p
      class="text-lg font-mono font-bold"
      :class="[
        isCriticalTime
          ? 'text-red-600'
          : isLowTime
          ? 'text-yellow-600'
          : 'text-gray-600',
      ]"
    >
      Pozostały czas: {{ formattedTime }}
    </p>
    <p v-if="isLowTime && !isCriticalTime" class="text-sm text-yellow-600 mt-1">
      Zostało mniej niż 5 minut!
    </p>
    <p v-if="isCriticalTime" class="text-sm text-red-600 mt-1 font-bold">
      Została mniej niż 1 minuta!
    </p>
  </div>
</template>
