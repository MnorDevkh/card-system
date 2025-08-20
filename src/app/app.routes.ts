import { Routes } from '@angular/router';
import { MenuComponent } from './component/comone/menu.component';
import { HomeComponent } from './component/home.component';
import { CardEditorComponent } from './component/card-editor.component';
import { UploadImageComponent } from './component/add-card-template.component';
import { CardTemplateListComponent } from './component/card-template-list.component';
import { StudentListComponent } from './component/student-list.component';
import { CardGeneratorComponent } from './component/card-generator.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'card-generator/:id', component: CardGeneratorComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'card', component: CardTemplateListComponent },
  { path: 'upload-template', component: UploadImageComponent },
  { path: 'student-list', component: StudentListComponent },
];
