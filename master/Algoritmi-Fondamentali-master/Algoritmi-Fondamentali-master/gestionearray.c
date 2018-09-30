/*
 * Autore:     Aurelio De Rosa <aurelioderosa@gmail.com>
 * Versione:   1.0
 * Licenza:    http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License v3
 * Link:       https://bitbucket.org/AurelioDeRosa/algoritmi-fondamentali
 */

int *ArrayLeggi (int Dimensione)
{
   int *Array, i;

   Array = (int *)malloc( Dimensione * sizeof(int));

   for (i = 0; i < Dimensione; i++)
   {
      printf("Scrivi il %d numero: ",i+1);
      scanf("%d",&Array[i]);
   }
   return Array;
}


void ArrayStampa (int *Array, int Dimensione)
{
   int i;

   printf("L'array e':\n");
   for (i = 0; i < Dimensione; i++)
     printf("%d ",Array[i]);
   printf("\n\n");
}


int **MatriceLeggi (int DimRiga, int DimCol)
{
   int **Matrice, i, j;

   Matrice = (int **)malloc( DimRiga * sizeof(int *));
   for (i = 0; i < DimRiga; i++)
      Matrice[i] = (int *)malloc( DimCol * sizeof(int));

   for (i = 0; i < DimRiga; i++)
   {
      for (j = 0; j < DimCol; j++)
      {
			printf("Scrivi il numero di posizione [%d][%d]: ",i+1,j+1);
			scanf("%d",&Matrice[i][j]);
		}
   }
   return Matrice;
}


void MatriceStampa (int **Matrice, int DimRiga, int DimCol)
{
   int i, j;

   printf("La matrice e':\n");
   for (i = 0; i < DimRiga; i++)
   {
      for ( j = 0; j < DimCol; j++)
         printf("%d ",Matrice[i][j]);

      printf("\n");
   }
   printf("\n");
}


void CancellazioneDoppioni (int *Array, int *Dimensione)
{
   int i, j;

   for (i = 0; Array[i] != Array[i+1]  &&  i < (*Dimensione) - 1; i++) ;

   j = i;

   while( i < (*Dimensione) - 2)
   {
      i++;
      if ( Array[i] != Array[i+1] )
        Array[++j] = Array[i+1];
   }
   /* j mantiene l'ultima posizione,quindi per avere la dimensione dell'array si deve sommare 1 */
   *Dimensione = j + 1;
   Array = realloc (Array,*Dimensione * sizeof(int));
}


int RicercaSequenziale (int *Array, int Inizio, int Fine, int Chiave)
{
   int i,Trovato;

   Trovato = False;
   for ( i = Inizio; Trovato == False  &&  i <= Fine; i++)
   {
      if ( Array[i] == Chiave )
        Trovato = True;
   }
   return Trovato;
}



int RicercaBinaria (int *Array, int Inizio, int Fine, int Chiave)
{
   int Trovato = False;
   int Centro;

   while ( Trovato == False  &&  Inizio <= Fine)
   {
      Centro = (Inizio + Fine) / 2 ;

      if ( Array[Centro] == Chiave )
        Trovato = True;
      else if ( Array[Centro] < Chiave )
        Inizio = Centro + 1 ;
      else
        Fine = Centro - 1 ;
   }
   return Trovato;
}
