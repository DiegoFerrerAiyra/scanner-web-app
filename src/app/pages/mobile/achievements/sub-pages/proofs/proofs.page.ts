import { Component, OnInit } from "@angular/core";


import { ConfirmationService, MessageService } from "primeng/api";
import { ActivatedRoute } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { IAchievementsItem } from "@modules/mobile/achievements/models/interfaces/achievements.interfaces";
import { IProofItem } from "@modules/mobile/achievements/proofs/interfaces/proofs.interfaces";
import { ProofsApi } from "@modules/mobile/achievements/proofs/proofs.api";
import { ErrorsManager } from "@core/errors/errors.manager";
import { CProofStatus } from "@modules/mobile/achievements/proofs/constants/proofs.constants";


@Component({
  selector: "mdk-proofs",
  templateUrl: "./proofs.page.html",
  styleUrls: ["./proofs.page.scss"],
})
export class ProofsComponent implements OnInit {
  achievement_id: string = "";
  achievementsItems: IAchievementsItem[] = [];
  achievementItem: IAchievementsItem;

  proofItems: IProofItem[] = [];

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private activateRoute: ActivatedRoute,
    private proofsApi: ProofsApi,
    private errorsManager: ErrorsManager
  ) {}

  ngOnInit(): void {
    this.getAchievement();
  }

  getAchievement(): void {
    this.achievement_id = this.activateRoute.snapshot.paramMap.get("id");
    this.proofsApi.getAchievement(this.achievement_id).subscribe({
      next: (achievement) => {
        this.achievementItem = achievement;
        this.achievementsItems.push(achievement),
          this.getAchievementProofs(achievement);
      },
      error: (error: HttpErrorResponse) =>
        this.errorsManager.manageErrors(error),
    });
  }

  getAchievementProofs(achievement: IAchievementsItem): void {
    this.proofsApi.getParticipants(achievement).subscribe({
      next: (participants) => {
        this.proofItems = participants;
      },
      error: (error: HttpErrorResponse) =>
        this.errorsManager.manageErrors(error),
    });
  }

  showCancelButton(status: string): boolean {
    return status === CProofStatus.REVIEW || status === CProofStatus.SUBMITTED;
  }

  showApproveButton(status: string): boolean {
    return status === CProofStatus.REVIEW || status === CProofStatus.SUBMITTED;
  }

  showApprovedButton(status: string): boolean {
    return (
      status == CProofStatus.APPROVED || status === CProofStatus.AUTO_APPROVED
    );
  }

  showCancelledButton(status: string): boolean {
    return status === CProofStatus.DISMISSED;
  }

  showBurntButton(status: string): boolean {
    return status === CProofStatus.BURNT;
  }

  showBurnButton(status: string): boolean {
    return status === CProofStatus.PAYED;
  }

  getKeyStatus(status: string): string {
    let result = "";

    Object.entries(CProofStatus).find(([key, value]) => {
      if (value === status) {
        result = key;
      }
    });

    return result;
  }

  onClickCancel(proof: IProofItem): void {
    const header = `Confirm to discard ${proof.user_email}'s proof`;
    const message = "Are you sure that you want to proceed?";
    this.confirmationService.confirm({
      message: message,
      header: header,
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.dismissProof(proof);
      },
    });
  }

  dismissProof(proof: IProofItem): void {
    this.proofsApi.dismissProof(proof.definition_id, proof.id).subscribe({
      next: () => {
        proof.status = CProofStatus.DISMISSED;
        this.updateItem(proof);
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "Proof dismissed",
          life: 2000,
        });
      },
      error: (error: HttpErrorResponse) =>
        this.errorsManager.manageErrors(error),
    });
  }

  onClickApprove(proof: IProofItem): void {
    const header = `Confirm Approve ${proof.user_email}'s proof`;
    const message = "Are you sure that you want to proceed?";
    this.confirmationService.confirm({
      message: message,
      header: header,
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.approveProof(proof);
      },
    });
  }

  approveProof(proof: IProofItem): void {
    this.proofsApi.approveProof(proof.definition_id, proof.id).subscribe({
      next: () => {
        proof.status = CProofStatus.APPROVED;
        //this.updateItem(proof);
        this.getAchievement()
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "Proof Payed",
          life: 2000,
        });
      },
      error: (error: HttpErrorResponse) =>
        this.errorsManager.manageErrors(error),
    });
  }

  onClickBurn(proof: IProofItem): void {
    const header = `Confirm Burning ${proof.user_email}'s MBX Reward`;
    const message = "Are you sure that you want to proceed?";
    this.confirmationService.confirm({
      message: message,
      header: header,
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.burnProof(proof);
      },
    });
  }

  burnProof(proof: IProofItem): void {
    this.proofsApi.burnProof(proof.definition_id, proof.id).subscribe({
      next: () => {
        proof.status = CProofStatus.BURNT;
        this.updateItem(proof);
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "MBX Reward Burnt",
          life: 2000,
        });
      },
      error: (error: HttpErrorResponse) =>
        this.errorsManager.manageErrors(error),
    });
  }

  updateItem(proof: IProofItem) {
    const index = this.proofItems.findIndex(
      (element) => element.id === proof.id
    );
    this.proofItems[index] = proof;
  }
}
