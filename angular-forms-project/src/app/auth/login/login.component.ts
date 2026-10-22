import { afterNextRender, Component, DestroyRef, inject, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  private form = viewChild<NgForm>('form');
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const savedForm = window.localStorage.getItem('saved-login-form');
      if (savedForm) {
        const parsedForm = JSON.parse(savedForm);
        const savedEmail = parsedForm.email;
        setTimeout(() => {
          this.form()?.controls['email'].setValue(savedEmail);
        }, 1);
      }

      const subscription = this.form()?.valueChanges?.pipe(debounceTime(500)).subscribe({
        next: (value) => 
          window.localStorage.setItem(
            'saved-login-form', 
            JSON.stringify({email: value.email}))        
      });

      this.destroyRef.onDestroy(() => subscription?.unsubscribe()); 
    });
  }

  onSubmit(formData: NgForm) {
    if (formData.invalid) {
      return;
    }

    const email =formData.form.value.email;
    const password = formData.form.value.password;
    
    console.log('formData: ', formData.form);
    console.log('email: ', email);
    console.log('password: ', password);

    formData.reset();
  }
}
