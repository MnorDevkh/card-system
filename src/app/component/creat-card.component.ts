import { Component, OnInit } from '@angular/core';
import { CardService } from '../service/card.service';


@Component({
  selector: 'app-creat-card',
  standalone: true,
  templateUrl: './creat-card.component.html',
  styleUrls: ['./creat-card.component.css']
})
export class CreatCardComponent implements OnInit {
  cardData: any = null; // JSON data from service
  backgroundImage: string | null = null; // Selected background image as data URL
  selectedFile: File | null = null;

  constructor(private cardService: CardService) {}

  ngOnInit(): void {
    this.loadCardData();
  }

  loadCardData(): void {
    this.cardService.getCardTemplateData().subscribe({
      next: (data) => {
        this.cardData = data;
        console.log('Card template data loaded:', data);
      },
      error: (err) => {
        console.error('Error loading card data:', err);
      }
    });
  }

  onBackgroundSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Convert file to data URL for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.backgroundImage = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
}
