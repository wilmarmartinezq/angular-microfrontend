import { Component } from '@angular/core';
import { Product, ProductService } from './services/product.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  productDialog: boolean;
  submitted: boolean;
  public products: Product[] = [];
  product: Product;
  selectedProducts: Product[];
  genres: any[];
  productGenre: any;

  constructor(private productService: ProductService, private messageService: MessageService, private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.genres = [
      { label: 'British Hip-Hop', value: 'British Hip-Hop' },
      { label: 'US Hip-Hop', value: 'US Hip-Hop' },
      { label: 'Conscious Hip Hop', value: 'Conscious Hip Hop' },
      { label: 'Pop Rap', value: 'Pop Rap' },
      { label: 'Rock', value: 'Rock' },
      { label: 'Metal', value: 'Metal' }
    ];

    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  editProduct(product: Product) {
    this.product = { ...product };
    this.productGenre = this.genres.find(g => g.label === this.product.productGenre);
    this.productDialog = true;
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productService.deleteProduct(product.id).subscribe(res => {
          this.products = this.products.filter(val => val.id !== res.id);
          this.product = null;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        });
      }
    });
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  updateProductRating(event: any) {
    this.product.rating = event.value;
  }

  openNew() {
    this.product = {};
    this.submitted = false;
    this.productDialog = true;
  }

  saveProduct() {
    this.submitted = true;
    if (this.product.name.trim()) {
      if (this.product.id !== null && this.product.id !== undefined) {
        this.product.productGenre = this.productGenre.label;
        this.productService.updateProduct(this.product).subscribe(res => {
          this.product = res;
          this.products[this.findIndexById(this.product.id)] = this.product;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
          this.productDialog = false;
          this.product = {};
          const message = JSON.stringify({
            channel: 'FROM_PRODUCT_FRAME'
          });
          window.parent.postMessage(message, '*');
        });
      }
      else {
        this.product.image = 'https://www.primefaces.org/primeng/v11-lts/assets/showcase/images/demo/product/product-placeholder.svg';
        this.product.productGenre = this.productGenre.label;
        this.productService.createProduct(this.product).subscribe(res => {
          this.product.id = res.id;
          this.products.push(this.product);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
          this.productDialog = false;
          this.product = {};
        });
      }
    }
  }
}
