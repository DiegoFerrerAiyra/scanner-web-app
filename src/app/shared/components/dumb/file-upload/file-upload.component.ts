import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DefaultTips, DefaultTipsTitle, DeriverablesFileType, FileTypes } from '@shared/components/dumb/file-upload/models/constants/file-upload.constants';
import { ICategory, IEmitFile, IEmitLink } from '@shared/components/dumb/file-upload/models/interfaces/file-upload.interfaces';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'mdk-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  @ViewChild('fileUpload')  fileUpload!: FileUpload;

  @Input() fileType!: typeof FileTypes[keyof typeof FileTypes];
  @Input() enabledSelectFileType:boolean = false;
  @Input() enabledDescription:boolean = false;
  @Input() uploadingResource!: boolean;
  @Input() showTips!: boolean;
  @Input() messageUploadingResource!: string;
  @Input() hasBorder:boolean = false;
  @Input() showDeleteButton:boolean = false;
  @Input() backgroundWhite:boolean = false

  // Properties for each description
  @Input() videoTipsTitle!: string;
  @Input() videoTipsMessages!: string[];
  @Input() multiple:boolean = false;
  @Input() maxFileInput!: number;
  @Input() chooseLabel:string = 'Upload';

  @Output() outputFile: EventEmitter<IEmitFile>=new EventEmitter
  @Output() outputFileEmpty : EventEmitter<void>=new EventEmitter
  @Output() removeResource : EventEmitter<void>=new EventEmitter
  @Output() outputDescription : EventEmitter<string>=new EventEmitter
  @Output() outputLink : EventEmitter<IEmitLink>=new EventEmitter

  uploadedFiles: any[] = [];
  description!: string;
  link!: string;
  isLinkValid:boolean = true;
  selectedTips!: string[];
  tipsTitle!: string;

  // Dropdown
  categories: ICategory[] = [
    {
      name: DeriverablesFileType.VIDEO
    },
    {
      name: DeriverablesFileType.IMAGE
    },
    {
      name: DeriverablesFileType.PDF
    },
    {
      name: DeriverablesFileType.LINK
    },
  ]

  @Input() selectedCategory!: ICategory

  ngOnInit(): void {
    if(!this.fileType) {
      this.fileType = FileTypes['VIDEO']
      this.selectedCategory = this.categories[0]
      this.selectedTips = this.videoTipsMessages ?? DefaultTips[this.selectedCategory.name.toUpperCase()]
      this.tipsTitle = this.videoTipsTitle ?? DefaultTipsTitle
    }

    this.loadUploadingMessage()
  }

  onUpload(event:any): void {

    if (event.currentFiles?.length > 0) {
      this.uploadedFiles = [...this.uploadedFiles, event.currentFiles]
    }

    if (this.uploadedFiles[0]?.length == 1) {
      const data:IEmitFile = {
        description:this.description,
        file:this.uploadedFiles[0][0]
      }
      this.outputFile.emit(data) 
    }
    
  }

  removeResourceThisComponent(): void {
    // Needs the timeout because otherwise it wont clear uploadedFiles
    this.fileUpload.clear()
    this.uploadedFiles = []
    this.outputFileEmpty.emit()
  }

  // Remove resource from the parent component
  removeResourceForParent():void{
    this.removeResource.emit()
  }

  // onChange of file-type dropdown
  changeFileType():void{
    this.fileType = FileTypes[this.selectedCategory.name.toUpperCase()]
    this.messageUploadingResource = 'Please wait while the' + this.selectedCategory.name + 'uploads'
    this.selectedTips = this.videoTipsMessages ?? DefaultTips[this.selectedCategory.name.toUpperCase()]
    this.removeResourceThisComponent()
  }

  // URL validator
  validateLink():void{
    try {
      this.isLinkValid = Boolean(new URL(this.link));
    }
    catch(e){
      this.isLinkValid = false
    }

  }

  // Send description to parent when it changes (Only if it has a uploaded file)
  emitDescription():void{
    // Path for all categories except for link
    if (this.selectedCategory.name !== DeriverablesFileType.LINK ){
      // Check if either it has files uploaded
      if (this.uploadedFiles.length){
        this.outputDescription.emit(this.description) 
      }
    }
    // Path if link category is selected
    else{
      let emitLink: IEmitLink
      // Validate link
      this.validateLink()
      // Check if either description or link are not empty
      if (this.description?.length && this.link?.length && this.isLinkValid){
        emitLink = {
          description: this.description,
          link: this.link.trim()
        }
      }else{
        emitLink = {
          description: '',
          link: ''
        }
      }
      this.outputLink.emit(emitLink) 

    }

  }

  loadUploadingMessage():void {
    if(!this.messageUploadingResource){
      this.messageUploadingResource = 'Please wait while the' + this.selectedCategory.name + 'uploads'
    }
  }
}
