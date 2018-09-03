import { Component, ViewChild, ViewEncapsulation, Input ,Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ITicketEntity, TicketStorage, UserInfo } from './ticket-storage.component';

@Component({
    selector: 'shopping-cart-dialog',
    template:
	`
		<modal #shoppingCart1>
			<modal-header>
				<h4 class="modal-title">I'm a modal!</h4>
			</modal-header>
			<modal-body>
				<div class="form-group">
					<label for="textbox">I'm a textbox!</label>
					<input autofocus type="text" class="form-control" id="textbox" />
				</div>        
			</modal-body>
			<modal-footer [show-default-buttons]="true"></modal-footer>
		</modal>
		
		<modal #shoppingCart2 [animation]="animation" [keyboard]="keyboard" [backdrop]="backdrop" (onClose)="closed()" (onDismiss)="dismissed()"
			(onOpen)="opened()" [cssClass]="cssClass" #modal>
			<modal-header [show-close]="true">
				<h4 class="modal-title">I'm a modal!</h4>
			</modal-header>
			<modal-body>
				<ul>
					<li *ngFor="let item of items">
						<a href="#" (click)="$event.preventDefault(); selected = item">{{ item }}</a>
					</li>
				</ul>
				<p *ngIf="selected">Selected: <b>{{ selected }}</b></p>
			</modal-body>
			<modal-footer [show-default-buttons]="true"></modal-footer>
		</modal>

		<modal #shoppingCart3 [animation]="animation" [keyboard]="keyboard" [backdrop]="backdrop" (onClose)="navigate()" (onOpen)="opened()" [cssClass]="cssClass" #navigateModal>
			<modal-header [show-close]="true">
				<h4 class="modal-title">I'm a modal!</h4>
			</modal-header>
			<modal-body>
				<p>I will navigate to another route when you close the modal.</p>
			</modal-body>
			<modal-footer>
				<button type="button" class="btn btn-default" data-dismiss="modal" (click)="navigateModal.dismiss()">Закрыть</button>
				<button type="button" class="btn btn-primary" autofocus (click)="navigateModal.close()">Применить</button>
			</modal-footer>
		</modal>

		<modal #shoppingCart4 style="z-index: 1049" [animation]="animation" [keyboard]="keyboard" [backdrop]="backdrop" (onClose)="closed()" (onDismiss)="dismissed()"
			(onOpen)="opened()" [cssClass]="cssClass" #parentModal>
			<modal-header [show-close]="true">
				<h4 class="modal-title">I'm a modal!</h4>
			</modal-header>
			<modal-body>
				<p><strong>Note:</strong> My <code>z-index</code> is set to <code>1049</code>.</p>
				<button type="button" class="btn btn-default" (click)="modal.open()">Open another modal</button>
			</modal-body>
			<modal-footer>
				<button type="button" class="btn btn-default" data-dismiss="modal" (click)="parentModal.dismiss()">Отменить</button>
				<button type="button" class="btn btn-primary" (click)="parentModal.close()">Сохранить</button>
			</modal-footer>
		</modal>

		<modal #shoppingCart [animation]="animation" [keyboard]="keyboard" [backdrop]="backdrop" (onClose)="closed()" (onDismiss)="dismissed()" (onOpen)="opened()" [cssClass]="cssClass" #validationModal>
			<form #modalForm="ngForm" novalidate>
				<modal-header [show-close]="true">
					<h4 class="modal-title">{{ dialogTitle}}</h4>
				</modal-header>
				<modal-body>
					<div class="form-group">
						<label for="firstName">{{ firstName }}</label>
						<input type="text" class="form-control" autofocus required [(ngModel)]="model.firstName" name="firstName" id="firstName">
					</div>
					<div class="form-group">
						<label for="lastName">{{ lastName }}</label>
						<input type="text" class="form-control" required [(ngModel)]="model.lastName" name="lastName" id="lastName">
					</div>
					<shopping-cart [items]="items"></shopping-cart>
				</modal-body>
				<modal-footer>
					<button type="button" class="btn btn-default" data-dismiss="modal" (click)="clearShoppingCart($event); validationModal.close();">Очистить</button>
					<button type="button" class="btn btn-default" data-dismiss="modal" (click)="saveShoppingCart($event); validationModal.close();"><span class="glyphicon glyphicon-shopping-cart"></span> Сохранить</button>
					<button type="button" class="btn btn-success" [disabled]="!modalForm.valid" (click)="buyShoppingCart($event)">Оплатить <span class="glyphicon glyphicon-play"></span></button>
				</modal-footer>
			</form>
		</modal>
	`,
    styles:
	[
        `modal .ng-valid[required] {
            border-left: 5px solid #5cb85c; /* green */
        }`,
        `modal .ng-invalid:not(.ng-untouched):not(form) {
            border-left: 5px solid #d9534f; /* red */
        }`,
        `modal .red-text {
            color: #d9534f !important; /* red */
        }`
    ],
    encapsulation: ViewEncapsulation.None
})
export class ShoppingCartDialog {
    @ViewChild('shoppingCart') modal: ModalComponent;
	@Input('items') items: Array<ITicketEntity> = [];
	
    //private items: string[] = ['item1', 'item2', 'item3'];
    private selected: string;
    private output: string;
    private model: UserInfo = new UserInfo();
	
	private dialogTitle: string = "Корзина";
	private firstName: string = "Имя";
	private lastName: string = "Фамилия";

    private index: number = 0;
    private backdropOptions = [true, false, 'static'];
    private cssClass: string = '';

    private animation: boolean = true;
    private keyboard: boolean = true;
    private backdrop: string | boolean = true;
    private css: boolean = false;

    constructor(@Inject(TicketStorage) private ticketStore, private router: Router) {}

    public closed() : void {
        this.output = '(closed) ' + this.selected;
    }

    public dismissed() : void {
        this.output = '(dismissed)';
    }

    public opened() : void {
        this.output = '(opened)';
    }

    public navigate() : void {
        this.router.navigateByUrl('/hello');
    }

    public open() : void {
        this.modal.open();
    }
	
	//public cancelShoppingCart(event) : void {
	//	this.ticketStore.saveItems(this.items, this.model);
	//	//event.stopPropagation();
	//}
	
	public saveShoppingCart(event) : void {
		this.items = this.ticketStore.getAllTickets();
		this.ticketStore.saveItems(this.items, this.model);
		//event.stopPropagation();
	}
	
	public clearShoppingCart(event) : void {
		this.ticketStore.clearItems();
		event.stopPropagation();
	}
	
	public buyShoppingCart(event) : void {
		event.stopPropagation();
	}
}

/*export class DialogComponent {
    private close: EventEmitter = new EventEmitter();

    public onClickedExit() : void {
        this.close.emit('event');
    }
}*/