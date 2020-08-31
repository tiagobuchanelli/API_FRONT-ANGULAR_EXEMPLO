import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from '../models/product.model';
import { Security } from '../utils/security.util';

@Injectable({
    providedIn: 'root' //significa que o DataService vai estar disponivel para todos os modulos
})
export class DataService {

    public url = 'http://localhost:3000/v1';

    constructor(private http: HttpClient) { }

    //função que compõe o cabeçalho da requisição
    public composeHeaders() {
        const token = Security.getToken();
        const headers = new HttpHeaders().set('Authorization', `bearer ${token}`); //formato Bearer
        //const headers = new HttpHeaders().set('x-acess-token', token); Depende de como foi setado na API para compor o cabeçalho. Ex: curso 1972

        return headers;
    }

    getProducts() {
        return this.http.get<Product[]>(`${this.url}/products`);

    }

    authenticate(data) {
        return this.http.post(`${this.url}/accounts/authenticate`, data);

    }

    refreshToken() {
        return this.http.post(
            `${this.url}/accounts/refresh-token`,
            null,
            { headers: this.composeHeaders() }
        );

    }

    create(data) {
        return this.http.post(`${this.url}/accounts`, data); //https://prnt.sc/u8jmop
    }

    resetPassword(data) {
        return this.http.post(`${this.url}/accounts/reset-password`, data);

    }

    getProfile() {
        return this.http.get(`${this.url}/accounts`, { headers: this.composeHeaders() });
    }

    updateProfile(data) {
        return this.http.put(`${this.url}/accounts`, data, { headers: this.composeHeaders() });
    }
}