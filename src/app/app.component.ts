import { Component } from '@angular/core';

import { Product } from './models/product.model';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  imgParent = '';
  showImg = true;

  constructor(
    private authService: AuthService,
    private userService: UsersService
  ) {

  }


  onLoaded(img: string) {
    console.log('log padre', img);
  }

  toggleImg() {
    this.showImg = !this.showImg;
  }
  createUser() {
    this.userService.create({
      email: 'rafael@gmail.com',
      password: '123',
      name: 'Rafael'
    })
    .subscribe(rts => {
      console.log(rts, 'USUARIO CREADO');
    });
  }
  login() {
    this.authService.login('rafael@gmail.com', '123')
      .subscribe(rta => {
        console.log(rta.access_token, 'LOGGEADO -- TOKEN');
      })
  }
}
