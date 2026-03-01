import { Component } from '@angular/core';

@Component({
  selector: 'app-postman-loader',
  imports: [],
  templateUrl: './postman-loader.html',
  styleUrl: './postman-loader.css',
})
export class PostmanLoader {}
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-postman-loader',
  templateUrl: './postman-loader.component.html',
  styleUrls: ['./postman-loader.component.css']
})
export class PostmanLoaderComponent {
  @Input() isLoading:boolean = false;
}
