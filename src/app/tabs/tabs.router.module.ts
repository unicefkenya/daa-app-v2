import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'attendance',
        children: [
          {
            path: '',
            loadChildren: () => import('../attendance/attendance.module').then(m => m.AttendancePageModule)
          }
        ]
      },
      {
        path: 'attendance-overview',
        children: [
          {
            path: '',
            loadChildren: () => import('../attendance-overview/attendance-overview.module').then(m => m.AttendanceOverviewPageModule)
          }
        ]
      },
      {
        path: 'myschool',
        children: [
          {
            path: '',
            loadChildren: () => import('../myschool/myschool.module').then(m => m.MyschoolPageModule)
          }
        ]
      },
      {
        path: 'view-students',
        children: [
          {
            path: '',
            loadChildren: () => import('../view-students/view-students.module').then(m => m.ViewStudentsPageModule)
          },
          {
            path: 'individual-attendance',
            loadChildren: () => import('../individual-attendance/individual-attendance.module').then(m => m.IndividualAttendancePageModule)
          }
        ]
      },
      {
        path: 'move-students',
        children: [
          {
            path: '',
            loadChildren: () => import('../move-students/move-students.module').then(m => m.MoveStudentsPageModule)
          }
        ]
      },
      {
        path: 'promote',
        children: [
          {
            path: '',
            loadChildren: () => import('../promote/promote.module').then(m => m.PromotePageModule)
          }
        ]
      },
      {
        path: 'students',
        children: [
          {
            path: '',
            loadChildren: () => import('../students/students.module').then(m => m.StudentsPageModule)
          },
          {
            path: 'add-student',
            loadChildren: () => import('../add-learner-myform/add-student/add-student.module').then(m => m.AddStudentPageModule)
          },
          {
            path: 'delete-reason',
            loadChildren: () => import('../delete-reason/delete-reason.module').then(m => m.DeleteReasonPageModule)
          }
        ]
      },
      {
        path: 'teachers',
        children: [
          {
            path: '',
            loadChildren: () => import('../teachers/teachers.module').then(m => m.TeachersPageModule)
          },
          {
            path: 'add-teacher',
            loadChildren: () => import('../add-teacher-myform/add-teacher-myform.module').then(m => m.AddTeacherMyformModule)
          }
        ]
      },
      {
        path: 'classes',
        children: [
          {
            path: '',
            loadChildren: () => import('../classes/classes.module').then(m => m.ClassesPageModule)
          },
          {
            path: 'add-class',
            loadChildren: () => import('../add-class/add-class.module').then(m => m.AddClassPageModule)
          }
        ]
      },
      {
        path: 'overall-reports',
        children: [
          {
            path: '',
            loadChildren: () => import('../overall-reports/overall-reports.module').then(m => m.OverallReportsPageModule)
          }
        ]
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'edit-password',
        children: [
          {
            path: '',
            loadChildren: () => import('../edit-password/edit-password.module').then(m => m.EditPasswordPageModule)
          }
        ]
      },
      {
        path: 'update-attendance',
        children: [
          {
            path: '',
            loadChildren: () => import('../update-attendance/update-attendance.module').then(m => m.UpdateAttendancePageModule)
          }
        ]
      },
      {
        path: 'help',
        children: [
          {
            path: '',
            loadChildren: () => import('../help/help.module').then(m => m.HelpPageModule)
          }
        ]
      },
      {
        path: 'absence-reason',
        children: [
          {
            path: '',
            loadChildren: () => import('../absence-reason/absence-reason.module').then(m => m.AbsenceReasonPageModule)
          }
        ]
      },
      {
        path: 'deactivated-learners',
        children: [
          {
            path: '',
            loadChildren: () => import('../deactivated-learners/deactivated-learners.module').then(m => m.DeactivatedLearnersModule)
          }
        ]
      },
      {
        path: 'reactivate-reason',
        children: [
          {
            path: '',
            loadChildren: () => import('../reactivate-reason/reactivate-reason.module').then(m => m.ReactivateReasonModule)
          }
        ]
      },
    ]

  },
  {
    path: '',
    redirectTo: '/attendance',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
