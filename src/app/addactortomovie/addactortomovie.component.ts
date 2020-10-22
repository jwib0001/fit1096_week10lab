import { Component, OnInit } from '@angular/core';
import { DatabaseService } from "../database.service";
import { Router } from "@angular/router";
@Component({
  selector: 'app-addactortomovie',
  templateUrl: './addactortomovie.component.html',
  styleUrls: ['./addactortomovie.component.css']
})
export class AddactortomovieComponent implements OnInit {
  fullName:string="";
  bYear:number=0;
  actorId:string="";

  title:string="";
  year:number=0;
  movieId:string="";

  selectedActor=null;
  selectedMovie=null;

  constructor(private dbService: DatabaseService, private router: Router) { }

  actorsDB:any[]=[];
  moviesDB:any[]=[];
  ngOnInit(): void {
    this.onGetActors();
    this.onGetMovies();
  }

  onGetActors() {
    return this.dbService.getActors().subscribe((data: any[]) => {
      this.actorsDB = data;
    });
  }

   //Get all Movies
   onGetMovies() {
    return this.dbService.getMovies().subscribe((data: any[]) => {
      this.moviesDB = data;
    });
  }

  onSelectActor(item) {
    this.actorId = item._id;
    this.fullName = item.name;
    this.selectedActor=item;
  }
  onSelectMovie(item) {
    this.movieId = item._id;
    this.title = item.title;
    this.selectedMovie=item;
  }

  onAddActor2Movie() {
    this.dbService.addActor(this.movieId, {id:this.actorId}).subscribe(result => {
      this.onGetMovies();
      this.onGetActors();
    });
  }
}
