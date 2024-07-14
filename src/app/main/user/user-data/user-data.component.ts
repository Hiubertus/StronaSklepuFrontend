import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators} from "@angular/forms";
import {User} from "../../../models/user.model";
import {CommonModule} from "@angular/common";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-user-data',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.scss'
})
export class UserDataComponent implements OnInit {

  myForm1!: FormGroup;
  myForm2!: FormGroup;

  user!: User | null;
  check: boolean = false
  info: boolean = false;
  errors: string[] = [];
  submitted: boolean = false;

  submitted2: boolean = false;

  constructor(private authService: AuthService) {
  }

  async ngOnInit() {
    this.myForm1 = new FormGroup({
      street: new FormControl(''),
      apartment: new FormControl(''),
      city: new FormControl('')
    });

    this.myForm2 = new FormGroup({
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('',
        [
          Validators.required,
          Validators.minLength(9),
          this.passwordValidator(),
        ]),
      repeatNewPassword: new FormControl('',
        [
          Validators.required,
          this.passwordMatchValidator()
        ])
    });

    this.user = this.authService.getUser()
    this.myForm1.patchValue({
      street: this.user!.street,
      apartment: this.user!.apartment,
      city: this.user!.city
    });
  }

  async savePassword() {
    this.errors = [];
    this.submitted = true;

    if (this.myForm2.valid) {
      try {
        const result = await this.authService.patchUserPassword(this.myForm2.value.oldPassword, this.myForm2.value.newPassword);
        if (result) {
          this.myForm2.reset();
          this.myForm2.disable()
          this.submitted = false;
          this.errors.push('passwordUpdated');
        }
      } catch (err: any) {
        if (err.message === 'badPassword') {
          this.errors.push('badPassword');
        }
        if (err.message === 'databaseError') {
          this.errors.push('databaseError');
        }
        console.error('An error occurred:', err);
      }
    }
  }

  async saveGeneralData() {
    this.submitted2 = true
    this.check = true
    try {
      const result = await this.authService.patchUserData(this.myForm1.value.street, this.myForm1.value.apartment, this.myForm1.value.city);
      console.log(this.myForm1.value.street, this.myForm1.value.apartment, this.myForm1.value.city)
      if (result) {
        this.submitted2 = false
        this.check = true;
        this.myForm1.disable()
      }
    } catch (err: any) {
      this.check = false
      console.error('An error occurred:', err);
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
      const password = control.parent?.get('newPassword')?.value;
      const confirmPassword = control.value;
      return password === confirmPassword ? null : {'passwordMismatch': true};
    };
  }
}
