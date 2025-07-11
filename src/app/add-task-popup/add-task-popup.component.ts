import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-add-task-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-task-popup.component.html', // Use an external HTML file
  styleUrls: ['./add-task-popup.component.css'], // Use an external CSS file
})
export class AddTaskPopupComponent implements OnChanges {
  @Input() task: any = null; // Input for the task to edit
  @Output() close = new EventEmitter<void>();
  taskData = { title: '', description: '', dueDate: '' };
  dueDateError = false;

  constructor(private taskService: TaskService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && this.task) {
      // Pre-fill the form with the task data when editing
      this.taskData = { ...this.task };
    }
  }

  // Validate the due date format
  validateDueDate(): void {
    if (!this.taskData.dueDate) {
      this.dueDateError = false;
      return;
    }
    const date = new Date(this.taskData.dueDate);
    this.dueDateError = isNaN(date.getTime());
  }
  // Save the task (add or update)
  saveTask(): void {
    this.validateDueDate();
    if (this.dueDateError) return;

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
  // Cancel the operation
  closePopup(): void {
    this.close.emit(); // Notify parent to close the popup
  }
}
