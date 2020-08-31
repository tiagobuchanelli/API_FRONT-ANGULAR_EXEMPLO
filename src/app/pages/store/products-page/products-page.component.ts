import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
})
export class ProductsPageComponent implements OnInit {
  public products$: Observable<Product[]>; //quando retorno é assincrono usar $ no nome variavel


  constructor(private data: DataService) { }

  ngOnInit(): void {
    this.products$ = this.data.getProducts()
  }

}
