import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonTree } from 'src/app/services/services.models';
import { PeopleService } from 'src/app/services/people.service';
import { MatSnackBar } from '@angular/material';
import initPanZoom, { PanZoom } from 'panzoom';

@Component({
  selector: ' app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {
  isLoading: boolean;
  treeData: PersonTree;
  panZoom: PanZoom;

  @ViewChild('familyTree', { static: false }) familyTree: ElementRef;

  constructor(
    private componentElement: ElementRef,
    private matSnackBar: MatSnackBar,
    private peopleService: PeopleService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Initialize properties
    this.isLoading = true;
    // Get the person id from the route
    const personId = parseInt(this.route.snapshot.paramMap.get('id'));
    // Get the person's kinships tree
    this.peopleService.inspectPersonKinshipsTree(personId).subscribe(response => {
      if (response.ok) {
        // If nothing goes wrong, save the data
        this.treeData = response.data;
        this.isLoading = false;
        // And initialize the zoom
        this.panZoom = initPanZoom(this.componentElement.nativeElement.children[0]);

      } else {
        // Else, show the error in a snack bar
        this.matSnackBar.open(response.message);
      }
    });
  }

  decreaseZoom(): void {
    this.panZoom.zoomTo(0, 0, 0.75);
  }

  increaseZoom(): void {
    this.panZoom.zoomTo(0, 0, 1.25);
  }
}
