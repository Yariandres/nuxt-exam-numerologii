export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore();

  console.log(userStore.user);
});
