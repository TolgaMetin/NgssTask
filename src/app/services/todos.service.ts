import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TodoDto } from '../models/Todo';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  url = 'https://jsonplaceholder.typicode.com/todos/';
  headers = new HttpHeaders(
    {'Content-Type': 'application/json; charset=UTF-8'}
  );

  logger: LoggerService;
  http: HttpClient;

  constructor(logger: LoggerService, http: HttpClient) {
    this.logger = logger;
    this.http = http;
  }

  getTodos(): Observable<HttpResponse<TodoDto[]>> {
    this.logger.log(`Requesting GET at '${this.url}'...`);

    return this.http.get<TodoDto[]>(`${this.url}`, {
      observe: 'response'
    });
  }


  EditTodo(todo: TodoDto): Observable<HttpResponse<object>> {
    this.logger.log(`Requesting PUT at '${this.url}/${todo.id}'...`);

    return this.http.put(`${this.url}/${todo.id}`, JSON.stringify(todo), {
      headers: this.headers,
      observe: 'response'
    });
  }

  deleteTodo(todo: TodoDto): Observable<HttpResponse<object>> {
    this.logger.log(`Requesting DELETE at '${this.url}/${todo.id}'...`);

    return this.http.delete(`${this.url}/${todo.id}`, {
      headers: this.headers,
      observe: 'response'
    });
  }
}
