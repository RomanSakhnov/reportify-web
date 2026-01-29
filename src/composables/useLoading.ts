import { ref } from "vue";

// Composable for managing loading states
export function useLoading(initialState = false) {
  const loading = ref(initialState);
  const error = ref<string | null>(null);

  const startLoading = () => {
    loading.value = true;
    error.value = null;
  };

  const stopLoading = () => {
    loading.value = false;
  };

  const setError = (message: string) => {
    error.value = message;
    loading.value = false;
  };

  const clearError = () => {
    error.value = null;
  };

  // Wrapper to execute async function with loading state
  const withLoading = async <T>(fn: () => Promise<T>): Promise<T | null> => {
    startLoading();
    try {
      const result = await fn();
      stopLoading();
      return result;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return null;
    }
  };

  return {
    loading,
    error,
    startLoading,
    stopLoading,
    setError,
    clearError,
    withLoading,
  };
}
