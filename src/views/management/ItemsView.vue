<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Items Management</h1>
      <button @click="openCreateModal" class="btn btn-primary">
        + Add Item
      </button>
    </div>

    <!-- Filters -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Category</label
          >
          <select v-model="filters.category" @change="loadItems" class="input">
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="books">Books</option>
            <option value="clothing">Clothing</option>
            <option value="food">Food</option>
            <option value="tools">Tools</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Status</label
          >
          <select v-model="filters.active" @change="loadItems" class="input">
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="spinner"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card bg-red-50 border border-red-200">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <!-- Items Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="item in items"
        :key="item.id"
        class="card hover:shadow-lg transition-shadow"
      >
        <div class="flex justify-between items-start mb-3">
          <h3 class="text-lg font-semibold text-gray-900">{{ item.name }}</h3>
          <span
            class="px-2 py-1 text-xs rounded-full"
            :class="
              item.active
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            "
          >
            {{ item.active ? "Active" : "Inactive" }}
          </span>
        </div>

        <p class="text-sm text-gray-600 mb-4 line-clamp-2">
          {{ item.description || "No description" }}
        </p>

        <div class="space-y-2 mb-4">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Category:</span>
            <span class="font-medium capitalize">{{
              item.category || "N/A"
            }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Price:</span>
            <span class="font-medium"
              >${{ item.price?.toFixed(2) || "0.00" }}</span
            >
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Quantity:</span>
            <span class="font-medium">{{ item.quantity }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Owner:</span>
            <span class="font-medium">{{ item.user.name }}</span>
          </div>
        </div>

        <div class="flex space-x-2 pt-4 border-t">
          <button
            @click="openEditModal(item)"
            class="flex-1 btn btn-secondary text-sm"
          >
            Edit
          </button>
          <button
            v-if="authStore.isAdmin || item.user.id === authStore.user?.id"
            @click="deleteItem(item.id)"
            class="flex-1 btn btn-danger text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && items.length === 0" class="card text-center py-12">
      <p class="text-gray-500">No items found</p>
    </div>

    <!-- Item Modal -->
    <ItemModal
      v-if="showModal"
      :item="selectedItem"
      @close="closeModal"
      @saved="handleSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { itemService } from "@/services/item.service";
import { useAuthStore } from "@/stores/auth.store";
import { useLoading } from "@/composables/useLoading";
import { useNotification } from "@/composables/useNotification";
import ItemModal from "@/components/modals/ItemModal.vue";
import type { Item } from "@/types";

const authStore = useAuthStore();
const { loading, error, withLoading } = useLoading();
const { success, error: notifyError } = useNotification();

const items = ref<Item[]>([]);
const showModal = ref(false);
const selectedItem = ref<Item | null>(null);
const filters = reactive({
  category: "",
  active: "",
});

onMounted(async () => {
  await loadItems();
});

const loadItems = async () => {
  const params: any = {};
  if (filters.category) params.category = filters.category;
  if (filters.active) params.active = filters.active === "true";

  const data = await withLoading(() => itemService.getAll(params));
  if (data) {
    items.value = data;
  }
};

const openCreateModal = () => {
  selectedItem.value = null;
  showModal.value = true;
};

const openEditModal = (item: Item) => {
  selectedItem.value = item;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedItem.value = null;
};

const handleSaved = () => {
  closeModal();
  loadItems();
  success("Item saved successfully");
};

const deleteItem = async (id: number) => {
  if (!confirm("Are you sure you want to delete this item?")) return;

  try {
    await itemService.delete(id);
    success("Item deleted successfully");
    loadItems();
  } catch (err: any) {
    notifyError(err.response?.data?.message || "Failed to delete item");
  }
};
</script>
