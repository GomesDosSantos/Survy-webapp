import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // https://github.com/firebase/firebaseui-web
  // O cara da ajuda: @beeman https://github.com/stackblitz/core/issues/930
  constructor(private auth: AuthService, private router: Router, private zone : NgZone) { }

  ngOnInit() {
    if (this.auth.isUserAuthenticated())
    {
      this.router.navigate(['home']);
    }
  }

  efetuarLoginGoogle() {
    this.auth.loginWithGoogle();
  }

  efetuarLoginFacebook() {
    this.auth.loginWithFacebook();
  }
  
}