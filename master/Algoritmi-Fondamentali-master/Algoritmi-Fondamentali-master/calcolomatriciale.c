/*
 * Autore:     Aurelio De Rosa <aurelioderosa@gmail.com>
 * Versione:   1.0
 * Licenza:    http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License v3
 * Link:       https://bitbucket.org/AurelioDeRosa/algoritmi-fondamentali
 */

int ProdottoScalare (int *Array, int *Vettore, int Dimensione)
{
   int i,Risultato;

   for ( i = 0, Risultato = 0; i < Dimensione; i++)
     Risultato += Array[i] * Vettore[i];

   return Risultato;
}


void Saxpy (int *Array, int *Vettore, int Dimensione, int Moltiplicatore)
{
   int i;

   for (i = 0; i < Dimensione; i++)
     Array[i] += Moltiplicatore * Vettore[i];
}


void Gaxpy (int **Matrice, int Righe, int Colonne, int *Array, int *Vettore, int DimensioneArray)
{
   int i,j;

   if ( DimensioneArray != Colonne )
   {
      printf("Errore! Il numero di colonne della matrice deve essere\n");
      printf("uguale alla dimensione dei due array\n");
   }
   else
   {
      for (i = 0; i < Righe; i++)
      {
         for (j = 0; j < Colonne; j++)
           Vettore[i] += Matrice[i][j] * Array[j];
      }
   }
}


int *ProdottoMatriceVettore (int **Matrice, int Righe, int Colonne, int *Array, int DimensioneArray,
                             int *DimArrayRisultante)
{
   int i,j;
   int *Temp;

   if ( DimensioneArray != Colonne )
   {
      printf("Errore! Il numero di colonne della matrice deve essere\n");
      printf("uguale alla dimensione dell' array\n");
      *DimArrayRisultante = - 1;
      Temp = NULL;
   }
   else
   {
      *DimArrayRisultante = Righe;
      Temp = (int *)malloc( *DimArrayRisultante * sizeof(int));

      for (i = 0; i < Righe; i++)
      {
         Temp[i] = 0;
         for (j = 0; j < Colonne; j++)
           Temp[i] += Matrice[i][j] * Array[j];
      }
   }
   return Temp;
}

int **ProdottoMatriceMatrice (int **Matrice, int Righe, int Colonne, int **Matrix, int Rows, int Columns,
                              int *RigheMatriceRisultante, int *ColonneMatriceRisultante)
{
   int i,j,k;
   int **Temp;

   if ( Rows != Colonne )
   {
      printf("Errore! Il numero di colonne della prima matrice deve essere\n");
      printf("uguale al numero di righe della seconda\n");
      *RigheMatriceRisultante = -1;
      *ColonneMatriceRisultante = -1;
      Temp=NULL;
   }
   else
   {
      *RigheMatriceRisultante = Righe;
      *ColonneMatriceRisultante = Columns;
      Temp = (int **)malloc( *RigheMatriceRisultante * sizeof(int *));
      for (i = 0; i < *RigheMatriceRisultante; i++)
        Temp[i] = (int *)malloc( *ColonneMatriceRisultante * sizeof(int));

      for (i = 0; i < Righe; i++)
      {
         for (k = 0; k < Columns; k++)
         {
            Temp[i][k] = 0;
            for (j = 0; j < Colonne; j++)
              Temp[i][k] += Matrice[i][j] * Matrix[j][k];
         }
      }
   }
   return Temp;
}
