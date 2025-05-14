import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<any[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) {} // Inject HttpClient
  // Fetch tasks from the API
  fetchTasks(): void {
    this.http.get<any[]>('http://localhost:3000/tasks').subscribe({
      next: (data) => {
        console.log('API response:', data); // Verify this log
        this.tasksSubject.next(data || []);
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
      },
    });
  }
  // Add a new task
  addTask(task: {
    title: string;
    description?: string;
    dueDate?: string;
  }): Observable<any> {
    return this.http.post('http://localhost:3000/tasks', task);
  }
  // Update an existing task
  updateTask(
    id: string,
    task: { title: string; description?: string; dueDate?: string }
  ): Observable<any> {
    return this.http.put(`http://localhost:3000/tasks/${id}`, task);
  }
  // Delete a task
  deleteTask(id: string): Observable<any> {
    return this.http.delete(`http://localhost:3000/tasks/${id}`);
  }
}
