import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DummyPostsResponse, DummyUsersResponse,
  PaginationParams, SearchParams, DummyPost, DummyUser
} from '../models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl;

  getPosts(params: Partial<PaginationParams> = {}): Observable<DummyPostsResponse> {
    let p = new HttpParams()
      .set('limit', params.limit ?? 10)
      .set('skip', params.skip ?? 0);
    if (params.sortBy) p = p.set('sortBy', params.sortBy);
    if (params.order)  p = p.set('order', params.order);
    return this.http.get<DummyPostsResponse>(`${this.base}/posts`, { params: p })
      .pipe(catchError(this.handleError));
  }

  searchPosts(params: SearchParams): Observable<DummyPostsResponse> {
    const p = new HttpParams()
      .set('q', params.q)
      .set('limit', params.limit ?? 10)
      .set('skip', params.skip ?? 0);
    return this.http.get<DummyPostsResponse>(`${this.base}/posts/search`, { params: p })
      .pipe(catchError(this.handleError));
  }

  getPostById(id: number): Observable<DummyPost> {
    return this.http.get<DummyPost>(`${this.base}/posts/${id}`)
      .pipe(catchError(this.handleError));
  }

  getUsers(params: Partial<PaginationParams> = {}): Observable<DummyUsersResponse> {
    const p = new HttpParams()
      .set('limit', params.limit ?? 10)
      .set('skip', params.skip ?? 0);
    return this.http.get<DummyUsersResponse>(`${this.base}/users`, { params: p })
      .pipe(catchError(this.handleError));
  }

  getUserById(id: number): Observable<DummyUser> {
    return this.http.get<DummyUser>(`${this.base}/users/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: unknown): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => error);
  }
}
