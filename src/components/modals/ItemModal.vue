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
          {{ isEdit ? "Edit Item" : "Create Item" }}
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
            >Description</label
          >
          <textarea
            v-model="form.description"
            rows="3"
            class="input"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Category</label
          >
          <select v-model="form.category" class="input">
            <option value="">Select category</option>
            <option value="electronics">Electronics</option>
            <option value="books">Books</option>
            <option value="clothing">Clothing</option>
            <option value="food">Food</option>
            <option value="tools">Tools</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Price</label
            >
            <input
              v-model.number="form.price"
              type="number"
              step="0.01"
              min="0"
              class="input"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Quantity *</label
            >
            <input
              v-model.number="form.quantity"
              type="number"
              min="0"
              required
              class="input"
            />
          </div>
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
import { itemService } from "@/services/item.service";
import type { Item } from "@/types";

const props = defineProps<{
  item?: Item | null;
}>();

const emit = defineEmits<{
  close: [];
  saved: [];
}>();

const loading = ref(false);
const error = ref<string | null>(null);

const isEdit = computed(() => !!props.item);

const form = reactive({
  name: props.item?.name || "",
  description: props.item?.description || "",
  category: props.item?.category || "",
  price: props.item?.price || 0,
  quantity: props.item?.quantity || 0,
  active: props.item?.active !== false,
});

const handleSubmit = async () => {
  loading.value = true;
  error.value = null;

  try {
    if (isEdit.value && props.item) {
      await itemService.update(props.item.id, form);
    } else {
      await itemService.create(form);
    }

    emit("saved");
  } catch (err: any) {
    error.value = err.response?.data?.message || "Failed to save item";
  } finally {
    loading.value = false;
  }
};
</script>
