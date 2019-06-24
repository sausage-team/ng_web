import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NzMessageService } from 'ng-zorro-antd';

import { login } from 'src/store/actions/user.action';
import { UserService } from 'src/services/user.service';
import { CookieUtil } from 'src/cache/cookie';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private store: Store<{
      account: Map<string, any>,
      isLogin: boolean
    }>,
    private message: NzMessageService,
    private cookie: CookieUtil) {}

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if ('VALID' === this.validateForm.status) {
      this.userService.login({
        ...this.validateForm.value,
        username: this.validateForm.value.userName,
        remember: undefined
      }).subscribe((res: any) => {
        if (res.status === 0) {
          this.message.success('登录成功');
          this.cookie.saveLoginData(res.data);
          this.login();
          this.router.navigateByUrl('/');
        } else {
          this.message.success(res.msg || '登录失败');
        }
      });
    }
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }

  login() {
    this.store.dispatch(login());
  }
}
