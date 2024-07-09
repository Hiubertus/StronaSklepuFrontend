import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ReactiveFormsModule} from "@angular/forms";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {CommonModule} from "@angular/common";
import {AuthService} from "../../../../services/auth.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../auth.component.scss']
})
export class LoginComponent implements OnInit {
  myForm!: FormGroup;
  errors: string[] = [];
  submitted: boolean = false;

  constructor(private router: Router,
              private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.myForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })
  }

  async onSubmit() {
    this.submitted = true;
    this.errors = []

    if (this.myForm.valid) {
      try {
        const result = await this.authService.loginUser(this.myForm.value.email, this.myForm.value.password)
        if (result.success) {
          this.myForm.reset();
          this.submitted = false;
          this.errors.push('accountLogged');
          await this.router.navigate(['/user']);
        }
      } catch (error: any) {
        console.error(error)
        if (error.message === 'badPassword') {
          this.errors.push('badPassword');
        }
        if (error.message === 'emailNonExist') {
          this.errors.push('emailNonExist');
        } else {
          this.errors.push('databaseError');
        }
      }
    }
  }
}
