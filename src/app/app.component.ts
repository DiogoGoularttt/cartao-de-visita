import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroPhoneSolid,
  heroEnvelopeSolid,
  heroMapPinSolid,
} from '@ng-icons/heroicons/solid';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
  providers: [
    provideNgxMask(),
    provideIcons({ heroEnvelopeSolid, heroMapPinSolid, heroPhoneSolid }),
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  form: FormGroup;
  showCard = false;
  isFlipped = false;
  isCardGenerated = false; 

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
      return `(${numeros.substring(0, 2)}) ${numeros.substring(
        2,
        7
      )}-${numeros.substring(7)}`;
    } else if (numeros.length === 10) {
      return `(${numeros.substring(0, 2)}) ${numeros.substring(
        2,
        6
      )}-${numeros.substring(6)}`;
    }

    return phone;
  }

  gerarCartao() {
    if (this.form.valid) {
      this.showCard = true;
      this.isCardGenerated = true;
    }
  }

  removeRotation(element: HTMLElement) {
    element.style.transform = 'rotateY(0deg)';
  }

  restoreRotation(element: HTMLElement) {
    element.style.transform = 'rotateY(180deg)';
  }

  downloadPDF() {
    const cardFrontElement = document.querySelector(
      '.card-front'
    ) as HTMLElement;
    const cardBackElement = document.querySelector('.card-back') as HTMLElement;

    if (cardFrontElement && cardBackElement) {
      this.removeRotation(cardBackElement);

      html2canvas(cardFrontElement, {
        backgroundColor: this.form.value.backgroundColor,
      }).then((frontCanvas) => {
        const frontImgData = frontCanvas.toDataURL('image/png');

        html2canvas(cardBackElement, {
          backgroundColor: this.form.value.backgroundColor,
        }).then((backCanvas) => {
          const backImgData = backCanvas.toDataURL('image/png');

          this.restoreRotation(cardBackElement);
          const pdf = new jsPDF('p', 'mm', 'a4');

          const margin = 10;
          const imgWidth = 190;
          const frontImgHeight =
            (frontCanvas.height * imgWidth) / frontCanvas.width;
          const backImgHeight =
            (backCanvas.height * imgWidth) / backCanvas.width;

          pdf.addImage(
            frontImgData,
            'PNG',
            margin,
            margin,
            imgWidth,
            frontImgHeight
          );

          pdf.rect(margin - 1, margin - 1, imgWidth + 2, frontImgHeight + 2);

          pdf.addImage(
            backImgData,
            'PNG',
            margin,
            margin * 2 + frontImgHeight,
            imgWidth,
            backImgHeight
          );

          pdf.rect(
            margin - 1,
            margin * 2 + frontImgHeight - 1,
            imgWidth + 2,
            backImgHeight + 2
          );

          pdf.save(`${this.form.value.name}_cartao_de_visitas.pdf`);
        });
      });
    }
  }
}
