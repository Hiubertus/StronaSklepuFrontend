import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {AuthService} from "../../../../services/auth.service";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['../auth.component.scss', './register.component.scss']
})


export class RegisterComponent implements OnInit {
  info: boolean = false;
  myForm!: FormGroup;
  errors: string[] = [];
  submitted: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.myForm = new FormGroup({
      name: new FormControl('',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern("^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]*( [A-ZĄĆĘŁŃÓŚŹŻ]([a-ząćęłńóśźż]){2,})?$")
        ]),
      surname: new FormControl('',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern("^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]*(-[A-ZĄĆĘŁŃÓŚŹŻ]([a-ząćęłńóśźż]){2,})?$")
        ]),
      email: new FormControl('',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.pattern("^[a-zA-Z][a-zA-Z0-9]*(\\.[a-zA-Z][a-zA-Z0-9]*)*@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")
        ]),
      password: new FormControl('',
        [
          Validators.required,
          Validators.minLength(9),
          this.passwordValidator()
        ]),
      password2: new FormControl('',
        [
          Validators.required,
          this.passwordMatchValidator()
        ]),
    });
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

  async onSubmit() {
    this.errors = [];
    this.submitted = true;

    if (this.myForm.valid) {
      try {
        const result = await this.authService.registerUser(
          this.myForm.value.name,
          this.myForm.value.surname,
          this.myForm.value.password,
          this.myForm.value.email
        );
        if (result.success) {
          this.myForm.reset();
          this.submitted = false;
          this.myForm.disable()
          this.errors.push('accountCreated');
          setTimeout(async () => {
            await this.router.navigate(['/login'])
          }, 3000)

        }
      } catch (error: any) {
        if (error.message === 'emailExist') {
          this.errors.push('emailExist');
        } else {
          this.errors.push('databaseError');
        }
      }
    }
  }
}
