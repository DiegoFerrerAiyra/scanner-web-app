import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { IRoleAssociationForm } from '@pages/manage-roles/models/interfaces/manage-roles.interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { emailValidator } from '@shared/utils/forms.validators';
import { Table } from 'primeng/table';
import { ROLES_AVAILABLE } from '@core/roles/models/constants/roles.constants';
import { Roles } from '@core/roles/models/types/roles.types';
import { RolesService } from '@core/roles/roles.service';

@Component({
  selector: 'mdk-manage-roles',
  standalone: true,
  imports: [CommonModule,SharedModule],
  templateUrl: './manage-roles.page.html',
  styleUrls: ['./styles/manage-roles.page.scss'],
  providers:[RolesService]
})
export class ManageRolesComponent implements OnInit {

  //#region [---- DEPENDENCIES ----]

  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly rolesService: RolesService = inject(RolesService);

  //#endregion

  //#region [---- PROPERTIES ----]

  public roleAssociationForm: FormGroup<IRoleAssociationForm>;

  public activeModal:boolean = false
  public isEdition: boolean = false;
  public isDelete:boolean = false;
  public roleAssociations$!: Observable<any[]>;
  public TECH_DEVELOPER_ROL:Roles = ROLES_AVAILABLE.TECH_DEVELOPER

  @ViewChild("rolesAssociationTable") rolesAssociationTable: Table;

  //#endregion

  //#region [---- LIFE CYCLES ----]

  ngOnInit(): void {
    this.createRoleAssociationForm()
    this.getRoleAssociations()
  }

  //#endregion

  //#region [---- FORM LOGIC ----]

  private createRoleAssociationForm(): void {
    this.roleAssociationForm = this.fb.group({
      id: this.fb.control(""),
      rolKey: this.fb.control("", Validators.compose([Validators.required])),
      modakGroup: this.fb.control("", Validators.compose([Validators.required,emailValidator()])),
    });
  }

  private resetRoleAssociationForm():void{
    this.roleAssociationForm.get('id').setValue('')
    this.roleAssociationForm.get('rolKey').setValue('')
    this.roleAssociationForm.get('modakGroup').setValue('')
  }

  public onInputChange(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.rolesAssociationTable.filterGlobal(inputValue, 'contains')
  }

  //#endregion

  //#region [---- MODAL LOGIC ----]

  public createRoleAssociationModal(){
    this.resetRoleAssociationForm()
    this.isDelete = false
    this.isEdition = false
    this.activeModal = true;
  }

  public editRoleAssociationModal(item){
    this.roleAssociationForm.get('id').setValue(item.id)
    this.roleAssociationForm.get('rolKey').setValue(item.rolKey)
    this.roleAssociationForm.get('modakGroup').setValue(item.modakGroup)
    this.isDelete = false
    this.isEdition = true;
    this.activeModal = true;
  }

  public deleteRoleAssociationModal(item){
    this.roleAssociationForm.get('id').setValue(item.id)
    this.roleAssociationForm.get('rolKey').setValue(item.rolKey)
    this.roleAssociationForm.get('modakGroup').setValue(item.modakGroup)
    this.isDelete = true
    this.activeModal = true;
  }

  public hideDialog() {
    this.resetRoleAssociationForm()
    this.isEdition = false;
    this.activeModal = false;
  }

  public save() {
    if(this.isDelete) this.deleteRoleAssociation()
    this.isEdition ? this.editRoleAssociation() : this.createRoleAssociation();
    this.hideDialog();
  }

  //#endregion

  //#region [---- API LOGICS ----]

  private getRoleAssociations():void {
    const data = [
      {
        id: 'safasfa',
        rolKey:'MODAK_TECH',
        modakGroup: 'tech@modak.live'
      },
      {
        id: 'safasfa',
        rolKey:'ALL_TEAM',
        modakGroup: 'team@modak.live'
      }
    ]

    this.roleAssociations$ = of(data);

  }


  private createRoleAssociation():void {
    if(this.rolesService.validateIfHasAvailableRole([ROLES_AVAILABLE.TECH_DEVELOPER,ROLES_AVAILABLE.ROLES_ADMIN])){
      console.log('CREATE',this.roleAssociationForm.value);
    }
  }

  private editRoleAssociation():void {
    if(this.rolesService.validateIfHasAvailableRole([ROLES_AVAILABLE.ROLES_ADMIN])){
      console.log('CREATE',this.roleAssociationForm.value);
    }
  }

  private deleteRoleAssociation():void {
    if(this.rolesService.validateIfHasAvailableRole([ROLES_AVAILABLE.ROLES_ADMIN])){
      console.log('CREATE',this.roleAssociationForm.value);
    }
  }

  //#endregion





}
