<script setup>
  import { ref, computed } from 'vue';
  import { RouterLink } from 'vue-router';
  import { postsData } from '../data/posts.js';

  const TIER_COLORS = {
    S: { label: 'text-pink-400', chip: 'bg-pink-600' },
    A: { label: 'text-purple-400', chip: 'bg-purple-600' },
    B: { label: 'text-blue-400', chip: 'bg-blue-600' },
    C: { label: 'text-orange-400', chip: 'bg-orange-600' },
    D: { label: 'text-yellow-400', chip: 'bg-yellow-600' },
    F: { label: 'text-red-400', chip: 'bg-red-600' },
  };

  const posts = ref(postsData);

  const searchQuery = ref('');
  const activeTag = ref(null);

  const allTags = computed(() => {
    const tagSet = new Set();
    posts.value.forEach((post) => post.tags.forEach((t) => tagSet.add(t)));
    return [...tagSet];
  });

  const topViewed = computed(() => [...posts.value].sort((a, b) => b.views - a.views).slice(0, 3));

  const filteredPosts = computed(() =>
    posts.value.filter((post) => {
      const matchesTag = !activeTag.value || post.tags.includes(activeTag.value);
      const q = searchQuery.value.toLowerCase();
      const matchesSearch =
        !q || post.title.toLowerCase().includes(q) || post.tags.some((t) => t.toLowerCase().includes(q));
      return matchesTag && matchesSearch;
    }),
  );

  function toggleTag(tag) {
    activeTag.value = activeTag.value === tag ? null : tag;
  }

  function starsDisplay(rating) {
    const full = Math.round(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }

  function clearFilters() {
    searchQuery.value = '';
    activeTag.value = null;
  }

  const currentTime = ref('');
  function updateTime() {
    const now = new Date();
    currentTime.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  updateTime();
  setInterval(updateTime, 1000);
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
      <RouterLink
        to="/"
        class="no-underline"
        style="display: inline-block"
      >
        <div
          class="overflow-hidden rounded-lg"
          style="
            width: 120px;
            height: 50px;
            border: 2px solid #7c3aed;
            box-shadow: 0 0 12px rgba(124, 58, 237, 0.6);
            background: #13131f;
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          <!-- IMAGE SLOT: *Note to self replace with <img src="path/to/logo.png" class="w-full h-full object-cover"> when logo image ready -->
          <span style="color: #7c3aed; font-size: 12px">Logo here</span>
        </div>
      </RouterLink>
      <div class="flex items-center gap-4">
        <RouterLink
          to="/"
          class="text-sm no-underline"
          style="color: #a78bfa"
        >
          Browse
        </RouterLink>
        <RouterLink
          to="/create"
          class="rounded-lg px-3 py-1.5 text-sm no-underline transition-all"
          style="border: 1px solid #7c3aed; color: #c4b5fd; box-shadow: 0 0 8px rgba(124, 58, 237, 0.3)"
        >
          + New list
        </RouterLink>
      </div>
    </nav>

    <section
      class="px-6 py-4"
      style="background: #0d0d14; border-bottom: 1px solid #7c3aed; box-shadow: 0 0 12px rgba(124, 58, 237, 0.2)"
    >
      <p
        class="mb-3 text-xs tracking-widest uppercase"
        style="color: #7c3aed"
      >
        Top viewed
      </p>

      <div class="flex gap-3 overflow-x-auto pb-1">
        <RouterLink
          v-for="post in topViewed"
          :key="post.id"
          :to="`/post/${post.id}`"
          class="w-52 flex-none overflow-hidden rounded-xl no-underline transition-all"
          style="border: 1px solid #7c3aed; box-shadow: 0 0 10px rgba(124, 58, 237, 0.3); background: #13131f"
        >
          <!-- Cover image or placeholder -->
          <div
            class="relative h-28 overflow-hidden"
            style="background: #1a1a2e"
          >
            <img
              v-if="post.coverImage"
              :src="post.coverImage"
              :alt="post.title"
              class="h-full w-full object-cover"
            />
            <!-- Placeholder shown when no cover image uploaded yet -->
            <div
              v-else
              class="flex h-full w-full items-center justify-center"
              style="background: #1a1a2e"
            >
              <span
                class="text-3xl font-medium"
                style="color: #4c1d95"
              >
                {{ post.title.charAt(0) }}
              </span>
            </div>

            <!-- View count badge overlaid bottom-left -->
            <span
              class="absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-xs"
              style="background: rgba(124, 58, 237, 0.6); color: #e9d5ff"
            >
              {{ post.views.toLocaleString() }} views
            </span>
          </div>

          <!-- Post title and rating -->
          <div
            class="p-2.5"
            style="background: #13131f"
          >
            <p
              class="truncate text-xs font-medium"
              style="color: #e2e8f0"
            >
              {{ post.title }}
            </p>
            <p
              class="mt-0.5 text-xs"
              style="color: #a78bfa"
            >
              {{ starsDisplay(post.rating) }} {{ post.rating.toFixed(1) }}
            </p>
          </div>
        </RouterLink>
      </div>
    </section>

    <!-- ─────────────────────────────────────────
         GALAXY BACKGROUND
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
      <!-- Scattered star dots overlay using SVG background -->
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
        <!-- ─────────────────────────────────────────
             MAIN CONTENT
        ───────────────────────────────────────────── -->
        <main class="mx-auto max-w-4xl px-6 py-5">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search posts or tags..."
            class="mb-4 w-full rounded-lg px-3 py-2 text-sm transition-all outline-none"
            style="
              background: #13131f;
              border: 1px solid #7c3aed;
              color: #e2e8f0;
              box-shadow: 0 0 8px rgba(124, 58, 237, 0.2);
            "
          />

          <!-- Tag pills -->
          <div class="mb-6 flex flex-wrap gap-2">
            <button
              v-for="tag in allTags"
              :key="tag"
              @click="toggleTag(tag)"
              class="rounded-full px-3 py-1.5 text-xs transition-all"
              :style="
                activeTag === tag
                  ? 'border: 1px solid #a78bfa; background: rgba(124, 58, 237, 0.3); color: #e9d5ff; box-shadow: 0 0 8px rgba(124, 58, 237, 0.5);'
                  : 'border: 1px solid #3b1f6b; background: #13131f; color: #a78bfa;'
              "
            >
              {{ tag }}
            </button>
          </div>

          <!-- Section label -->
          <p
            class="mb-3 text-xs tracking-widest uppercase"
            style="color: #7c3aed"
          >
            Recent posts
          </p>

          <!-- ─────────────────────────────────────
               POST GRID
          ───────────────────────────────────────── -->
          <div
            v-if="filteredPosts.length"
            class="grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            <RouterLink
              v-for="post in filteredPosts"
              :key="post.id"
              :to="`/post/${post.id}`"
              class="block overflow-hidden rounded-xl no-underline transition-all"
              style="border: 1px solid #7c3aed; background: #13131f; box-shadow: 0 0 10px rgba(124, 58, 237, 0.2)"
            >
              <!-- Cover image or placeholder -->
              <div
                class="relative h-36 overflow-hidden"
                style="background: #1a1a2e"
              >
                <img
                  v-if="post.coverImage"
                  :src="post.coverImage"
                  :alt="post.title"
                  class="h-full w-full object-cover"
                />
                <!-- Placeholder shown until creator uploads a cover image -->
                <div
                  v-else
                  class="flex h-full w-full flex-col items-center justify-center gap-1"
                  style="background: #1a1a2e"
                >
                  <span
                    class="text-4xl font-medium"
                    style="color: #4c1d95"
                  >
                    {{ post.title.charAt(0) }}
                  </span>
                  <span
                    class="text-xs"
                    style="color: #6d28d9"
                    >No cover image</span
                  >
                </div>

                <!-- Tag pills overlaid top-right on the image -->
                <div class="absolute top-2 right-2 flex flex-wrap justify-end gap-1">
                  <span
                    v-for="tag in post.tags.slice(0, 2)"
                    :key="tag"
                    class="rounded px-1.5 py-0.5 text-xs"
                    style="background: rgba(109, 40, 217, 0.7); color: #e9d5ff"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>

              <!-- Post metadata -->
              <div class="p-3">
                <p
                  class="mb-1 truncate text-sm font-medium"
                  style="color: #e2e8f0"
                >
                  {{ post.title }}
                </p>
                <p
                  class="mb-3 line-clamp-2 text-xs leading-relaxed"
                  style="color: #94a3b8"
                >
                  {{ post.description }}
                </p>

                <div class="flex items-center justify-between">
                  <div>
                    <!-- Rating shown in purple to match theme -->
                    <p
                      class="text-xs"
                      style="color: #a78bfa"
                    >
                      {{ starsDisplay(post.rating) }} {{ post.rating.toFixed(1) }}
                      <span style="color: #64748b">({{ post.ratingCount }})</span>
                    </p>
                    <p
                      class="text-xs"
                      style="color: #64748b"
                    >
                      {{ post.views.toLocaleString() }} views
                    </p>
                  </div>
                </div>
              </div>
            </RouterLink>
          </div>

          <!-- Empty state when no posts match search/filter -->
          <div
            v-else
            class="py-16 text-center"
          >
            <p
              class="text-sm"
              style="color: #64748b"
            >
              No posts match your search.
            </p>
            <button
              @click="clearFilters"
              class="mt-3 text-xs"
              style="color: #a78bfa"
            >
              Clear filters
            </button>
          </div>
        </main>
      </div>
    </div>

    <!-- ─────────────────────────────────────────
         FOOTER
    ───────────────────────────────────────────── -->
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
      <!-- Live clock — updates every second via setInterval in script -->
      <p
        class="mt-2 text-xs"
        style="color: #6d28d9"
      >
        {{ currentTime }}
      </p>
    </footer>
  </div>
</template>
