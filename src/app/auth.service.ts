import { Injectable, NgZone } from '@angular/core';

// JSON Web Tokens
//import { JwtHelperService } from '@auth0/angular-jwt';
// Router
import { Router, ActivatedRoute } from '@angular/router';
// Firebase API
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';


@Injectable()
export class AuthService {

  isLogged : boolean = false;

  constructor(public asAuth : AngularFireAuth, private route : ActivatedRoute, private router : Router, private zone : NgZone) { }

  isUserLoggedIn() : boolean {
    return this.isLogged;
  }

  isUserAuthenticated() : boolean {
    //const jwttoken = localStorage.getItem('token');
    // return !this.jwtHelper.isTokenExpired(jwttoken);
    let resp : any = this.getInfoCurrentUser();
    if (resp === null || resp === undefined)
    {
      return false;
    }
    console.log(this.isLogged);
    return this.isLogged;
  }

  getInfoCurrentUser() : any {
    //console.log(this.asAuth.auth.currentUser);
    return this.asAuth.auth.currentUser;
  }

  logout() : any {
    return this.asAuth.auth.signOut();
  }

  redirectToLogin() {
    if (this.isUserAuthenticated())
    {
      this.logout();
    }
    this.router.navigate(['login']);
  }

  checkLogin() {
    let resp : any = this.getInfoCurrentUser();
    if ((resp === null || resp === undefined) && (!this.isUserAuthenticated()))
    {
      this.router.navigate(['login']);
    }
  }

  checkUserKey() {
    
  }

  addUserAndRetriveKey() {

  }

  retriveKeyFromUser() {

  }

  loginWithGoogle() {
    let provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider)
    .then(
      (response) => {
        this.isLogged = true;
        let user_info = this.getInfoCurrentUser();
        if (user_info.lastLoginAt !== undefined || user_info.lastLoginAt !== null)
        {
          ; // ADD USER AND RETRIVE KEY
        }
        this.zone.run(()=>{this.router.navigate(['home'])})
      }
    )
    .catch(
      (error) => {
        console.log(error);
      }
    )
  }

  loginWithFacebook() {
    let provider = new firebase.auth.FacebookAuthProvider();
    return firebase.auth().signInWithPopup(provider);
  }

}