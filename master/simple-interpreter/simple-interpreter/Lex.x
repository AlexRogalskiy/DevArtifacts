-- Lex.x -*- mode: haskell -*-
{
module Lex where
import Numeric
}

%wrapper "monad"

$alpha = [a-zA-Z]
$digit = [0-9]
$hex = [0-9a-fA-F]
$bin = [0-1]

tokens :-
  $white+				;
  $digit+				{ \(p,_,_,s) len -> return $ TInt (read $ take len s) }
  ("0x" $hex+) 				{ \(p,_,_,s) len -> return $ TInt (fst.head.readHex.(\(_:_:xs) -> xs) $ take len s) }
  ("0b" $bin+)				{ \(p,_,_,s) len -> return $ TInt (foldl (\n c -> if c == '1' then n*2+1 else n*2) 0 $ (\(_:_:xs) -> xs) $ take len s) }

  [$alpha] [$alpha $digit]*		{ \(p,_,_,s) len -> return $ TIdent $ take len s }

  "+"					{ \(p,_,_,s) len -> return $ TPlus }
  "-"					{ \(p,_,_,s) len -> return $ TMinus }
  "*"					{ \(p,_,_,s) len -> return $ TMul }
  "/"					{ \(p,_,_,s) len -> return $ TDiv }
  "%"					{ \(p,_,_,s) len -> return $ TMod }
  "|"					{ \(p,_,_,s) len -> return $ TBinOr }
  "&"					{ \(p,_,_,s) len -> return $ TBinAnd }
  "^"					{ \(p,_,_,s) len -> return $ TBinXor }
  "~"					{ \(p,_,_,s) len -> return $ TBinNot }
  "!"					{ \(p,_,_,s) len -> return $ TLogNot }
  "&&"					{ \(p,_,_,s) len -> return $ TLogAnd }
  "||"					{ \(p,_,_,s) len -> return $ TLogOr }
  "^^"					{ \(p,_,_,s) len -> return $ TLogXor }
  "<<"					{ \(p,_,_,s) len -> return $ TShl }
  ">>"					{ \(p,_,_,s) len -> return $ TShr }
  "<<<"					{ \(p,_,_,s) len -> return $ TRol }
  ">>>"					{ \(p,_,_,s) len -> return $ TRor }

  "<"					{ \(p,_,_,s) len -> return $ TLt }
  ">"					{ \(p,_,_,s) len -> return $ TGt }
  "<="                                  { \(p,_,_,s) len -> return $ TLe }
  ">="                                  { \(p,_,_,s) len -> return $ TGe }
  "=="                                  { \(p,_,_,s) len -> return $ TEq }
  "!="                                  { \(p,_,_,s) len -> return $ TNe }

  "="					{ \(p,_,_,s) len -> return $ TModifSet }
  "++"					{ \(p,_,_,s) len -> return $ TModifInc }
  "--"					{ \(p,_,_,s) len -> return $ TModifDec }
  "+="					{ \(p,_,_,s) len -> return $ TModifPlus }
  "-="					{ \(p,_,_,s) len -> return $ TModifMinus }
  "*="					{ \(p,_,_,s) len -> return $ TModifMul }
  "/="					{ \(p,_,_,s) len -> return $ TModifDiv }
  "%="					{ \(p,_,_,s) len -> return $ TModifMod }
  "|="					{ \(p,_,_,s) len -> return $ TModifBinOr }
  "&="					{ \(p,_,_,s) len -> return $ TModifBinAnd }
  "^="					{ \(p,_,_,s) len -> return $ TModifBinXor }
  ">>="					{ \(p,_,_,s) len -> return $ TModifShr }
  "<<="					{ \(p,_,_,s) len -> return $ TModifShl }
  ">>>="				{ \(p,_,_,s) len -> return $ TModifRor }
  "<<<="				{ \(p,_,_,s) len -> return $ TModifRol }
  "&&="					{ \(p,_,_,s) len -> return $ TModifLogAnd }
  "||="					{ \(p,_,_,s) len -> return $ TModifLogOr }
  "^^="					{ \(p,_,_,s) len -> return $ TModifLogXor }

  "?"					{ \(p,_,_,s) len -> return $ TQuestion }
  ":"					{ \(p,_,_,s) len -> return $ TColon }
  ";" 					{ \(p,_,_,s) len -> return $ TSemiColon }
  "("					{ \(p,_,_,s) len -> return $ TLeftParen }
  ")"					{ \(p,_,_,s) len -> return $ TRightParen }
{

alexEOF = return TEOF

alexScanTokens str = runAlex str $ do
  let loop = do tok <- alexMonadScan
		if tok == TEOF 
			then return [tok]
			else do toks <- loop
				return (tok:toks)
  loop  

data Token =
	TInt Int | TIdent String 
	| TPlus | TMinus | TMul | TDiv | TMod | TBinOr | TBinAnd | TBinXor | TBinNot | TRor | TRol
	| TLogNot | TLogAnd | TLogOr | TLogXor | TShl | TShr | TLt | TGt | TLe | TGe | TEq | TNe
	| TModifSet | TModifPlus | TModifMinus | TModifMul | TModifDiv | TModifMod | TModifRol | TModifRor
	| TModifShr | TModifShl | TModifLogAnd | TModifLogOr | TModifLogXor | TModifBinOr 
	| TModifBinAnd | TModifBinXor | TModifInc | TModifDec
	| TQuestion | TColon | TSemiColon | TLeftParen | TRightParen
	| TEOF
	deriving (Eq)

instance Show Token where
  show x = case x of
    TInt i -> show i
    TIdent s -> s
    TModifSet -> "="
    TModifPlus -> "+="
    TModifMinus -> "-="
    TModifMul -> "*="
    TModifDiv -> "/="
    TModifMod -> "%="
    TModifBinAnd -> "&="
    TModifBinOr -> "|="
    TModifBinXor -> "^="
    TModifShl -> "<<="
    TModifShr -> ">>="
    TModifLogAnd -> "&&="
    TModifLogOr -> "||="
    TModifLogXor -> "^^="
    TModifRol -> "<<<="
    TModifRor -> ">>>="
    TModifInc -> "++"
    TModifDec -> "--"
    TPlus -> "+"
    TMinus -> "-"
    TMul -> "*"
    TDiv -> "/"
    TMod -> "%"
    TBinOr -> "|"
    TBinAnd -> "&"
    TBinXor -> "^"
    TBinNot -> "~"
    TLogNot -> "!"
    TLogAnd -> "&&"
    TLogOr -> "||"
    TLogXor -> "^^"
    TShl -> "<<"
    TShr -> ">>"
    TRol -> "<<<"
    TRor -> ">>>"
    TLt -> "<"
    TGt -> ">"
    TLe -> "<="
    TGe -> ">="
    TEq -> "=="
    TNe -> "!="
    TQuestion -> "?"
    TColon -> ":"
    TSemiColon -> ";"
    TLeftParen -> "("
    TRightParen -> ")"
    TEOF -> "(EOF)"

}
