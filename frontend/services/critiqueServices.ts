// src/services/critiqueServices.ts - Pure localStorage version
// =====================================
// LOCALSTORAGE SERVICE FUNCTIONS FOR CRITIQUE
// =====================================

import { AuthService } from '@/lib/auth';
import type { 
  UserProfile, 
  Submission, 
  SubmissionFormData, 
  Notification, 
  DashboardData,
  SubmissionFilters,
  PaginatedResponse,
  UserRole
} from '@/types/critique';

// Storage keys for localStorage
const PROFILES_KEY = 'anime_quiz_profiles';
const SUBMISSIONS_KEY = 'anime_quiz_submissions';
const NOTIFICATIONS_KEY = 'anime_quiz_notifications';

// Helper functions for localStorage operations
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// =====================================
// USER PROFILE SERVICES
// =====================================

export const profileService = {
  // Get current user's profile
  async getCurrentProfile(): Promise<UserProfile | null> {
    const user = AuthService.getCurrentUser();
    if (!user) return null;

    const profiles = getFromStorage<UserProfile[]>(PROFILES_KEY, []);
    const profile = profiles.find(p => p.id === user.id);
    
    if (!profile) {
      // Create a default profile if none exists
      const defaultProfile: UserProfile = {
        id: user.id,
        role: (user.role as UserRole) || 'user',
        bio: '',
        favorite_genres: [],
        notification_preferences: { email: true, in_app: true },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      profiles.push(defaultProfile);
      saveToStorage(PROFILES_KEY, profiles);
      return defaultProfile;
    }

    return profile;
  },

  // Create user profile (called after signup)
  async createProfile(userId: string, role: UserRole = 'user'): Promise<UserProfile> {
    const profiles = getFromStorage<UserProfile[]>(PROFILES_KEY, []);
    
    // Check if profile already exists
    const existingProfile = profiles.find(p => p.id === userId);
    if (existingProfile) {
      return existingProfile;
    }

    const newProfile: UserProfile = {
      id: userId,
      role,
      bio: '',
      favorite_genres: [],
      notification_preferences: { email: true, in_app: true },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    profiles.push(newProfile);
    saveToStorage(PROFILES_KEY, profiles);
    
    console.log('✅ Profile created:', userId);
    return newProfile;
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const profiles = getFromStorage<UserProfile[]>(PROFILES_KEY, []);
    const profileIndex = profiles.findIndex(p => p.id === userId);
    
    if (profileIndex === -1) {
      throw new Error('Profile not found');
    }

    const updatedProfile = {
      ...profiles[profileIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };

    profiles[profileIndex] = updatedProfile;
    saveToStorage(PROFILES_KEY, profiles);
    
    console.log('✅ Profile updated:', userId);
    return updatedProfile;
  }
};

// =====================================
// SUBMISSION SERVICES
// =====================================

export const submissionService = {
  // Create new submission
  async createSubmission(formData: SubmissionFormData): Promise<Submission> {
    const user = AuthService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const submissions = getFromStorage<Submission[]>(SUBMISSIONS_KEY, []);
    
    // Convert cover image to base64 for localStorage (in real app, upload to cloud)
    let coverImageUrl = '';
    if (formData.cover_image) {
      // In a real app, you'd upload this to cloud storage
      // For localStorage demo, we'll create a placeholder URL
      coverImageUrl = `data:image/placeholder;base64,${btoa(formData.cover_image.name)}`;
    }

    const newSubmission: Submission = {
      id: generateId(),
      critic_id: user.id,
      type: formData.type as any,
      title: formData.title,
      content: formData.content,
      anime_manga_id: formData.anime_manga_id || undefined,
      youtube_link: formData.youtube_link || undefined,
      star_rating: formData.star_rating || undefined,
      cover_image: coverImageUrl || undefined,
      status: 'pending',
      admin_notes: undefined,
      views: 0,
      likes: 0,
      comments: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      approved_at: undefined,
      critic: {
        name: user.name,
        avatar_url: user.avatar_url
      }
    };

    submissions.push(newSubmission);
    saveToStorage(SUBMISSIONS_KEY, submissions);
    
    console.log('✅ Submission created:', newSubmission.id);
    return newSubmission;
  },

  // Get user's submissions
  async getUserSubmissions(filters: SubmissionFilters = {}): Promise<PaginatedResponse<Submission>> {
    const user = AuthService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const submissions = getFromStorage<Submission[]>(SUBMISSIONS_KEY, []);
    let userSubmissions = submissions.filter(s => s.critic_id === user.id);

    // Apply filters
    if (filters.type && filters.type !== 'all') {
      userSubmissions = userSubmissions.filter(s => s.type === filters.type);
    }

    if (filters.status && filters.status !== 'all') {
      userSubmissions = userSubmissions.filter(s => s.status === filters.status);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      userSubmissions = userSubmissions.filter(s => 
        s.title.toLowerCase().includes(searchLower) ||
        s.content.toLowerCase().includes(searchLower)
      );
    }

    // Sort by created_at descending
    userSubmissions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const total = userSubmissions.length;
    const startIndex = (page - 1) * limit;
    const paginatedSubmissions = userSubmissions.slice(startIndex, startIndex + limit);

    return {
      data: paginatedSubmissions,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit)
    };
  },

  // Get all submissions (for admin)
  async getAllSubmissions(filters: SubmissionFilters = {}): Promise<PaginatedResponse<Submission>> {
    const user = AuthService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      throw new Error('Admin access required');
    }

    const submissions = getFromStorage<Submission[]>(SUBMISSIONS_KEY, []);
    let filteredSubmissions = [...submissions];

    // Apply filters
    if (filters.type && filters.type !== 'all') {
      filteredSubmissions = filteredSubmissions.filter(s => s.type === filters.type);
    }

    if (filters.status && filters.status !== 'all') {
      filteredSubmissions = filteredSubmissions.filter(s => s.status === filters.status);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredSubmissions = filteredSubmissions.filter(s => 
        s.title.toLowerCase().includes(searchLower) ||
        s.content.toLowerCase().includes(searchLower) ||
        s.critic?.name.toLowerCase().includes(searchLower)
      );
    }

    // Sort by created_at descending
    filteredSubmissions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const total = filteredSubmissions.length;
    const startIndex = (page - 1) * limit;
    const paginatedSubmissions = filteredSubmissions.slice(startIndex, startIndex + limit);

    return {
      data: paginatedSubmissions,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit)
    };
  },

  // MODIFICATION for src/services/critiqueServices.ts
// Find the getApprovedSubmissions function and replace it with this:

// Get approved submissions (for public view)
async getApprovedSubmissions(filters: SubmissionFilters = {}): Promise<PaginatedResponse<Submission>> {
  const submissions = getFromStorage<Submission[]>(SUBMISSIONS_KEY, []);
  let approvedSubmissions = submissions.filter(s => s.status === 'approved');

  // ADDED: Demo data if no real approved submissions exist
  if (approvedSubmissions.length === 0) {
    approvedSubmissions = [
      {
        id: 'public-demo-1',
        critic_id: 'critic-user-1',
        type: 'anime_review',
        title: 'Attack on Titan Final Season: A Masterpiece of Storytelling',
        content: 'After four incredible seasons, Attack on Titan has concluded with what might be the most emotionally complex and narratively ambitious finale in anime history. The series masterfully explores themes of freedom, war, and the cyclical nature of hatred while maintaining its signature blend of intense action and philosophical depth. The animation quality reaches unprecedented heights during the final battle sequences, with each frame meticulously crafted to convey both the epic scale and intimate character moments. What sets this finale apart is its refusal to provide easy answers or clear-cut heroes and villains. Instead, it challenges viewers to grapple with the moral complexity of its characters\' choices. The voice acting, particularly in the Japanese version, delivers powerfully emotional performances that will leave viewers both satisfied and haunted long after the credits roll. This conclusion proves that Attack on Titan stands as one of the greatest anime series of our generation.',
        anime_manga_id: 'attack-on-titan-final',
        star_rating: 5,
        cover_image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
        status: 'approved',
        views: 2847,
        likes: 156,
        comments: 43,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        approved_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        critic: {
          name: 'Akira Tanaka',
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
        }
      },
      {
        id: 'public-demo-2',
        critic_id: 'critic-user-2',
        type: 'manga_review',
        title: 'Chainsaw Man: Redefining Shonen Manga Conventions',
        content: 'Tatsuki Fujimoto\'s Chainsaw Man is a revolutionary work that completely subverts traditional shonen manga expectations. The series presents a world where devils born from human fears terrorize society, but the real horror comes from the psychological depth of its characters. Denji, our chainsaw-wielding protagonist, isn\'t your typical hero seeking glory or friendship - he\'s a young man driven by basic human desires for food, shelter, and affection. Fujimoto\'s artwork is consistently stunning, with panel composition that creates genuine tension and emotional impact. The way he handles violence is both visceral and meaningful, never gratuitous but always serving the story\'s themes about power, exploitation, and the cost of survival. What makes Chainsaw Man special is how it balances dark humor with existential horror, creating moments that are simultaneously hilarious and deeply unsettling. This manga stands as a testament to how the medium can tackle mature themes while remaining accessible and entertaining.',
        anime_manga_id: 'chainsaw-man',
        star_rating: 5,
        cover_image: 'https://images.unsplash.com/photo-1609813360936-5e9f2b65e4b7?w=400&h=600&fit=crop',
        status: 'approved',
        views: 1923,
        likes: 134,
        comments: 28,
        created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        approved_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        critic: {
          name: 'Sakura Yamamoto',
          avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b332e234?w=100&h=100&fit=crop&crop=face'
        }
      },
      {
        id: 'public-demo-3',
        critic_id: 'critic-user-3',
        type: 'episode_review',
        title: 'Demon Slayer S3E8: Animation Excellence Meets Emotional Storytelling',
        content: 'This episode represents everything that makes Demon Slayer exceptional. The battle choreography reaches cinematic quality with fluid animation that makes every sword strike feel impactful and meaningful. Ufotable has once again proven why they are the gold standard for action anime production. But what elevates this episode beyond mere visual spectacle is its emotional core - the themes of family bonds and sacrifice that resonate deeply throughout the series. The voice performances convey genuine emotion that elevates the material beyond typical action sequences, particularly in the quieter moments between battles. The integration of traditional Japanese aesthetics with modern animation techniques creates a visual language that feels both timeless and contemporary. The soundtrack perfectly complements each scene, knowing when to swell dramatically and when to pull back for intimate character moments. This episode demonstrates that great anime isn\'t just about flashy fights - it\'s about making every moment count emotionally.',
        anime_manga_id: 'demon-slayer-s3',
        star_rating: 5,
        cover_image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
        status: 'approved',
        views: 1456,
        likes: 89,
        comments: 22,
        created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        approved_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        critic: {
          name: 'Hiroshi Nakamura',
          avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
        }
      },
      {
        id: 'public-demo-4',
        critic_id: 'critic-user-4',
        type: 'vlog',
        title: 'My Anime Journey 2024: Hidden Gems and Personal Discoveries',
        content: 'In this personal reflection, I share my most meaningful anime discoveries of 2024 and why certain series resonated with me on a deeper level. From underrated series that deserve more attention to mainstream hits that exceeded all expectations, this vlog covers the emotional impact these stories have had on my perspective as both a viewer and a critic. I discuss how anime continues to evolve as a medium for complex storytelling, touching on everything from the rise of original anime films to the increasing global influence of Japanese animation. This year has been particularly special for discovering series that challenge conventional genre boundaries - shows that blend slice-of-life elements with supernatural thriller, or romantic comedies that tackle serious social issues. I also delve into the cultural significance of these works and how they reflect contemporary Japanese society while remaining universally relatable. Whether you\'re a longtime anime fan or someone just getting started, I hope this journey through my 2024 watchlist inspires you to explore new stories.',
        youtube_link: 'https://youtube.com/watch?v=demo456',
        cover_image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=600&fit=crop',
        status: 'approved',
        views: 3204,
        likes: 198,
        comments: 67,
        created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        approved_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        critic: {
          name: 'Emma Chen',
          avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
        }
      },
      {
        id: 'public-demo-5',
        critic_id: 'critic-user-5',
        type: 'anime_review',
        title: 'Jujutsu Kaisen Season 2: Shibuya Arc - Peak Anime Storytelling',
        content: 'The Shibuya Incident arc represents a turning point not just for Jujutsu Kaisen, but for modern shonen anime as a whole. MAPPA has delivered animation work that brings unprecedented intensity to every action sequence while maintaining emotional authenticity in the quieter character moments. This season explores the consequences of power and the weight of responsibility in ways that feel genuinely mature and earned. What sets this arc apart is its willingness to show real consequences - characters face permanent losses, make morally complex choices, and deal with trauma in realistic ways. The arc doesn\'t shy away from darkness, but it never feels gratuitously grim. Instead, it uses these challenging moments to develop its characters and explore deeper themes about sacrifice, duty, and the cost of protecting others. The voice acting performances capture the gravity of each situation perfectly, and Hiroami Tanaka\'s soundtrack elevates every scene to emotional heights. This season proves that Jujutsu Kaisen has evolved beyond its initial premise to become something truly special.',
        anime_manga_id: 'jujutsu-kaisen-s2',
        star_rating: 5,
        cover_image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
        status: 'approved',
        views: 2156,
        likes: 187,
        comments: 41,
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        approved_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        critic: {
          name: 'Kenji Watanabe',
          avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
        }
      },
      {
        id: 'public-demo-6',
        critic_id: 'critic-user-6',
        type: 'manga_review',
        title: 'My Hero Academia: Exploring Heroism in the Modern Age',
        content: 'Kohei Horikoshi\'s My Hero Academia has become a cultural phenomenon by asking fundamental questions about what it means to be a hero in the modern world. The series brilliantly uses its superhero setting to explore themes of social responsibility, personal growth, and the different forms that heroism can take. Deku\'s journey from powerless dreamer to developing hero serves as a compelling metaphor for overcoming personal limitations and finding strength in unexpected places. What makes this manga special is its ensemble cast - each character feels fully realized with their own motivations, struggles, and growth arcs. The world-building is meticulous, creating a society where superpowers are commonplace but the human elements remain central to every story. Horikoshi\'s art style perfectly balances dynamic action scenes with expressive character moments, making every page visually engaging. The series also tackles serious issues like discrimination, class inequality, and the pressure of living up to expectations, all while maintaining an optimistic outlook about humanity\'s potential for good.',
        anime_manga_id: 'my-hero-academia',
        star_rating: 4,
        cover_image: 'https://images.unsplash.com/photo-1609813360936-5e9f2b65e4b7?w=400&h=600&fit=crop',
        status: 'approved',
        views: 1687,
        likes: 112,
        comments: 35,
        created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
        approved_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
        critic: {
          name: 'Yuki Sato',
          avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
        }
      },
      {
        id: 'public-demo-7',
        critic_id: 'critic-user-7',
        type: 'episode_review',
        title: 'Spy x Family S2E4: Comedy and Heart in Perfect Balance',
        content: 'This episode showcases everything that makes Spy x Family such a delightful viewing experience. The comedy timing is absolutely perfect, with each joke landing naturally without feeling forced or over-the-top. But what truly elevates this series is how it balances humor with genuine emotional moments that remind us why this makeshift family works so well together. Anya\'s telepathic abilities continue to be used cleverly for both comedic and dramatic effect, while Loid and Yor\'s attempts to maintain their covers create wonderful moments of dramatic irony. The animation from Studio Wit and CloverWorks maintains the manga\'s distinctive character designs while adding subtle touches that enhance the storytelling - from Anya\'s expressive reactions to the elegant way they handle the action sequences. The episode also does an excellent job of world-building, showing us more of the Cold War-inspired setting without getting bogged down in exposition. It\'s rare to find a series that can make you laugh and tug at your heartstrings within the same episode, but Spy x Family makes it look effortless.',
        anime_manga_id: 'spy-x-family-s2',
        star_rating: 4,
        cover_image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
        status: 'approved',
        views: 1234,
        likes: 98,
        comments: 19,
        created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
        approved_at: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
        critic: {
          name: 'Mei Takahashi',
          avatar_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face'
        }
      },
      {
        id: 'public-demo-8',
        critic_id: 'critic-user-8',
        type: 'vlog',
        title: 'The Evolution of Studio Ghibli: From Nausicaa to The Boy and the Heron',
        content: 'Join me on a comprehensive journey through Studio Ghibli\'s incredible filmography, exploring how the studio has evolved while maintaining its core values of environmental consciousness, strong character development, and breathtaking visual storytelling. In this deep-dive analysis, I examine recurring themes across Miyazaki and Takahata\'s works, from the anti-war messages in Grave of the Fireflies to the environmental allegories in Princess Mononoke. We\'ll explore how Ghibli films have influenced not just anime, but cinema as a whole, inspiring filmmakers worldwide with their hand-drawn animation techniques and emotionally resonant storytelling. I also discuss the studio\'s recent works, including how The Wind Rises served as Miyazaki\'s meditation on creativity and destruction, and what The Boy and the Heron might represent as potentially his final film. Throughout this analysis, I\'ll share personal anecdotes about how these films have shaped my understanding of animation as an art form and why Ghibli\'s approach to storytelling remains relevant in our digital age.',
        youtube_link: 'https://youtube.com/watch?v=demo789',
        cover_image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=600&fit=crop',
        status: 'approved',
        views: 4521,
        likes: 267,
        comments: 89,
        created_at: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        approved_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        critic: {
          name: 'Alex Rodriguez',
          avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'
        }
      }
    ];
  }

  // Apply filters
  if (filters.type && filters.type !== 'all') {
    approvedSubmissions = approvedSubmissions.filter(s => s.type === filters.type);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    approvedSubmissions = approvedSubmissions.filter(s => 
      s.title.toLowerCase().includes(searchLower) ||
      s.content.toLowerCase().includes(searchLower) ||
      s.critic?.name.toLowerCase().includes(searchLower)
    );
  }

  // Sort by approved_at descending (most recently approved first)
  approvedSubmissions.sort((a, b) => {
    const aTime = a.approved_at ? new Date(a.approved_at).getTime() : 0;
    const bTime = b.approved_at ? new Date(b.approved_at).getTime() : 0;
    return bTime - aTime;
  });

  // Pagination
  const page = filters.page || 1;
  const limit = filters.limit || 12;
  const total = approvedSubmissions.length;
  const startIndex = (page - 1) * limit;
  const paginatedSubmissions = approvedSubmissions.slice(startIndex, startIndex + limit);

  return {
    data: paginatedSubmissions,
    total,
    page,
    limit,
    total_pages: Math.ceil(total / limit)
  };
},

  // Get single submission
  async getSubmission(id: string): Promise<Submission | null> {
    const submissions = getFromStorage<Submission[]>(SUBMISSIONS_KEY, []);
    const submission = submissions.find(s => s.id === id);
    
    if (!submission) return null;

    // Increment views
    submission.views += 1;
    saveToStorage(SUBMISSIONS_KEY, submissions);
    
    return submission;
  },

  // Increment views
  async incrementViews(id: string): Promise<void> {
    const submissions = getFromStorage<Submission[]>(SUBMISSIONS_KEY, []);
    const submission = submissions.find(s => s.id === id);
    
    if (submission) {
      submission.views += 1;
      saveToStorage(SUBMISSIONS_KEY, submissions);
    }
  },

  // Update submission (for admins)
  async updateSubmission(id: string, updates: Partial<Submission>): Promise<Submission> {
    const user = AuthService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      throw new Error('Admin access required');
    }

    const submissions = getFromStorage<Submission[]>(SUBMISSIONS_KEY, []);
    const submissionIndex = submissions.findIndex(s => s.id === id);
    
    if (submissionIndex === -1) {
      throw new Error('Submission not found');
    }

    const updatedSubmission = {
      ...submissions[submissionIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };

    submissions[submissionIndex] = updatedSubmission;
    saveToStorage(SUBMISSIONS_KEY, submissions);
    
    return updatedSubmission;
  },

  // Approve submission
  async approveSubmission(id: string, adminNotes?: string): Promise<void> {
    const user = AuthService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      throw new Error('Admin access required');
    }

    await this.updateSubmission(id, {
      status: 'approved',
      approved_at: new Date().toISOString(),
      admin_notes: adminNotes
    });

    // Create notification
    const submissions = getFromStorage<Submission[]>(SUBMISSIONS_KEY, []);
    const submission = submissions.find(s => s.id === id);
    
    if (submission) {
      await notificationService.createNotification({
        user_id: submission.critic_id,
        type: 'submission_approved',
        title: 'Submission Approved! 🎉',
        message: `Your submission "${submission.title}" has been approved and is now live!`,
        submission_id: id
      });
    }
  },

  // Reject submission
  async rejectSubmission(id: string, reason: string): Promise<void> {
    const user = AuthService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      throw new Error('Admin access required');
    }

    await this.updateSubmission(id, {
      status: 'rejected',
      admin_notes: reason
    });

    // Create notification
    const submissions = getFromStorage<Submission[]>(SUBMISSIONS_KEY, []);
    const submission = submissions.find(s => s.id === id);
    
    if (submission) {
      await notificationService.createNotification({
        user_id: submission.critic_id,
        type: 'submission_rejected',
        title: 'Submission Update',
        message: `Your submission "${submission.title}" needs some changes. Reason: ${reason}`,
        submission_id: id
      });
    }
  },

  // Delete submission (for users to delete their own submissions)
  async deleteSubmission(id: string): Promise<void> {
    const user = AuthService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const submissions = getFromStorage<Submission[]>(SUBMISSIONS_KEY, []);
    const submissionIndex = submissions.findIndex(s => s.id === id);
    
    if (submissionIndex === -1) {
      throw new Error('Submission not found');
    }

    const submission = submissions[submissionIndex];
    
    // Check if user owns the submission or is admin
    if (submission.critic_id !== user.id && user.role !== 'admin') {
      throw new Error('Unauthorized to delete this submission');
    }

    // Remove submission from storage
    submissions.splice(submissionIndex, 1);
    saveToStorage(SUBMISSIONS_KEY, submissions);
    
    console.log('✅ Submission deleted:', id);
  }
};

// =====================================
// NOTIFICATION SERVICES
// =====================================

export const notificationService = {
  // Create notification
  async createNotification(data: {
    user_id: string;
    type: 'submission_approved' | 'submission_rejected' | 'admin_message';
    title: string;
    message: string;
    submission_id?: string;
  }): Promise<void> {
    const notifications = getFromStorage<Notification[]>(NOTIFICATIONS_KEY, []);
    
    const newNotification: Notification = {
      id: generateId(),
      user_id: data.user_id,
      type: data.type,
      title: data.title,
      message: data.message,
      submission_id: data.submission_id,
      is_read: false,
      created_at: new Date().toISOString()
    };

    notifications.push(newNotification);
    saveToStorage(NOTIFICATIONS_KEY, notifications);
    
    console.log('✅ Notification created:', newNotification.id);
  },

  // Get user notifications
  async getUserNotifications(): Promise<Notification[]> {
    const user = AuthService.getCurrentUser();
    if (!user) return [];

    const notifications = getFromStorage<Notification[]>(NOTIFICATIONS_KEY, []);
    const userNotifications = notifications
      .filter(n => n.user_id === user.id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Add submission data if available
    const submissions = getFromStorage<Submission[]>(SUBMISSIONS_KEY, []);
    const enrichedNotifications = userNotifications.map(notification => {
      if (notification.submission_id) {
        const submission = submissions.find(s => s.id === notification.submission_id);
        if (submission) {
          notification.submission = {
            title: submission.title,
            type: submission.type
          };
        }
      }
      return notification;
    });

    return enrichedNotifications;
  },

  // Mark notification as read
  async markAsRead(id: string): Promise<void> {
    const notifications = getFromStorage<Notification[]>(NOTIFICATIONS_KEY, []);
    const notification = notifications.find(n => n.id === id);
    
    if (notification) {
      notification.is_read = true;
      saveToStorage(NOTIFICATIONS_KEY, notifications);
    }
  },

  // Mark all notifications as read
  async markAllAsRead(): Promise<void> {
    const user = AuthService.getCurrentUser();
    if (!user) return;

    const notifications = getFromStorage<Notification[]>(NOTIFICATIONS_KEY, []);
    const updated = notifications.map(n => 
      n.user_id === user.id ? { ...n, is_read: true } : n
    );
    
    saveToStorage(NOTIFICATIONS_KEY, updated);
  }
};

// =====================================
// DASHBOARD SERVICES
// =====================================

export const dashboardService = {
  // Get dashboard data for critics
  async getDashboardData(): Promise<DashboardData> {
    const user = AuthService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const submissions = getFromStorage<Submission[]>(SUBMISSIONS_KEY, []);
    const userSubmissions = submissions.filter(s => s.critic_id === user.id);

    // Calculate statistics
    const stats = {
      total_submissions: userSubmissions.length,
      approved: userSubmissions.filter(s => s.status === 'approved').length,
      rejected: userSubmissions.filter(s => s.status === 'rejected').length,
      pending: userSubmissions.filter(s => s.status === 'pending').length,
      total_views: userSubmissions.reduce((sum, s) => sum + s.views, 0),
      total_likes: userSubmissions.reduce((sum, s) => sum + s.likes, 0),
      total_comments: userSubmissions.reduce((sum, s) => sum + s.comments, 0)
    };

    // Get recent submissions (last 5)
    const recentSubmissions = userSubmissions
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    // Generate monthly data (mock data for demo)
    const monthlyData = [
      { month: 'Jan', submissions: 5, approved: 4 },
      { month: 'Feb', submissions: 8, approved: 6 },
      { month: 'Mar', submissions: 12, approved: 10 },
      { month: 'Apr', submissions: 15, approved: 12 },
      { month: 'May', submissions: 18, approved: 15 },
      { month: 'Jun', submissions: 22, approved: 20 }
    ];

    return {
      stats,
      recent_submissions: recentSubmissions,
      monthly_data: monthlyData
    };
  }
};