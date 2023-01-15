import { Component, OnInit } from '@angular/core';

import { CreateProductDTO, Product, UpdateProductDTO } from '../../models/product.model';

import { StoreService } from '../../services/store.service';
import { ProductsService } from '../../services/products.service';

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

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    this.productsService.getAllProducts()
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
    this.productsService.getProduct(id)
      .subscribe((product: Product) => {
        this.toggleProductDetail();
        this.productChosen = product;
      });
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
}
