import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.scss'],
})
export class AddDialogComponent {
  userForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AddDialogComponent>,
    private formBuilder: FormBuilder
  ) {
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.pattern('^((\\+7-?)|0)?[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onConfirm() {
    // Получение текущих данных из localStorage
    if (this.userForm.valid) {
      const newUser = {
        name: this.userForm.value.name,
        surname: this.userForm.value.surname,
        phone: this.userForm.value.phone,
        email: this.userForm.value.email,
      };

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      this.userForm.reset();

      this.dialogRef.close(true);
    }
  }

  onCancel() {
    this.userForm.reset();
    this.dialogRef.close(false);
  }
}
