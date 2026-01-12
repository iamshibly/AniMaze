import axios from 'axios';

const ANILIST_ENDPOINT = 'https://graphql.anilist.co';

export interface AnimeData {
  id: number;
  title: {
    romaji: string;
    english?: string;
    native: string;
  };
  coverImage: {
    large: string;
    medium: string;
  };
  genres: string[];
  averageScore?: number;
  episodes?: number;
  duration?: number;
  status: string;
  description?: string;
  startDate?: {
    year: number;
  };
  format?: string;
}

export interface MangaData {
  id: number;
  title: {
    romaji: string;
    english?: string;
    native: string;
  };
  coverImage: {
    large: string;
    medium: string;
  };
  genres: string[];
  averageScore?: number;
  chapters?: number;
  status: string;
  description?: string;
  startDate?: {
    year: number;
  };
  popularity?: number;
}

const ANIME_QUERY = `
  query ($page: Int, $perPage: Int, $search: String, $sort: [MediaSort]) {
    Page(page: $page, perPage: $perPage) {
      media(search: $search, type: ANIME, sort: $sort) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          medium
        }
        genres
        averageScore
        episodes
        duration
        status
        description
        startDate {
          year
        }
        format
      }
    }
  }
`;

const MANGA_QUERY = `
  query ($page: Int, $perPage: Int, $search: String, $sort: [MediaSort]) {
    Page(page: $page, perPage: $perPage) {
      media(search: $search, type: MANGA, sort: $sort) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          medium
        }
        genres
        averageScore
        chapters
        status
        description
        startDate {
          year
        }
        popularity
      }
    }
  }
`;

export async function searchAnime(searchTerm?: string, page = 1, perPage = 10) {
  try {
    const variables = {
      search: searchTerm,
      page,
      perPage,
      sort: searchTerm ? ['SEARCH_MATCH'] : ['TRENDING_DESC', 'POPULARITY_DESC']
    };

    const response = await axios.post(
      ANILIST_ENDPOINT,
      { query: ANIME_QUERY, variables },
      { headers: { 'Content-Type': 'application/json' } }
    );

    return response.data.data.Page.media as AnimeData[];
  } catch (error) {
    console.error('Error fetching anime data:', error);
    return [];
  }
}

export async function searchManga(searchTerm?: string, page = 1, perPage = 10) {
  try {
    const variables = {
      search: searchTerm,
      page,
      perPage,
      sort: searchTerm ? ['SEARCH_MATCH'] : ['TRENDING_DESC', 'POPULARITY_DESC']
    };

    const response = await axios.post(
      ANILIST_ENDPOINT,
      { query: MANGA_QUERY, variables },
      { headers: { 'Content-Type': 'application/json' } }
    );

    return response.data.data.Page.media as MangaData[];
  } catch (error) {
    console.error('Error fetching manga data:', error);
    return [];
  }
}

export async function getTrendingAnime(perPage = 8) {
  return searchAnime(undefined, 1, perPage);
}

export async function getTrendingManga(perPage = 8) {
  return searchManga(undefined, 1, perPage);
}
