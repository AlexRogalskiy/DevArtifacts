.data
.cstring
	.align 2
LC0:
	.ascii "i=%d, j=%d\12\0"
.text
	.align 2
	.globl _main
_main:
LFB1:
	mflr r0
	stw r31,-4(r1)
LCFI0:
	stw r0,8(r1)
LCFI1:
	stwu r1,-80(r1)
LCFI2:
	bcl 20,31,L1$pb
L1$pb:
	mflr r31
	mr r11,r3
	lwz r9,0(r4)
	lbz r0,0(r9)
	extsb r5,r0
	cmpwi cr0,r3,2
	bne+ cr0,L2
	addi r5,r5,1
	b L3
L2:
	addi r5,r5,-1
L3:
	addis r3,r31,ha16(LC0-L1$pb)
	la r3,lo16(LC0-L1$pb)(r3)
	mr r4,r11
	bl L_printf$stub
	li r3,0
	lwz r0,88(r1)
	addi r1,r1,80
	mtlr r0
	lwz r31,-4(r1)
	blr
LFE1:
.data
.picsymbol_stub
L_printf$stub:
	.indirect_symbol _printf
	mflr r0
	bcl 20,31,L0$_printf
L0$_printf:
	mflr r11
	addis r11,r11,ha16(L_printf$lazy_ptr-L0$_printf)
	mtlr r0
	lwz r12,lo16(L_printf$lazy_ptr-L0$_printf)(r11)
	mtctr r12
	addi r11,r11,lo16(L_printf$lazy_ptr-L0$_printf)
	bctr
.data
.lazy_symbol_pointer
L_printf$lazy_ptr:
	.indirect_symbol _printf
	.long dyld_stub_binding_helper
.data
.constructor
.data
.destructor
	.align 1
