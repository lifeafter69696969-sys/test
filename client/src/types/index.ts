export interface User {
  id: string;
  email: string;
  name: string;
  userType: 'investor' | 'franchisee';
  phone: string;
  company: string;
  profile: {
    bio: string;
    avatar: string;
    verified: boolean;
  };
  createdAt: string;
}

export interface Franchise {
  id: string;
  title: string;
  category: string;
  investment: {
    min: number;
    max: number;
  };
  description: string;
  features: string[];
  images: string[];
  rating: number;
  reviews: number;
  franchiseeId: string;
  location: string;
  establishedYear: number;
  totalUnits: number;
  createdAt: string;
  status: 'active' | 'inactive';
}

export interface Application {
  id: string;
  userId: string;
  franchiseId: string;
  message: string;
  experience?: string;
  investment: number;
  status: 'pending' | 'approved' | 'rejected';
  userInfo: {
    name: string;
    email: string;
    phone: string;
    company: string;
  };
  franchise?: {
    id: string;
    title: string;
    category: string;
    investment: {
      min: number;
      max: number;
    };
  };
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface FranchiseFilters {
  category?: string;
  minInvestment?: number;
  maxInvestment?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface FranchiseResponse {
  franchises: Franchise[];
  pagination: PaginationInfo;
}

export interface DashboardStats {
  // For investors
  totalApplications?: number;
  pendingApplications?: number;
  approvedApplications?: number;
  rejectedApplications?: number;
  
  // For franchisees
  totalListings?: number;
  activeListings?: number;
}