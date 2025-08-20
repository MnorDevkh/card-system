import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { Student, StudentService } from '../service/student.service';
import { CardService } from '../service/card.service';
import { environment } from '../../environments/environment';
import { UploadService } from '../service/upload.service';

@Component({
  selector: 'app-card-generator',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzGridModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzSpinModule,
  ],
  templateUrl: './card-generator.component.html',
})
export class CardGeneratorComponent implements OnInit {
  // State for Background Templates
  backgroundTemplates: any;
  selectedTemplateId: number | null = null;
  loadingTemplates = false;

  // State for Student Table
  students: Student[] = [];
  loadingStudents = false;
  totalStudents = 0;
  pageIndex = 1;
  pageSize = 10;

  // Student Selection state
  mapOfCheckedId: { [key: string]: boolean } = {};
  isAllDisplayedDataChecked = false;
  isIndeterminate = false;
  checkedNumber = 0;
  listOfCurrentPageData: readonly Student[] = [];
  cardTemplates: any;

  constructor(
    private route: ActivatedRoute,
    private cardService: CardService,
    private studentService: StudentService,
    private uploadService: UploadService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.loadBackgroundTemplates();
    this.loadStudents();
  }
  // Method to load background templates from the service
  loadBackgroundTemplates(): void {
     this.uploadService.getListImage('template').subscribe({
      next: (files) => {
        this.cardTemplates = [];
        files.forEach((file) => {
          this.uploadService.getImage(file.filename).subscribe({
            next: (imageUrl) => {
              console.log(imageUrl);
              
              this.cardTemplates.push({ id: file.id, imageUrl });
            },
            error: (err) => console.error('Failed to load image:', err),
          });
        });
      },
      error: (err) => console.error('Failed to load image list:', err),
    });
  }
  loadStudents(): void {
    this.loadingStudents = true;
    this.studentService.getStudents(this.pageIndex, this.pageSize).subscribe({
      next: (data) => {
        this.students = data.students;
        this.totalStudents = data.total;
        this.loadingStudents = false;
        // Reset selection on new page load
        this.mapOfCheckedId = {};
        this.refreshCheckedStatus();
      },
      error: (err) => {
        console.error('Failed to load students', err);
        this.loadingStudents = false;
      },
    });
  }

  // Event handler for page index change
  onPageIndexChange(index: number): void {
    this.pageIndex = index;
    this.loadStudents();
  }

  // Event handler for background template selection
  onTemplateSelect(templateId: number): void {
    this.selectedTemplateId = templateId;
  }

  // Student table selection methods
  onCurrentPageDataChange(listOfCurrentPageData: readonly Student[]): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.isAllDisplayedDataChecked = this.listOfCurrentPageData.every(
      (item) => this.mapOfCheckedId[item.id]
    );
    this.isIndeterminate =
      this.listOfCurrentPageData.some((item) => this.mapOfCheckedId[item.id]) &&
      !this.isAllDisplayedDataChecked;
    this.checkedNumber = Object.values(this.mapOfCheckedId).filter(
      (v) => v
    ).length;
  }

  onItemChecked(id: string, checked: boolean): void {
    this.mapOfCheckedId[id] = checked;
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach(
      (item) => (this.mapOfCheckedId[item.id] = value)
    );
    this.refreshCheckedStatus();
  }

  // Method to trigger card generation
  generateCards(): void {
    // Collect the IDs of the selected students
    const studentIds = Object.keys(this.mapOfCheckedId).filter(
      (key) => this.mapOfCheckedId[key]
    );

    if (this.selectedTemplateId && studentIds.length > 0) {
      console.log(
        `Generating cards with template ${this.selectedTemplateId} for students:`,
        studentIds
      );
      // Here you would call your card generation service
      // this.cardService.generateCards(this.selectedTemplateId, studentIds).subscribe(...)
    }
  }
}
