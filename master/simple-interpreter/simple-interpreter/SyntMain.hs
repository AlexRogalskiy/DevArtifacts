module Main where
import Lex
import Synt

main = do 
  inStr <- getContents
  putStrLn $ case alexScanTokens inStr >>= synt of
    Right tree -> show tree
    Left err -> "ERROR: " ++ err

