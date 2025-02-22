<script setup lang="ts">
const isLoading = ref(false);
const studentName = ref('');
const studentEmail = ref('');
const nameError = ref('');
const emailError = ref('');
const backgroundElements = ref<{
  largeNumbers: {
    fontSize: string;
    left: string;
    top: string;
    animationDelay: string;
    animationDuration: string;
    number: number;
  }[];
  smallNumbers: {
    fontSize: string;
    left: string;
    top: string;
    animationDelay: string;
    animationDuration: string;
    number: number;
  }[];
  stars: {
    width: string;
    height: string;
    left: string;
    top: string;
    animationDelay: string;
    animationDuration: string;
    opacity: number;
  }[];
}>({
  largeNumbers: [],
  smallNumbers: [],
  stars: [],
});

definePageMeta({
  layout: 'student',
});

const validateAndStart = async () => {
  nameError.value = '';
  emailError.value = '';

  // Validate name
  if (!studentName.value.trim()) {
    nameError.value = 'Proszę wpisać swoje imię';
    return;
  }

  if (studentName.value.length < 3) {
    nameError.value = 'Imię musi mieć co najmniej 3 znaki';
    return;
  }

  // Validate email
  if (!studentEmail.value.trim()) {
    emailError.value = 'Proszę wpisać adres email';
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(studentEmail.value.trim())) {
    emailError.value = 'Proszę wpisać prawidłowy adres email';
    return;
  }

  isLoading.value = true;
  try {
    const response = await $fetch('/api/exam/initialize', {
      method: 'POST',
      body: {
        studentName: studentName.value.trim(),
        studentEmail: studentEmail.value.trim(),
      },
    });

    localStorage.setItem('examSessionId', response.id);
    localStorage.setItem('studentName', studentName.value.trim());
    localStorage.setItem('studentEmail', studentEmail.value.trim());
    localStorage.setItem(
      'questionSlugs',
      JSON.stringify(response.questionSlugs)
    );

    if (response.questionSlugs.length > 0) {
      await navigateTo(`/student/question/${response.questionSlugs[0]}`);
    } else {
      throw new Error('No questions available');
    }
  } catch (error) {
    nameError.value = 'Nie udało się rozpocząć egzaminu. Spróbuj ponownie.';
  } finally {
    isLoading.value = false;
  }
};

// Create the background elements data on mount to avoid hydration mismatch
onMounted(() => {
  // Large numbers
  backgroundElements.value = {
    largeNumbers: Array.from({ length: 20 }, () => ({
      fontSize: `${Math.random() * 100 + 50}px`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${Math.random() * 10 + 10}s`,
      number: Math.floor(Math.random() * 9) + 1,
    })),
    smallNumbers: Array.from({ length: 40 }, () => ({
      fontSize: `${Math.random() * 20 + 10}px`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${Math.random() * 4 + 2}s`,
      number: Math.floor(Math.random() * 9) + 1,
    })),
    stars: Array.from({ length: 50 }, () => ({
      width: `${Math.random() * 3 + 1}px`,
      height: `${Math.random() * 3 + 1}px`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      opacity: Math.random() * 0.5 + 0.1,
    })),
  };
});
</script>

<template>
  <div class="min-h-screen min-h-[100dvh] bg-gray-900 relative overflow-hidden">
    <!-- Animated Background -->
    <div class="absolute inset-0 overflow-hidden">
      <ClientOnly>
        <!-- Large Numbers -->
        <div
          v-for="(item, index) in backgroundElements.largeNumbers"
          :key="`large-${index}`"
          class="absolute text-gray-700/10 font-bold animate-float"
          :style="{
            fontSize: item.fontSize,
            left: item.left,
            top: item.top,
            animationDelay: item.animationDelay,
            animationDuration: item.animationDuration,
          }"
        >
          {{ item.number }}
        </div>

        <!-- Small Numbers -->
        <div
          v-for="(item, index) in backgroundElements.smallNumbers"
          :key="`small-${index}`"
          class="absolute text-gray-700/5 animate-pulse"
          :style="{
            fontSize: item.fontSize,
            left: item.left,
            top: item.top,
            animationDelay: item.animationDelay,
            animationDuration: item.animationDuration,
          }"
        >
          {{ item.number }}
        </div>

        <!-- Stars -->
        <div
          v-for="(item, index) in backgroundElements.stars"
          :key="`star-${index}`"
          class="absolute bg-white rounded-full animate-twinkle"
          :style="{
            width: item.width,
            height: item.height,
            left: item.left,
            top: item.top,
            animationDelay: item.animationDelay,
            animationDuration: item.animationDuration,
            opacity: item.opacity,
          }"
        />
      </ClientOnly>
    </div>

    <!-- Existing Content -->
    <div class="relative z-10">
      <header class="ml-auto">
        <StudentNavigation />
      </header>

      <section class="max-w-3xl mx-auto px-1 md:px-4 py-12">
        <h1
          class="text-4xl text-center md:text-5xl md:text-left font-bold mb-8 text-gray-100 leading-tight tracking-tight font-[playfair]"
        >
          Witaj w Egzaminie Certyfikacyjnym z Szkoły Numerologii - dev
        </h1>

        <div class="rounded-xl bg-gray-800 shadow-2xl p-4 md:p-8 mb-8">
          <h2 class="text-2xl font-semibold mb-8 text-gray-100 tracking-wide">
            Instrukcje egzaminu
          </h2>

          <ul class="list-disc pl-6 space-y-4 mb-8">
            <li class="text-lg text-gray-300 leading-relaxed">
              Egzamin składa się z pytań wielokrotnego wyboru
            </li>
            <li class="text-lg text-gray-300 leading-relaxed">
              Musisz uzyskać minimum 70% punktów, aby zdać
            </li>
            <li class="text-lg text-gray-300 leading-relaxed">
              Po udzieleniu odpowiedzi przejdziesz do następnego pytania
            </li>
            <li class="text-lg text-gray-300 leading-relaxed">
              Wyniki będą dostępne natychmiast po zakończeniu testu
            </li>
            <li class="text-lg text-gray-300 leading-relaxed">
              Masz 40 minut na rozwiązanie testu
            </li>
            <li class="text-lg text-gray-300 leading-relaxed">
              Jeśli nie zdasz, możesz natychmiast przystąpić do ponownego
              egzaminu
            </li>
          </ul>

          <div class="mb-8">
            <!-- Name Input -->
            <div class="mb-6">
              <label
                for="studentName"
                class="block text-lg font-medium text-green-300 mb-3"
              >
                Wpisz swoje pełne imię i nazwisko (tak jak ma się pojawić na
                certyfikacie)
              </label>
              <input
                id="studentName"
                v-model="studentName"
                type="text"
                class="w-full px-5 py-4 text-lg border rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder-gray-400 transitionAll duration-200"
                :class="{ 'border-red-500 ring-red-500': nameError }"
                placeholder="np. Jan Kowalski"
                @keyup.enter="validateAndStart"
              />
              <p
                v-if="nameError"
                class="mt-2 text-base text-red-400 font-medium"
              >
                {{ nameError }}
              </p>
            </div>

            <!-- Email Input -->
            <div class="mb-6">
              <label
                for="studentEmail"
                class="block text-lg font-medium text-green-300 mb-3"
              >
                Podaj swój adres email (potrzebny do wysłania certyfikatu)
              </label>
              <input
                id="studentEmail"
                v-model="studentEmail"
                type="email"
                class="w-full px-5 py-4 text-lg border rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder-gray-400 transitionAll duration-200"
                :class="{ 'border-red-500 ring-red-500': emailError }"
                placeholder="twoj@email.com"
                @keyup.enter="validateAndStart"
              />
              <p
                v-if="emailError"
                class="mt-2 text-base text-red-400 font-medium"
              >
                {{ emailError }}
              </p>
            </div>
          </div>

          <UButton
            @click="validateAndStart"
            :disabled="isLoading"
            size="lg"
            color="green"
            class="w-full md:w-auto text-lg px-8 py-4 font-medium tracking-wide"
            :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
            icon="i-heroicons-arrow-right"
          >
            <span v-if="isLoading">Ładowanie...</span>
            <span v-else>Rozpocznij egzamin</span>
          </UButton>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-float {
  animation: float linear infinite;
}

.animate-twinkle {
  animation: twinkle ease-in-out infinite;
}

/* Improved text readability */
.text-balance {
  text-wrap: balance;
}

/* Enhanced shadows with better contrast against animated background */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
}

/* Ensure content is readable over animated background */
.bg-gray-800 {
  @apply bg-opacity-95 backdrop-blur-sm;
}

/* Smooth transitions */
.transitionAll {
  @apply transition-all duration-200 ease-in-out;
}

/* Focus states */
input:focus {
  @apply outline-none;
}

/* List styling */
.list-disc {
  list-style-type: disc;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .text-4xl {
    @apply text-3xl;
  }

  .text-2xl {
    @apply text-xl;
  }

  .text-lg {
    @apply text-base;
  }

  .p-8 {
    @apply p-6;
  }
}

/* Dark mode optimizations */
@media (prefers-color-scheme: dark) {
  .bg-gray-800 {
    @apply bg-opacity-95;
  }
}
</style>
