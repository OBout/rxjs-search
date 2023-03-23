import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

interface User {
  id: number;
  name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  searchInput = new FormControl();
  filteredUsers$: Observable<User[]>;
  private users: User[] = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Carol' },
    { id: 4, name: 'David' },
    { id: 5, name: 'Eve' },
    { id: 6, name: 'Frank' }
  ];

  constructor() {
    this.filteredUsers$ = this.searchInput.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchText: string) => this.searchUsers(searchText))
    );
  }

  private searchUsers(searchText: string): Observable<User[]> {
    if (!searchText || searchText.trim().length === 0) {
      return of(this.users);
    }

    const lowerCaseSearchText = searchText.toLowerCase();
    return of(
      this.users.filter(user =>
        user.name.toLowerCase().includes(lowerCaseSearchText)
      )
    );
  }
}