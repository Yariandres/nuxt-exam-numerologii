<script setup lang="ts">
const { supabase } = useSupabase();

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const error = ref('');
const successMessage = ref('');
const activeTab = ref('signin'); // 'signin' or 'signup'

const signInWithEmail = async () => {
  if (!email.value || !password.value) {
    error.value = 'Please enter both email and password';
    return;
  }

  isLoading.value = true;
  error.value = '';
  successMessage.value = '';

  try {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (signInError) throw signInError;

    // Redirect to dashboard on success
    navigateTo('/admin/dashboard');
  } catch (err: any) {
    console.error('Login error:', err);
    error.value = err.message || 'Failed to sign in';
  } finally {
    isLoading.value = false;
  }
};

const signUp = async () => {
  if (!email.value || !password.value) {
    error.value = 'Please enter both email and password';
    return;
  }

  isLoading.value = true;
  error.value = '';
  successMessage.value = '';

  try {
    const { error: signUpError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        emailRedirectTo: `${window.location.origin}/admin/dashboard`,
      },
    });

    if (signUpError) throw signUpError;

    successMessage.value = 'Check your email to confirm your registration!';
  } catch (err: any) {
    console.error('Registration error:', err);
    error.value = err.message || 'Failed to sign up';
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
  email.value = '';
  password.value = '';
  error.value = '';
  successMessage.value = '';
};

watch(activeTab, () => {
  resetForm();
});
</script>

<template>
  <section
    class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8 ring-2 ring-gray-200 rounded-lg p-4">
      <!-- Header -->
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-200">
          Admin Portal
        </h2>
      </div>

      <!-- Tabs -->
      <div class="flex">
        <button
          :class="[
            'flex-1 py-2 px-4 text-center',
            activeTab === 'signin'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700',
          ]"
          @click="activeTab = 'signin'"
        >
          Sign In
        </button>
        <button
          :class="[
            'flex-1 py-2 px-4 text-center',
            activeTab === 'signup'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700',
          ]"
          @click="activeTab = 'signup'"
        >
          Sign Up
        </button>
      </div>

      <!-- Form -->
      <form
        class="mt-8 space-y-6"
        @submit.prevent="activeTab === 'signin' ? signInWithEmail() : signUp()"
      >
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Email address
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="••••••••"
            />
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <!-- Success Message -->
        <div
          v-if="successMessage"
          class="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm text-center"
        >
          {{ successMessage }}
        </div>

        <!-- Submit Button -->
        <div>
          <UButton
            type="submit"
            :loading="isLoading"
            :disabled="isLoading"
            block
            color="primary"
          >
            {{
              isLoading
                ? activeTab === 'signin'
                  ? 'Signing in...'
                  : 'Signing up...'
                : activeTab === 'signin'
                ? 'Sign In'
                : 'Sign Up'
            }}
          </UButton>
        </div>
      </form>

      <!-- Help Text -->
      <p class="mt-4 text-center text-sm text-gray-600">
        {{
          activeTab === 'signin'
            ? 'Sign in with your email and password'
            : 'Create a new admin account'
        }}
      </p>
    </div>
  </section>
</template>
