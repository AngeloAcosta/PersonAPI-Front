import { CreateComponent as PersonCreateComponent } from './../create/create.component';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonTree, SimpleKinshipType } from 'src/app/services/services.models';
import { PeopleService } from 'src/app/services/people.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import initPanZoom, { PanZoom } from 'panzoom';
import { StorageService } from 'src/app/services/storage.service';
import Swal from 'sweetalert2';
import { CreateComponent as KinshipCreateComponent } from 'src/app/kinships/create/create.component';

@Component({
  selector: ' app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {
  private readonly MAX_ZOOM: number = 2.0;
  private readonly MIN_ZOOM: number = 0.5;
  private readonly ZOOM_DECREASE: number = 0.75;
  private readonly ZOOM_INCREASE: number = 1.25;

  private personId: number;
  private panZoom: PanZoom;

  isLoading: boolean;
  treeData: PersonTree;

  @ViewChild('familyTree', { static: false }) familyTree: ElementRef;

  constructor(
    private componentElement: ElementRef,
    private matDialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private peopleService: PeopleService,
    private route: ActivatedRoute,
    private storageService: StorageService
  ) { }

  private doKinshipCreation(kinshipType: SimpleKinshipType): void {
    // Open kinship create component in a dialog
    const kinshipCreateDialog = this.matDialog.open(KinshipCreateComponent, {
      data: { ownerId: this.treeData.owner.id, kinshipType }
    });
    // Refresh the tree when the dialog is closed
    kinshipCreateDialog.beforeClosed().subscribe(_ => {
      this.refreshTree();
    });
  }

  private doPersonAndKinshipCreation(kinshipType: SimpleKinshipType): void {
    // Open person create component in a dialog
    const personCreateDialog = this.matDialog.open(PersonCreateComponent);
    // Analize the dialog closing event
    personCreateDialog.beforeClosed().subscribe(_ => {
      // If a new person was created, then we can recover their id from the storage service
      const newPersonId = this.storageService.getValue<number>(PersonCreateComponent.NEW_PERSON_ID_STORAGE_KEY);
      // If such id exists...
      if (newPersonId) {
        // Erase it
        this.storageService.deleteValue(PersonCreateComponent.NEW_PERSON_ID_STORAGE_KEY);
        // Open kinship create component in a dialog
        const kinshipCreateDialog = this.matDialog.open(KinshipCreateComponent, {
          data: { ownerId: this.treeData.owner.id, kinshipType, relativeId: newPersonId }
        });
        // Refresh the tree when the dialog is closed
        kinshipCreateDialog.beforeClosed().subscribe(_ => {
          this.refreshTree();
        });
      }
    });
  }

  private refreshTree(): void {
    // Get the person's kinships tree
    this.peopleService.inspectPersonKinshipsTree(this.personId).subscribe(response => {
      if (response.ok) {
        // If nothing goes wrong, save the data
        this.treeData = response.data;
        this.isLoading = false;
        // Initialize and configure the zoom if it isn't done yet
        if (!this.panZoom) {
          const zoomConfiguration = { bounds: true, maxZoom: this.MAX_ZOOM, minZoom: this.MIN_ZOOM };
          this.panZoom = initPanZoom(this.componentElement.nativeElement.children[0], zoomConfiguration);
        }
      } else {
        // Else, show the error in a snack bar
        this.matSnackBar.open(response.message);
      }
    });
  }

  ngOnInit(): void {
    // Initialize properties
    this.isLoading = true;
    // Get the person id from the route
    this.personId = parseInt(this.route.snapshot.paramMap.get('id'));
    // Perform initial refresh of the tree
    this.refreshTree();
  }

  decreaseZoom(): void {
    this.panZoom.zoomTo(0, 0, this.ZOOM_DECREASE);
  }

  increaseZoom(): void {
    this.panZoom.zoomTo(0, 0, this.ZOOM_INCREASE);
  }

  promptAdd(kinshipType: SimpleKinshipType): void {
    Swal
      .fire({
        title: `New ${kinshipType.name.toLowerCase()}`,
        text: `Would you like to select an existing person to be the new ${kinshipType.name.toLowerCase()}?`,
        confirmButtonText: 'Yes, please',
        cancelButtonText: 'No, I want to create a new person',
        showCloseButton: true,
        showCancelButton: true
      })
      .then(result => {
        if (result.value) {
          this.doKinshipCreation(kinshipType);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.doPersonAndKinshipCreation(kinshipType);
        }
      });
  }
}
