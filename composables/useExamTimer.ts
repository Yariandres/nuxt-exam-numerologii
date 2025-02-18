import { useState } from '#imports';

export const useExamTimer = () => {
  // Make the state globally reactive using useState
  const totalSeconds = useState('examTimer', () => 0);
  const isTimeUp = useState('examTimeUp', () => false);
  let timer: NodeJS.Timer | null = null;

  // Format time for display
  const formattedTime = computed(() => {
    const minutes = Math.floor(totalSeconds.value / 60);
    const seconds = totalSeconds.value % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  });

  // Computed properties for styling
  const isLowTime = computed(() => totalSeconds.value < 300);
  const isCriticalTime = computed(() => totalSeconds.value < 60);

  // Get remaining time in seconds
  const getRemainingTime = (): number => {
    const endTimeStr = localStorage.getItem('examEndTime');
    if (!endTimeStr) return 0;

    const endTime = new Date(endTimeStr);
    const now = new Date();
    const diffMs = endTime.getTime() - now.getTime();
    return Math.max(0, Math.floor(diffMs / 1000));
  };

  // Start the timer
  const startTimer = (onTimeUp: () => void) => {
    if (timer) return; // Prevent multiple timers

    timer = setInterval(() => {
      if (totalSeconds.value > 0) {
        totalSeconds.value--;
      } else {
        if (timer) {
          clearInterval(timer as NodeJS.Timeout);
          timer = null;
        }
        isTimeUp.value = true;
        onTimeUp();
      }
    }, 1000);
  };

  // Initialize or resume timer
  const initializeTimer = async (onTimeUp: () => void) => {
    try {
      // Check if there's an existing timer
      const remainingSeconds = getRemainingTime();

      if (remainingSeconds > 0) {
        // Resume existing timer
        totalSeconds.value = remainingSeconds;
      } else {
        // Start new timer
        const { data } = await useFetch('/api/admin/settings');
        if (data.value) {
          const minutes = data.value.timerMinutes;
          totalSeconds.value = minutes * 60;

          // Set end time in localStorage
          const endTime = new Date();
          endTime.setMinutes(endTime.getMinutes() + minutes);
          localStorage.setItem('examEndTime', endTime.toISOString());
        }
      }

      startTimer(onTimeUp);
    } catch (error) {
      console.error('Failed to initialize timer:', error);
      // Fallback to default 30 minutes
      totalSeconds.value = 1800; // 30 minutes in seconds
      const endTime = new Date();
      endTime.setMinutes(endTime.getMinutes() + 30);
      localStorage.setItem('examEndTime', endTime.toISOString());
      startTimer(onTimeUp);
    }
  };

  // Clear timer data
  const clearTimer = () => {
    if (timer) {
      clearInterval(timer as NodeJS.Timeout);
      timer = null;
    }
    localStorage.removeItem('examEndTime');
    totalSeconds.value = 0;
    isTimeUp.value = false;
  };

  return {
    formattedTime,
    isLowTime,
    isCriticalTime,
    isTimeUp,
    initializeTimer,
    clearTimer,
  };
};
