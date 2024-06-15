import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/views/users/users.interface';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss'],
})
export class EditDialogComponent implements OnInit {
  userForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: User,
    private dialogRef: MatDialogRef<EditDialogComponent>,
    private formBuilder: FormBuilder
  ) {
    this.userForm = this.formBuilder.group({
      name: [this.data.name, [Validators.required, Validators.minLength(2)]],
      surname: [
        this.data.surname,
        [Validators.required, Validators.minLength(2)],
      ],
      phone: [
        this.data.phone,
        [Validators.pattern('^((\\+7-?)|0)?[0-9]{10}$')],
      ],
      email: [this.data.email, [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    console.log(this.data);
  }

  onConfirm() {
    if (this.userForm.valid) {
      // Получение текущих данных из localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      // Обновление данных пользователя в массиве
      const updatedUsers = users.map((user: User) => {
        if (user.id === this.data.id) {
          return {
            ...user,
            name: this.userForm.value.name,
            surname: this.userForm.value.surname,
            phone: this.userForm.value.phone,
            email: this.userForm.value.email,
          };
        } else {
          return user;
        }
      });

      // Сохранение обновленных данных в localStorage
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Закрытие диалогового окна
      this.dialogRef.close(true);
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
