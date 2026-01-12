// src/lib/avatars.ts - Updated with consistent avatar paths
// REPLACE your entire avatars.ts file with this version

export interface Avatar {
  id: number;
  name: string;
  image: string;
  category: 'action' | 'fantasy' | 'slice-of-life' | 'mecha' | 'shounen';
}

// Avatar configuration - handle mixed file extensions
const AVATAR_CONFIG = {
  basePath: '/avatars/',
  fallbackImage: '/avatars/default.jpg',
  
  // Map avatar IDs to their actual file extensions
  // Update this based on your actual files in public/avatars/
  extensionMap: {
    1: 'jpg',   // avatar-1.jpg
    2: 'jpeg',  // avatar-2.jpeg
    3: 'jpg',   // avatar-3.jpg
    4: 'jpeg',  // avatar-4.jpeg
    5: 'jpg',   // avatar-5.jpg
    6: 'jpeg',  // avatar-6.jpeg
    7: 'jpg',   // avatar-7.jpg
    8: 'jpeg',  // avatar-8.jpeg
    9: 'jpg',   // avatar-9.jpg
    10: 'jpeg', // avatar-10.jpeg
    11: 'jpg',  // avatar-11.jpg
    12: 'jpeg', // avatar-12.jpeg
    13: 'jpg',  // avatar-13.jpg
    14: 'jpeg', // avatar-14.jpeg
    15: 'jpg',  // avatar-15.jpg
    16: 'jpeg', // avatar-16.jpeg
    17: 'jpg',  // avatar-17.jpg
    18: 'jpeg', // avatar-18.jpeg
    19: 'jpg',  // avatar-19.jpg
    20: 'jpeg', // avatar-20.jpeg
    21: 'jpg',  // avatar-21.jpg
    22: 'jpeg', // avatar-22.jpeg
    23: 'jpg',  // avatar-23.jpg
    24: 'jpeg', // avatar-24.jpeg
    25: 'jpg',  // avatar-25.jpg
    26: 'jpeg', // avatar-26.jpeg
    27: 'jpg',  // avatar-27.jpg
    28: 'jpeg', // avatar-28.jpeg
    29: 'jpg',  // avatar-29.jpg
    30: 'jpeg'  // avatar-30.jpeg
  }
};

// Helper function that tries multiple extensions
export const getAvatarImagePath = (avatarId: number): string => {
  const extension = AVATAR_CONFIG.extensionMap[avatarId] || 'jpg';
  return `${AVATAR_CONFIG.basePath}avatar-${avatarId}.${extension}`;
};

// All 30 avatar names as configured
const avatarNames = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  'ab', 'ac', 'ad', 'ae'
];

const getAvatarName = (name: string): string => {
  const nameMap: { [key: string]: string } = {
    'a': 'Heroic Warrior', 'ab': 'Alpha Beta', 'ac': 'Ace Commander', 
    'ad': 'Admiral', 'ae': 'Aegis Shield', 'b': 'Battle Master', 
    'c': 'Shadow Fighter', 'd': 'Swift Blade', 'e': 'Storm Caller', 
    'f': 'Fire Guardian', 'g': 'Wind Dancer', 'h': 'Earth Shaker', 
    'i': 'Ice Queen', 'j': 'Lightning Strike', 'k': 'Dark Knight', 
    'l': 'Light Bearer', 'm': 'Magic User', 'n': 'Night Rider', 
    'o': 'Ocean Master', 'p': 'Phoenix Wing', 'q': 'Quantum Leap', 
    'r': 'Royal Guard', 's': 'Sky Walker', 't': 'Thunder God', 
    'u': 'Void Hunter', 'v': 'Victory Star', 'w': 'Water Spirit', 
    'x': 'X-Factor', 'y': 'Young Hero', 'z': 'Zen Master'
  };
  
  return nameMap[name] || `Avatar ${name.toUpperCase()}`;
};

// Generate all 30 avatars with consistent paths
export const avatars: Avatar[] = avatarNames.map((name, index) => {
  const categories: Avatar['category'][] = ['action', 'fantasy', 'slice-of-life', 'mecha', 'shounen'];
  const category = categories[index % categories.length];
  
  return {
    id: index + 1, // IDs from 1-30
    name: getAvatarName(name),
    image: getAvatarImagePath(index + 1), // Use consistent path format
    category
  };
});

// Updated getAvatarById function
export const getAvatarById = (id: number): string => {
  if (id > 0 && id <= avatars.length) {
    return getAvatarImagePath(id);
  }
  return AVATAR_CONFIG.fallbackImage;
};

export const getAvatarsByCategory = (category: Avatar['category']): Avatar[] => {
  return avatars.filter(avatar => avatar.category === category);
};

export const AVATAR_OPTIONS: number[] = avatars.map(avatar => avatar.id);

export const CATEGORIZED_AVATARS = {
  action: getAvatarsByCategory('action'),
  fantasy: getAvatarsByCategory('fantasy'),
  'slice-of-life': getAvatarsByCategory('slice-of-life'),
  mecha: getAvatarsByCategory('mecha'),
  shounen: getAvatarsByCategory('shounen')
};

// Utility functions
export const getRandomAvatar = (): Avatar => {
  const randomIndex = Math.floor(Math.random() * avatars.length);
  return avatars[randomIndex];
};

export const getRandomAvatarByCategory = (category: Avatar['category']): Avatar => {
  const categoryAvatars = getAvatarsByCategory(category);
  const randomIndex = Math.floor(Math.random() * categoryAvatars.length);
  return categoryAvatars[randomIndex];
};

export const searchAvatars = (query: string): Avatar[] => {
  const lowercaseQuery = query.toLowerCase();
  return avatars.filter(avatar => 
    avatar.name.toLowerCase().includes(lowercaseQuery) ||
    avatar.category.toLowerCase().includes(lowercaseQuery)
  );
};

export const isValidAvatarId = (id: number): boolean => {
  return id > 0 && id <= avatars.length;
};

export const getAvatarNameById = (id: number): string => {
  const avatar = avatars.find(avatar => avatar.id === id);
  return avatar ? avatar.name : 'Unknown Avatar';
};

// Export default
export default avatars;