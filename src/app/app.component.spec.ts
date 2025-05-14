import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TaskService } from './services/task.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: any;
  let taskService: jasmine.SpyObj<TaskService>;

  const mockTasks = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      dueDate: '2025-05-15',
      isCompleted: false,
      createdAt: '2025-05-13',
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Description 2',
      dueDate: '2025-05-16',
      isCompleted: true,
      createdAt: '2025-05-13',
    },
    {
      id: '3',
      title: 'Task 3',
      description: 'Description 3',
      dueDate: undefined,
      isCompleted: false,
      createdAt: '2025-05-13',
    },
  ];

  beforeEach(async () => {
    const taskServiceSpy = jasmine.createSpyObj('TaskService', [
      'tasks$',
      'fetchTasks',
      'deleteTask',
      'updateTask',
    ]);
    taskServiceSpy.tasks$ = of(mockTasks);

    await TestBed.configureTestingModule({
      imports: [AppComponent, HttpClientTestingModule], // Add AppComponent to imports
      providers: [{ provide: TaskService, useValue: taskServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize tasks and apply default filter', () => {
    expect(component.tasksList).toEqual(mockTasks);
    expect(component.filteredTasks).toEqual(mockTasks);
  });

  it('should sort tasks by due date, placing tasks with no due date at the bottom', () => {
    const sortedTasks = component.sortTasksByDueDate(mockTasks);
    expect(sortedTasks[0].title).toBe('Task 1');
    expect(sortedTasks[1].title).toBe('Task 2');
    expect(sortedTasks[2].title).toBe('Task 3');
  });

  it('should open and close the popup', () => {
    component.openPopup();
    expect(component.showPopup).toBeTrue();

    component.closePopup();
    expect(component.showPopup).toBeFalse();
  });

  it('should select a task', () => {
    const task = mockTasks[0];
    component.selectTask(task);
    expect(component.selectedTask).toBe(task);
  });

  it('should open and close the delete confirmation popup', () => {
    component.openDeletePopup();
    expect(component.showDeletePopup).toBeTrue();

    component.closeDeletePopup();
    expect(component.showDeletePopup).toBeFalse();
  });

  it('should delete a task and refresh the task list', () => {
    const task = mockTasks[0];
    component.selectedTask = task;
    taskService.deleteTask.and.returnValue(of(null)); // Mock the deleteTask response

    component.deleteTask();

    // Ensure the argument passed to deleteTask is a string
    expect(taskService.deleteTask).toHaveBeenCalledWith(task.id);
    expect(taskService.deleteTask).toHaveBeenCalledTimes(1);
    expect(component.selectedTask).toBeNull();
  });

  it('should filter tasks by completed status', () => {
    component.filter = 'completed';
    component.applyFilter();
    expect(component.filteredTasks).toEqual([mockTasks[1]]);
  });

  it('should filter tasks by incomplete status', () => {
    component.filter = 'incomplete';
    component.applyFilter();
    expect(component.filteredTasks).toEqual([mockTasks[0], mockTasks[2]]);
  });

  it('should filter tasks by overdue status', () => {
    spyOn(component, 'isPastDue').and.callFake(
      (dueDate) => dueDate === '2025-05-15'
    );
    component.filter = 'overdue';
    component.applyFilter();
    expect(component.filteredTasks).toEqual([mockTasks[0]]);
  });

  it('should detect if a task is past due', () => {
    const pastDueDate = '2025-05-12';
    const futureDueDate = '2025-05-20';
    expect(component.isPastDue(pastDueDate)).toBeTrue();
    expect(component.isPastDue(futureDueDate)).toBeFalse();
    expect(component.isPastDue(undefined)).toBeFalse();
  });

  it('should handle filter change and reapply the filter', () => {
    spyOn(component, 'applyFilterAndSort');
    const event = { target: { value: 'completed' } } as any;
    component.onFilterChange(event);
    expect(component.applyFilterAndSort).toHaveBeenCalled();
  });
});
