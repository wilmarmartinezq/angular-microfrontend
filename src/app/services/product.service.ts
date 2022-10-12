import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(environment.PRODUCT_MICROSERVICE_URL + 'api/Product');
  }

  createProduct(product: Product): Observable<Product> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<Product>(environment.PRODUCT_MICROSERVICE_URL + 'api/Product', product, httpOptions);
  }

  updateProduct(product: Product): Observable<Product> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put<Product>(environment.PRODUCT_MICROSERVICE_URL + 'api/Product/' + product.id, product, httpOptions);
  }

  deleteProduct(id: number): Observable<Product> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE'
      })
    };
    return this.http.delete<Product>(environment.PRODUCT_MICROSERVICE_URL + 'api/Product/' + id, httpOptions);
  }

}

export class Product {
  id?: number;
  productNumber?: string;
  productGenre?: string;
  name?: string;
  description?: string;
  specification?: string;
  price?: number;
  stock?: number;
  vendors?: Vendor[];
  image?: string;
  rating?: number;
}

export class Vendor {
  id: number;
  name: string;
}