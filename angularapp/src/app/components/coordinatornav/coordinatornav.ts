import { Component } from '@angular/core';

@Component({
  selector: 'app-coordinatornav',
  imports: [],
  templateUrl: './coordinatornav.html',
  styleUrl: './coordinatornav.css',
})
export class Coordinatornav {}
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-coordinatornav',
  templateUrl: './coordinatornav.component.html',
  styleUrls: ['./coordinatornav.component.css']
})
export class CoordinatornavComponent {
  userRole = localStorage.getItem('userRole');
  username=localStorage.getItem('username')
  constructor(private auth: AuthService, private router: Router) { }
  
  logout() {
    this.auth.logout();
    this.router.navigateByUrl('login');
  }

  isTrainersActive(): boolean {
    const url = this.router.url;
    return url.includes('/add-trainer') || url.includes('/view-trainers');
  }
}