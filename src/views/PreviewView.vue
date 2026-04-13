<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const TIER_COLORS = {
    S: { label: 'text-pink-400', chip: 'bg-pink-600' },
    A: { label: 'text-purple-400', chip: 'bg-purple-600' },
    B: { label: 'text-blue-400', chip: 'bg-blue-600' },
    C: { label: 'text-orange-400', chip: 'bg-orange-600' },
    D: { label: 'text-yellow-400', chip: 'bg-yellow-600' },
    F: { label: 'text-red-400', chip: 'bg-red-600' },
  };

  const formData = ref(
    localStorage.getItem('createFormData') ? JSON.parse(localStorage.getItem('createFormData')) : {},
  );

  function starsDisplay(rating) {
    const full = Math.round(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }

  function getTierItems() {
    return ['S', 'A', 'B', 'C', 'D', 'F'].filter((tier) => formData.value.tiers[tier]?.length > 0);
  }

  function goBack() {
    router.push({ name: 'create' });
  }

  async function postToFile() {
    try {
      console.log('Posting:', formData.value);
      localStorage.removeItem('createFormData');
      alert('Post created! Redirecting to home...');
      router.push('/');
    } catch (error) {
      alert('Error posting: ' + error.message);
    }
  }
</script>

<template>
  <div
    class="flex min-h-screen flex-col"
    style="background: #0a0a0f"
  >
    <!-- NAVIGATION BAR -->
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
      <div
        class="text-sm font-medium"
        style="color: #c4b5fd"
      >
        Preview
      </div>
      <RouterLink
        to="/"
        class="rounded-lg px-3 py-1.5 text-sm no-underline transition-all"
        style="border: 1px solid #7c3aed; color: #c4b5fd; box-shadow: 0 0 8px rgba(124, 58, 237, 0.3)"
      >
        ← Home
      </RouterLink>
    </nav>

    <!-- GALAXY BACKGROUND WRAPPER -->
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
        <main class="mx-auto max-w-2xl px-6 py-8">
          <p
            class="mb-6 text-center text-xs"
            style="color: #7c3aed"
          >
            This is how your post will look
          </p>

          <!-- COVER IMAGE -->
          <div
            class="mb-6 h-64 overflow-hidden rounded-xl"
            style="border: 1px solid #7c3aed; background: #13131f; box-shadow: 0 0 12px rgba(124, 58, 237, 0.3)"
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
              style="background: #1a1a2e"
            >
              <span
                class="text-5xl font-medium"
                style="color: #4c1d95"
              >
                {{ formData.title?.charAt(0) }}
              </span>
            </div>
          </div>

          <!-- POST TITLE -->
          <h1
            class="mb-3 text-3xl font-bold"
            style="color: #e9d5ff"
          >
            {{ formData.title }}
          </h1>

          <!-- AUTHOR AND TAGS -->
          <div
            class="mb-6 pb-6"
            style="border-bottom: 1px solid #7c3aed"
          >
            <p
              class="mb-3 text-sm"
              style="color: #a78bfa"
            >
              By <span style="color: #c4b5fd; font-weight: 500">{{ formData.authorName }}</span>
            </p>
            <div
              v-if="formData.tags?.length"
              class="flex flex-wrap gap-2"
            >
              <span
                v-for="tag in formData.tags"
                :key="tag"
                class="rounded-full px-3 py-1 text-xs"
                style="background: rgba(124, 58, 237, 0.2); border: 1px solid #7c3aed; color: #c4b5fd"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- DESCRIPTION -->
          <div
            class="mb-8 rounded-lg p-4"
            style="background: #13131f; border: 1px solid #7c3aed"
          >
            <p
              class="text-sm leading-relaxed"
              style="color: #e2e8f0"
            >
              {{ formData.description }}
            </p>
          </div>

          <!-- ─────────────────────────────────────
               TIER LIST DISPLAY
          ───────────────────────────────────────── -->
          <div class="mb-8">
            <h2
              class="mb-4 text-xl font-bold"
              style="color: #c4b5fd"
            >
              Tier List
            </h2>

            <div class="space-y-4">
              <div
                v-for="tier in getTierItems()"
                :key="tier"
              >
                <!-- Tier label badge -->
                <div class="mb-2 flex items-center gap-3">
                  <span
                    class="flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold"
                    :class="TIER_COLORS[tier].chip"
                    style="color: #fff"
                  >
                    {{ tier }}
                  </span>
                  <span
                    class="text-sm font-medium"
                    :class="TIER_COLORS[tier].label"
                  >
                    {{ tier }} Tier
                  </span>
                </div>

                <!-- Tier items row -->
                <div
                  class="flex flex-wrap gap-4 rounded-lg p-4"
                  style="background: #13131f; border: 1px solid #7c3aed"
                >
                  <div
                    v-for="(item, index) in formData.tiers[tier]"
                    :key="index"
                    class="flex flex-col items-center gap-2"
                  >
                    <!-- Item image if available -->
                    <div
                      v-if="item.image"
                      class="h-20 w-20 overflow-hidden rounded-lg"
                      style="border: 1px solid rgba(124, 58, 237, 0.3)"
                    >
                      <img
                        :src="item.image"
                        :alt="item.name"
                        class="h-full w-full object-cover"
                      />
                    </div>
                    <!-- Colored placeholder if no image -->
                    <div
                      v-else
                      class="flex h-20 w-20 items-center justify-center rounded-lg p-1 text-center"
                      :class="TIER_COLORS[tier].chip"
                    >
                      <span style="color: #fff; font-size: 11px; font-weight: 500; line-height: 1.2">
                        {{ item.name }}
                      </span>
                    </div>
                    <span
                      class="text-center text-xs"
                      style="color: #c4b5fd; max-width: 80px"
                    >
                      {{ item.name }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ─────────────────────────────────────
               ACTION BUTTONS
               Back: returns to CreateView with all data intact
               Post: saves to file and redirects to home
          ───────────────────────────────────────── -->
          <div class="mb-8 flex justify-center gap-4">
            <button
              @click="goBack"
              class="rounded-lg px-6 py-3 text-sm font-medium transition-all"
              style="
                border: 1px solid #7c3aed;
                background: transparent;
                color: #c4b5fd;
                box-shadow: 0 0 8px rgba(124, 58, 237, 0.2);
              "
            >
              ← Back to edit
            </button>
            <button
              @click="postToFile"
              class="rounded-lg px-6 py-3 text-sm font-medium transition-all"
              style="
                border: 1px solid #7c3aed;
                background: rgba(124, 58, 237, 0.3);
                color: #c4b5fd;
                box-shadow: 0 0 12px rgba(124, 58, 237, 0.4);
              "
            >
              Post →
            </button>
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
