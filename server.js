// ─────────────────────────────────────────────
// URATE BACKEND SERVER
// Simple Express server that reads and writes
// post JSON files from src/data/posts/
//
// Run with: node server.js
// Runs on port 3001 so it doesn't clash with
// Vite's dev server on port 5173.
//
// ENDPOINTS:
//   GET  /api/posts                              - returns all posts as array
//   POST /api/posts                              - saves a new post JSON file
//   GET  /api/posts/:id                          - returns a single post by ID
//   POST /api/posts/:id/view                     - increments view count
//   POST /api/posts/:id/comments                 - adds a comment to a post
//   POST /api/posts/:id/rate                     - submits a star rating
//   POST /api/posts/:id/comments/:commentId/like    - likes a comment
//   POST /api/posts/:id/comments/:commentId/dislike - dislikes a comment
// ─────────────────────────────────────────────

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = path.join(__dirname, 'src', 'data', 'posts');

// ─────────────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────────
// HELPER: readPost
// Reads a single post JSON file and returns
// the parsed object. Returns null if not found.
// ─────────────────────────────────────────────
function readPost(id) {
  const filePath = path.join(POSTS_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// ─────────────────────────────────────────────
// HELPER: writePost
// Writes a post object back to its JSON file.
// ─────────────────────────────────────────────
function writePost(id, post) {
  const filePath = path.join(POSTS_DIR, `${id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(post, null, 2), 'utf-8');
}

// ─────────────────────────────────────────────
// HELPER: getNextPostId
// Finds the highest existing post number and
// returns the next one formatted as p0001.
// Max is p9999.
// ─────────────────────────────────────────────
function getNextPostId() {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.json'));
  if (files.length === 0) return 'p0001';
  const numbers = files.map((f) => {
    const match = f.match(/^p(\d+)\.json$/);
    return match ? parseInt(match[1], 10) : 0;
  });
  const next = Math.max(...numbers) + 1;
  if (next > 9999) throw new Error('Maximum post limit (9999) reached');
  return `p${String(next).padStart(4, '0')}`;
}

// ─────────────────────────────────────────────
// GET /api/posts
// Reads every JSON file in the posts directory
// and returns them all as an array sorted by
// newest first.
// ─────────────────────────────────────────────
app.get('/api/posts', (req, res) => {
  try {
    const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.json'));
    const posts = files.map((file) => {
      const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
      return JSON.parse(content);
    });
    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(posts);
  } catch (err) {
    console.error('Error reading posts:', err);
    res.status(500).json({ error: 'Failed to read posts' });
  }
});

// ─────────────────────────────────────────────
// GET /api/posts/:id
// Returns a single post by its ID.
// CHANGED: View count is no longer incremented
// here. Views are incremented via the separate
// POST /api/posts/:id/view endpoint so the count
// only goes up on actual page visits, not on
// every data fetch which was causing refresh loops.
// ─────────────────────────────────────────────
app.get('/api/posts/:id', (req, res) => {
  try {
    const post = readPost(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    console.error('Error reading post:', err);
    res.status(500).json({ error: 'Failed to read post' });
  }
});

// ─────────────────────────────────────────────
// POST /api/posts/:id/view
// Increments the view count for a post.
// Called once by PostView.vue on mount.
// Separated from GET so views only increment
// on actual page visits, not every data fetch.
// ─────────────────────────────────────────────
app.post('/api/posts/:id/view', (req, res) => {
  try {
    const post = readPost(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    post.views = (post.views || 0) + 1;
    writePost(req.params.id, post);
    res.json({ success: true, views: post.views });
  } catch (err) {
    console.error('Error incrementing view:', err);
    res.status(500).json({ error: 'Failed to increment view' });
  }
});

// ─────────────────────────────────────────────
// POST /api/posts
// Receives post data from PreviewView.vue,
// assigns the next available ID, and saves it
// as a JSON file in the posts directory.
// ─────────────────────────────────────────────
app.post('/api/posts', (req, res) => {
  try {
    const postData = req.body;
    const id = getNextPostId();

    const post = {
      id,
      title: postData.title,
      description: postData.description,
      authorName: postData.authorName,
      tags: postData.tags || [],
      views: 0,
      rating: 0,
      ratingCount: 0,
      ratingTotal: 0,
      coverImage: postData.coverImage || null,
      tiers: postData.tiers,
      comments: [],
      createdAt: new Date().toISOString(),
    };

    writePost(id, post);
    console.log(`Created new post: ${id} - "${post.title}"`);
    res.status(201).json({ success: true, id, post });
  } catch (err) {
    console.error('Error saving post:', err);
    res.status(500).json({ error: err.message || 'Failed to save post' });
  }
});

// ─────────────────────────────────────────────
// POST /api/posts/:id/comments
// Adds a new comment to a post.
// Each comment has id, authorName, text,
// likes, dislikes, and createdAt.
// ─────────────────────────────────────────────
app.post('/api/posts/:id/comments', (req, res) => {
  try {
    const post = readPost(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const nextNum = post.comments.length + 1;
    const commentId = `c${String(nextNum).padStart(4, '0')}`;

    const comment = {
      id: commentId,
      authorName: req.body.authorName || 'Anonymous',
      text: req.body.text,
      likes: 0,
      dislikes: 0,
      createdAt: new Date().toISOString(),
    };

    post.comments.push(comment);
    writePost(req.params.id, post);

    console.log(`New comment on ${req.params.id} by ${comment.authorName}`);
    res.status(201).json({ success: true, comment });
  } catch (err) {
    console.error('Error saving comment:', err);
    res.status(500).json({ error: 'Failed to save comment' });
  }
});

// ─────────────────────────────────────────────
// POST /api/posts/:id/rate
// Submits a star rating (1-5) for a post.
// Adds to ratingTotal and increments ratingCount,
// then recalculates the average stored in rating.
// The frontend uses localStorage to prevent
// a user from rating the same post twice per
// browser session.
// ─────────────────────────────────────────────
app.post('/api/posts/:id/rate', (req, res) => {
  try {
    const post = readPost(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const stars = parseInt(req.body.stars, 10);
    if (stars < 1 || stars > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    post.ratingTotal = (post.ratingTotal || 0) + stars;
    post.ratingCount = (post.ratingCount || 0) + 1;
    post.rating = Math.round((post.ratingTotal / post.ratingCount) * 10) / 10;

    writePost(req.params.id, post);

    console.log(`New rating on ${req.params.id}: ${stars} stars (avg now ${post.rating})`);
    res.json({ success: true, rating: post.rating, ratingCount: post.ratingCount });
  } catch (err) {
    console.error('Error saving rating:', err);
    res.status(500).json({ error: 'Failed to save rating' });
  }
});

// ─────────────────────────────────────────────
// POST /api/posts/:id/comments/:commentId/like
// Increments the like count on a specific comment.
// ─────────────────────────────────────────────
app.post('/api/posts/:id/comments/:commentId/like', (req, res) => {
  try {
    const post = readPost(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comment = post.comments.find((c) => c.id === req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    comment.likes = (comment.likes || 0) + 1;
    writePost(req.params.id, post);

    res.json({ success: true, likes: comment.likes });
  } catch (err) {
    console.error('Error liking comment:', err);
    res.status(500).json({ error: 'Failed to like comment' });
  }
});

// ─────────────────────────────────────────────
// POST /api/posts/:id/comments/:commentId/dislike
// Increments the dislike count on a specific comment.
// ─────────────────────────────────────────────
app.post('/api/posts/:id/comments/:commentId/dislike', (req, res) => {
  try {
    const post = readPost(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comment = post.comments.find((c) => c.id === req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    comment.dislikes = (comment.dislikes || 0) + 1;
    writePost(req.params.id, post);

    res.json({ success: true, dislikes: comment.dislikes });
  } catch (err) {
    console.error('Error disliking comment:', err);
    res.status(500).json({ error: 'Failed to dislike comment' });
  }
});

// ─────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`URate backend running at http://localhost:${PORT}`);
  console.log(`Posts directory: ${POSTS_DIR}`);
});
