// ─────────────────────────────────────────────
// PRESET POST DATA
// Four sample posts that ship with the app.
// Each post has:
//   id          – unique identifier used in routing (/post/:id)
//   title       – display name of the post
//   description – short blurb shown on the card
//   tags        – array of tag strings (drives the tag pill filter)
//   views       – view count (slider order is derived from this)
//   rating      – current average star rating (1–5)
//                 NOTE: this is a static placeholder for now.
//                 Once the backend is wired up, rating will be
//                 computed dynamically from all submitted ratings:
//                 average = sum of all ratings / ratingCount
//   ratingCount – how many users have submitted a rating
//   coverImage  – path or URL to the post's cover image.
//                 null = show a colored placeholder.
//                 When the creator uploads a cover image, this
//                 will be set to the saved file path, e.g.:
//                 '/uploads/covers/mass-effect.jpg'
//                 The template checks: if coverImage is set,
//                 show <img>, otherwise show the placeholder div.
//   tiers       – S/A/B/C/D/F keys, each an array of items.
//                 Each item: { name: string, image: string|null }
//                 item.image works the same way as coverImage —
//                 null now, real path/URL when images are added.
// ─────────────────────────────────────────────
export const postsData = [
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
    description: 'A definitive ranking of the most iconic ice cream flavors. Opinions are strong. Fights will happen.',
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
];
