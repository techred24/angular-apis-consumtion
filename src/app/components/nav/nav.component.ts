import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';

import { StoreService } from '../../services/store.service'
import { AuthService } from '../../services/auth.service'
import { switchMap } from 'rxjs/operators'

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  activeMenu = false;
  counter = 0;
  token = '';
  profile: User | undefined = undefined;

  constructor(
    private storeService: StoreService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.storeService.myCart$.subscribe(products => {
      this.counter = products.length;
    });
  }

  toggleMenu() {
    this.activeMenu = !this.activeMenu;
  }

  login() {
    this.authService.login('rafael@gmail.com', '123')
      .pipe(
        switchMap((token) => {
          // this.token = token.access_token
          return this.authService.profile()
        })
      )
      .subscribe(profile => {
        console.log(profile, 'LA DATA DEL PROFILE')
        this.profile = profile
      })
  }
}
