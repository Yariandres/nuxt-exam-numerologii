import { useState } from '#imports';

export const useExamTimer = () => {
  // Make the state globally reactive using useState
  const totalSeconds = useState('examTimer', () => 0);
  const timerMinutes = useState('examTimerMinutes', () => 0);
  const isTimeUp = useState('examTimeUp', () => false);
  const timer = useState<NodeJS.Timer | null>('examTimerInterval', () => null);

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
    if (timer.value) {
      clearInterval(timer.value);
      timer.value = null;
    }

    timer.value = setInterval(() => {
      if (totalSeconds.value > 0) {
        totalSeconds.value--;
        timerMinutes.value = Math.ceil(totalSeconds.value / 60);
      } else {
        if (timer.value) {
          clearInterval(timer.value);
          timer.value = null;
        }
        isTimeUp.value = true;
        onTimeUp();
      }
    }, 1000);
  };

  // Initialize or resume timer
  const initializeTimer = async (onTimeUp: () => void) => {
    try {
      console.log('Initializing timer...');
      // Check if there's an existing timer
      const remainingSeconds = getRemainingTime();
      console.log('Remaining seconds:', remainingSeconds);

      if (remainingSeconds > 0) {
        console.log('Resuming existing timer');
        totalSeconds.value = remainingSeconds;
        timerMinutes.value = Math.ceil(remainingSeconds / 60);
      } else {
        console.log('Starting new timer');
        const { data } = await useFetch('/api/admin/settings');
        console.log('Timer settings:', data.value);

        if (data.value) {
          const minutes = data.value.timerMinutes;
          totalSeconds.value = minutes * 60;
          timerMinutes.value = minutes;

          // Set end time in localStorage
          const endTime = new Date();
          endTime.setMinutes(endTime.getMinutes() + minutes);
          localStorage.setItem('examEndTime', endTime.toISOString());
          console.log('Set end time:', endTime.toISOString());
        }
      }

      startTimer(onTimeUp);
    } catch (error) {
      console.error('Failed to initialize timer:', error);
      // Fallback to default 30 minutes
      totalSeconds.value = 1800;
      timerMinutes.value = 30;
      const endTime = new Date();
      endTime.setMinutes(endTime.getMinutes() + 30);
      localStorage.setItem('examEndTime', endTime.toISOString());
      startTimer(onTimeUp);
    }
  };

  // Clear timer data
  const clearTimer = () => {
    if (timer.value) {
      clearInterval(timer.value);
      timer.value = null;
    }
    localStorage.removeItem('examEndTime');
    totalSeconds.value = 0;
    timerMinutes.value = 0;
    isTimeUp.value = false;
  };

  return {
    formattedTime,
    isLowTime,
    isCriticalTime,
    isTimeUp,
    timerMinutes,
    initializeTimer,
    clearTimer,
  };
};
