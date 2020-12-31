import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  public form: FormGroup;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = new FormGroup(
      {
        name: new FormControl(""),
        email: new FormControl(
          "",
          [Validators.required, Validators.email],
          this.asyncEmailValidator()
        ),
        confirmEmail: new FormControl("")
      },
      { validators: this.emailsMatch() }
    );
  }

  reinitialiser() {
    this.form.reset();
  }

  submit() {
    console.log(this.form.value);
  }

  emailsMatch(): ValidatorFn {
    return (group: FormGroup): ValidationErrors | null => {
      return group.get("email").value != group.get("confirmEmail").value
        ? { noMatch: true }
        : null;
    };
  }

  asyncEmailValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.http
        .get(
          `https://apilayer.net/api/check?access_key=115ce3ae2ccdef30e018edbde78d2c4a&email=${
            control.value
          }&smtp=1&format=1`
        )
        .pipe(
          map((response: any) => {
            console.log(response);
            return !response.smtp_check
              ? { asyncEmailValidator: control.value }
              : null;
          })
        );
    };
  }
}
