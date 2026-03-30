<script setup>
  import { ref, computed } from 'vue';
  import { RouterLink } from 'vue-router';

  const TIER_COLORS = {
    S: { label: 'text-pink-700', chip: 'bg-pink-500' },
    A: { label: 'text-purple-700', chip: 'bg-purple-500' },
    B: { label: 'text-blue-700', chip: 'bg-blue-600' },
    C: { label: 'text-orange-700', chip: 'bg-orange-500' },
    D: { label: 'text-yellow-700', chip: 'bg-yellow-400' },
    F: { label: 'text-red-700', chip: 'bg-red-500' },
  };

  const posts = ref([
    {
      id: 1,
      title: 'Best Mass Effect companions',
      description: 'Every squadmate across the trilogy ranked by loyalty, combat usefulness, and banter quality.',
      tags: ['Gaming', 'Mass Effect', 'RPG'],
      views: 2700,
      rating: 4.8,
      ratingCount: 42,
      coverImage:
        'https://d1lss44hh2trtw.cloudfront.net/resize?type=webp&url=https%3A%2F%2Fshacknews-www.s3.amazonaws.com%2Fassets%2Farticle%2F2021%2F05%2F05%2Fmass-effect-legendary-editions-website-now-lets-you-create-your-own-cover-art_feature.jpg&width=1032&sign=NkwTUastu1zKOGmhN-ie0_LCP_E1qVdw0vvr3Dpdt_0',
      tiers: {
        S: [
          { name: 'Tali', image: null },
          { name: 'Garrus', image: null },
          { name: 'Vetra', image: null },
        ],
        A: [
          { name: 'Mordin', image: null },
          { name: 'Legion', image: null },
          { name: 'Liara', image: null },
          { name: 'Miranda', image: null },
        ],
        B: [
          { name: 'Wrex', image: null },
          { name: 'Thane', image: null },
          { name: 'Grunt', image: null },
          { name: 'Nyreen', image: null },
        ],
        C: [
          { name: 'Jack', image: null },
          { name: 'Kasumi', image: null },
          { name: 'Aria', image: null },
        ],
        D: [
          { name: 'Zaeed', image: null },
          { name: 'Javik', image: null },
          { name: 'EDI', image: null },
          { name: 'James', image: null },
          { name: 'Peebee', image: null },
          { name: 'Drak', image: null },
        ],
        F: [
          { name: 'Jaal', image: null },
          { name: 'Jacob', image: null },
          { name: 'Samara', image: null },
          { name: 'Morinth', image: null },
          { name: 'Liam', image: null },
          { name: 'Cora', image: null },
          { name: 'Kaidan', image: null },
          { name: 'Ashley', image: null },
        ],
      },
    },
    {
      id: 2,
      title: 'Best Genshin Impact regions',
      description: 'All regions judged on exploration design, soundtrack, world quests, and overall atmosphere.',
      tags: ['Gaming', 'Genshin Impact', 'Open World'],
      views: 3100,
      rating: 4.5,
      ratingCount: 67,
      coverImage:
        'https://imgeucdn.gamespress.com/cdn/files/Games%20Press/2020/08/06091349-87c79feb-fac4-41b2-808d-b906bd5fa00e/Genshin_Impact_Key_Art-EN.jpg?w=533&mode=max&otf=y&quality=90&format=jpg&bgcolor=white&sky=65a18af47f220d9cba821024e39563d06979085461bfd961631afbbded094263',
      tiers: {
        S: [
          { name: 'Fontaine', image: null },
          { name: 'Mondstadt', image: null },
        ],
        A: [
          { name: 'Nod Krai', image: null },
          { name: 'Sumeru', image: null },
          { name: 'Liyue', image: null },
        ],
        B: [{ name: 'Natlan', image: null }],
        C: [{ name: 'Inazuma', image: null }],
        D: [],
        F: [],
      },
    },
    {
      id: 3,
      title: 'Best Call of Duty Zombies maps',
      description: 'Classic and modern zombies maps ranked on atmosphere, easter eggs, layout, and replayability.',
      tags: ['Gaming', 'Call of Duty', 'FPS'],
      views: 980,
      rating: 4.1,
      ratingCount: 29,
      coverImage: 'https://i.ytimg.com/vi/1Bo-Vt5Dopw/maxresdefault.jpg',
      tiers: {
        S: [
          { name: 'Tranzit', image: null },
          { name: 'Mob of the Dead', image: null },
        ],
        A: [
          { name: 'Kino der Toten', image: null },
          { name: 'Der Eisendrache', image: null },
        ],
        B: [{ name: 'Shadows of Evil', image: null }],
        C: [{ name: 'Buried', image: null }],
        D: [{ name: 'Five', image: null }],
        F: [],
      },
    },
    {
      id: 4,
      title: 'Best ice cream flavors',
      description:
        'A definitive ranking of the most iconic ice cream flavors. Opinions are strong. Fights will happen.',
      tags: ['Food', 'Ice Cream'],
      views: 2100,
      rating: 4.3,
      ratingCount: 55,
      coverImage: 'https://portsoyicecream.co.uk/site/wp-content/uploads/ice-1554x1171.jpg',
      tiers: {
        S: [
          { name: 'Vanilla', image: null },
          { name: 'Cookies & cream', image: null },
        ],
        A: [
          { name: 'Coffee', image: null },
          { name: 'Strawberry', image: null },
        ],
        B: [
          { name: 'Chocolate', image: null },
          { name: 'Rocky Road', image: null },
        ],
        C: [{ name: 'Pistachio', image: null }],
        D: [{ name: 'Bubblegum', image: null }],
        F: [{ name: 'Rum raisin', image: null }],
      },
    },
  ]);

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
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-3">
      <RouterLink
        to="/"
        class="font-medium text-gray-900 no-underline"
        >TierShare</RouterLink
      >
      <div class="flex items-center gap-4">
        <RouterLink
          to="/"
          class="text-sm text-gray-500 hover:text-gray-800"
          >Browse</RouterLink
        >
        <RouterLink
          to="/create"
          class="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-800 no-underline hover:bg-gray-50"
        >
          + New list
        </RouterLink>
      </div>
    </nav>

    <section class="border-b border-gray-100 bg-white px-6 py-4">
      <p class="mb-3 text-xs tracking-widest text-gray-400 uppercase">Top viewed</p>

      <div class="flex gap-3 overflow-x-auto pb-1">
        <RouterLink
          v-for="post in topViewed"
          :key="post.id"
          :to="`/post/${post.id}`"
          class="w-52 flex-none overflow-hidden rounded-xl border border-gray-200 no-underline transition-colors hover:border-gray-400"
        >
          <div class="relative h-28 overflow-hidden bg-gray-100">
            <img
              v-if="post.coverImage"
              :src="post.coverImage"
              :alt="post.title"
              class="h-full w-full object-cover"
            />
            <div
              v-else
              class="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
            >
              <span class="text-3xl font-medium text-gray-300">
                {{ post.title.charAt(0) }}
              </span>
            </div>
            <span class="absolute bottom-2 left-2 rounded-full bg-black/40 px-2 py-0.5 text-xs text-white">
              {{ post.views.toLocaleString() }} views
            </span>
          </div>
          <div class="bg-white p-2.5">
            <p class="truncate text-xs font-medium text-gray-800">{{ post.title }}</p>
            <p class="mt-0.5 text-xs text-amber-600">{{ starsDisplay(post.rating) }} {{ post.rating.toFixed(1) }}</p>
          </div>
        </RouterLink>
      </div>
    </section>
    <main class="mx-auto max-w-4xl px-6 py-5">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search posts or tags..."
        class="mb-4 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-colors outline-none focus:border-gray-400"
      />
      <div class="mb-6 flex flex-wrap gap-2">
        <button
          v-for="tag in allTags"
          :key="tag"
          @click="toggleTag(tag)"
          class="rounded-full border px-3 py-1.5 text-xs transition-colors"
          :class="
            activeTag === tag
              ? 'border-purple-300 bg-purple-50 text-purple-800'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
          "
        >
          {{ tag }}
        </button>
      </div>
      <p class="mb-3 text-xs tracking-widest text-gray-400 uppercase">Recent posts</p>
      <div
        v-if="filteredPosts.length"
        class="grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        <RouterLink
          v-for="post in filteredPosts"
          :key="post.id"
          :to="`/post/${post.id}`"
          class="block overflow-hidden rounded-xl border border-gray-100 bg-white no-underline transition-colors hover:border-gray-300"
        >
          <div class="relative h-36 overflow-hidden bg-gray-100">
            <img
              v-if="post.coverImage"
              :src="post.coverImage"
              :alt="post.title"
              class="h-full w-full object-cover"
            />
            <div
              v-else
              class="flex h-full w-full flex-col items-center justify-center gap-1 bg-gradient-to-br from-gray-100 to-gray-200"
            >
              <span class="text-4xl font-medium text-gray-300">
                {{ post.title.charAt(0) }}
              </span>
              <span class="text-xs text-gray-400">No cover image</span>
            </div>
            <div class="absolute top-2 right-2 flex flex-wrap justify-end gap-1">
              <span
                v-for="tag in post.tags.slice(0, 2)"
                :key="tag"
                class="rounded bg-black/40 px-1.5 py-0.5 text-xs text-white"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          <div class="p-3">
            <p class="mb-1 truncate text-sm font-medium text-gray-800">{{ post.title }}</p>
            <p class="mb-3 line-clamp-2 text-xs leading-relaxed text-gray-400">
              {{ post.description }}
            </p>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs text-amber-600">
                  {{ starsDisplay(post.rating) }} {{ post.rating.toFixed(1) }}
                  <span class="text-gray-400">({{ post.ratingCount }})</span>
                </p>
                <p class="text-xs text-gray-400">{{ post.views.toLocaleString() }} views</p>
              </div>
            </div>
          </div>
        </RouterLink>
      </div>
      <div
        v-else
        class="py-16 text-center"
      >
        <p class="text-sm text-gray-400">No posts match your search.</p>
        <button
          @click="
            searchQuery = '';
            activeTag = null;
          "
          class="mt-3 text-xs text-purple-700 hover:underline"
        >
          Clear filters
        </button>
      </div>
    </main>
  </div>
</template>
