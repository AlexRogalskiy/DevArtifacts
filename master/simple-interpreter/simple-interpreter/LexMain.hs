module Main where
import Lex

main = do
  s <- getContents
  putStrLn $ case alexScanTokens s of
    Right lst -> concatMap (\t -> "'" ++ show t ++ "' ") lst
    Left err -> "ERROR: " ++ err
