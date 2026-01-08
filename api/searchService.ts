import { SearchFilters, SearchResult, ApiResponse, Service } from './mockServer/types';
import { mockDatabase } from './mockServer/database';
import { withDelay } from './mockServer/delay';

export interface QuickSearchResult {
  id: string;
  type: 'salon' | 'service' | 'staff';
  title: string;
  subtitle: string;
  image?: string;
  rating?: number;
  price?: number;
}

export interface FilterOptions {
  categories: { id: string; name: string; count: number }[];
  priceRanges: { min: number; max: number; label: string }[];
  ratings: { value: number; label: string }[];
  sortOptions: { value: string; label: string }[];
}

class SearchService {
  /**
   * Quick search - lightweight search for autocomplete
   */
  async quickSearch(query: string, limit: number = 5): Promise<ApiResponse<QuickSearchResult[]>> {
    return withDelay(() => {
      if (!query || query.length < 2) {
        return {
          success: true,
          data: [],
        };
      }

      const results: QuickSearchResult[] = [];
      const queryLower = query.toLowerCase();

      // Search services
      mockDatabase.services
        .filter((s) => s.isActive && s.name.toLowerCase().includes(queryLower))
        .slice(0, limit)
        .forEach((s) => {
          results.push({
            id: s.id,
            type: 'service',
            title: s.name,
            subtitle: s.description,
            image: s.image,
            price: s.discountPrice || s.price,
          });
        });

      // Search staff
      mockDatabase.staff
        .filter((s) => s.isActive && s.name.toLowerCase().includes(queryLower))
        .slice(0, limit)
        .forEach((s) => {
          results.push({
            id: s.id,
            type: 'staff',
            title: s.name,
            subtitle: s.role,
            image: s.avatar,
            rating: s.rating,
          });
        });

      // Search salons
      mockDatabase.salons
        .filter((s) => s.name.toLowerCase().includes(queryLower))
        .slice(0, limit)
        .forEach((s) => {
          results.push({
            id: s.id,
            type: 'salon',
            title: s.name,
            subtitle: s.address,
            image: s.images[0],
            rating: s.rating,
          });
        });

      return {
        success: true,
        data: results.slice(0, limit),
      };
    }, 50, 150);
  }

  /**
   * Full search with filters
   */
  async search(
    query: string,
    filters?: SearchFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<SearchResult[]>> {
    return withDelay(() => {
      let results: SearchResult[] = [];
      const queryLower = query?.toLowerCase() || '';

      // Search services
      mockDatabase.services
        .filter((s) => {
          if (!s.isActive) return false;
          if (queryLower && !s.name.toLowerCase().includes(queryLower) &&
              !s.description.toLowerCase().includes(queryLower)) return false;

          // Apply filters
          if (filters?.serviceCategories?.length && !filters.serviceCategories.includes(s.categoryId)) return false;
          if (filters?.priceMin && s.price < filters.priceMin) return false;
          if (filters?.priceMax && s.price > filters.priceMax) return false;

          return true;
        })
        .forEach((s) => {
          results.push({
            type: 'service',
            id: s.id,
            name: s.name,
            description: s.description,
            image: s.image,
            price: s.discountPrice || s.price,
            matchScore: this.calculateMatchScore(s.name, queryLower),
          });
        });

      // Search staff
      if (!filters?.serviceCategories?.length) {
        mockDatabase.staff
          .filter((s) => {
            if (!s.isActive) return false;
            if (queryLower && !s.name.toLowerCase().includes(queryLower) &&
                !s.role.toLowerCase().includes(queryLower) &&
                !s.specialties.some(spec => spec.toLowerCase().includes(queryLower))) return false;
            if (filters?.minRating && s.rating < filters.minRating) return false;
            return true;
          })
          .forEach((s) => {
            results.push({
              type: 'staff',
              id: s.id,
              name: s.name,
              description: s.role,
              image: s.avatar,
              rating: s.rating,
              matchScore: this.calculateMatchScore(s.name, queryLower),
            });
          });
      }

      // Sort results
      if (filters?.sortBy) {
        switch (filters.sortBy) {
          case 'rating':
            results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
          case 'price_low':
            results.sort((a, b) => (a.price || 0) - (b.price || 0));
            break;
          case 'price_high':
            results.sort((a, b) => (b.price || 0) - (a.price || 0));
            break;
          default:
            results.sort((a, b) => b.matchScore - a.matchScore);
        }
      } else {
        results.sort((a, b) => b.matchScore - a.matchScore);
      }

      // Pagination
      const startIndex = (page - 1) * limit;
      const paginatedResults = results.slice(startIndex, startIndex + limit);

      return {
        success: true,
        data: paginatedResults,
        meta: {
          total: results.length,
          page,
          limit,
          hasMore: startIndex + limit < results.length,
        },
      };
    });
  }

  /**
   * Get filter options
   */
  async getFilterOptions(): Promise<ApiResponse<FilterOptions>> {
    return withDelay(() => {
      const categories = mockDatabase.serviceCategories.map((c) => {
        const count = mockDatabase.services.filter((s) => s.categoryId === c.id && s.isActive).length;
        return {
          id: c.id,
          name: c.name,
          count,
        };
      });

      return {
        success: true,
        data: {
          categories,
          priceRanges: [
            { min: 0, max: 200000, label: 'Under 200K' },
            { min: 200000, max: 500000, label: '200K - 500K' },
            { min: 500000, max: 1000000, label: '500K - 1M' },
            { min: 1000000, max: Infinity, label: 'Above 1M' },
          ],
          ratings: [
            { value: 4.5, label: '4.5+' },
            { value: 4, label: '4+' },
            { value: 3.5, label: '3.5+' },
            { value: 3, label: '3+' },
          ],
          sortOptions: [
            { value: 'relevance', label: 'Most Relevant' },
            { value: 'rating', label: 'Highest Rated' },
            { value: 'price_low', label: 'Lowest Price' },
            { value: 'price_high', label: 'Highest Price' },
          ],
        },
      };
    }, 50, 100);
  }

  /**
   * Get popular searches
   */
  async getPopularSearches(): Promise<ApiResponse<string[]>> {
    return withDelay(() => {
      return {
        success: true,
        data: [
          'Haircut',
          'Hair Color',
          'Manicure',
          'Massage',
          'Facial',
          'Nail Art',
          'Beard Trim',
          'Deep Tissue',
        ],
      };
    }, 50, 100);
  }

  /**
   * Get recent searches (would be stored locally in real app)
   */
  async getRecentSearches(userId: string): Promise<ApiResponse<string[]>> {
    return withDelay(() => {
      // In real app, this would come from local storage or user preferences
      return {
        success: true,
        data: ['Hair styling', 'Gel manicure', 'Emily Chen'],
      };
    }, 50, 100);
  }

  /**
   * Get search suggestions based on partial query
   */
  async getSuggestions(query: string): Promise<ApiResponse<string[]>> {
    return withDelay(() => {
      if (!query || query.length < 2) {
        return {
          success: true,
          data: [],
        };
      }

      const suggestions: Set<string> = new Set();
      const queryLower = query.toLowerCase();

      // Service names
      mockDatabase.services
        .filter((s) => s.isActive && s.name.toLowerCase().includes(queryLower))
        .forEach((s) => suggestions.add(s.name));

      // Staff names
      mockDatabase.staff
        .filter((s) => s.isActive && s.name.toLowerCase().includes(queryLower))
        .forEach((s) => suggestions.add(s.name));

      // Category names
      mockDatabase.serviceCategories
        .filter((c) => c.name.toLowerCase().includes(queryLower))
        .forEach((c) => suggestions.add(c.name));

      return {
        success: true,
        data: Array.from(suggestions).slice(0, 8),
      };
    }, 30, 80);
  }

  /**
   * Search services by category
   */
  async searchByCategory(categoryId: string): Promise<ApiResponse<Service[]>> {
    return withDelay(() => {
      const services = mockDatabase.services.filter(
        (s) => s.categoryId === categoryId && s.isActive
      );

      return {
        success: true,
        data: services,
      };
    });
  }

  // Helper to calculate match score
  private calculateMatchScore(text: string, query: string): number {
    if (!query) return 0.5;

    const textLower = text.toLowerCase();

    // Exact match
    if (textLower === query) return 1;

    // Starts with query
    if (textLower.startsWith(query)) return 0.9;

    // Contains query
    if (textLower.includes(query)) return 0.7;

    // Word match
    const words = textLower.split(' ');
    if (words.some(w => w.startsWith(query))) return 0.6;

    return 0.3;
  }
}

export const searchService = new SearchService();
