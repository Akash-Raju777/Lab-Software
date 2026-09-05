import { 
  ApiResponse, 
  InventorySummary, 
  Reagent, 
  ReagentFormData, 
  AlertItem, 
  User, 
  UserProfile, 
  UpdateProfileData, 
  ChangePasswordData, 
  LabSettingsData 
} from '@/types';

function getBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    return '';
  }

  return envUrl ? envUrl.replace(/\/+$/, '') : 'http://localhost:8080';
}


class ApiService {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('labtrack_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    const contentType = res.headers.get('content-type');
    let data: any;

    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      data = { message: text || res.statusText };
    }

    if (!res.ok) {
      const errorMessage = data?.message || data?.error || `Request failed with status ${res.status}`;
      throw new Error(errorMessage);
    }

    // Spring Boot returns ApiResponse wrapper { success, message, data }
    return data.data !== undefined ? data.data : data;
  }

  // Auth Endpoints
  async login(email: string, password: string): Promise<User> {
    const res = await fetch(`${getBaseUrl()}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return this.handleResponse<User>(res);
  }

  // Reagents Endpoints
  async getReagents(params?: {
    search?: string;
    status?: string;
    sortBy?: string;
    sortDir?: string;
  }): Promise<Reagent[]> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.status && params.status !== 'ALL') query.append('status', params.status);
    if (params?.sortBy) query.append('sortBy', params.sortBy);
    if (params?.sortDir) query.append('sortDir', params.sortDir);

    const qs = query.toString();
    const url = `${getBaseUrl()}/api/reagents${qs ? `?${qs}` : ''}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
      cache: 'no-store',
    });
    return this.handleResponse<Reagent[]>(res);
  }

  async getReagentById(id: number): Promise<Reagent> {
    const res = await fetch(`${getBaseUrl()}/api/reagents/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<Reagent>(res);
  }

  async createReagent(data: ReagentFormData): Promise<Reagent> {
    const payload = {
      name: data.name.trim(),
      quantity: Number(data.quantity),
      unit: data.unit.trim(),
      expiryDate: data.expiryDate,
    };

    const res = await fetch(`${getBaseUrl()}/api/reagents`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });
    return this.handleResponse<Reagent>(res);
  }

  async deleteReagent(id: number): Promise<void> {
    const res = await fetch(`${getBaseUrl()}/api/reagents/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse<void>(res);
  }

  async getInventorySummary(): Promise<InventorySummary> {
    const res = await fetch(`${getBaseUrl()}/api/reagents/summary`, {
      method: 'GET',
      headers: this.getHeaders(),
      cache: 'no-store',
    });
    return this.handleResponse<InventorySummary>(res);
  }

  async getAlerts(): Promise<AlertItem[]> {
    const res = await fetch(`${getBaseUrl()}/api/reagents/alerts`, {
      method: 'GET',
      headers: this.getHeaders(),
      cache: 'no-store',
    });
    return this.handleResponse<AlertItem[]>(res);
  }

  // Settings & Profile Endpoints
  async getProfile(identifier?: string): Promise<UserProfile> {
    const qs = identifier ? `?identifier=${encodeURIComponent(identifier)}` : '';
    const res = await fetch(`${getBaseUrl()}/api/settings/profile${qs}`, {
      method: 'GET',
      headers: this.getHeaders(),
      cache: 'no-store',
    });
    return this.handleResponse<UserProfile>(res);
  }

  async updateProfile(data: UpdateProfileData, identifier?: string): Promise<UserProfile> {
    const qs = identifier ? `?identifier=${encodeURIComponent(identifier)}` : '';
    const res = await fetch(`${getBaseUrl()}/api/settings/profile${qs}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<UserProfile>(res);
  }

  async changePassword(data: ChangePasswordData, identifier?: string): Promise<void> {
    const qs = identifier ? `?identifier=${encodeURIComponent(identifier)}` : '';
    const res = await fetch(`${getBaseUrl()}/api/settings/password${qs}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<void>(res);
  }

  async getPreferences(identifier?: string): Promise<UserProfile> {
    const qs = identifier ? `?identifier=${encodeURIComponent(identifier)}` : '';
    const res = await fetch(`${getBaseUrl()}/api/settings/preferences${qs}`, {
      method: 'GET',
      headers: this.getHeaders(),
      cache: 'no-store',
    });
    return this.handleResponse<UserProfile>(res);
  }

  async updatePreferences(data: LabSettingsData, identifier?: string): Promise<UserProfile> {
    const qs = identifier ? `?identifier=${encodeURIComponent(identifier)}` : '';
    const res = await fetch(`${getBaseUrl()}/api/settings/preferences${qs}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<UserProfile>(res);
  }
}

export const api = new ApiService();

