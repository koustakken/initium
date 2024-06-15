import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { User } from './users.interface';
import { DataService } from 'src/app/services/data.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';

import { AddDialogComponent } from '../../components/add-dialog/add-dialog.component';
import { EditDialogComponent } from '../../components/edit-dialog/edit-dialog.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = [
    'select',
    'name',
    'surname',
    'phone',
    'email',
  ];
  public dataSource: MatTableDataSource<User>;
  public selection = new SelectionModel<User>(true, []);
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor(private dataService: DataService, private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<User>();
  }

  ngOnInit(): void {
    this.dataService.getUsers().subscribe((users: User[]) => {
      console.log(users);
      this.dataSource.data = users;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: User): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.id
    }`;
  }

  // ADD USER

  addUser() {
    const dialogRef = this.dialog.open(AddDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        this.dataSource.data = users;
      }
    });
  }

  // EDIT USER

  editUser(user: User) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: user,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        this.dataSource.data = users;
      }
    });
  }

  // DELETE USER

  deleteUser() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        dialogTitle: 'Удаление строк',
        message: `Удалить выбранные строки(${this.selection.selected.length})?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        // Получение выбранных пользователей
        const selectedUsers = this.selection.selected;

        // Удаление выбранных пользователей из источника данных
        this.dataSource.data = this.dataSource.data.filter(
          (user) => !selectedUsers.includes(user)
        );

        // Сохранение обновленных данных в localStorage
        localStorage.setItem('users', JSON.stringify(this.dataSource.data));

        // Очистка выбранных пользователей
        this.selection.clear();
      }
    });
  }
}
