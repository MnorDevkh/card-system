import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StudentService, Student } from '../service/student.service';
import * as XLSX from 'xlsx';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-list.component.html',
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  total: number = 0;
  limit: number = 20;
  currentPage: number = 1;
  uploading: boolean = false;
  loading = false;

  constructor(
    private studentService: StudentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents(page: number = 1) {
    this.loading = true;

    this.currentPage = page;
    const skip = (page - 1) * this.limit;
    this.studentService.getStudents(skip, this.limit).subscribe({
      next: (data) => {
        this.students = data.students || [];
        this.total = data.total || 0;
        this.currentPage = page;
        this.loading = false;
        console.log(this.loading);
        this.cdr.detectChanges();
        
      },
      error: (err) => {
        console.error('Failed to load students', err);
        this.loading = false;
      },
    });
  }

  exportToExcel() {
    if (this.students.length === 0) return;

    const exportData = this.students.map((s) => ({
      ID: s.id,
      'Card ID': s.card_id,
      'Identity ID': s.identity_id,
      'Name Khmer': s.name.khmer,
      'Name English': s.name.english,
      Gender: s.gender,
      'Birth Date': s.birth_date,
      'Birth Place Village': s.birth_place.village,
      'Birth Place Commune': s.birth_place.commune,
      'Birth Place District': s.birth_place.district,
      'Birth Place Province': s.birth_place.province,
      'Current Address Village': s.current_address.village,
      'Current Address Commune': s.current_address.commune,
      'Current Address District': s.current_address.district,
      'Current Address Province': s.current_address.province,
      Phone: s.phone,
      'Guardian Name': s.guardian.name,
      'Guardian Phone': s.guardian.phone,
      'Education Level': s.education_level,
      'Bac II Code': s.bacII_code,
      'Bac II Year': s.bacII_year,
      'Bac II Result': s.bacII_result,
      'High School': s.high_school,
      Faculty: s.faculty,
      Major: s.major,
      'Study Shift': s.study_shift,
      'Scholarship Type': s.scholarship_type,
      'Scholarship Card ID': s.scholarship_card_id,
      'Scholarship Bye': s.scholarship_by,
      Email: s.email,
      Notes: s.notes,
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    // saveAs(blob, 'student_list.xlsx');
  }

  uploadExcel(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    this.uploading = true;
    this.studentService.uploadExcel(formData).subscribe({
      next: () => {
        console.log('Upload successful');
        this.uploading = false;
        this.loadStudents();
      },
      error: (err) => {
        console.error('Upload failed', err);
        this.uploading = false;
      },
    });
  }

  formatNested(obj: any): string {
    return Object.values(obj).join(', ');
  }

  isObject(value: any): boolean {
    return value && typeof value === 'object' && !Array.isArray(value);
  }

  totalPages(): number {
    return this.total ? Math.ceil(this.total / this.limit) : 0;
  }

  get pages(): number[] {
    const total = this.totalPages();
    return total > 0
      ? Array(total)
          .fill(0)
          .map((_, i) => i + 1)
      : [];
  }
}
