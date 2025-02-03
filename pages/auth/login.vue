<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';

const router = useRouter();
const userStore = useUserStore();

const isRegistering = ref(false);
const registerState = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
});

// Initialize from storage on page load
onMounted(() => {
  userStore.initializeFromStorage();

  // Redirect if already logged in
  if (userStore.isAuthenticated) {
    if (userStore.isAdmin) {
      navigateTo('/admin');
    } else {
      navigateTo('/student');
    }
  }
});

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Must be at least 6 characters'),
});
// Registration schema
const registerSchema = z
  .object({
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Must be at least 6 characters'),
    name: z.string().min(2, 'Name is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type Schema = z.output<typeof schema>;
type RegisterSchema = z.output<typeof registerSchema>;

const state = reactive({
  email: '',
  password: '',
});

const rememberMe = ref(false);
const error = ref('');

async function onLogin(event: FormSubmitEvent<Schema>) {
  error.value = '';

  try {
    await userStore.login(event.data.email, event.data.password);

    // If remember me is checked, store email
    if (rememberMe.value) {
      localStorage.setItem('rememberMe', 'true');
      localStorage.setItem('lastEmail', event.data.email);
    } else {
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('lastEmail');
    }

    // Redirect based on role
    if (userStore.isAdmin) {
      router.push('/admin');
    } else {
      router.push('/student');
    }
  } catch (err: any) {
    console.error(err);
    error.value = err.message || 'An error occurred during login';
  }
}

async function onRegister(event: FormSubmitEvent<RegisterSchema>) {
  error.value = '';

  try {
    await userStore.register(
      event.data.email,
      event.data.password,
      event.data.name
    );
  } catch (err: any) {
    console.error(err);
    error.value = err.message || 'An error occurred during registration';
  }
}

// Check for remembered email on component mount
onMounted(() => {
  const remembered = localStorage.getItem('rememberMe');
  const lastEmail = localStorage.getItem('lastEmail');

  if (remembered && lastEmail) {
    state.email = lastEmail;
    rememberMe.value = true;
  }
});
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-300"
  >
    <div class="w-full max-w-md">
      <!-- Logo or Title -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Numerology Test</h1>
        {{ isRegistering ? 'Create an account' : 'Sign in to your account' }}
      </div>

      <div class="bg-white p-8 rounded-lg shadow-md">
        <!-- Error Alert -->
        <div
          v-if="error"
          class="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md"
        >
          {{ error }}
        </div>

        <!-- Login Form -->
        <UForm
          v-if="!isRegistering"
          :schema="schema"
          :state="state"
          class="space-y-6"
          @submit="onLogin"
        >
          <UFormGroup label="Email" name="email">
            <UInput v-model="state.email" type="email" />
          </UFormGroup>

          <UFormGroup label="Password" name="password">
            <UInput
              v-model="state.password"
              type="password"
              autocomplete="current-password"
            />
          </UFormGroup>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div class="text-sm">
              <a
                href="#"
                class="font-medium text-green-600 hover:text-green-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <!-- Add Register Option -->
          <div class="mt-4 text-center">
            <p class="text-sm text-gray-600">
              Don't have an account?
              <button
                type="button"
                class="text-green-600 hover:text-green-500 font-medium"
                @click="isRegistering = true"
              >
                Register now
              </button>
            </p>
          </div>

          <UButton
            type="submit"
            block
            color="green"
            variant="solid"
            class="w-full"
          >
            Sign in
          </UButton>
        </UForm>

        <UForm
          v-else
          :schema="registerSchema"
          :state="registerState"
          class="space-y-6"
          @submit="onRegister"
        >
          <UFormGroup label="Full Name" name="name">
            <UInput
              v-model="registerState.name"
              type="text"
              autocomplete="name"
            />
          </UFormGroup>

          <UFormGroup label="Email" name="email">
            <UInput
              v-model="registerState.email"
              type="email"
              autocomplete="email"
            />
          </UFormGroup>

          <UFormGroup label="Password" name="password">
            <UInput
              v-model="registerState.password"
              type="password"
              autocomplete="new-password"
            />
          </UFormGroup>

          <UFormGroup label="Confirm Password" name="confirmPassword">
            <UInput
              v-model="registerState.confirmPassword"
              type="password"
              autocomplete="new-password"
            />
          </UFormGroup>

          <UButton
            type="submit"
            block
            color="green"
            variant="solid"
            class="w-full"
          >
            Register
          </UButton>

          <!-- Back to Login -->
          <div class="mt-4 text-center">
            <p class="text-sm text-gray-600">
              Already have an account?
              <button
                type="button"
                class="text-green-600 hover:text-green-500 font-medium"
                @click="isRegistering = false"
              >
                Sign in
              </button>
            </p>
          </div>
        </UForm>

        <!-- Demo Credentials -->
        <div class="mt-6 space-y-2 text-sm text-gray-600">
          <p class="font-semibold">Demo Credentials:</p>
          <div class="space-y-1">
            <p>Admin: admin@numerology.com / admin123</p>
            <p>Student: student@numerology.com / student123</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
