import { Component, OnInit } from '@angular/core';
import {ReceiptPageComponent} from '../receipt-page/receipt-page.component'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  constructor(private receiptPageObj: ReceiptPageComponent, private route: Router) { }

  ngOnInit(): void {
    
  }


  loginForm = new FormGroup({
    userName: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  get userName(){return this.loginForm.get('userName')}
  get password(){return this.loginForm.get('password')}
  warningMessage = false;
  //username:any;
  onSubmit(){
    var loginData = this.loginForm.value;
    console.log(loginData);

    //fetch username and password from Form
    var loginUsername = loginData['userName'];
    var loginPassword = loginData['password'];

    if(loginUsername !='' && loginPassword !=''){
       this.warningMessage = false;
        // sending username as a agentName in route url
       this.route.navigate(['/receipt',{agentName:loginUsername}])
    }
    else{
      this.warningMessage = true;
      //alert('Please provide username and password details')
    }
   
  }
}
