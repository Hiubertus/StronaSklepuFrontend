import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink, RouterLinkActive} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    NgClass
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit {
  errors: string[] = [];
  submitted: boolean = false;

  loginForm!: FormGroup;
  registerForm!: FormGroup;

  authMode!: "login" | "register";

  constructor(private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.authMode = this.route.snapshot.params['authMode']
    this.route.params.subscribe(params => {
      this.authMode = params['authMode'];
    })
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
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
      password: new FormControl('', [
          Validators.required,
          Validators.minLength(9),
          this.passwordValidator()
      ]),
      password2: new FormControl('', [
          Validators.required,
          this.passwordMatchValidator()
      ]),
    })
  }
  changeAuthPage(page: 'login' | 'register') {
    this.errors = [];
    this.submitted = false;
    if(page == 'register') {
      this.router.navigate(['/auth/login'])
    }
    if(page == 'login') {
      this.router.navigate(['/auth/register'])
    }
  }
  async onSubmit() {
    this.submitted = true;
    if(this.authMode == 'login') {
      if (this.loginForm.valid) {
        try {
          const result = await this.authService.loginUser(
            this.loginForm.value.email,
            this.loginForm.value.password)
          if (result) {
            this.loginForm.reset();
            this.submitted = false;
            this.errors = [];
            this.errors.push('accountLogged');
            await this.router.navigate(['/user']);
          }
        } catch (error: any) {
          console.error(error)
          if (error.message === 'badPassword') {
            this.errors.push('badPassword');
          } if (error.message === 'emailNonExist') {
            this.errors.push('emailNonExist');
          } if (error.message === 'databaseError') {
            this.errors.push('databaseError');
          }
        }
      }
    }
    if(this.authMode == 'register') {
      if (this.registerForm.valid) {
        try {
          const result = await this.authService.registerUser(
            this.registerForm.value.username,
            this.registerForm.value.email,
            this.registerForm.value.password
          );
          if (result) {
            this.registerForm.reset();
            this.submitted = false;
            this.errors = [];
            this.registerForm.disable()
            this.errors.push('accountCreated');
            setTimeout(async () => {
              this.changeAuthPage('register')
            }, 3000)
          }
        } catch (error: any) {
          if (error.message === 'emailExist') {
            this.errors.push('emailExist');
          } if (error.message === 'usernameExist') {
            this.errors.push('usernameExist');
          }  if (error.message === 'databaseError') {
            this.errors.push('databaseError');
          }
        }
      }
    }
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const value: string = control.value;
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /\d/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      const isValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
      return isValid ? null : {'invalidPassword': true};
    };
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const password = control.parent?.get('password')?.value;
      const confirmPassword = control.value;
      return password === confirmPassword ? null : {'passwordMismatch': true};
    };
  }
}
