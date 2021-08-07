import { Component, OnInit, ViewChild } from '@angular/core';
import { StoreService } from 'src/app/services/store.service'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';

@UntilDestroy()
@Component({
  selector: 'app-food-court',
  templateUrl: './food-court.component.html',
  styleUrls: ['./food-court.component.css']
})
export class FoodCourtComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  success: boolean = false;
  duplicated: boolean = false;
  loading: boolean = false;
  failed: boolean = false;
  isUpdate: boolean = true;

  selectedStore: any;
  stores: any = [];
  deletedStore: any;

  filterValue: string = "";
  debounceTimer: any;

  constructor(private storeService: StoreService) { }

  ngOnInit(): void { }

  set FilterValue(value: string) {
    clearTimeout(this.debounceTimer)
    this.debounceTimer = setTimeout(() => {
      this.filterValue = value;
      this.getServerData(this.paginator,this.filterValue);
      this.paginator.firstPage();
    }, 500);
  }

  manage(entity: NgForm) {
    this.loading = true;
    this.success = false;
    this.duplicated = false;
    this.isUpdate ? this.update(entity) : this.create(entity);
  }

  preCreate() {
    this.resetAction();
    this.isUpdate = false;
  }
  create(entity: NgForm) {
    console.log(entity.value);
    this.storeService.create(entity.value).pipe(untilDestroyed(this)).subscribe(
      (res) => {
        this.loading = false;
        res.status === 201 ? (this.success = true) : (this.failed = true);
      },
      (err) => {
        this.loading = false;
        err.status === 409 ? (this.duplicated = true) : (this.failed = true);
      }
    )
  }

  preUpdate(item: any) {
    this.resetAction();
    this.isUpdate = true;
    this.selectedStore = item;
    console.log(this.selectedStore)
  }
  update(entity: NgForm) {
    console.log(entity.value);
    this.storeService.update(this.selectedStore._id.toString(), entity.value).pipe(untilDestroyed(this)).subscribe(
      (res) => {
        this.loading = false;
        res.status === 202 ? (this.success = true) : (this.failed = true);
      },
      (err) => {
        this.loading = false;
        err.status === 409 ? (this.duplicated = true) : (this.failed = true);
      });
  }

  preDelete(entity: any) {
    this.resetAction()
    this.deletedStore = entity
  }
  delete() {
    this.loading = true;
    this.storeService.delete(this.deletedStore._id).pipe(untilDestroyed(this)).subscribe(
      (res) => {
        this.loading = false;
        res.status === 202 ? (this.success = true) : (this.failed = true)
      },
      (err) => { this.loading = false; });

  }

  resetAction() {
    this.success = false;
    this.duplicated = false;
    this.loading = false;
    this.failed = false;
  }
  ngAfterViewInit() {
    this.getServerData(this.paginator);
  }

  getServerData(event: any, filter?: string) {
    this.storeService.readAll(event.pageIndex, event.pageSize, filter).pipe(untilDestroyed(this)).subscribe(
      (res) => { this.stores = res.body; },
      (err) => { console.log(err) });
  }

}
