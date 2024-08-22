import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'attendance', loadChildren: () => import('./attendance/attendance.module').then(m => m.AttendancePageModule) },
  { path: 'myschool', loadChildren: () => import('./myschool/myschool.module').then(m => m.MyschoolPageModule) },
  { path: 'students', loadChildren: () => import('./students/students.module').then(m => m.StudentsPageModule) },
  { path: 'delete-reason', loadChildren: () => import('./delete-reason/delete-reason.module').then(m => m.DeleteReasonPageModule) },
  { path: 'add-student', loadChildren: () => import('./add-student/add-student.module').then(m => m.AddStudentPageModule) },
  { path: 'teachers', loadChildren: () => import('./teachers/teachers.module').then(m => m.TeachersPageModule) },
  { path: 'classes', loadChildren: () => import('./classes/classes.module').then(m => m.ClassesPageModule) },
  { path: 'add-class', loadChildren: () => import('./add-class-myform/add-class-myform.module').then(m => m.AddClassMyformModule) },
  { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule) },
  { path: 'edit-password', loadChildren: () => import('./edit-password/edit-password.module').then(m => m.EditPasswordPageModule) },
  { path: 'move-students', loadChildren: () => import('./move-students/move-students.module').then(m => m.MoveStudentsPageModule) },
  { path: 'attendance-overview', loadChildren: () => import('./attendance-overview/attendance-overview.module').then(m => m.AttendanceOverviewPageModule) },
  { path: 'promote', loadChildren: () => import('./promote/promote.module').then(m => m.PromotePageModule) },
  { path: 'update-attendance', loadChildren: () => import('./update-attendance/update-attendance.module').then(m => m.UpdateAttendancePageModule) },
  { path: 'view-students', loadChildren: () => import('./view-students/view-students.module').then(m => m.ViewStudentsPageModule) },
  { path: 'individual-attendance', loadChildren: () => import('./individual-attendance/individual-attendance.module').then(m => m.IndividualAttendancePageModule) },
  { path: 'overall-reports', loadChildren: () => import('./overall-reports/overall-reports.module').then(m => m.OverallReportsPageModule) },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
  { path: '', loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule) },
  { path: 'help', loadChildren: () => import('./help/help.module').then(m => m.HelpPageModule) },
  { path: 'absence-reason', loadChildren: () => import('./absence-reason/absence-reason.module').then(m => m.AbsenceReasonPageModule) },
  { path: 'add-student', loadChildren: () => import('./add-learner-myform/add-student/add-student.module').then(m => m.AddStudentPageModule) },
  { path: 'guardian-details', loadChildren: () => import('./add-learner-myform/guardian-details/guardian-details.module').then(m => m.GuardianDetailsPageModule) },
  { path: 'forgot-password', loadChildren: () => import('./forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule) },
  { path: 'reset-password', loadChildren: () => import('./reset-password/reset-password.module').then(m => m.ResetPasswordPageModule) },
  { path: 'add-teacher', loadChildren: () => import('./add-teacher-myform/add-teacher-myform.module').then(m => m.AddTeacherMyformModule) },
  { path: 'help-form', loadChildren: () => import('./help-form/help-form.module').then(m => m.HelpFormModule) },
  { path: 'deactivated-learners', loadChildren: () => import('./deactivated-learners/deactivated-learners.module').then(m => m.DeactivatedLearnersModule) },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' }),

  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
