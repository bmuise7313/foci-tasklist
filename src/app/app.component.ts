import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TaskService } from './services/task.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AddTaskPopupComponent } from './add-task-popup/add-task-popup.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, AddTaskPopupComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'foci-tasklist';
  tasksList: { title: string; description?: string; dueDate?: string; isCompleted: boolean; createdAt: string }[] = [];
  filteredTasks: { title: string; description?: string; dueDate?: string; isCompleted: boolean; createdAt: string }[] = [];
  filter = 'all'; // Default filter
  showPopup = false;
  showDeletePopup = false; // Track delete confirmation popup visibility
  selectedTask: any = null; // Track the selected task
  message: string | null = null; // Message to display to the user

  constructor(private taskService: TaskService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.taskService.tasks$.subscribe((tasks) => {
      this.tasksList = this.sortTasksByDueDate(tasks);
      this.applyFilter();
    });
    this.taskService.fetchTasks();
  }

  sortTasksByDueDate(tasks: any[]): any[] {
  return tasks.sort((a, b) => {
    if (!a.dueDate) return 1; // Place tasks with no due date at the bottom
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(); // Sort by due date
  });
}

  openPopup(): void {
    this.selectedTask = null; // Clear the selected task to ensure it's an "Add Task" popup
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
    this.taskService.fetchTasks(); // Refresh the task list after adding or editing a task
  }

  selectTask(task: any): void {
    this.selectedTask = task; // Set the selected task
  }

  openEditPopup(): void {
    if (this.selectedTask) {
      this.showPopup = true; // Open the popup for editing
    }
  }

  openDeletePopup(): void {
    this.showDeletePopup = true; // Open the delete confirmation popup
  }

  closeDeletePopup(): void {
    this.showDeletePopup = false; // Close the delete confirmation popup
  }

  deleteTask(): void {
    if (this.selectedTask) {
      const taskTitle = this.selectedTask.title;
      this.taskService.deleteTask(this.selectedTask.id).subscribe(() => {
        this.message = `Task "${taskTitle}" has been deleted successfully.`;
        this.clearMessageAfterDelay();
        this.taskService.fetchTasks(); // Refresh the task list
        this.selectedTask = null; // Clear the selected task
        this.showDeletePopup = false; // Close the delete confirmation popup
      });
    }
  }

  toggleCompletion(): void {
    if (this.selectedTask) {
      const updatedTask = {
        ...this.selectedTask,
        isCompleted: !this.selectedTask.isCompleted, // Toggle the completion status
      };
      this.taskService.updateTask(this.selectedTask.id, updatedTask).subscribe(() => {
        this.taskService.fetchTasks(); // Refresh the task list
        this.selectedTask = null; // Clear the selected task
      });
    }
  }

  applyFilter(): void {
    if (this.filter === 'completed') {
      this.filteredTasks = this.tasksList.filter((task) => task.isCompleted);
    } else if (this.filter === 'incomplete') {
      this.filteredTasks = this.tasksList.filter((task) => !task.isCompleted);
    } else if (this.filter === 'overdue') {
      this.filteredTasks = this.tasksList.filter(
        (task) => !task.isCompleted && this.isPastDue(task.dueDate)
      );
    } else {
      this.filteredTasks = [...this.tasksList]; // Show all tasks
    }
  }

  isPastDue(dueDate: string | undefined): boolean {
  if (!dueDate) {
    return false; // If no due date is provided, it's not past due
  }
  const today = new Date();
  const dueDateObj = new Date(dueDate);
  return dueDateObj < today; // Check if the due date is in the past
}

  onFilterChange(event: Event): void {
    const filter = (event.target as HTMLSelectElement).value; // Cast to HTMLSelectElement
    this.filter = filter; // Update the filter
    this.applyFilter(); // Reapply the filter
  }

  // Example: Add a task
  addTask(task: any): void {
    this.taskService.addTask(task).subscribe(() => {
      this.message = `Task "${task.title}" has been added successfully.`;
      this.clearMessageAfterDelay();
      this.taskService.fetchTasks(); // Refresh the task list
    });
  }

  // Example: Edit a task
  editTask(task: any): void {
    this.taskService.updateTask(task.id, task).subscribe(() => {
      this.message = `Task "${task.title}" has been updated successfully.`;
      this.clearMessageAfterDelay();
      this.taskService.fetchTasks(); // Refresh the task list
    });
  }

  // Clear the message after a delay
  private clearMessageAfterDelay(): void {
    setTimeout(() => {
      this.message = null;
      this.cdr.detectChanges(); // Trigger change detection
    }, 5000); // Clear the message after 3 seconds
  }
}