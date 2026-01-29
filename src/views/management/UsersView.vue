<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Users Management</h1>
      <button
        v-if="authStore.isAdmin"
        @click="openCreateModal"
        class="btn btn-primary"
      >
        + Add User
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="spinner"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card bg-red-50 border border-red-200">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <!-- Users Table -->
    <div v-else class="card overflow-hidden p-0">
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td class="font-medium">{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span
                class="px-2 py-1 text-xs rounded-full"
                :class="
                  user.role === 'admin'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                "
              >
                {{ user.role }}
              </span>
            </td>
            <td>
              <span
                class="px-2 py-1 text-xs rounded-full"
                :class="
                  user.active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                "
              >
                {{ user.active ? "Active" : "Inactive" }}
              </span>
            </td>
            <td class="text-sm text-gray-500">
              {{ formatDate(user.created_at || "") }}
            </td>
            <td>
              <div class="flex space-x-2">
                <button
                  @click="openEditModal(user)"
                  class="text-sm text-primary-600 hover:text-primary-800"
                >
                  Edit
                </button>
                <button
                  v-if="authStore.isAdmin && user.id !== authStore.user?.id"
                  @click="deleteUser(user.id)"
                  class="text-sm text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- User Modal -->
    <UserModal
      v-if="showModal"
      :user="selectedUser"
      @close="closeModal"
      @saved="handleSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/stores/auth.store";
import { useLoading } from "@/composables/useLoading";
import { useNotification } from "@/composables/useNotification";
import UserModal from "@/components/modals/UserModal.vue";
import type { User } from "@/types";

const authStore = useAuthStore();
const { loading, error, withLoading } = useLoading();
const { success, error: notifyError } = useNotification();

const users = ref<User[]>([]);
const showModal = ref(false);
const selectedUser = ref<User | null>(null);

onMounted(async () => {
  await loadUsers();
});

const loadUsers = async () => {
  const data = await withLoading(() => userService.getAll());
  if (data) {
    users.value = data;
  }
};

const openCreateModal = () => {
  selectedUser.value = null;
  showModal.value = true;
};

const openEditModal = (user: User) => {
  selectedUser.value = user;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedUser.value = null;
};

const handleSaved = () => {
  closeModal();
  loadUsers();
  success("User saved successfully");
};

const deleteUser = async (id: number) => {
  if (!confirm("Are you sure you want to delete this user?")) return;

  try {
    await userService.delete(id);
    success("User deleted successfully");
    loadUsers();
  } catch (err: any) {
    notifyError(err.response?.data?.message || "Failed to delete user");
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
};
</script>
