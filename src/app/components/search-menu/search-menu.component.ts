import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-menu',
  templateUrl: './search-menu.component.html',
  styleUrl: './search-menu.component.css'
})
export class SearchMenuComponent implements OnInit {

  constructor(
    private router: Router
  ){}
  
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
  }

  searchProducts(query : string){
    // Wahi hai bas route dena hai , aur router outlet tak accesss hona chahiye [same single screen parent mai].
    // bas yaha pai ek method ke throught routing invoke kiya.
    this.router.navigateByUrl(`/search/${query}`) ;
  }
  
}
