import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TaskServiceService } from '../services/task-service.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatProgressSpinnerModule],

  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss'
})
export class ConfirmationComponent {

  constructor(private fb: FormBuilder, private taskService: TaskServiceService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ConfirmationComponent>) { }

  isLoading = false;
  minDate = new Date();
  editForm: any;
  showDate: boolean = true;


  ngOnInit() {
    this.minDate = new Date(this.minDate.getFullYear(), this.minDate.getMonth(), this.minDate.getDate() + 1);
    this.showDate = this.data.type !== 'delete';
    this.editForm = this.fb.group({
      confirmation: ['', Validators.required, '', Validators.maxLength(15)],
      dueDate: ['', Validators.required]
    });
  }

  update() {
    this.isLoading = true;
    this.taskService.taskUpdation(this.data.task.id, { dueDate: this.editForm.value.dueDate }).then((res: any) => {
      if (res) {
        this.dialogRef.close(true);
      }
    }).catch((error: any) => {
      console.error(error)

    }).finally(() => {
      this.isLoading = false;
    });

  }

  delete() {
    this.isLoading = true;
    this.taskService.deleteTask(this.data.task.id)
      .then((res: any) => {
        if (res) {
          this.dialogRef.close(true);
        }
      })
      .catch((error: any) => {
        console.error(error);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

}
