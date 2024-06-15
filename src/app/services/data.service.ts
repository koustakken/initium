import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, of } from 'rxjs';

import { User } from '../views/users/users.interface';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}
  apiUrl = 'https://test-data.directorix.cloud/task1';
  storedUsers = localStorage.getItem('users');

  getUsers() {
    if (this.storedUsers?.length) {
      return of(JSON.parse(this.storedUsers));
    }

    return this.http.get<{ users: User[] }>(this.apiUrl).pipe(
      map((res) => {
        const users = res.users.map((user, index) => ({
          ...user,
          id: index + 1,
        }));
        localStorage.setItem('users', JSON.stringify(users));
        return users;
      })
    );
  }
}
