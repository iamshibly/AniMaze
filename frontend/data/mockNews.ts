import { NewsArticle } from '@/types/news';
import { dedupeImagesAdvanced } from '@/utils/imageUtils';

const rawMockNewsData: NewsArticle[] = [
  {
    id: '1',
    title: 'Attack on Titan Final Season Receives Critical Acclaim',
    excerpt: 'The long-awaited conclusion to the Attack on Titan anime series has received widespread praise from fans and critics alike, with stunning animation and emotional storytelling.',
    content: 'The final season of Attack on Titan has concluded with what many consider to be one of the most satisfying endings in anime history...',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1885/119899l.jpg',
    imageUrls: [
      'https://cdn.myanimelist.net/images/anime/1885/119899l.jpg',
      'https://cdn.myanimelist.net/images/anime/10/47347l.jpg',
      'https://images.animenewsnetwork.com/thumbnails/max300x600/cms/feature/184/8570.jpg'
    ],
    author: 'Sarah Chen',
    source: 'Anime News Network',
    sourceUrl: 'https://www.animenewsnetwork.com/news/2024-04-03/attack-on-titan-final-season-receives-critical-acclaim/.207721',
    publishedAt: new Date('2024-01-15'),
    category: 'anime',
    tags: ['attack on titan', 'final season', 'mappa'],
    isHeadline: true
  },
  {
    id: '2',
    title: 'Demon Slayer Movie Breaks Box Office Records in Japan',
    excerpt: 'The latest Demon Slayer film has shattered previous box office records, becoming the highest-grossing anime film of all time in Japan.',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1286/99889l.jpg',
    imageUrls: [
      'https://cdn.myanimelist.net/images/anime/1286/99889l.jpg',
      'https://cdn.myanimelist.net/images/anime/1020/108894.jpg',
      'https://images.animenewsnetwork.com/thumbnails/max300x600/cms/news/159/7531.jpg'
    ],
    author: 'Takeshi Yamamoto',
    source: 'Crunchyroll News',
    sourceUrl: 'https://www.crunchyroll.com/news/latest/2024/01/14/demon-slayer-movie-breaks-box-office-records',
    publishedAt: new Date('2024-01-14'),
    category: 'anime',
    tags: ['demon slayer', 'box office', 'movie'],
    score: 9.2
  },
  {
    id: '3',
    title: 'One Piece Chapter 1100 Reveals Major Plot Twist',
    excerpt: 'The latest chapter of One Piece has left fans stunned with a revelation that changes everything we thought we knew about the Void Century.',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/6/73245l.jpg',
    imageUrls: [
      'https://cdn.myanimelist.net/images/anime/6/73245l.jpg',
      'https://cdn.myanimelist.net/images/anime/1244/138851.jpg',
      'https://cdn.myanimelist.net/images/anime/1/67177.jpg'
    ],
    author: 'Maria Rodriguez',
    source: 'Manga Plus',
    sourceUrl: 'https://mangaplus.shueisha.co.jp/titles/100020',
    publishedAt: new Date('2024-01-13'),
    category: 'manga',
    tags: ['one piece', 'manga', 'void century']
  },
  {
    id: '4',
    title: 'Studio Ghibli Announces New Film Project',
    excerpt: 'The legendary animation studio has announced their next feature film, marking their return to original storytelling after several years.',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/4/21289l.jpg',
    imageUrls: [
      'https://cdn.myanimelist.net/images/anime/4/21289l.jpg',
      'https://media.kitsu.io/anime/poster_images/12/medium.jpg',
      'https://media.kitsu.io/anime/cover_images/12/original.jpg'
    ],
    author: 'David Kim',
    source: 'Studio Ghibli',
    sourceUrl: 'https://www.ghibli.jp/info/013400/',
    publishedAt: new Date('2024-01-12'),
    category: 'industry',
    tags: ['studio ghibli', 'new project', 'animation']
  },
  {
    id: '5',
    title: 'Jujutsu Kaisen Season 3 Production Announced',
    excerpt: 'Following the success of the Shibuya Incident arc, MAPPA has officially confirmed production of Jujutsu Kaisen Season 3.',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1171/109222l.jpg',
    imageUrls: [
      'https://cdn.myanimelist.net/images/anime/1171/109222l.jpg',
      'https://cdn.myanimelist.net/images/anime/1722/127394.jpg',
      'https://images.animenewsnetwork.com/thumbnails/max300x600/cms/news/174/9812.jpg'
    ],
    author: 'Elena Volkov',
    source: 'MAPPA Studios',
    sourceUrl: 'https://jujutsukaisen.jp/news/20240111_announcement/',
    publishedAt: new Date('2024-01-11'),
    category: 'anime',
    tags: ['jujutsu kaisen', 'season 3', 'mappa']
  },
  {
    id: '6',
    title: 'Chainsaw Man Part 2 Manga Reaches 1 Million Sales',
    excerpt: 'Tatsuki Fujimoto\'s continuation of the Chainsaw Man story has achieved remarkable commercial success in just its first month of release.',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1506/110415l.jpg',
    imageUrls: [
      'https://cdn.myanimelist.net/images/anime/1506/110415l.jpg',
      'https://cdn.myanimelist.net/images/anime/1806/126216l.jpg',
      'https://cdn.myanimelist.net/images/manga/3/275651l.jpg'
    ],
    author: 'James Wilson',
    source: 'Weekly Shonen Jump',
    sourceUrl: 'https://www.shonenjump.com/j/rensai/chainsaw.html',
    publishedAt: new Date('2024-01-10'),
    category: 'manga',
    tags: ['chainsaw man', 'part 2', 'sales']
  },
  {
    id: '7',
    title: 'Spy x Family Code: White Movie Review',
    excerpt: 'The first theatrical release of Spy x Family delivers heartwarming family moments with spectacular animation quality that exceeds expectations.',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1441/122795l.jpg',
    imageUrls: [
      'https://cdn.myanimelist.net/images/anime/1441/122795l.jpg',
      'https://cdn.myanimelist.net/images/anime/1630/124786.jpg',
      'https://media.kitsu.io/anime/poster_images/1375/medium.jpg'
    ],
    author: 'Lisa Park',
    source: 'Anime Review Central',
    sourceUrl: 'https://www.animenewsnetwork.com/review/spy-x-family-code-white/.208123',
    publishedAt: new Date('2024-01-09'),
    category: 'reviews',
    tags: ['spy x family', 'movie', 'review'],
    score: 8.7
  },
  {
    id: '8',
    title: 'My Hero Academia Final Arc Begins',
    excerpt: 'Kohei Horikoshi has announced that the manga is entering its final story arc, bringing the journey of Deku and Class 1-A to its climactic conclusion.',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/10/78745l.jpg',
    imageUrls: [
      'https://cdn.myanimelist.net/images/anime/10/78745l.jpg',
      'https://cdn.myanimelist.net/images/anime/1000/110531.jpg',
      'https://cdn.myanimelist.net/images/manga/1/269867.jpg'
    ],
    author: 'Michael Chang',
    source: 'Shonen Jump+',
    sourceUrl: 'https://shonenjumpplus.com/episode/3269754496401369355',
    publishedAt: new Date('2024-01-08'),
    category: 'manga',
    tags: ['my hero academia', 'final arc', 'deku']
  },
  {
    id: '9',
    title: 'Review: Frieren - Journey Beyond the Hero\'s Tale',
    excerpt: 'An emotional masterpiece that redefines what it means to be an adventure anime.',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1015/138006l.jpg',
    imageUrls: [
      'https://cdn.myanimelist.net/images/anime/1015/138006l.jpg',
      'https://cdn.myanimelist.net/images/anime/1642/138065.jpg',
      'https://cdn.myanimelist.net/images/userimages/8753617.jpg'
    ],
    author: 'Alex Rivera',
    source: 'Jikan Reviews',
    sourceUrl: 'https://myanimelist.net/reviews.php?id=494837',
    publishedAt: new Date('2024-01-02'),
    category: 'reviews',
    tags: ['frieren', 'review', 'adventure'],
    score: 9.6
  },
  {
    id: '10',
    title: 'Bleach: Thousand Year Blood War Final Cour Announced',
    excerpt: 'The epic conclusion to Ichigo\'s journey gets a release date.',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1908/135431l.jpg',
    imageUrls: [
      'https://cdn.myanimelist.net/images/anime/1908/135431l.jpg',
      'https://cdn.myanimelist.net/images/anime/1765/135372.jpg',
      'https://kitsu-production-media.s3.amazonaws.com/anime/poster_images/13699/large.jpg'
    ],
    author: 'Studio Pierrot',
    source: 'Bleach Official',
    sourceUrl: 'https://bleach-anime.com/news/2024/01/01/final-cour-announcement/',
    publishedAt: new Date('2024-01-01'),
    category: 'anime',
    tags: ['bleach', 'final cour', 'announcement'],
    isHeadline: true
  },
  // Gaming news
  {
    id: '11',
    title: 'Dragon Ball FighterZ Gets Major Update',
    excerpt: 'Bandai Namco announces new characters and game modes for the popular fighting game.',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1223/96541l.jpg',
    imageUrls: [
      'https://cdn.myanimelist.net/images/anime/1223/96541l.jpg',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=200&fit=crop'
    ],
    author: 'Gaming Weekly',
    source: 'Bandai Namco',
    sourceUrl: 'https://www.bandainamcoent.com/news/dragon-ball-fighterz-update',
    publishedAt: new Date('2023-12-30'),
    category: 'gaming',
    tags: ['dragon ball', 'fighterz', 'update']
  },
  {
    id: '12',
    title: 'Anime Industry Shows Record Growth in 2024',
    excerpt: 'Latest industry reports show unprecedented expansion in anime production and global reach.',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=200&fit=crop',
    author: 'Industry Insider',
    source: 'Anime Business Journal',
    publishedAt: new Date('2023-12-29'),
    category: 'industry',
    tags: ['industry', 'growth', 'statistics']
  }
];

// Apply advanced deduplication with strict quota (max 2 uses per image)
export const mockNewsData: NewsArticle[] = dedupeImagesAdvanced(rawMockNewsData, 2);

// Export as default for compatibility
export default mockNewsData;