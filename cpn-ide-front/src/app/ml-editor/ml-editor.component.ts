import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs/Subscription";
import { Message } from "../common/message";
import { EventService } from "../services/event.service";
import { ModelService } from "../services/model.service";
import { AccessCpnService } from "../services/access-cpn.service";
import { declarationOverview } from "./declaration-overview";

// Modified 2026-10-28: combined read-only declarations view.
@Component({
  selector: "app-ml-editor",
  templateUrl: "./ml-editor.component.html",
  styleUrls: ["./ml-editor.component.scss"],
})
export class MlEditorComponent implements OnInit, OnDestroy {
  @Input() project: Object;
  textValue = "";
  allCode = "";
  showAll = true;
  cpnParentElement = {};
  cpnElement = {};
  cpnType;
  private subscriptions: Subscription[] = [];

  constructor(
    private eventService: EventService,
    private modelService: ModelService,
    public accessCpnService: AccessCpnService
  ) {}

  ngOnInit() {
    this.subscriptions.push(this.eventService.on(Message.TREE_SELECT_DECLARATION_NODE_NEW,
      event => this.onSelectDeclarationNode(event)));
    [Message.PROJECT_LOAD, Message.MODEL_RELOAD, Message.MODEL_CHANGED, Message.DECLARATION_CHANGED]
      .forEach(message => this.subscriptions.push(this.eventService.on(message, () => {
        if (message === Message.PROJECT_LOAD || message === Message.MODEL_RELOAD) {
          this.cpnType = undefined;
          this.textValue = "";
        }
        if (this.showAll) this.refreshAll();
      })));
    this.refreshAll();
  }

  ngOnDestroy() { this.subscriptions.forEach(subscription => subscription.unsubscribe()); }

  refreshAll() {
    const cpn = this.modelService.getCpn();
    this.allCode = declarationOverview(cpn && cpn.globbox,
      (type, node) => this.modelService.cpnDeclarationToString(type, node));
  }

  openAll() { this.refreshAll(); this.showAll = true; }
  openSelected() { if (this.cpnType) this.showAll = false; }
  getText() { return this.modelService.cpnDeclarationToString(this.cpnType, this.cpnElement); }

  onSelectDeclarationNode(event) {
    if (event && event.cpnElement && event.cpnType) {
      this.cpnParentElement = event.cpnParentElement;
      this.cpnElement = event.cpnElement;
      this.cpnType = event.cpnType;
      this.textValue = this.getText();
      this.showAll = false;
    }
  }

  saveEditedData(event) {
    if (this.showAll || !this.cpnType || this.accessCpnService.isSimulation) return;
    const layout = event.target && event.target.textContent;
    if (layout && layout !== this.getText()) {
      this.modelService.updateDeclaration(this.cpnElement, this.cpnType, this.cpnParentElement, layout);
      this.textValue = this.getText();
    }
  }
}
