<script setup>
  // ─────────────────────────────────────────────
  // IMPORTS
  // ─────────────────────────────────────────────
  import { ref, computed, onMounted } from 'vue';
  import { RouterLink } from 'vue-router';

  // ─────────────────────────────────────────────
  // POSTS STATE
  // ─────────────────────────────────────────────
  const posts = ref([]);
  const loading = ref(true);

  // ─────────────────────────────────────────────
  // FETCH ALL POSTS
  // ─────────────────────────────────────────────
  onMounted(async () => {
    try {
      const res = await fetch('http://localhost:3001/api/posts');
      posts.value = await res.json();
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      loading.value = false;
    }
  });

  // ─────────────────────────────────────────────
  // COMPUTED: GROUPED POSTS
  // Groups posts alphabetically by the first
  // character of their title.
  // # — titles starting with a number (0-9)
  // A-Z — titles starting with that letter
  // @ — titles starting with any other character
  //
  // Within each group posts are sorted
  // alphabetically by title.
  // ─────────────────────────────────────────────
  const groupedPosts = computed(() => {
    // Sort all posts alphabetically by title first
    const sorted = [...posts.value].sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));

    // Build the groups object
    const groups = {};

    sorted.forEach((post) => {
      const firstChar = post.title.charAt(0).toUpperCase();
      let key;

      if (/[0-9]/.test(firstChar)) {
        key = '#';
      } else if (/[A-Z]/.test(firstChar)) {
        key = firstChar;
      } else {
        key = '@';
      }

      if (!groups[key]) groups[key] = [];
      groups[key].push(post);
    });

    const letterOrder = ['#', ...Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ'), '@'];
    return letterOrder.filter((letter) => groups[letter]).map((letter) => ({ letter, posts: groups[letter] }));
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
      <div class="flex items-center gap-4">
        <RouterLink
          to="/"
          class="text-sm no-underline"
          style="color: #a78bfa"
          >Home</RouterLink
        >
        <RouterLink
          to="/browse"
          class="text-sm font-medium no-underline"
          style="color: #c4b5fd"
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
        <main class="mx-auto max-w-4xl px-6 py-8">
          <h1
            class="mb-2 text-3xl font-bold"
            style="color: #e9d5ff"
          >
            Browse
          </h1>
          <p
            class="mb-8 text-sm"
            style="color: #64748b"
          >
            All tier lists, sorted alphabetically.
          </p>

          <!-- Loading state -->
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

          <!-- Empty state -->
          <div
            v-else-if="!posts.length"
            class="py-16 text-center"
          >
            <p
              class="text-sm"
              style="color: #64748b"
            >
              No posts yet.
            </p>
            <RouterLink
              to="/create"
              class="mt-3 text-xs no-underline"
              style="color: #a78bfa"
            >
              Create the first one →
            </RouterLink>
          </div>

          <!-- ─────────────────────────────────────
               ALPHABETICAL GROUPS
               # section first for numbered titles.
               Then A-Z letter sections.
               @ section last for special characters.
               Each section shows a large letter
               heading followed by pill-style post
               links showing title and author.
          ───────────────────────────────────────── -->
          <div
            v-else
            class="space-y-10"
          >
            <div
              v-for="group in groupedPosts"
              :key="group.letter"
            >
              <!-- Letter heading with neon purple underline -->
              <div
                class="mb-4 pb-2"
                style="border-bottom: 1px solid #7c3aed"
              >
                <span
                  class="text-2xl font-bold"
                  style="color: #7c3aed"
                >
                  {{ group.letter }}
                </span>
              </div>

              <!-- Post pills
                   Each pill shows the post title and author.
                   Clicking navigates to /post/:id.
              -->
              <div class="flex flex-wrap gap-3">
                <RouterLink
                  v-for="post in group.posts"
                  :key="post.id"
                  :to="`/post/${post.id}`"
                  class="no-underline transition-all hover:scale-[1.02]"
                >
                  <div
                    class="rounded-lg px-4 py-2.5"
                    style="background: #13131f; border: 1px solid #7c3aed; box-shadow: 0 0 8px rgba(124, 58, 237, 0.15)"
                  >
                    <p
                      class="text-sm font-medium"
                      style="color: #e2e8f0"
                    >
                      {{ post.title }}
                    </p>
                    <p
                      class="mt-0.5 text-xs"
                      style="color: #64748b"
                    >
                      by {{ post.authorName }}
                    </p>
                  </div>
                </RouterLink>
              </div>
            </div>
          </div>
        </main>
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
        URate — Final Project
      </p>
      <p
        class="mt-1 text-xs"
        style="color: #7c3aed"
      >
        Made by Sergio D. Morfin
      </p>
    </footer>
  </div>
</template>
