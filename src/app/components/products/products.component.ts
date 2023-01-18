import { Component, OnInit } from '@angular/core';
import { zip } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CreateProductDTO, Product, UpdateProductDTO } from '../../models/product.model';

import { StoreService } from '../../services/store.service';
import { ProductsService } from '../../services/products.service';
import  Swal  from 'sweetalert2';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  myShoppingCart: Product[] = [];
  total = 0;
  products: Product[] = [];
  showProductDetail = false;
  productChosen!: Product;
  limit = 10;
  offset = 0;
  statusDetail: 'loading' | 'success' | 'error' | 'init' = 'init';

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    this.productsService.getAllProducts()
    // this.productsService.getProductsByPage(10, 0)
    .subscribe(data => {
      this.products = data;
    });
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toggleProductDetail() {
    this.showProductDetail = !this.showProductDetail;
  }
  onShowDetail(id: string) {
    this.statusDetail = 'loading';
    this.productsService.getProduct(id)
      .subscribe((product: Product) => {
        this.toggleProductDetail();
        this.productChosen = product;
        this.statusDetail = 'success';
      }, errorMsg => {
        this.statusDetail = 'error';
        Swal.fire({
          title: errorMsg,
          text: errorMsg,
          icon: 'error',
          confirmButtonText: 'Ok'
        })
      });
  }
  readAndUpdate(id: string) {
    this.productsService.getProduct(id)
      .pipe(
        // There can be many swithMaps here. This is equivalent to many then's chained. switchMap is returning another observable
        // If there would be another switchMap below the first one, it would receive the response returned for the first one, it would receive an observable as well as the first
        switchMap((product) => this.productsService.update(product.id, { title: 'change' }))
      )
      .subscribe(data => {
        console.log(data);
      });

      this.productsService.fetchReadAndUpdate(id, { title: 'Nuevo Titulazo' })
      .subscribe(response => {
        const read = response[0];
        const update = response[1];
      })
  }
  createNewProduct() {
    const product: CreateProductDTO = {
      title: 'Nuevo Producto',
      description: 'bla bla bla',
      images: [''],
      price: 1000,
      categoryId: 2
    }
    this.productsService.create(product)
      .subscribe(data => {
        console.log('created', data);
        this.products.unshift(data);
      })
  }
  updateProduct() {
    const changes: UpdateProductDTO = {
      title: 'Amazing Product'
    }
    const { id } = this.productChosen;
    this.productsService.update(id, changes)
      .subscribe((product: Product) => {
        const productIndex = this.products.findIndex(productToFind => productToFind.id === product.id);
        this.products[productIndex] = product;
        this.productChosen = product
      })
  }
  deleteProduct() {
    const { id } = this.productChosen;
    this.productsService.delete(id)
      .subscribe(data => {
        const productIndex = this.products.findIndex(product => product.id === id)
        this.products.splice(productIndex, 1);
        this.toggleProductDetail();
      })
  }

  loadMore() {
    this.productsService.getProductsByPage(this.limit, this.offset)
      .subscribe(data => {
        this.products = this.products.concat(data);
        this.offset += this.limit;
      })
  }
}
