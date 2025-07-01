import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Task, TaskServiceService } from '../services/task-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent implements OnDestroy {

  taskForm!: FormGroup;
  minDate = new Date();
  isLoading: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(private fb: FormBuilder, private taskService: TaskServiceService, public dialogRef: MatDialogRef<AddTaskComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.taskForm = this.fb.group({
      taskName: ['', [Validators.required, Validators.maxLength(20)]],
      taskDescription: ['',[Validators.required, Validators.maxLength(60)]],
      dueDate: ['', Validators.required],
      isWork: [true]
    });
  }

  addTask() {
    this.isLoading = true;
    const formData = this.taskForm.value;
    const task: Task = {
      name: formData.taskName,
      description: formData.taskDescription,
      dueDate: formData.dueDate,
      isWork: formData.isWork,
      isPersonal: formData.isWork ? false : true,
      completed: false
    };
    this.subscriptions.add(this.taskService.addTask(task).subscribe({
      next: (res) => {
        if (res) {
          this.taskForm.reset();
          this.dialogRef.close(true);
        }
      },
      error: (err) => {
        console.error(err);
      }, complete: () => {
        this.isLoading = false;
      }
    })
    )
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
