/*
 * Autore:     Aurelio De Rosa <aurelioderosa@gmail.com>
 * Versione:   1.0
 * Licenza:    http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License v3
 * Link:       https://bitbucket.org/AurelioDeRosa/algoritmi-fondamentali
 */

int Partiziona (int *Array, int Inizio, int Fine)
{
   int i, j, ElementoDiPartizionamento, Temp;

   ElementoDiPartizionamento = Array[Inizio];
   i = Inizio - 1 ;
   j = Fine + 1;

   do
   {
      do
      {j--;}
      while ( Array[j] > ElementoDiPartizionamento );

      do
      {i++;}
      while ( Array[i] < ElementoDiPartizionamento );

      if (i < j)
      {
         Temp = Array[i];
         Array[i] = Array[j];
         Array[j] = Temp;
      }
   }
   while (i < j);

   return j;
}


int *Merge (int *Array, int Dimensione, int *Vettore, int Lunghezza, int *DimArrayRisultante)
{
   int i,j,IndiceNuovoArray;
   int *NewArray;

   *DimArrayRisultante = Dimensione + Lunghezza;
   NewArray = (int *)malloc( *DimArrayRisultante * sizeof(int));

   IndiceNuovoArray = i = j = 0;

   while ( i < Dimensione  &&  j < Lunghezza )
     NewArray[IndiceNuovoArray++] = ( Array[i] <= Vettore[j] ) ?  Array[i++] : Vettore[j++] ;

   if ( i == Dimensione )
   {
      do
      {
         NewArray[IndiceNuovoArray++] = Vettore[j++];
      }
      while ( IndiceNuovoArray < *DimArrayRisultante );
   }
   else
   {
      do
      {
         NewArray[IndiceNuovoArray++] = Array[i++];
      }
      while ( IndiceNuovoArray < *DimArrayRisultante );
   }

   return NewArray;
}


void CostruisciHeap (int *Array, int Dimensione)
{
   int i;

   for ( i = Dimensione / 2; i >= 0; i--)
     Heapify (Array, Dimensione, i);
}


void Heapify (int *Array, int Dimensione, int Indice)
{
   int Left, Right, Maggiore;

   int Sinistro (int Indice)
   {
      return ( ( 2 * (Indice + 1 ) ) - 1 );
   }
   int Destro (int Indice)
   {
      return ( 2 * (Indice + 1 ) );
   }

   Left = Sinistro (Indice);
   Right = Destro (Indice);

   Maggiore = ( Left <= Dimensione  &&  Array[Left] > Array[Indice] ) ? Left : Indice ;

   if ( Right <= Dimensione  &&  Array[Right] > Array[Maggiore] )
     Maggiore = Right;

   if ( Maggiore != Indice )
   {
      Swap ( &(Array[Indice]), &(Array[Maggiore]) );
      Heapify (Array, Dimensione, Maggiore);
   }

}


void ExchangeSort (int *Array,int Inizio,int Fine)
{
   int i,j,ContatoreScambi;

   i = Fine;
   do
   {
      ContatoreScambi = 0;

      for ( j = 0; j < Fine; j++)
      {
         if( Array[j] > Array[j+1] )
	     {
	        Swap ( &Array[j], &Array[j+1] );
	        /* Conta se sono stati effetuati scambi.In caso negativo si esce dal ciclo */
           ContatoreScambi++;
	     }
      }
      i--;
    }
    while ( ContatoreScambi != 0  &&  i != Inizio );
}


void InsertionSort (int *Array,int Inizio,int Fine)
{
   int i,j,ElementoDaOrdinare;

   for ( i = 1; i <= Fine; i++ )
   {
      ElementoDaOrdinare = Array[i];
      j = i - 1;

      while ( j >= Inizio  &&  Array[j] > ElementoDaOrdinare )
      {
         Array[j+1] = Array[j];
         j--;
      }
      Array[j+1] = ElementoDaOrdinare;
   }
}


void SelectionSort (int *Array, int Inizio, int Fine)
{
   int i,j,PosMinimo;

   for( i = Inizio; i < Fine; i++)
   {
      PosMinimo = i;

      for( j = i + 1; j <= Fine; j++)
      {
         if ( Array[j] < Array[PosMinimo] )
           PosMinimo = j;
      }
      Swap ( &Array[i], &Array[PosMinimo] );
   }
}


void QuickSort (int *Array, int Inizio, int Fine)
{
   int Mezzo;

   if ( Inizio < Fine )
   {
      Mezzo = Partiziona (Array, Inizio, Fine);
      QuickSort (Array, Inizio, Mezzo);
      QuickSort (Array, Mezzo + 1, Fine);
   }
}


void MergeSort (int *Array,int Inizio, int Fine)
{
   int Centro;

   void Merge (int *Array,int Inizio, int Mezzo, int Fine)
   {
      int DimAppoggio = Fine - Inizio + 1;
      int Appoggio[DimAppoggio];
      int i,j,k;

      i = Inizio;
      j = Mezzo + 1;
      k = 0;

      while ( i <= Mezzo  &&  j <= Fine )
        Appoggio[k++] = ( Array[i] <= Array[j] ) ? Array[i++] : Array[j++] ;

      if ( i > Mezzo )
      {
         do
         {
            Appoggio[k++] = Array[j++];
         }
         while ( k < DimAppoggio);
      }
      else
      {
         do
         {
            Appoggio[k++] = Array[i++];
         }
         while ( k < DimAppoggio);
      }

      for ( i = Inizio, k = 0 ; i <= Fine; i++, k++)
        Array[i] = Appoggio[k];

   }
   if ( Inizio < Fine )
   {
      Centro = (Inizio + Fine) / 2;
      MergeSort(Array,Inizio,Centro);
      MergeSort(Array,Centro+1,Fine);
      Merge(Array,Inizio,Centro,Fine);
   }
}


void CountingSort (int *Array, int Inizio, int Fine)
{
   int i,j,k,Massimo,Contatore;
   int *Temp;

   Massimo = Array[Inizio];

   for( i = Inizio + 1; i <= Fine; i++)
   {
      if ( Array[i] > Massimo )
        Massimo = Array[i];
   }

   Temp = (int *)malloc( ( Massimo + 1 ) * sizeof(int));

   for ( i = 0; i <= Massimo; i++)
     Temp[i] = 0;

   for ( j = 0; j <= Massimo; j++)
   {
      Contatore = 0;
      for ( i = Inizio; i <= Fine; i++)
      {
         if ( Array[i] == j )
           Contatore++;
      }
      Temp[j] = Contatore;
   }

   for ( i = Inizio; i < Fine; i++)
     Array[i] = 0;

   j = 0;
   for ( i = 0; i <= Massimo; i++)
   {
      for ( k = 0; k < Temp[i]; k++)
        Array[j++] = i;
   }
}


void HeapSort (int *Array, int Dimensione)
{
   int i, DimensioneHeap;

   DimensioneHeap = Dimensione - 1;
   CostruisciHeap (Array, DimensioneHeap);

   for ( i = DimensioneHeap; i >= 1; i--)
   {
      Swap ( &Array[0], &Array[i] );
      DimensioneHeap--;
      Heapify (Array, DimensioneHeap, 0);
   }
}
