#load "__querySource.fsx";;

query { for f in QuerySource.films do count };;

query { for f in QuerySource.films do minByNullable f.gross };;

query { for f in QuerySource.films do maxByNullable f.gross };;

query { for f in QuerySource.films do sumByNullable f.gross };;

// Note: divisor is count of items, not count of non-null items
//       see below for a custom query operator that averages only
//       the non-null items
query { for f in QuerySource.films do averageByNullable f.gross };;

query { for f in QuerySource.films do
        where (f.gross.HasValue)
        averageByNullable f.gross };;
