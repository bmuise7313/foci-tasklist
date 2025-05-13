import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-add-task-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="popup">
      <h2>{{ task?.id ? 'Edit Task' : 'Add Task' }}</h2>
      <form (ngSubmit)="saveTask()">
        <label>
          Title:
          <input type="text" [(ngModel)]="taskData.title" name="title" required />
        </label>
        <label>
          Description:
          <input type="text" [(ngModel)]="taskData.description" name="description" />
        </label>
        <label>
          Due Date:
          <input type="date" [(ngModel)]="taskData.dueDate" name="dueDate" />
        </label>
        <button type="submit">{{ task?.id ? 'Save Changes' : 'Add Task' }}</button>
        <button type="button" (click)="closePopup()">Cancel</button>
      </form>
    </div>
  `,
  styleUrls: ['./add-task-popup.component.css'],
})
export class AddTaskPopupComponent implements OnChanges {
  @Input() task: any = null; // Input for the task to edit
  @Output() close = new EventEmitter<void>();
  taskData = { title: '', description: '', dueDate: '' };

  constructor(private taskService: TaskService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && this.task) {
      // Pre-fill the form with the task data when editing
      this.taskData = { ...this.task };
    }
  }

  saveTask(): void {
    if (this.task?.id) {
      // Update the task if it already exists
      this.taskService.updateTask(this.task.id, this.taskData).subscribe(() => {
        this.close.emit(); // Notify parent to close the popup
      });
    } else {
      // Add a new task if no task is selected
      this.taskService.addTask(this.taskData).subscribe(() => {
        this.close.emit(); // Notify parent to close the popup
      });
    }
  }

  closePopup(): void {
    this.close.emit(); // Notify parent to close the popup
  }
}