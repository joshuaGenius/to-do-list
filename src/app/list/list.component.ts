import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { AddTaskComponent } from '../add-task/add-task.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { TaskServiceService } from '../services/task-service.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatTooltipModule, MatSnackBarModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnDestroy {

  isLoading = true;
  tasks: any;
  sortOrder: 'asc' | 'desc' = 'asc';
  sortIcon: string = 'arrow_upward';
  selectedCategory!: string;
  selectedTaskId: string | null = null;
  currentDate: Date = new Date();
  private subscriptions: Subscription = new Subscription();

  constructor(private dialog: MatDialog, private taskService: TaskServiceService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.subscriptions.add(this.taskService.getTasksRealtime().subscribe({
      next: (res) => {
        this.tasks = res;
        this.isLoading = false;
        const overdueTasks = this.tasks.some((task: any) => this.isOverdue(task));
         if (overdueTasks) {
        this.snackBar.open('⚠️ Reminder Some tasks are overdue!', 'Dismiss', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-error']
        });
         }
      }, error: (err) => {
        console.error(err)
        this.snackBar.open('Failed to fetch tasks.', 'Dismiss', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    }))
  }

  addTask() {
    const DialogRef = this.dialog.open(AddTaskComponent, {
      width: '400px'
    });
    this.subscriptions.add(DialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.snackBar.open('Task added successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success']
          })
        }
      }, error: () => {
        this.snackBar.open('Failed to add task.', 'Dismiss', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    }))
  }

  deleteTask(task: any) {
    const Dialog = this.dialog.open(ConfirmationComponent, {
      width: '400px',
      data: {
        task,
        type: "delete"
      }
    })
    this.subscriptions.add(Dialog.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.snackBar.open('Task deleted Successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success']
          })
        }
      }, error: () => {
        this.snackBar.open('Failed to delete task.', 'Dismiss', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    }))
  }

  changeDue(task: any) {
    const DialogRef = this.dialog.open(ConfirmationComponent, {
      width: '400px',
      data: {
        task,
        type: "date"
      }
    });
    this.subscriptions.add(DialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.snackBar.open(' Due date updated successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success']
          })
        }
      }, error: (err) => {
        this.snackBar.open('Failed to Update due date.', 'Dismiss', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    }))
  }

  isOverdue(task: any): boolean {
    const dueDate = task.dueDate?.toDate ? task.dueDate.toDate() : task.dueDate;
    return !!dueDate && dueDate < this.currentDate;
  }

  toggleDateSort() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortIcon = this.sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward';
    this.taskService.fetchTasksWithDate(this.sortOrder).subscribe((res) => {
      this.tasks = res;
    })
  }

  filterCategory(category?: any) {
    this.selectedCategory = this.selectedCategory === category ? null : category;
    this.taskService.fetchTasksCategory(this.selectedCategory).subscribe((res) => {
      this.tasks = res;
    })
  }

  onTaskClick(taskId: string) {
    this.selectedTaskId = this.selectedTaskId === taskId ? null : taskId;
  }

  markAsCompleted(task: any) {
    this.taskService.taskUpdation(task.id, { completed: !task.currentStatus })
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }
}
