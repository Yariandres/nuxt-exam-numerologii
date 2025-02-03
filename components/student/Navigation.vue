<script setup lang="ts">
const userStore = useUserStore();
const loading = ref(false);

const supabase = useSupabaseClient();

async function signOut() {
  try {
    loading.value = true;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    userStore.user = null;
    navigateTo('/auth/login');
  } catch (error: unknown) {
    if (error instanceof Error) {
      alert(error.message);
    } else {
      alert('An unknown error occurred');
    }
  } finally {
    loading.value = false;
  }
}
</script>
<template>
  <nav>
    <ul>
      <li>
        <UButton :loading="loading" @click="signOut">Sign Out</UButton>
      </li>
    </ul>
  </nav>
</template>
