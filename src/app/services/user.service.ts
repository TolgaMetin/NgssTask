import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDto } from '../models/UserDto';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url = 'https://jsonplaceholder.typicode.com/users';
  headers = new HttpHeaders({
    'Content-Type': 'application/json; charset=UTF-8',
  });

  logger: LoggerService;
  http: HttpClient;

  constructor(logger: LoggerService, http: HttpClient) {
    this.logger = logger;
    this.http = http;
  }

  getUsers(): Observable<HttpResponse<UserDto[]>> {
    this.logger.log(`Requesting GET at '${this.url}'...`);

    return this.http.get<UserDto[]>(`${this.url}`, {
      observe: 'response',
    });
  }
}
