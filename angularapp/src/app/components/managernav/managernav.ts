import { Component } from '@angular/core';

@Component({
  selector: 'app-managernav',
  imports: [],
  templateUrl: './managernav.html',
  styleUrl: './managernav.css',
})
export class Managernav {}
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-managernav',
  templateUrl: './managernav.component.html',
  styleUrls: ['./managernav.component.css']
})
export class ManagernavComponent {
  userRole = localStorage.getItem('userRole');
  username = localStorage.getItem('username');
  constructor(private auth: AuthService, private router: Router) { }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  isReqActive(): boolean {
    const url = this.router.url;
    return url.includes('/add-requirement') || url.includes('/view-requirements');
  }
}