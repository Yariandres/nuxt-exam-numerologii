import { defineStore } from 'pinia';

interface UserData {
  email: string;
  role: 'ADMIN' | 'STUDENT';
  name: string;
}

interface UserInsert extends UserData {
  password: string;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as UserData | null,
    isAuthenticated: false,
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'ADMIN',
    isStudent: (state) => state.user?.role === 'STUDENT',
    userRole: (state) => state.user?.role,
  },

  actions: {
    async login(email: string, password: string) {
      const supabase = useSupabaseClient();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Fetch user profile data including role
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('role, name')
          .eq('email', data.user.email)
          .single();

        if (profileError) throw profileError;

        if (!profile) throw new Error('User profile not found');

        const userData: UserData = {
          email: data.user.email!,
          role: profile.role,
          name: profile.name,
        };

        this.user = userData;
        this.isAuthenticated = true;
        localStorage.setItem('user', JSON.stringify(userData));
      }
    },

    async logout() {
      const supabase = useSupabaseClient();
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      this.user = null;
      this.isAuthenticated = false;
      localStorage.removeItem('user');
      navigateTo('/auth/login');
    },

    async register(email: string, password: string, name: string) {
      const supabase = useSupabaseClient();
      console.log('Starting registration for:', { email, name });

      // First, create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Then create user profile
      try {
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .insert<UserInsert>([
            {
              email,
              name,
              role: 'STUDENT',
            },
          ])
          .select()
          .single();

        if (profileError) throw profileError;

        if (data.user) {
          await this.login(email, password);
        }
      } catch (err) {
        console.error('Registration error:', err);
        throw err;
      }
    },

    async initializeFromStorage() {
      const supabase = useSupabaseClient();

      try {
        // Check current session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('role, name')
            .eq('email', session.user.email)
            .single();

          if (profileError) throw profileError;

          if (!profile) throw new Error('User profile not found');

          this.user = {
            email: session.user.email!,
            role: profile.role,
            name: profile.name,
          };
          this.isAuthenticated = true;
        }
      } catch (error) {
        console.error('Error initializing from storage:', error);
        this.logout();
      }
    },
  },
});
