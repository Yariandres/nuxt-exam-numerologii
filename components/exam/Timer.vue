<template>
  <div>
    <p>Time Remaining: {{ time }} seconds</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  time: {
    type: Number,
    required: true,
  },
});

const remainingTime = ref(props.time);

watch(
  () => props.time,
  (newTime) => {
    remainingTime.value = newTime;
  }
);

// // Logic to count down the timer
// setInterval(() => {
//   if (remainingTime.value > 0) {
//     remainingTime.value--;
//   }
// }, 1000);
</script>
