import {Component, OnInit} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink, RouterLinkActive} from "@angular/router";
import {AuthService} from "../../../shared/services/auth.service";
import {NgClass} from "@angular/common";
import {InputWrapperComponent} from "../../../shared/components/input-wrapper/input-wrapper.component";
import {passwordMatchValidator, passwordValidator} from "../../../shared/validators.model";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    NgClass,
    InputWrapperComponent
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit {
  submitted: boolean = false;

  loginForm!: FormGroup;
  registerForm!: FormGroup;

  authMode!: "login" | "register";

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {
  }

  ngOnInit() {
    this.authMode = this.route.snapshot.params['authMode']
    this.route.params.subscribe(params => {
      this.authMode = params['authMode'];
    })
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(9), passwordValidator()])
    })
    this.registerForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/^\S*$/)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.email
      ]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(9),
        passwordValidator()
      ]),
      repeatNewPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(9),
        passwordMatchValidator()
      ]),
    })
  }

  changeAuthPage(page: 'login' | 'register') {
    this.submitted = false;

    if (page == 'register') {
      this.registerForm.reset()
      this.router.navigate(['/auth/login'])
    }
    if (page == 'login') {
      this.loginForm.reset();
      this.router.navigate(['/auth/register'])
    }
  }

  async onSubmit() {
    this.submitted = true;
    if (this.authMode == 'login') {
      if (this.loginForm.valid) {
        try {
          const result = await this.authService.loginUser(
            this.loginForm.value.email,
            this.loginForm.value.password)
          if (result) {
            this.submitted = false;
            this.loginForm.get('password')?.setErrors({ success: true })
            await this.router.navigate(['/user']);
          }
        } catch (error: any) {
          if (error.message === 'badPassword') {
            this.loginForm.get('password')?.setErrors({badPassword: true});
          }
          if (error.message === 'emailNonExist') {
            this.loginForm.get('email')?.setErrors({emailNonExist: true});
          }
          if (error.message === 'databaseError') {
            this.loginForm.get('password')?.setErrors({databaseError: true});
          }
        }
      }
    }
    if (this.authMode == 'register') {
      if (this.registerForm.valid) {
        try {
          const result = await this.authService.registerUser(
            this.registerForm.value.username,
            this.registerForm.value.email,
            this.registerForm.value.newPassword
          );
          if (result) {
            this.registerForm.reset();
            this.submitted = false;
            this.registerForm.disable();
            this.registerForm.get('repeatNewPassword')?.setErrors({ success: true });
            setTimeout(async () => {
              this.changeAuthPage('register')
            }, 3000)

          }
        } catch (error: any) {
          if (error.message === 'emailExist') {
            this.registerForm.get('email')?.setErrors({emailExist: true});
          }
          if (error.message === 'usernameExist') {
            this.registerForm.get('username')?.setErrors({usernameExist: true});
          }
          if (error.message === 'databaseError') {
            this.registerForm.get('repeatNewPassword')?.setErrors({databaseError: true});
          }
        }
      }
    }
  }

  get emailLogin(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get passwordLogin(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  get usernameRegister(): FormControl {
    return this.registerForm.get('username') as FormControl;
  }

  get emailRegister(): FormControl {
    return this.registerForm.get('email') as FormControl;
  }

  get newPasswordRegister(): FormControl {
    return this.registerForm.get('newPassword') as FormControl;
  }

  get repeatNewPasswordRegister(): FormControl {
    return this.registerForm.get('repeatNewPassword') as FormControl;
  }
}
