import { Component, Input, Output,EventEmitter } from '@angular/core';
import { CModalType } from '@shared/components/dumb/confirm-modal/models/constants/confirm-modal.constants';
import { ModalType } from '@shared/components/dumb/confirm-modal/models/types/confirm-modal.types';

@Component({
  selector: 'mdk-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {

  @Input() type:ModalType = CModalType.MESSAGE;
  @Input() title?:string;
  @Input() acceptText?:string;
  @Input() cancelText?:string;
  @Input() thirdButtonText?:string;
  @Input() showModal:boolean = false
  @Input() message!: string;
  @Input() optionsRadio!: string[];

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModalOptions: EventEmitter<string> = new EventEmitter<string>();
  @Output() thirdButtonAction: EventEmitter<boolean> = new EventEmitter<boolean>();

  //#region [---- PROPERTIES ----]

  public valueRadio: string = '';
  public otherValue:string = ''
  public showReConfirmModal:boolean = false

  //#endregion

  checkCloseModal(event:MouseEvent){
    event.preventDefault()
    const element = event.target as HTMLElement
    const idElement = element.getAttribute('id')
    if(idElement === 'modalBackground') this.modalEmit(false)
  }

  public modalEmit(event:boolean){
    this.closeModal.emit(event)
  }

  public modalOptionsEmit(event:boolean){
    this.showReConfirmModal = false
    if(!event) this.valueRadio = ''
    const valueToEmit = this.valueRadio === 'Other' ? this.otherValue : this.valueRadio
    this.closeModalOptions.emit(valueToEmit)
  }

  public handleThirdButton():void{
    this.thirdButtonAction.emit(true)
  }
}
