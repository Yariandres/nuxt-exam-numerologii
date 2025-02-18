<script setup lang="ts">
const props = defineProps<{
  minutes: number;
}>();

const emit = defineEmits<{
  timeUp: []; // Emitted when timer reaches zero
}>();

// Convert minutes to seconds for countdown
const totalSeconds = ref(props.minutes * 60);

// Update totalSeconds when minutes prop changes
watch(
  () => props.minutes,
  (newMinutes) => {
    totalSeconds.value = newMinutes * 60;
  }
);

const formattedTime = computed(() => {
  const minutes = Math.floor(totalSeconds.value / 60);
  const seconds = totalSeconds.value % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Computed properties for styling
const isLowTime = computed(() => totalSeconds.value < 300); // Less than 5 minutes
const isCriticalTime = computed(() => totalSeconds.value < 60); // Less than 1 minute

// Start timer
const timer = setInterval(() => {
  if (totalSeconds.value > 0) {
    totalSeconds.value--;
    // Store current time in localStorage
    const endTime = new Date();
    endTime.setSeconds(endTime.getSeconds() + totalSeconds.value);
    localStorage.setItem('examEndTime', endTime.toISOString());
  } else {
    clearInterval(timer);
    emit('timeUp');
  }
}, 1000);

// Clean up on component unmount
onUnmounted(() => {
  clearInterval(timer);
});
</script>

<template>
  <div
    class="fixed top-4 right-4 p-4 rounded-lg shadow-md transition-all duration-300"
    :class="[
      isCriticalTime
        ? 'bg-red-100 animate-pulse'
        : isLowTime
        ? 'bg-yellow-100'
        : 'bg-white',
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
      Time Remaining: {{ formattedTime }}
    </p>
    <p v-if="isLowTime && !isCriticalTime" class="text-sm text-yellow-600 mt-1">
      Less than 5 minutes remaining!
    </p>
    <p v-if="isCriticalTime" class="text-sm text-red-600 mt-1 font-bold">
      Less than 1 minute remaining!
    </p>
  </div>
</template>
