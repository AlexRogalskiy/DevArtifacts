-- Synt.y -*- mode: haskell -*-
{
module Synt where
import Lex 
}

%name synt
%tokentype { Token }
%monad { Either String } { (>>=) } { return }

%token
	int				{ TInt $$ }
	ident 				{ TIdent $$ }
	'+'				{ TPlus }
	'-'				{ TMinus }
	'*'				{ TMul }
	'/'				{ TDiv }
	'%'				{ TMod }
	'||'				{ TLogOr }
	'^^'				{ TLogXor }
	'&&'				{ TLogAnd }
	'|'				{ TBinOr }
	'&'				{ TBinAnd }
	'^'				{ TBinXor }
	'=='				{ TEq }
	'<>'				{ TNe }
	'<'				{ TLt }
	'<='				{ TLe }
	'>'				{ TGt }
	'>='				{ TGe }
	'<<'				{ TShl }
	'>>'				{ TShr }
	'<<<'				{ TRol }
	'>>>'				{ TRor }
	'!'				{ TLogNot }
	'~'				{ TBinNot }
	'='				{ TModifSet }
	'++'				{ TModifInc }
	'--'				{ TModifDec }
	'+='				{ TModifPlus }
	'-='				{ TModifMinus }
	'*='				{ TModifMul }
	'/='				{ TModifDiv }
	'&='				{ TModifBinAnd }
	'|='				{ TModifBinOr }
	'^='				{ TModifBinXor }
	'%='				{ TModifMod }
	'<<='				{ TModifShl }
	'>>='				{ TModifShr }
	'<<<='				{ TModifRol }
	'>>>='				{ TModifRor }
	'&&='				{ TModifLogAnd }
	'||='				{ TModifLogOr }
	'^^='				{ TModifLogXor }
	'?'				{ TQuestion }
	':'				{ TColon }
	';' 				{ TSemiColon }
	'('				{ TLeftParen }
	')' 				{ TRightParen }
	'EOF'				{ TEOF }

%right '=' '<<=' '>>=' '<<<=' '>>>=' '+=' '-=' '*=' '/=' '%=' '&=' '|=' '^=' '&&=' '||=' '^^='
%right '?' ':'
%left '||'
%left '^^'
%left '&&'
%left '|'
%left '^'
%left '&'
%left '==' '<>'
%left '<' '<=' '>' '>='
%left '>>' '<<' '<<<' '>>>'
%left '+' '-'
%left '*' '/' '%'
%right '!' '~'
%right NEG
%%

Program:
	ExprList			{ Program $1 }

ExprList:
	Expr ';' ExprList		{ ExprList $1 $3 }
	| 'EOF'				{ ExprEnd }

Expr:
	ident '=' RVal			{ Expr $1 $3 }
	| ident '+=' RVal		{ Expr $1 (BinOp Add (IdentVal $1) $3) }
	| ident '-=' RVal		{ Expr $1 (BinOp Sub (IdentVal $1) $3) }
	| ident '*=' RVal		{ Expr $1 (BinOp Mul (IdentVal $1) $3) }
	| ident '/=' RVal		{ Expr $1 (BinOp Div (IdentVal $1) $3) }
	| ident '%=' RVal		{ Expr $1 (BinOp Mod (IdentVal $1) $3) }
	| ident '<<=' RVal		{ Expr $1 (BinOp Shl (IdentVal $1) $3) }
	| ident '<<<=' RVal		{ Expr $1 (BinOp Rol (IdentVal $1) $3) }
	| ident '>>=' RVal		{ Expr $1 (BinOp Shl (IdentVal $1) (UnOp Neg $3)) }
	| ident '>>>=' RVal		{ Expr $1 (BinOp Rol (IdentVal $1) (UnOp Neg $3)) }
	| ident '&=' RVal		{ Expr $1 (BinOp BinAnd (IdentVal $1) $3) }
	| ident '|=' RVal		{ Expr $1 (BinOp BinOr (IdentVal $1) $3) }
	| ident '^=' RVal		{ Expr $1 (BinOp BinXor (IdentVal $1) $3) }
	| ident '&&=' RVal		{ Expr $1 (BinOp LogAnd (IdentVal $1) $3) }
	| ident '||=' RVal		{ Expr $1 (BinOp LogOr (IdentVal $1) $3) }
	| ident '^^=' RVal		{ Expr $1 (BinOp LogXor (IdentVal $1) $3) }
	| ident '++'			{ Expr $1 (BinOp Add (IdentVal $1) (IntVal 1)) }
	| '++' ident			{ Expr $2 (BinOp Add (IdentVal $2) (IntVal 1)) }
	| ident '--'			{ Expr $1 (BinOp Sub (IdentVal $1) (IntVal 1)) }
	| '--' ident			{ Expr $2 (BinOp Sub (IdentVal $2) (IntVal 1)) }

RVal:
	RVal '+' RVal			{ BinOp Add $1 $3 }
	| RVal '-' RVal			{ BinOp Sub $1 $3 }
	| RVal '*' RVal			{ BinOp Mul $1 $3 }
	| RVal '/' RVal			{ BinOp Div $1 $3 }
	| RVal '%' RVal			{ BinOp Mod $1 $3 }
	| RVal '&&' RVal		{ BinOp LogAnd $1 $3 }
	| RVal '||' RVal		{ BinOp LogOr $1 $3 }
	| RVal '^^' RVal		{ BinOp LogXor $1 $3 }
	| RVal '&' RVal			{ BinOp BinAnd $1 $3 }
	| RVal '|' RVal			{ BinOp BinOr $1 $3 }
	| RVal '^' RVal			{ BinOp BinXor $1 $3 }
	| RVal '==' RVal		{ BinOp Eq $1 $3 }
	| RVal '<>' RVal		{ UnOp LogNot (BinOp Eq $1 $3) }
	| RVal '<' RVal			{ BinOp Lt $1 $3 }
	| RVal '<=' RVal		{ BinOp Le $1 $3 }
	| RVal '>' RVal			{ UnOp LogNot (BinOp Le $1 $3) }
	| RVal '>=' RVal		{ UnOp LogNot (BinOp Lt $1 $3) }
	| RVal '<<' RVal		{ BinOp Shl $1 $3 }
	| RVal '<<<' RVal		{ BinOp Rol $1 $3 }
	| RVal '>>' RVal		{ BinOp Shl $1 (UnOp Neg $3) }
	| RVal '>>>' RVal		{ BinOp Rol $1 (UnOp Neg $3) }
	| '!' RVal			{ UnOp LogNot $2 }
	| '~' RVal			{ UnOp BinNot $2 }
	| '-' RVal %prec NEG		{ UnOp Neg $2 }
	| RVal '?' RVal ':' RVal	{ IfElse $1 $3 $5 }
	| '(' RVal ')'			{ $2 }
	| int				{ IntVal $1 }
	| ident				{ IdentVal $1 }
	
{

happyError _ = Left "syntax error"

data Program =	Program ExprList
		deriving (Show, Eq)

data ExprList =	ExprList Expr ExprList | ExprEnd
		deriving (Show, Eq)

data Expr =	Expr String RVal
		deriving (Show, Eq)

data BinOpType=	Add | Sub | Mul | Div | Mod | LogOr | LogXor | LogAnd | BinAnd | BinOr | BinXor
		| Eq | Lt | Le | Shl | Rol
		deriving (Show, Eq)

data UnOpType =	LogNot | BinNot | Neg
		deriving (Show, Eq)

data RVal = 	IntVal Int | IdentVal String 
		| BinOp BinOpType RVal RVal | UnOp UnOpType RVal | IfElse RVal RVal RVal
		deriving (Show, Eq)
}
