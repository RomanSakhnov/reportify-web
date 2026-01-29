<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-900">
          {{ isEdit ? "Edit User" : "Create User" }}
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="px-6 py-4 space-y-4">
        <!-- Error Message -->
        <div
          v-if="error"
          class="p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Name *</label
          >
          <input v-model="form.name" type="text" required class="input" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Email *</label
          >
          <input v-model="form.email" type="email" required class="input" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Password {{ isEdit ? "" : "*" }}
          </label>
          <input
            v-model="form.password"
            type="password"
            :required="!isEdit"
            class="input"
            placeholder="Min 6 characters"
          />
          <p v-if="isEdit" class="text-xs text-gray-500 mt-1">
            Leave blank to keep current password
          </p>
        </div>

        <div v-if="authStore.isAdmin">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Role</label
          >
          <select v-model="form.role" class="input">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div class="flex items-center">
          <input
            v-model="form.active"
            type="checkbox"
            id="active"
            class="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
          />
          <label for="active" class="ml-2 text-sm text-gray-700">Active</label>
        </div>

        <!-- Actions -->
        <div class="flex space-x-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 btn btn-primary"
          >
            <span v-if="loading">Saving...</span>
            <span v-else>{{ isEdit ? "Update" : "Create" }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/stores/auth.store";
import type { User } from "@/types";

const props = defineProps<{
  user?: User | null;
}>();

const emit = defineEmits<{
  close: [];
  saved: [];
}>();

const authStore = useAuthStore();
const loading = ref(false);
const error = ref<string | null>(null);

const isEdit = computed(() => !!props.user);

const form = reactive({
  name: props.user?.name || "",
  email: props.user?.email || "",
  password: "",
  role: props.user?.role || "user",
  active: props.user?.active !== false,
});

const handleSubmit = async () => {
  loading.value = true;
  error.value = null;

  try {
    const userData: any = { ...form };
    if (isEdit.value && !userData.password) {
      delete userData.password;
    }

    if (isEdit.value && props.user) {
      await userService.update(props.user.id, userData);
    } else {
      await userService.create(userData);
    }

    emit("saved");
  } catch (err: any) {
    error.value = err.response?.data?.message || "Failed to save user";
  } finally {
    loading.value = false;
  }
};
</script>
