<script setup>
  // ─────────────────────────────────────────────
  // IMPORTS
  // ─────────────────────────────────────────────
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter, RouterLink } from 'vue-router';

  const route = useRoute();
  const router = useRouter();

  const TIER_COLORS = {
    S: { label: 'text-pink-400', chip: 'bg-pink-600' },
    A: { label: 'text-purple-400', chip: 'bg-purple-600' },
    B: { label: 'text-blue-400', chip: 'bg-blue-600' },
    C: { label: 'text-orange-400', chip: 'bg-orange-600' },
    D: { label: 'text-yellow-400', chip: 'bg-yellow-600' },
    F: { label: 'text-red-400', chip: 'bg-red-600' },
  };

  const post = ref(null);
  const loading = ref(true);
  const error = ref(null);
  const userRating = ref(0);
  const hoverRating = ref(0);
  const hasRated = ref(false);
  const ratingSubmitting = ref(false);
  const commentAuthor = ref('');
  const commentText = ref('');
  const commentSubmitting = ref(false);

  onMounted(async () => {
    try {
      const res = await fetch(`https://urate.onrender.com/api/posts/${route.params.id}`);
      if (!res.ok) throw new Error('Post not found');
      post.value = await res.json();

      // Check localStorage to see if user already rated this post
      const ratedPosts = JSON.parse(localStorage.getItem('ratedPosts') || '{}');
      if (ratedPosts[route.params.id]) {
        hasRated.value = true;
        userRating.value = ratedPosts[route.params.id];
      }
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  });

  function getTierItems() {
    return ['S', 'A', 'B', 'C', 'D', 'F'].filter((tier) => post.value.tiers[tier]?.length > 0);
  }

  function starsDisplay(rating) {
    const full = Math.round(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  function hasLiked(commentId) {
    return !!localStorage.getItem(`liked_${route.params.id}_${commentId}`);
  }

  function hasDisliked(commentId) {
    return !!localStorage.getItem(`disliked_${route.params.id}_${commentId}`);
  }

  async function submitRating(stars) {
    if (hasRated.value || ratingSubmitting.value) return;
    ratingSubmitting.value = true;

    try {
      const res = await fetch(`https://urate.onrender.com/api/posts/${route.params.id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stars }),
      });

      if (!res.ok) throw new Error('Failed to submit rating');
      const result = await res.json();

      post.value.rating = result.rating;
      post.value.ratingCount = result.ratingCount;
      userRating.value = stars;
      hasRated.value = true;

      const ratedPosts = JSON.parse(localStorage.getItem('ratedPosts') || '{}');
      ratedPosts[route.params.id] = stars;
      localStorage.setItem('ratedPosts', JSON.stringify(ratedPosts));
    } catch (err) {
      alert('Error submitting rating: ' + err.message);
    } finally {
      ratingSubmitting.value = false;
    }
  }

  async function submitComment() {
    if (!commentAuthor.value.trim() || !commentText.value.trim()) {
      alert('Please enter your name and a comment');
      return;
    }
    if (commentSubmitting.value) return;
    commentSubmitting.value = true;

    try {
      const res = await fetch(`https://urate.onrender.com/api/posts/${route.params.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: commentAuthor.value,
          text: commentText.value,
        }),
      });

      if (!res.ok) throw new Error('Failed to post comment');
      const result = await res.json();

      post.value.comments.push(result.comment);
      commentAuthor.value = '';
      commentText.value = '';
    } catch (err) {
      alert('Error posting comment: ' + err.message);
    } finally {
      commentSubmitting.value = false;
    }
  }

  async function likeComment(comment) {
    const key = `liked_${route.params.id}_${comment.id}`;
    if (localStorage.getItem(key)) return;

    try {
      const res = await fetch(`https://urate.onrender.com/api/posts/${route.params.id}/comments/${comment.id}/like`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to like comment');
      const result = await res.json();
      comment.likes = result.likes;
      localStorage.setItem(key, '1');
    } catch (err) {
      console.error('Error liking comment:', err);
    }
  }

  async function dislikeComment(comment) {
    const key = `disliked_${route.params.id}_${comment.id}`;
    if (localStorage.getItem(key)) return;

    try {
      const res = await fetch(
        `https://urate.onrender.com/api/posts/${route.params.id}/comments/${comment.id}/dislike`,
        {
          method: 'POST',
        },
      );
      if (!res.ok) throw new Error('Failed to dislike comment');
      const result = await res.json();
      comment.dislikes = result.dislikes;
      localStorage.setItem(key, '1');
    } catch (err) {
      console.error('Error disliking comment:', err);
    }
  }
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
          URate
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
        <!-- LOADING STATE -->
        <div
          v-if="loading"
          class="flex items-center justify-center py-32"
        >
          <p
            class="text-sm"
            style="color: #7c3aed"
          >
            Loading post...
          </p>
        </div>

        <!-- ERROR STATE -->
        <div
          v-else-if="error"
          class="flex flex-col items-center justify-center gap-4 py-32"
        >
          <p
            class="text-sm"
            style="color: #f87171"
          >
            Post not found.
          </p>
          <RouterLink
            to="/"
            class="text-xs no-underline"
            style="color: #a78bfa"
            >← Back to home</RouterLink
          >
        </div>

        <!-- POST CONTENT -->
        <main
          v-else
          class="mx-auto max-w-3xl px-6 py-8"
        >
          <!-- ─────────────────────────────────────
               POST TITLE
          ───────────────────────────────────────── -->
          <h1
            class="mb-3 text-3xl font-bold"
            style="color: #e9d5ff"
          >
            {{ post.title }}
          </h1>

          <!-- ─────────────────────────────────────
               TAGS
          ───────────────────────────────────────── -->
          <div
            v-if="post.tags?.length"
            class="mb-4 flex flex-wrap gap-2"
          >
            <span
              v-for="tag in post.tags"
              :key="tag"
              class="rounded-full px-3 py-1 text-xs"
              style="background: rgba(124, 58, 237, 0.2); border: 1px solid #7c3aed; color: #c4b5fd"
            >
              {{ tag }}
            </span>
          </div>

          <!-- ─────────────────────────────────────
               COVER IMAGE
               Big and prominent at the top.
          ───────────────────────────────────────── -->
          <div
            class="mb-6 h-72 overflow-hidden rounded-xl"
            style="border: 1px solid #7c3aed; box-shadow: 0 0 16px rgba(124, 58, 237, 0.3)"
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
                class="text-6xl font-bold"
                style="color: #4c1d95"
              >
                {{ post.title.charAt(0) }}
              </span>
            </div>
          </div>

          <!-- ─────────────────────────────────────
               AUTHOR + META
          ───────────────────────────────────────── -->
          <div
            class="mb-6 flex items-center justify-between pb-6"
            style="border-bottom: 1px solid #7c3aed"
          >
            <div>
              <p
                class="text-sm"
                style="color: #a78bfa"
              >
                By
                <span
                  class="font-medium"
                  style="color: #c4b5fd"
                  >{{ post.authorName }}</span
                >
              </p>
              <p
                class="mt-1 text-xs"
                style="color: #64748b"
              >
                {{ formatDate(post.createdAt) }}
              </p>
            </div>
            <div class="text-right">
              <p
                class="text-sm"
                style="color: #a78bfa"
              >
                {{ starsDisplay(post.rating) }} {{ post.rating.toFixed(1) }}
              </p>
              <p
                class="text-xs"
                style="color: #64748b"
              >
                {{ post.ratingCount }} ratings · {{ post.views.toLocaleString() }} views
              </p>
            </div>
          </div>

          <!-- ─────────────────────────────────────
               DESCRIPTION
          ───────────────────────────────────────── -->
          <div
            class="mb-8 rounded-lg p-4"
            style="background: #13131f; border: 1px solid #7c3aed"
          >
            <p
              class="text-sm leading-relaxed"
              style="color: #e2e8f0"
            >
              {{ post.description }}
            </p>
          </div>

          <!-- ─────────────────────────────────────
               TIER LIST
          ───────────────────────────────────────── -->
          <div class="mb-8">
            <h2
              class="mb-4 text-xl font-bold"
              style="color: #c4b5fd"
            >
              Tier list
            </h2>

            <div class="space-y-3">
              <div
                v-for="tier in getTierItems()"
                :key="tier"
              >
                <!-- Tier header -->
                <div class="mb-2 flex items-center gap-3">
                  <span
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg font-bold"
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

                <!-- Items -->
                <div
                  class="flex flex-wrap gap-4 rounded-lg p-4"
                  style="background: #13131f; border: 1px solid #7c3aed"
                >
                  <div
                    v-for="(item, index) in post.tiers[tier]"
                    :key="index"
                    class="flex flex-col items-center gap-2"
                  >
                    <!-- Image if available -->
                    <div
                      v-if="item.image"
                      class="h-40 w-40 shrink-0 overflow-hidden rounded-lg"
                      style="border: 1px solid rgba(124, 58, 237, 0.3)"
                    >
                      <img
                        :src="item.image"
                        :alt="item.name"
                        class="h-full w-full object-cover"
                      />
                    </div>
                    <!-- Placeholder if no image -->
                    <div
                      v-else
                      class="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg p-1 text-center"
                      :class="TIER_COLORS[tier].chip"
                    >
                      <span style="color: #fff; font-size: 11px; font-weight: 500; line-height: 1.2">
                        {{ item.name }}
                      </span>
                    </div>
                    <!-- Item name label -->
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
               STAR RATING SECTION
          ───────────────────────────────────────── -->
          <div
            class="mb-8 rounded-lg p-5"
            style="background: #13131f; border: 1px solid #7c3aed"
          >
            <h3
              class="mb-3 text-sm font-medium"
              style="color: #c4b5fd"
            >
              Rate this post
            </h3>

            <div
              v-if="hasRated"
              class="py-2 text-center"
            >
              <p class="mb-1 text-2xl">{{ starsDisplay(userRating) }}</p>
              <p
                class="text-xs"
                style="color: #a78bfa"
              >
                You rated this {{ userRating }}/5 — thanks!
              </p>
            </div>

            <div
              v-else
              class="flex items-center gap-3"
            >
              <!-- Star buttons -->
              <div class="flex gap-1">
                <button
                  v-for="star in [1, 2, 3, 4, 5]"
                  :key="star"
                  @mouseenter="hoverRating = star"
                  @mouseleave="hoverRating = 0"
                  @click="submitRating(star)"
                  class="text-2xl transition-all"
                  :style="
                    star <= (hoverRating || userRating)
                      ? 'color: #a78bfa; cursor: pointer;'
                      : 'color: #3b1f6b; cursor: pointer;'
                  "
                >
                  ★
                </button>
              </div>
              <span
                class="text-xs"
                style="color: #64748b"
              >
                {{ hoverRating ? `${hoverRating} star${hoverRating > 1 ? 's' : ''}` : 'Click to rate' }}
              </span>
            </div>

            <p
              class="mt-3 text-xs"
              style="color: #64748b"
            >
              Current average: {{ starsDisplay(post.rating) }} {{ post.rating.toFixed(1) }} ({{ post.ratingCount }}
              {{ post.ratingCount === 1 ? 'rating' : 'ratings' }})
            </p>
          </div>

          <!-- ─────────────────────────────────────
               COMMENTS SECTION
          ───────────────────────────────────────── -->
          <div class="mb-8">
            <h2
              class="mb-4 text-xl font-bold"
              style="color: #c4b5fd"
            >
              Comments
              <span
                class="ml-2 text-sm font-normal"
                style="color: #64748b"
              >
                ({{ post.comments?.length || 0 }})
              </span>
            </h2>

            <!-- No comments yet -->
            <div
              v-if="!post.comments?.length"
              class="mb-6 rounded-lg p-6 text-center"
              style="background: #13131f; border: 1px dashed #7c3aed"
            >
              <p
                class="text-sm"
                style="color: #64748b"
              >
                No comments yet. Be the first!
              </p>
            </div>

            <!-- Comment list -->
            <div
              v-else
              class="mb-6 space-y-3"
            >
              <div
                v-for="comment in post.comments"
                :key="comment.id"
                class="rounded-lg p-4"
                style="background: #13131f; border: 1px solid #7c3aed"
              >
                <!-- Comment header: author + date -->
                <div class="mb-2 flex items-center justify-between">
                  <span
                    class="text-sm font-medium"
                    style="color: #c4b5fd"
                  >
                    {{ comment.authorName }}
                  </span>
                  <span
                    class="text-xs"
                    style="color: #64748b"
                  >
                    {{ formatDate(comment.createdAt) }}
                  </span>
                </div>

                <!-- Comment text -->
                <p
                  class="mb-3 text-sm leading-relaxed"
                  style="color: #e2e8f0"
                >
                  {{ comment.text }}
                </p>

                <div class="flex items-center gap-4">
                  <button
                    @click="likeComment(comment)"
                    class="flex items-center gap-1.5 rounded px-2 py-1 text-xs transition-all"
                    :style="
                      hasLiked(comment.id)
                        ? 'color: #64748b; cursor: default; background: rgba(124,58,237,0.05);'
                        : 'color: #a78bfa; cursor: pointer; background: rgba(124,58,237,0.1);'
                    "
                  >
                    <span>👍</span>
                    <span>{{ comment.likes || 0 }}</span>
                  </button>

                  <button
                    @click="dislikeComment(comment)"
                    class="flex items-center gap-1.5 rounded px-2 py-1 text-xs transition-all"
                    :style="
                      hasDisliked(comment.id)
                        ? 'color: #64748b; cursor: default; background: rgba(124,58,237,0.05);'
                        : 'color: #a78bfa; cursor: pointer; background: rgba(124,58,237,0.1);'
                    "
                  >
                    <span>👎</span>
                    <span>{{ comment.dislikes || 0 }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- ─────────────────────────────────────
                 ADD COMMENT FORM
            ───────────────────────────────────────── -->
            <div
              class="rounded-lg p-5"
              style="background: #13131f; border: 1px solid #7c3aed"
            >
              <h3
                class="mb-4 text-sm font-medium"
                style="color: #c4b5fd"
              >
                Leave a comment
              </h3>

              <!-- Author name -->
              <div class="mb-3">
                <label
                  class="mb-1 block text-xs"
                  style="color: #a78bfa"
                  >Your name</label
                >
                <input
                  v-model="commentAuthor"
                  type="text"
                  placeholder="e.g. Serg"
                  class="w-full rounded-lg px-3 py-2 text-sm transition-all outline-none"
                  style="background: #1a1a2e; border: 1px solid #7c3aed; color: #e2e8f0"
                />
              </div>

              <!-- Comment text -->
              <div class="mb-4">
                <label
                  class="mb-1 block text-xs"
                  style="color: #a78bfa"
                  >Comment</label
                >
                <textarea
                  v-model="commentText"
                  placeholder="Share your thoughts on this tier list..."
                  rows="3"
                  class="w-full resize-none rounded-lg px-3 py-2 text-sm transition-all outline-none"
                  style="background: #1a1a2e; border: 1px solid #7c3aed; color: #e2e8f0"
                ></textarea>
              </div>

              <!-- Submit button -->
              <button
                @click="submitComment"
                :disabled="commentSubmitting"
                class="rounded-lg px-5 py-2 text-sm font-medium transition-all"
                :style="
                  commentSubmitting
                    ? 'border: 1px solid #4c1d95; background: rgba(124,58,237,0.1); color: #6d28d9; cursor: not-allowed;'
                    : 'border: 1px solid #7c3aed; background: rgba(124,58,237,0.3); color: #c4b5fd; box-shadow: 0 0 8px rgba(124,58,237,0.3);'
                "
              >
                {{ commentSubmitting ? 'Posting...' : 'Post comment' }}
              </button>
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
