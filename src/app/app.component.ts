import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPhoneSolid, heroEnvelopeSolid, heroMapPinSolid } from '@ng-icons/heroicons/solid';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, provideNgxMask  } from 'ngx-mask'; 
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgxMaskDirective, NgIcon],
  providers: [provideNgxMask(), provideIcons({ heroEnvelopeSolid, heroMapPinSolid, heroPhoneSolid })],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  form: FormGroup;
  showCard = false;
  isFlipped = false;

  flipCard() {
    this.isFlipped = !this.isFlipped;
  }

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1)]],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      number: ['', Validators.required],
      neighborhood: ['', Validators.required],
      city: ['', Validators.required],
      backgroundColor: ['#ffffff'], 
      textColor: ['#000000'],
      iconColor: ['#000000'],
    });
  }

  formatPhone(phone: string): string {
    if (!phone) return '';

    const numeros = phone.replace(/\D/g, '');

    if (numeros.length === 11) {
      return `(${numeros.substring(0, 2)}) ${numeros.substring(2, 7)}-${numeros.substring(7)}`;
    } else if (numeros.length === 10) {
      return `(${numeros.substring(0, 2)}) ${numeros.substring(2, 6)}-${numeros.substring(6)}`;
    }

    return phone;
  }

  gerarCartao() {
    if (this.form.valid) {
      this.showCard = true;
    }
  }
}
