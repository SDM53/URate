<script setup>
  import { ref, computed, watch, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { postsData } from '../data/posts.js';

  const router = useRouter();

  const TIER_COLORS = {
    S: { label: 'text-pink-400', chip: 'bg-pink-600' },
    A: { label: 'text-purple-400', chip: 'bg-purple-600' },
    B: { label: 'text-blue-400', chip: 'bg-blue-600' },
    C: { label: 'text-orange-400', chip: 'bg-orange-600' },
    D: { label: 'text-yellow-400', chip: 'bg-yellow-600' },
    F: { label: 'text-red-400', chip: 'bg-red-600' },
  };

  const formData = ref({
    title: '',
    description: '',
    authorName: '',
    coverImage: '',
    tags: [],
    tiers: {
      S: [],
      A: [],
      B: [],
      C: [],
      D: [],
      F: [],
    },
  });

  const existingTags = computed(() => {
    const tagSet = new Set();
    postsData.forEach((post) => post.tags.forEach((t) => tagSet.add(t)));
    return [...tagSet];
  });

  const customTagInput = ref('');
  const showModal = ref(false);
  const modalTier = ref('S');
  const modalItemName = ref('');
  const modalItemImage = ref('');
  const draggedIndex = ref(null);
  const draggedTier = ref(null);

  function addTag(tag) {
    if (tag && !formData.value.tags.includes(tag)) {
      formData.value.tags.push(tag);
      customTagInput.value = '';
    }
  }

  function removeTag(tag) {
    formData.value.tags = formData.value.tags.filter((t) => t !== tag);
  }

  function toggleExistingTag(tag) {
    if (formData.value.tags.includes(tag)) {
      removeTag(tag);
    } else {
      addTag(tag);
    }
  }

  function openAddItemModal(tier) {
    modalTier.value = tier;
    modalItemName.value = '';
    modalItemImage.value = '';
    showModal.value = true;
  }

  function closeModal() {
    showModal.value = false;
    modalItemName.value = '';
    modalItemImage.value = '';
  }

  function addItemToTier() {
    if (!modalItemName.value.trim()) return;
    const tier = modalTier.value;
    if (formData.value.tiers[tier].length >= 10) {
      alert(`Max 10 items reached for ${tier} tier`);
      return;
    }
    formData.value.tiers[tier].push({
      name: modalItemName.value,
      image: modalItemImage.value || null,
    });
    closeModal();
  }

  function removeItemFromTier(tier, index) {
    formData.value.tiers[tier].splice(index, 1);
  }

  function startDrag(tier, index) {
    draggedIndex.value = index;
    draggedTier.value = tier;
  }

  function onDrop(toTier) {
    if (draggedIndex.value === null || draggedTier.value === null) return;
    const fromTier = draggedTier.value;
    const item = formData.value.tiers[fromTier][draggedIndex.value];
    formData.value.tiers[fromTier].splice(draggedIndex.value, 1);
    if (formData.value.tiers[toTier].length < 10) {
      formData.value.tiers[toTier].push(item);
    } else {
      formData.value.tiers[fromTier].splice(draggedIndex.value, 0, item);
    }
    draggedIndex.value = null;
    draggedTier.value = null;
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function goToPreview() {
    if (!formData.value.title.trim()) {
      alert('Please enter a post title');
      return;
    }
    if (!formData.value.authorName.trim()) {
      alert('Please enter your name');
      return;
    }
    const hasItems = Object.values(formData.value.tiers).some((tier) => tier.length > 0);
    if (!hasItems) {
      alert('Please add at least one item to a tier');
      return;
    }
    router.push({ name: 'preview' });
  }

  // ─────────────────────────────────────────────
  // LOCALSTORAGE PERSISTENCE
  // ─────────────────────────────────────────────
  watch(
    formData,
    (newVal) => {
      localStorage.setItem('createFormData', JSON.stringify(newVal));
    },
    { deep: true },
  );

  onMounted(() => {
    const saved = localStorage.getItem('createFormData');
    if (saved) {
      formData.value = JSON.parse(saved);
    }
  });
</script>

<template>
  <div
    class="flex min-h-screen flex-col"
    style="background: #0a0a0f"
  >
    <!-- ─────────────────────────────────────────
         NAVIGATION BAR
    ───────────────────────────────────────────── -->
    <nav
      class="sticky top-0 z-10 flex items-center justify-between px-6 py-3"
      style="background: #0d0d14; border-bottom: 1px solid #7c3aed; box-shadow: 0 0 12px rgba(124, 58, 237, 0.4)"
    >
      <RouterLink to="/">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-lg text-xl font-bold"
          style="
            border: 2px solid #7c3aed;
            background: #13131f;
            color: #c4b5fd;
            box-shadow: 0 0 12px rgba(124, 58, 237, 0.4);
          "
        >
          U
        </div>
      </RouterLink>
      <RouterLink
        to="/"
        class="rounded-lg px-3 py-1.5 text-sm no-underline transition-all"
        style="border: 1px solid #7c3aed; color: #c4b5fd; box-shadow: 0 0 8px rgba(124, 58, 237, 0.3)"
      >
        ← Back to home
      </RouterLink>
    </nav>

    <!-- ─────────────────────────────────────────
         GALAXY BACKGROUND WRAPPER
    ───────────────────────────────────────────── -->
    <div
      class="flex-1"
      style="
        background-color: #07070f;
        background-image:
          radial-gradient(ellipse at 20% 30%, rgba(88, 28, 135, 0.15) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 10%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
          radial-gradient(ellipse at 60% 70%, rgba(109, 40, 217, 0.12) 0%, transparent 55%),
          radial-gradient(ellipse at 10% 80%, rgba(37, 99, 235, 0.08) 0%, transparent 45%),
          radial-gradient(circle at 45% 45%, rgba(139, 92, 246, 0.06) 0%, transparent 40%);
      "
    >
      <div
        class="min-h-full"
        style="
          background-image:
            radial-gradient(circle, rgba(167, 139, 250, 0.8) 1px, transparent 1px),
            radial-gradient(circle, rgba(96, 165, 250, 0.6) 1px, transparent 1px),
            radial-gradient(circle, rgba(216, 180, 254, 0.5) 1px, transparent 1px);
          background-size:
            120px 120px,
            180px 180px,
            90px 90px;
          background-position:
            0 0,
            60px 60px,
            30px 90px;
        "
      >
        <main class="mx-auto max-w-6xl px-6 py-8">
          <h1
            class="mb-8 text-3xl font-bold"
            style="color: #e9d5ff"
          >
            Create a new tier list
          </h1>

          <!-- ─────────────────────────────────────
               TOP SECTION
          ───────────────────────────────────────── -->
          <div class="mb-12 grid grid-cols-3 items-stretch gap-8">
            <!-- LEFT SIDE: 2/3 width -->
            <div class="col-span-2 flex flex-col gap-6">
              <!-- POST TITLE -->
              <div>
                <label
                  class="mb-2 block text-sm font-medium"
                  style="color: #c4b5fd"
                  >Post title</label
                >
                <input
                  v-model="formData.title"
                  type="text"
                  placeholder="e.g. Best Mass Effect companions"
                  class="w-full rounded-lg px-4 py-3 text-sm transition-all outline-none"
                  style="
                    background: #13131f;
                    border: 1px solid #7c3aed;
                    color: #e2e8f0;
                    box-shadow: 0 0 8px rgba(124, 58, 237, 0.2);
                  "
                />
              </div>

              <!-- DESCRIPTION -->
              <div class="flex flex-1 flex-col">
                <label
                  class="mb-2 block text-sm font-medium"
                  style="color: #c4b5fd"
                  >Description</label
                >
                <textarea
                  v-model="formData.description"
                  placeholder="What is this tier list about?"
                  class="w-full flex-1 resize-none rounded-lg px-4 py-3 text-sm transition-all outline-none"
                  style="
                    background: #13131f;
                    border: 1px solid #7c3aed;
                    color: #e2e8f0;
                    box-shadow: 0 0 8px rgba(124, 58, 237, 0.2);
                  "
                ></textarea>
              </div>

              <!-- AUTHOR NAME -->
              <div>
                <label
                  class="mb-2 block text-sm font-medium"
                  style="color: #c4b5fd"
                  >Your name</label
                >
                <input
                  v-model="formData.authorName"
                  type="text"
                  placeholder="e.g. Serg"
                  class="w-full rounded-lg px-4 py-3 text-sm transition-all outline-none"
                  style="
                    background: #13131f;
                    border: 1px solid #7c3aed;
                    color: #e2e8f0;
                    box-shadow: 0 0 8px rgba(124, 58, 237, 0.2);
                  "
                />
              </div>
            </div>

            <!-- RIGHT SIDE -->
            <div class="col-span-1 flex flex-col gap-2">
              <!-- COVER IMAGE -->
              <div>
                <label
                  class="mb-2 block text-sm font-medium"
                  style="color: #c4b5fd"
                  >Cover image URL</label
                >
                <input
                  v-model="formData.coverImage"
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  class="w-full rounded-lg px-4 py-3 text-xs transition-all outline-none"
                  style="
                    background: #13131f;
                    border: 1px solid #7c3aed;
                    color: #e2e8f0;
                    box-shadow: 0 0 8px rgba(124, 58, 237, 0.2);
                  "
                />
              </div>

              <!-- COVER IMAGE PREVIEW BOX -->
              <div
                class="flex-1 overflow-hidden rounded-lg"
                style="
                  border: 1px solid #7c3aed;
                  background: #13131f;
                  box-shadow: 0 0 8px rgba(124, 58, 237, 0.2);
                  min-height: 200px;
                "
              >
                <img
                  v-if="formData.coverImage"
                  :src="formData.coverImage"
                  :alt="formData.title"
                  class="h-full w-full object-cover"
                />
                <div
                  v-else
                  class="flex h-full w-full items-center justify-center"
                >
                  <span
                    class="px-4 text-center text-xs"
                    style="color: #64748b"
                  >
                    Image preview will appear here
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- ─────────────────────────────────────
               TAGS SECTION
          ───────────────────────────────────────── -->
          <div class="mb-12">
            <h2
              class="mb-4 text-xl font-bold"
              style="color: #c4b5fd"
            >
              Tags
            </h2>

            <!-- Custom tag input -->
            <div class="mb-4 flex gap-2">
              <input
                v-model="customTagInput"
                type="text"
                placeholder="Type a new tag..."
                @keyup.enter="addTag(customTagInput)"
                class="flex-1 rounded-lg px-4 py-2 text-sm transition-all outline-none"
                style="
                  background: #13131f;
                  border: 1px solid #7c3aed;
                  color: #e2e8f0;
                  box-shadow: 0 0 8px rgba(124, 58, 237, 0.2);
                "
              />
              <button
                @click="addTag(customTagInput)"
                class="rounded-lg px-4 py-2 text-sm font-medium transition-all"
                style="
                  border: 1px solid #7c3aed;
                  background: rgba(124, 58, 237, 0.2);
                  color: #c4b5fd;
                  box-shadow: 0 0 8px rgba(124, 58, 237, 0.3);
                "
              >
                Add tag
              </button>
            </div>

            <!-- Existing tags as toggleable pills -->
            <p
              class="mb-3 text-xs"
              style="color: #7c3aed"
            >
              Click to toggle existing tags:
            </p>
            <div class="mb-4 flex flex-wrap gap-2">
              <button
                v-for="tag in existingTags"
                :key="tag"
                @click="toggleExistingTag(tag)"
                class="rounded-full px-3 py-1.5 text-xs transition-all"
                :style="
                  formData.tags.includes(tag)
                    ? 'border: 1px solid #a78bfa; background: rgba(124, 58, 237, 0.3); color: #e9d5ff; box-shadow: 0 0 8px rgba(124, 58, 237, 0.5);'
                    : 'border: 1px solid #3b1f6b; background: #13131f; color: #a78bfa;'
                "
              >
                {{ tag }}
              </button>
            </div>

            <!-- Selected tags with remove button -->
            <div
              v-if="formData.tags.length"
              class="flex flex-wrap gap-2"
            >
              <div
                v-for="tag in formData.tags"
                :key="tag"
                class="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs"
                style="border: 1px solid #a78bfa; background: rgba(124, 58, 237, 0.3); color: #e9d5ff"
              >
                {{ tag }}
                <button
                  @click="removeTag(tag)"
                  style="color: #e9d5ff"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          <!-- ─────────────────────────────────────
               TIER LIST BUILDER
          ───────────────────────────────────────── -->
          <div class="mb-8">
            <h2
              class="mb-6 text-xl font-bold"
              style="color: #c4b5fd"
            >
              Build your tier list
            </h2>

            <div class="space-y-4">
              <div
                v-for="tier in ['S', 'A', 'B', 'C', 'D', 'F']"
                :key="tier"
              >
                <!-- Tier header row -->
                <div class="mb-2 flex items-center justify-between">
                  <span
                    class="text-sm font-bold"
                    :class="TIER_COLORS[tier].label"
                  >
                    {{ tier }} Tier
                  </span>
                  <span
                    class="text-xs"
                    style="color: #64748b"
                  >
                    {{ formData.tiers[tier].length }}/10 items
                  </span>
                </div>

                <!-- Tier drop zone -->
                <div
                  class="flex flex-wrap items-center gap-3 rounded-lg p-4"
                  style="background: #13131f; border: 1px solid #7c3aed; min-height: 64px"
                  @dragover="dragOver"
                  @drop="onDrop(tier)"
                >
                  <!-- Existing draggable items -->
                  <div
                    v-for="(item, index) in formData.tiers[tier]"
                    :key="index"
                    draggable="true"
                    @dragstart="startDrag(tier, index)"
                    class="flex cursor-move items-center gap-2 rounded-lg px-3 py-2 transition-opacity select-none hover:opacity-80"
                    :class="TIER_COLORS[tier].chip"
                    style="color: #fff; border: 1px solid rgba(255, 255, 255, 0.2)"
                  >
                    <img
                      v-if="item.image"
                      :src="item.image"
                      :alt="item.name"
                      class="h-6 w-6 rounded object-cover"
                    />
                    <span class="text-xs font-medium">{{ item.name }}</span>
                    <button
                      @click.stop="removeItemFromTier(tier, index)"
                      class="ml-1 text-xs font-bold"
                      style="color: #fff"
                    >
                      ✕
                    </button>
                  </div>

                  <!-- Plus button -->
                  <button
                    @click="openAddItemModal(tier)"
                    class="flex h-14 w-14 flex-col items-center justify-center rounded-lg transition-all hover:opacity-80"
                    style="border: 2px dashed #7c3aed; background: transparent; color: #7c3aed"
                  >
                    <span style="font-size: 20px; line-height: 1">+</span>
                    <span style="font-size: 9px; color: #7c3aed; margin-top: 2px">add item</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- PREVIEW BUTTON -->
          <div class="mb-8 flex justify-center">
            <button
              @click="goToPreview"
              class="rounded-lg px-8 py-3 text-sm font-medium transition-all"
              style="
                border: 1px solid #7c3aed;
                background: rgba(124, 58, 237, 0.3);
                color: #c4b5fd;
                box-shadow: 0 0 12px rgba(124, 58, 237, 0.4);
              "
            >
              Preview post →
            </button>
          </div>
        </main>
      </div>
    </div>

    <!-- ─────────────────────────────────────────
         ADD ITEM
    ───────────────────────────────────────────── -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="background: rgba(0, 0, 0, 0.75)"
      @click.self="closeModal"
    >
      <div
        class="w-full max-w-md rounded-xl p-6"
        style="background: #13131f; border: 1px solid #7c3aed; box-shadow: 0 0 24px rgba(124, 58, 237, 0.5)"
      >
        <h3
          class="mb-6 text-lg font-bold"
          style="color: #c4b5fd"
        >
          Add item to <span :class="TIER_COLORS[modalTier].label">{{ modalTier }} tier</span>
        </h3>

        <div class="mb-4">
          <label
            class="mb-2 block text-sm font-medium"
            style="color: #c4b5fd"
            >Item name</label
          >
          <input
            v-model="modalItemName"
            type="text"
            placeholder="e.g. Garrus"
            @keyup.enter="addItemToTier"
            class="w-full rounded-lg px-4 py-3 text-sm transition-all outline-none"
            style="
              background: #1a1a2e;
              border: 1px solid #7c3aed;
              color: #e2e8f0;
              box-shadow: 0 0 8px rgba(124, 58, 237, 0.2);
            "
          />
        </div>

        <div class="mb-4">
          <label
            class="mb-2 block text-sm font-medium"
            style="color: #c4b5fd"
            >Item image URL (optional)</label
          >
          <input
            v-model="modalItemImage"
            type="text"
            placeholder="https://example.com/image.jpg"
            class="w-full rounded-lg px-4 py-3 text-sm transition-all outline-none"
            style="
              background: #1a1a2e;
              border: 1px solid #7c3aed;
              color: #e2e8f0;
              box-shadow: 0 0 8px rgba(124, 58, 237, 0.2);
            "
          />
        </div>

        <div
          v-if="modalItemImage"
          class="mb-4 h-24 overflow-hidden rounded-lg"
          style="border: 1px solid #7c3aed"
        >
          <img
            :src="modalItemImage"
            alt="Preview"
            class="h-full w-full object-cover"
          />
        </div>

        <div class="flex gap-3">
          <button
            @click="closeModal"
            class="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all"
            style="border: 1px solid #7c3aed; background: transparent; color: #c4b5fd"
          >
            Cancel
          </button>
          <button
            @click="addItemToTier"
            class="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all"
            style="
              border: 1px solid #7c3aed;
              background: rgba(124, 58, 237, 0.3);
              color: #c4b5fd;
              box-shadow: 0 0 8px rgba(124, 58, 237, 0.3);
            "
          >
            Add item
          </button>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <footer
      class="px-6 py-6 text-center"
      style="background: #0d0d14; border-top: 1px solid #7c3aed; box-shadow: 0 0 12px rgba(124, 58, 237, 0.3)"
    >
      <p
        class="text-sm font-medium"
        style="color: #c4b5fd"
      >
        URate — STC Final Project
      </p>
      <p
        class="mt-1 text-xs"
        style="color: #7c3aed"
      >
        Made by Sergio D Morfin
      </p>
    </footer>
  </div>
</template>
