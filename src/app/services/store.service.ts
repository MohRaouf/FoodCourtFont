import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../config';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private client: HttpClient) { }

  create(store: any) {
    return this.client.post(`${config.apiUrl}/stores/`, store, { observe: 'response' });
  }
  readOne(id: any) {
    return this.client.get(`${config.apiUrl}/stores/${id}`, { observe: 'response' });
  }
  readAll(page?: number, limit?: number, filter: string="") {
    return this.client.get(`${config.apiUrl}/stores?page=${page + 1}&limit=${limit}&filter=${filter}`, { observe: 'response' });
  }
  update(id: any, updates: any) {
    return this.client.patch(`${config.apiUrl}/stores/${id}`, updates, { observe: 'response' });
  }
  delete(id: any) {
    return this.client.delete(`${config.apiUrl}/stores/${id}`, { observe: 'response' });
  }
}
