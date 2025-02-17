export const useExamTimer = () => {
  const timerMinutes = ref(30);
  const isTimeUp = ref(false);

  // Fetch timer settings from the API
  const fetchTimerSettings = async () => {
    try {
      const { data } = await useFetch('/api/admin/settings');
      if (data.value) {
        timerMinutes.value = data.value.timerMinutes;
      }
    } catch (error) {
      console.error('Failed to fetch timer settings:', error);
      // Fallback to default 30 minutes
      timerMinutes.value = 30;
    }
  };

  // Handle time up event
  const handleTimeUp = () => {
    isTimeUp.value = true;
  };

  return {
    timerMinutes,
    isTimeUp,
    fetchTimerSettings,
    handleTimeUp,
  };
};
