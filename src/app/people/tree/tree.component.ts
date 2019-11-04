import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SimplePerson } from 'src/app/services/services.models';
import { PeopleService } from 'src/app/services/people.service';
import { OrgData } from 'angular-org-chart/src/app/modules/org-chart/orgData';

@Component({
  selector: ' app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {
  isLoading: boolean = true;
  orgData: OrgData = {
    name: "Iron Man",
    type: 'CEO',
    children: [
      {
        name: "Captain America",
        type: 'VP',
        children: [
          {
            name: "Hawkeye",
            type: 'manager',
            children: []
          },
          {
            name: "Antman",
            type: 'Manager',
            children: []
          }
        ]
      },
      {
        name: "Black Widow",
        type: 'VP',
        children: [
          {
            name: "Hulk",
            type: 'manager',
            children: [
              {
                name: "Spiderman",
                type: 'Intern',
                children: []
              }
            ]
          },
          {
            name: "Thor",
            type: 'Manager',
            children: [
              {
                name: "Loki",
                type: 'Team Lead',
                children: []
              }
            ]
          }
        ]
      }
    ]
  };
  person: SimplePerson;

  constructor(
    private peopleService: PeopleService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Get the person id from the route
    const personId = parseInt(this.route.snapshot.paramMap.get('id'));
    // Get the person and their kinships
    this.peopleService.inspectPerson(personId).subscribe(response => {
      if (response.ok) {
        this.person = response.data;
        this.isLoading = false;
      }
    });
  }
}
