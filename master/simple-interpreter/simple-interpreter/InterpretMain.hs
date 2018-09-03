module Main where
import Lex
import Synt
import Interpret

evalLoop ctx (x:xs) = do
  case alexScanTokens x >>= synt >>= evalProgCtx ctx of
    Right newCtx -> do
       putStrLn $ show newCtx
       evalLoop newCtx xs
    Left err -> do
      putStrLn err
      evalLoop ctx xs

evalLoop _ [] = return ()

main = do
  input <- getContents
  evalLoop createContext $ lines input
