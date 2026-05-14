<script setup>
  // ─────────────────────────────────────────────
  // IMPORTS
  // ─────────────────────────────────────────────
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { RouterLink, useRouter } from 'vue-router';

  const router = useRouter();

  // ─────────────────────────────────────────────
  // TIER COLOR MAP
  // ─────────────────────────────────────────────
  const TIER_COLORS = {
    S: { label: 'text-pink-400', chip: 'bg-pink-600' },
    A: { label: 'text-purple-400', chip: 'bg-purple-600' },
    B: { label: 'text-blue-400', chip: 'bg-blue-600' },
    C: { label: 'text-orange-400', chip: 'bg-orange-600' },
    D: { label: 'text-yellow-400', chip: 'bg-yellow-600' },
    F: { label: 'text-red-400', chip: 'bg-red-600' },
  };

  const posts = ref([]);
  const loading = ref(true);
  const sliderIndex = ref(0);
  let sliderInterval = null;
  const searchQuery = ref('');
  const activeTag = ref(null);

  const allTags = computed(() => {
    const tagSet = new Set();
    posts.value.forEach((post) => post.tags.forEach((t) => tagSet.add(t)));
    return [...tagSet];
  });

  const topViewed = computed(() => [...posts.value].sort((a, b) => b.views - a.views).slice(0, 3));
  const currentSliderPost = computed(() => topViewed.value[sliderIndex.value] || null);
  const hotPosts = computed(() => [...posts.value].sort((a, b) => b.views - a.views).slice(0, 2));
  const lovedPosts = computed(() =>
    [...posts.value].sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0)).slice(0, 2),
  );

  const newPosts = computed(() =>
    [...posts.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 2),
  );

  const filteredPosts = computed(() =>
    posts.value.filter((post) => {
      const matchesTag = !activeTag.value || post.tags.includes(activeTag.value);
      const q = searchQuery.value.toLowerCase();
      const matchesSearch =
        !q || post.title.toLowerCase().includes(q) || post.tags.some((t) => t.toLowerCase().includes(q));
      return matchesTag && matchesSearch;
    }),
  );

  const showSearchResults = computed(() => searchQuery.value !== '' || activeTag.value !== null);

  onMounted(async () => {
    try {
      const res = await fetch('http://localhost:3001/api/posts');
      posts.value = await res.json();
    } catch (err) {
      console.error('Failed to load posts from backend:', err);
    } finally {
      loading.value = false;
    }

    sliderInterval = setInterval(() => {
      if (topViewed.value.length > 0) {
        sliderIndex.value = (sliderIndex.value + 1) % topViewed.value.length;
      }
    }, 3000);
  });

  onUnmounted(() => {
    if (sliderInterval) clearInterval(sliderInterval);
  });

  function prevSlide() {
    if (topViewed.value.length === 0) return;
    sliderIndex.value = (sliderIndex.value - 1 + topViewed.value.length) % topViewed.value.length;
    resetSliderInterval();
  }

  function nextSlide() {
    if (topViewed.value.length === 0) return;
    sliderIndex.value = (sliderIndex.value + 1) % topViewed.value.length;
    resetSliderInterval();
  }

  function resetSliderInterval() {
    if (sliderInterval) clearInterval(sliderInterval);
    sliderInterval = setInterval(() => {
      if (topViewed.value.length > 0) {
        sliderIndex.value = (sliderIndex.value + 1) % topViewed.value.length;
      }
    }, 3000);
  }

  function goToPost(id) {
    router.push(`/post/${id}`);
  }

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

  // ─────────────────────────────────────────────
  // FOOTER CLOCK
  // ─────────────────────────────────────────────
  const currentTime = ref('');
  function updateTime() {
    const now = new Date();
    currentTime.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  updateTime();
  setInterval(updateTime, 1000);
</script>

<template>
  <!-- ─────────────────────────────────────────
       ROOT LAYOUT
       Three column layout that runs the full
       height of the page including scroll.
       Left and right columns are the neon purple
       glowing side bars. Center column holds all
       the page content.
       The outer wrapper is position relative so
       the side columns can be fixed width while
       the center grows and scrolls naturally.
  ───────────────────────────────────────────── -->
  <div
    class="flex min-h-screen"
    style="background: #0a0a0f"
  >
    <!-- ─────────────────────────────────────────
         LEFT SIDEBAR COLUMN
    ───────────────────────────────────────────── -->
    <div
      class="hidden w-60 shrink-0 lg:block"
      style="
        background: linear-gradient(to bottom, #7c3aed, #4c1d95, #7c3aed, #4c1d95, #7c3aed);
        box-shadow:
          0 0 20px rgba(124, 58, 237, 0.8),
          inset 0 0 10px rgba(167, 139, 250, 0.3);
        border-right: 1px solid #a78bfa;
      "
    ></div>

    <!-- ─────────────────────────────────────────
         CENTER COLUMN
    ───────────────────────────────────────────── -->
    <div class="flex min-w-0 flex-1 flex-col">
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
        <div class="flex items-center gap-4">
          <RouterLink
            to="/"
            class="text-sm font-medium no-underline"
            style="color: #c4b5fd"
            >Home</RouterLink
          >
          <RouterLink
            to="/browse"
            class="text-sm no-underline"
            style="color: #a78bfa"
            >Browse</RouterLink
          >
          <RouterLink
            to="/create"
            class="rounded-lg px-3 py-1.5 text-sm no-underline transition-all"
            style="border: 1px solid #7c3aed; color: #c4b5fd; box-shadow: 0 0 8px rgba(124, 58, 237, 0.3)"
          >
            + New list
          </RouterLink>
        </div>
      </nav>

      <!-- ─────────────────────────────────────────
           SLIDER
      ───────────────────────────────────────────── -->
      <section
        class="relative w-full shrink-0 overflow-hidden"
        style="
          background: #0d0d14;
          border-bottom: 1px solid #7c3aed;
          box-shadow: 0 0 12px rgba(124, 58, 237, 0.2);
          height: 320px;
        "
      >
        <div
          v-if="loading || !currentSliderPost"
          class="flex h-full items-center justify-center"
        >
          <p
            class="text-sm"
            style="color: #7c3aed"
          >
            Loading...
          </p>
        </div>

        <div
          v-else
          class="relative h-full cursor-pointer"
          @click="goToPost(currentSliderPost.id)"
        >
          <!-- Cover image -->
          <img
            v-if="currentSliderPost.coverImage"
            :src="currentSliderPost.coverImage"
            :alt="currentSliderPost.title"
            class="absolute inset-0 h-full w-full object-cover"
            style="opacity: 0.75"
          />
          <div
            v-else
            class="absolute inset-0 flex items-center justify-center"
            style="background: #1a1a2e"
          >
            <span
              class="text-6xl font-bold"
              style="color: #4c1d95"
            >
              {{ currentSliderPost.title.charAt(0) }}
            </span>
          </div>

          <div
            class="absolute inset-0"
            style="
              background: linear-gradient(
                to top,
                rgba(7, 7, 15, 0.95) 0%,
                rgba(7, 7, 15, 0.4) 50%,
                rgba(7, 7, 15, 0.1) 100%
              );
            "
          ></div>

          <!-- Post info -->
          <div class="absolute right-0 bottom-0 left-0 px-8 pb-6">
            <p
              class="mb-1 text-xs tracking-widest uppercase"
              style="color: #7c3aed"
            >
              Top viewed
            </p>
            <h2
              class="mb-2 text-2xl font-bold"
              style="color: #e9d5ff"
            >
              {{ currentSliderPost.title }}
            </h2>
            <div class="flex flex-wrap items-center gap-4">
              <span
                class="text-xs"
                style="color: #a78bfa"
              >
                {{ starsDisplay(currentSliderPost.rating) }} {{ currentSliderPost.rating.toFixed(1) }}
              </span>
              <span
                class="text-xs"
                style="color: #64748b"
              >
                {{ currentSliderPost.views.toLocaleString() }} views
              </span>
              <span
                v-for="tag in currentSliderPost.tags.slice(0, 2)"
                :key="tag"
                class="rounded-full px-2 py-0.5 text-xs"
                style="background: rgba(124, 58, 237, 0.3); border: 1px solid #7c3aed; color: #c4b5fd"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Dot indicators -->
          <div class="absolute right-8 bottom-4 flex gap-2">
            <button
              v-for="(_, i) in topViewed"
              :key="i"
              @click.stop="
                sliderIndex = i;
                resetSliderInterval();
              "
              class="h-2 w-2 rounded-full transition-all"
              :style="i === sliderIndex ? 'background: #a78bfa;' : 'background: rgba(167,139,250,0.3);'"
            ></button>
          </div>
        </div>

        <!-- Left arrow -->
        <button
          v-if="!loading && currentSliderPost"
          @click.stop="prevSlide"
          class="absolute top-0 left-0 flex h-full items-center justify-center px-4"
          style="background: transparent; border: none; cursor: pointer; z-index: 10"
          aria-label="Previous post"
        >
          <div
            style="
              width: 0;
              height: 0;
              border-top: 20px solid transparent;
              border-bottom: 20px solid transparent;
              border-right: 28px solid rgba(167, 139, 250, 0.45);
              transition: border-right-color 0.2s;
            "
            onmouseover="this.style.borderRightColor = 'rgba(167,139,250,0.75)'"
            onmouseout="this.style.borderRightColor = 'rgba(167,139,250,0.45)'"
          ></div>
        </button>

        <!-- Right arrow -->
        <button
          v-if="!loading && currentSliderPost"
          @click.stop="nextSlide"
          class="absolute top-0 right-0 flex h-full items-center justify-center px-4"
          style="background: transparent; border: none; cursor: pointer; z-index: 10"
          aria-label="Next post"
        >
          <div
            style="
              width: 0;
              height: 0;
              border-top: 20px solid transparent;
              border-bottom: 20px solid transparent;
              border-left: 28px solid rgba(167, 139, 250, 0.45);
              transition: border-left-color 0.2s;
            "
            onmouseover="this.style.borderLeftColor = 'rgba(167,139,250,0.75)'"
            onmouseout="this.style.borderLeftColor = 'rgba(167,139,250,0.45)'"
          ></div>
        </button>
      </section>

      <!-- ─────────────────────────────────────────
           GALAXY BACKGROUND SECTION
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
          <main class="mx-auto max-w-5xl px-8 py-6">
            <div
              v-if="loading"
              class="py-16 text-center"
            >
              <p
                class="text-sm"
                style="color: #7c3aed"
              >
                Loading posts...
              </p>
            </div>

            <template v-else>
              <!-- Search input -->
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
                      ? 'border: 1px solid #a78bfa; background: rgba(124,58,237,0.3); color: #e9d5ff; box-shadow: 0 0 8px rgba(124,58,237,0.5);'
                      : 'border: 1px solid #3b1f6b; background: #13131f; color: #a78bfa;'
                  "
                >
                  {{ tag }}
                </button>
              </div>

              <!-- ─────────────────────────────────────
                   SEARCH RESULTS
              ───────────────────────────────────────── -->
              <template v-if="showSearchResults">
                <p
                  class="mb-3 text-xs tracking-widest uppercase"
                  style="color: #7c3aed"
                >
                  Search results
                </p>
                <div
                  v-if="filteredPosts.length"
                  class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                  <RouterLink
                    v-for="post in filteredPosts"
                    :key="post.id"
                    :to="`/post/${post.id}`"
                    class="block overflow-hidden rounded-xl no-underline transition-all hover:scale-[1.02]"
                    style="border: 1px solid #7c3aed; background: #13131f; box-shadow: 0 0 10px rgba(124, 58, 237, 0.2)"
                  >
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
                      <div
                        v-else
                        class="flex h-full w-full items-center justify-center"
                        style="background: #1a1a2e"
                      >
                        <span
                          class="text-4xl font-medium"
                          style="color: #4c1d95"
                          >{{ post.title.charAt(0) }}</span
                        >
                      </div>
                    </div>
                    <div class="p-3">
                      <p
                        class="mb-1 truncate text-sm font-medium"
                        style="color: #e2e8f0"
                      >
                        {{ post.title }}
                      </p>
                      <p
                        class="mb-2 line-clamp-2 text-xs leading-relaxed"
                        style="color: #94a3b8"
                      >
                        {{ post.description }}
                      </p>
                      <p
                        class="text-xs"
                        style="color: #a78bfa"
                      >
                        {{ starsDisplay(post.rating) }} {{ post.rating.toFixed(1) }}
                        <span style="color: #64748b">({{ post.ratingCount }})</span>
                      </p>
                    </div>
                  </RouterLink>
                </div>
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
              </template>

              <!-- ─────────────────────────────────────
                   CURATED GRID
                   Row 1: Hot  (top 2 by views)
                   Row 2: Loved (top 2 by comments)
                   Row 3: New  (top 2 by createdAt)
              ───────────────────────────────────────── -->
              <template v-else>
                <p
                  class="mb-4 text-xs tracking-widest uppercase"
                  style="color: #7c3aed"
                >
                  Posts
                </p>

                <!-- HOT ROW -->
                <div class="mb-4 grid grid-cols-2 gap-4">
                  <RouterLink
                    v-for="post in hotPosts"
                    :key="`hot-${post.id}`"
                    :to="`/post/${post.id}`"
                    class="relative block overflow-hidden rounded-xl no-underline transition-all hover:scale-[1.02]"
                    style="border: 1px solid #7c3aed; background: #13131f; box-shadow: 0 0 10px rgba(124, 58, 237, 0.2)"
                  >
                    <div
                      class="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium"
                      style="background: #f97316; box-shadow: 2px 3px 6px rgba(0, 0, 0, 0.5); color: #7c2d12"
                    >
                      <span>🔥</span><span>Hot</span>
                    </div>
                    <div
                      class="relative h-40 overflow-hidden"
                      style="background: #1a1a2e"
                    >
                      <img
                        v-if="post.coverImage"
                        :src="post.coverImage"
                        :alt="post.title"
                        class="h-full w-full object-cover"
                      />
                      <div
                        v-else
                        class="flex h-full w-full items-center justify-center"
                        style="background: #1a1a2e"
                      >
                        <span
                          class="text-4xl font-medium"
                          style="color: #4c1d95"
                          >{{ post.title.charAt(0) }}</span
                        >
                      </div>
                      <div class="absolute top-2 right-2 flex flex-wrap justify-end gap-1">
                        <span
                          v-for="tag in post.tags.slice(0, 2)"
                          :key="tag"
                          class="rounded px-1.5 py-0.5 text-xs"
                          style="background: rgba(109, 40, 217, 0.7); color: #e9d5ff"
                          >{{ tag }}</span
                        >
                      </div>
                    </div>
                    <div class="p-3">
                      <p
                        class="mb-1 truncate text-sm font-medium"
                        style="color: #e2e8f0"
                      >
                        {{ post.title }}
                      </p>
                      <p
                        class="mb-2 line-clamp-2 text-xs leading-relaxed"
                        style="color: #94a3b8"
                      >
                        {{ post.description }}
                      </p>
                      <div class="flex items-center justify-between">
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
                  </RouterLink>
                </div>

                <!-- LOVED ROW -->
                <div class="mb-4 grid grid-cols-2 gap-4">
                  <RouterLink
                    v-for="post in lovedPosts"
                    :key="`loved-${post.id}`"
                    :to="`/post/${post.id}`"
                    class="relative block overflow-hidden rounded-xl no-underline transition-all hover:scale-[1.02]"
                    style="border: 1px solid #7c3aed; background: #13131f; box-shadow: 0 0 10px rgba(124, 58, 237, 0.2)"
                  >
                    <div
                      class="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium"
                      style="background: #ec4899; box-shadow: 2px 3px 6px rgba(0, 0, 0, 0.5); color: #831843"
                    >
                      <span>♡</span><span>Loved</span>
                    </div>
                    <div
                      class="relative h-40 overflow-hidden"
                      style="background: #1a1a2e"
                    >
                      <img
                        v-if="post.coverImage"
                        :src="post.coverImage"
                        :alt="post.title"
                        class="h-full w-full object-cover"
                      />
                      <div
                        v-else
                        class="flex h-full w-full items-center justify-center"
                        style="background: #1a1a2e"
                      >
                        <span
                          class="text-4xl font-medium"
                          style="color: #4c1d95"
                          >{{ post.title.charAt(0) }}</span
                        >
                      </div>
                      <div class="absolute top-2 right-2 flex flex-wrap justify-end gap-1">
                        <span
                          v-for="tag in post.tags.slice(0, 2)"
                          :key="tag"
                          class="rounded px-1.5 py-0.5 text-xs"
                          style="background: rgba(109, 40, 217, 0.7); color: #e9d5ff"
                          >{{ tag }}</span
                        >
                      </div>
                    </div>
                    <div class="p-3">
                      <p
                        class="mb-1 truncate text-sm font-medium"
                        style="color: #e2e8f0"
                      >
                        {{ post.title }}
                      </p>
                      <p
                        class="mb-2 line-clamp-2 text-xs leading-relaxed"
                        style="color: #94a3b8"
                      >
                        {{ post.description }}
                      </p>
                      <div class="flex items-center justify-between">
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
                          {{ post.comments?.length || 0 }} comments
                        </p>
                      </div>
                    </div>
                  </RouterLink>
                </div>

                <!-- NEW ROW -->
                <div class="grid grid-cols-2 gap-4">
                  <RouterLink
                    v-for="post in newPosts"
                    :key="`new-${post.id}`"
                    :to="`/post/${post.id}`"
                    class="relative block overflow-hidden rounded-xl no-underline transition-all hover:scale-[1.02]"
                    style="border: 1px solid #7c3aed; background: #13131f; box-shadow: 0 0 10px rgba(124, 58, 237, 0.2)"
                  >
                    <div
                      class="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium"
                      style="background: #3b82f6; box-shadow: 2px 3px 6px rgba(0, 0, 0, 0.5); color: #1e3a8a"
                    >
                      <span>◷</span><span>New</span>
                    </div>
                    <div
                      class="relative h-40 overflow-hidden"
                      style="background: #1a1a2e"
                    >
                      <img
                        v-if="post.coverImage"
                        :src="post.coverImage"
                        :alt="post.title"
                        class="h-full w-full object-cover"
                      />
                      <div
                        v-else
                        class="flex h-full w-full items-center justify-center"
                        style="background: #1a1a2e"
                      >
                        <span
                          class="text-4xl font-medium"
                          style="color: #4c1d95"
                          >{{ post.title.charAt(0) }}</span
                        >
                      </div>
                      <div class="absolute top-2 right-2 flex flex-wrap justify-end gap-1">
                        <span
                          v-for="tag in post.tags.slice(0, 2)"
                          :key="tag"
                          class="rounded px-1.5 py-0.5 text-xs"
                          style="background: rgba(109, 40, 217, 0.7); color: #e9d5ff"
                          >{{ tag }}</span
                        >
                      </div>
                    </div>
                    <div class="p-3">
                      <p
                        class="mb-1 truncate text-sm font-medium"
                        style="color: #e2e8f0"
                      >
                        {{ post.title }}
                      </p>
                      <p
                        class="mb-2 line-clamp-2 text-xs leading-relaxed"
                        style="color: #94a3b8"
                      >
                        {{ post.description }}
                      </p>
                      <div class="flex items-center justify-between">
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
                  </RouterLink>
                </div>
              </template>
            </template>
          </main>
        </div>
      </div>

      <!-- FOOTER -->
      <footer
        class="shrink-0 px-6 py-6 text-center"
        style="background: #0d0d14; border-top: 1px solid #7c3aed; box-shadow: 0 0 12px rgba(124, 58, 237, 0.3)"
      >
        <p
          class="text-sm font-medium"
          style="color: #c4b5fd"
        >
          URate — Final Project
        </p>
        <p
          class="mt-1 text-xs"
          style="color: #7c3aed"
        >
          Made by Sergio D. Morfin
        </p>
        <p
          class="mt-2 text-xs"
          style="color: #6d28d9"
        >
          {{ currentTime }}
        </p>
      </footer>
    </div>

    <!-- ─────────────────────────────────────────
         RIGHT SIDEBAR COLUMN
         Mirror of the left sidebar.
    ───────────────────────────────────────────── -->
    <div
      class="hidden w-60 shrink-0 lg:block"
      style="
        background: linear-gradient(to bottom, #7c3aed, #4c1d95, #7c3aed, #4c1d95, #7c3aed);
        box-shadow:
          0 0 200px rgba(124, 58, 237, 0.8),
          inset 0 0 100px rgba(167, 139, 250, 0.3);
        border-left: 1px solid #a78bfa;
      "
    ></div>
  </div>
</template>
