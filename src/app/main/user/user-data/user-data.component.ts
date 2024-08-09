import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators} from "@angular/forms";
import {User} from "../../../shared/models/user.model";
import {CommonModule} from "@angular/common";
import {AuthService} from "../../../shared/services/auth.service";
import {ReturnButtonComponent} from "../../../return-button/return-button.component";
import {InputWrapperComponent} from "../../../shared/components/input-wrapper/input-wrapper.component";
import {passwordMatchValidator, passwordValidator} from "../../../shared/validators.model";

@Component({
  selector: 'app-user-data',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ReturnButtonComponent,
    InputWrapperComponent
  ],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.scss'
})
export class UserDataComponent implements OnInit {

  userForm!: FormGroup;
  passwordForm!: FormGroup;

  user!: User | null;
  errors: string[] = [];
  passwordSubmitted: boolean = false;
  userSubmitted: boolean = false;

  constructor(private authService: AuthService) {
  }

  async ngOnInit() {
    this.user = this.authService.getUser()

    this.userForm = new FormGroup({
      username: new FormControl({value: this.user?.username, disabled: true}),
      email: new FormControl({value: this.user?.email, disabled: true}),
      street: new FormControl(this.user?.street),
      apartment: new FormControl(this.user?.apartment),
      city: new FormControl(this.user?.city),
    });

    this.passwordForm = new FormGroup({
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('',
        [
          Validators.required,
          Validators.minLength(9),
          passwordValidator(),
        ]),
      repeatNewPassword: new FormControl('',
        [
          Validators.required,
          passwordMatchValidator()
        ])
    });
  }

  async savePassword() {
    this.passwordSubmitted = true;

    if (this.passwordForm.valid) {
      try {
        const result = await this.authService.patchUserPassword(this.passwordForm.value.oldPassword, this.passwordForm.value.newPassword);
        if (result) {
          this.passwordForm.reset();
          this.passwordForm.disable()
          this.passwordSubmitted = false;
          this.passwordForm.get('repeatNewPassword')?.setErrors({ success: true });
        }
      } catch (err: any) {
        if (err.message === 'badPassword') {
          this.passwordForm.get('newPassword')?.setErrors({ badPassword: true });
        }
        if (err.message === 'databaseError') {
          this.passwordForm.get('repeatNewPassword')?.setErrors({ databaseError: true });
        }
      }
    }
  }

  async saveGeneralData() {
    this.userSubmitted = true
    try {
      const result = await this.authService.patchUserData(this.userForm.value.street, this.userForm.value.apartment, this.userForm.value.city);
      if (result) {
        this.userSubmitted = false
        this.userForm.disable()
        this.userForm.get('apartment')?.setErrors({ success : true })
      }
    } catch (err: any) {
      if (err.message === 'databaseError') {
        this.userForm.get('apartment')?.setErrors({ databaseError : true })
      }
    }

  }

  get usernameInput(): FormControl {
    return this.userForm.get('username') as FormControl;
  }
  get emailInput(): FormControl {
    return this.userForm.get('email') as FormControl;
  }
  get nameInput(): FormControl {
    return this.userForm.get('name') as FormControl;
  }
  get surnameInput(): FormControl {
    return this.userForm.get('surname') as FormControl;
  }
  get cityInput(): FormControl {
    return this.userForm.get('city') as FormControl;
  }
  get streetInput(): FormControl {
    return this.userForm.get('street') as FormControl;
  }
  get apartmentInput(): FormControl {
    return this.userForm.get('apartment') as FormControl;
  }

  get oldPasswordInput(): FormControl {
    return this.passwordForm.get('oldPassword') as FormControl;
  }
  get newPasswordInput(): FormControl {
    return this.passwordForm.get('newPassword') as FormControl;
  }
  get repeatNewPasswordInput(): FormControl {
    return this.passwordForm.get('repeatNewPassword') as FormControl;
  }
}
