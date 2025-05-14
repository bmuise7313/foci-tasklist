import { TestBed } from '@angular/core/testing';
import { AddTaskPopupComponent } from './add-task-popup.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TaskService } from '../services/task.service';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('AddTaskPopupComponent', () => {
  let component: AddTaskPopupComponent;
  let fixture: any;
  let taskService: jasmine.SpyObj<TaskService>;

  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    dueDate: '2025-05-15',
  };

  beforeEach(async () => {
    const taskServiceSpy = jasmine.createSpyObj('TaskService', [
      'addTask',
      'updateTask',
    ]);

    await TestBed.configureTestingModule({
      imports: [AddTaskPopupComponent, HttpClientTestingModule, FormsModule], // Include necessary modules
      providers: [{ provide: TaskService, useValue: taskServiceSpy }], // Provide the mocked TaskService
    }).compileComponents();

    fixture = TestBed.createComponent(AddTaskPopupComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize taskData when task input changes', () => {
    component.task = mockTask;
    component.ngOnChanges({
      task: {
        currentValue: mockTask,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true,
      },
    });
    expect(component.taskData).toEqual(mockTask);
  });

  it('should call addTask when saving a new task', () => {
    const newTask = {
      title: 'New Task',
      description: 'New Description',
      dueDate: '2025-05-20',
    };
    component.task = null; // No existing task
    component.taskData = newTask;

    taskService.addTask.and.returnValue(of(null)); // Mock the addTask response

    component.saveTask();

    expect(taskService.addTask).toHaveBeenCalledWith(newTask);
    expect(taskService.addTask).toHaveBeenCalledTimes(1);
  });

  it('should call updateTask when saving an existing task', () => {
    component.task = mockTask; // Existing task
    component.taskData = { ...mockTask, title: 'Updated Task' };

    taskService.updateTask.and.returnValue(of(null)); // Mock the updateTask response

    component.saveTask();

    expect(taskService.updateTask).toHaveBeenCalledWith(mockTask.id, {
      ...mockTask,
      title: 'Updated Task',
    });
    expect(taskService.updateTask).toHaveBeenCalledTimes(1);
  });

  it('should emit close event when closing the popup', () => {
    spyOn(component.close, 'emit');

    component.closePopup();

    expect(component.close.emit).toHaveBeenCalled();
    expect(component.close.emit).toHaveBeenCalledTimes(1);
  });
});
