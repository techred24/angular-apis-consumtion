import { Component } from '@angular/core';

import { Product } from './models/product.model';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { FilesService } from './services/files.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  imgParent = '';
  showImg = true;
  token = '';
  imgRta = '';

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private fileService: FilesService
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
        this.token = rta.access_token;
      })
  }
  getProfile() {
    this.authService.profile(this.token)
      .subscribe(profile => {
        console.log(profile);
      })
  }
  downloadPdf() {
    this.fileService.getFile('miPdf', 'https://pdfhive.com/wp-content/uploads/2019/03/Genius-Foods-Become-Smarter-and-Happier-While-Protecting-Your-Brain-for-Life1.pdf', 'application/pdf')
      .subscribe()
  }
  onUpload(event: Event) {
    const element = event.target as HTMLInputElement
    const file = element.files?.item(0)
    if (file) {
      this.fileService.uploadFile(file)
        .subscribe(rta => {
          console.log(rta.location, 'EL LOCATION')
          this.imgRta = rta.location;
        });
    }
  }
}
