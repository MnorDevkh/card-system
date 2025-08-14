import { Component, OnInit } from '@angular/core';
import { UploadService } from '../service/upload.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

interface CardTemplate {
  id: number;
  imageUrl: string;
}

@Component({
  selector: 'app-card-template-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-template-list.component.html',
  providers: [UploadService],
})
export class CardTemplateListComponent implements OnInit {
  cardTemplates: CardTemplate[] = [];

  constructor(private uploadService: UploadService, private router: Router) {}

  ngOnInit(): void {
    this.loadUploadedImages();
  }
  loadUploadedImages(): void {
    this.uploadService.getListImage('template').subscribe({
      next: (files) => {

        // files is FileMeta[]
        this.cardTemplates = [];

        files.forEach((file) => {
          this.uploadService.getImage(file.filename).subscribe({
            next: (imageUrl) => {
              this.cardTemplates.push({
                id: file.id,
                imageUrl,
              });
            },
            error: (err) => {
              console.error('Failed to load image:', err);
            },
          });
        });
      },
      error: (err) => {
        console.error('Failed to load image list:', err);
      },
    });
  }

 selectTemplate(id: number | null | undefined): void {
  if (id == null) {
    alert('Invalid template ID');
    return;
  }
  this.router.navigate(['/card-generator', id]);
}
  updateTemplate(id: number): void {
    console.log('Update template:', id);
  }

  trackById(index: number, item: CardTemplate): number {
    return item.id;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.uploadService.uploadImage(file,0, 'template').subscribe({
      next: (response) => {
        this.loadUploadedImages();
      },
      error: (error) => {
        console.error('Upload failed:', error);
      },
    });
  }
}
