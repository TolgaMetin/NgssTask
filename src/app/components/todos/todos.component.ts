import { Component, OnInit, ViewChild } from '@angular/core';
import { TodoDto } from 'src/app/models/Todo';
import { LoggerService } from 'src/app/services/logger.service';
import { TodosService } from 'src/app/services/todos.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UserDto } from 'src/app/models/UserDto';
import { UserService } from 'src/app/services/user.service';
import { combineLatest, Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
})
export class TodosComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'assignee', 'status', 'actions'];
  dataSource: MatTableDataSource<TodoDto>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  todos$: Observable<HttpResponse<TodoDto[]>> = this.todosService.getTodos();
  users$: Observable<HttpResponse<UserDto[]>> = this.userService.getUsers();

  constructor(
    private logger: LoggerService,
    private todosService: TodosService,
    private userService: UserService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    combineLatest([this.todos$, this.users$]).subscribe(([todos, users]) => {
      console.log(
        `Todos: ${todos},
           Users: ${users},
           `
      );
      todos.body.forEach((todo) => {
        todo.userName = users.body.find((user) => user.id === todo.userId).name;
      });
      this.dataSource = new MatTableDataSource(todos.body);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.logger.log('Request successful !');
    });
  }

  deleteTodo(todo: TodoDto): void {
    Swal.fire({
      title: 'Emin misiniz?',
      text: 'Bu İslemin geri donusu yoktur!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, Devam Et.',
      cancelButtonText: 'Hayır, Düşüneyim',
    }).then((result) => {
      if (result.value) {
        this.todosService.deleteTodo(todo).subscribe((response) => {
          if (response.ok) {
            const index = this.dataSource.data.indexOf(todo);
            this.dataSource.data.splice(index, 1);
            this.dataSource._updateChangeSubscription();
            this.logger.log('Silme İslemi Basarili !');
            Swal.fire('Kaldırıldı!', 'Basarıyla kaldirildi', 'success');
          } else {
            this.logger.log(`Request failed: ${response.status}.`);
            Swal.fire('İptal Edildi', 'Veritabanında degisiklik yapilmadi', 'error');
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('İptal Edildi', 'Veritabanında degisiklik yapilmadi', 'error');
      }
    });
  }

  editTodo(todo: TodoDto): void {
    Swal.fire({
      title: 'Tamamlanma Durumu?',
      input: 'checkbox',
      inputPlaceholder: 'Tamamlandi',
      inputValue: !todo.completed,
    }).then(function (result) {
      // const index = this.dataSource.data.indexOf(todo);
      if (result.value) {
        todo.completed = false;
        this.todosService.editTodo(todo).subscribe((response) => {
          // this.dataSource.data[index] = todo;
          this.getData();
          Swal.fire({ icon: 'success', text: 'Done olarak güncellendi!' });
        });
      } else if (result.value === 0) {
        todo.completed = true;
        this.todosService.editTodo(todo).subscribe((response) => {
          // this.dataSource.data[index] = todo;
          this.getData();
          Swal.fire({
            icon: 'success',
            text: 'In Progress olarak güncellendi!',
          });
        });
      } else {
        Swal.fire({ icon: 'error', text: 'Progress devam ediyor' });
      }
    });
  }

  logOut(){
    this.authenticationService.logout();
  }
}
