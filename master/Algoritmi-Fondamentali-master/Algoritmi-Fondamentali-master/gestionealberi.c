/*
 * Autore:     Aurelio De Rosa <aurelioderosa@gmail.com>
 * Versione:   1.0
 * Licenza:    http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License v3
 * Link:       https://bitbucket.org/AurelioDeRosa/algoritmi-fondamentali
 */

struct NodoAlbero *CreaNodoAlbero (int Chiave, struct NodoAlbero *Sinistro, struct NodoAlbero *Destro)
{
   struct NodoAlbero *Nodo;

   Nodo = (struct NodoAlbero *)malloc(sizeof(struct NodoAlbero));
   Nodo->Info = Chiave;
   Nodo->FiglioSx = Sinistro;
   Nodo->FiglioDx = Destro;

   return Nodo;
}


void VisitaPreorder (struct NodoAlbero *Root)
{
   /*
      Se l'albero è diverso da NULL allora andiamo a visitare il nodo corrente
      per poi passare ai sottoalberi in esso radicati.
   */
   if ( Root != NULL )
   {
      printf("%d ",Root->Info);
      VisitaPreorder (Root->FiglioSx);
      VisitaPreorder (Root->FiglioDx);
   }
}


void VisitaInorder (struct NodoAlbero *Root)
{
   if ( Root != NULL )
   {
      VisitaInorder (Root->FiglioSx);
      printf("%d ",Root->Info);
      VisitaInorder (Root->FiglioDx);
   }
}


void VisitaPostorder (struct NodoAlbero *Root)
{
   if ( Root != NULL )
   {
      VisitaPostorder (Root->FiglioSx);
      VisitaPostorder (Root->FiglioDx);
      printf("%d ",Root->Info);
   }
}


int ContaNodiAlbero (struct NodoAlbero *Root)

{
   int NumNodiAlberoSx, NumNodiAlberoDx, TotaleNodi;

   if ( Root == NULL )
     TotaleNodi = 0;
   else
   {
      /* Si contano i nodi del sottoalbero sinistro */
      NumNodiAlberoSx = ContaNodiAlbero (Root->FiglioSx);
      /* Si contano i nodi del sottoalbero destro */
      NumNodiAlberoDx = ContaNodiAlbero (Root->FiglioDx);
      /* Si sommano i due valori */
      TotaleNodi = NumNodiAlberoSx + NumNodiAlberoDx + 1;
   }
   return TotaleNodi;
}


int IsFiglio (struct NodoAlbero *Root, int Chiave, int Distanza)
{
   int Verifica;

   if ( Root == NULL )
     Verifica = -1;
   else if ( Root->Info == Chiave )
     Verifica = Distanza;
   else
   {
      Verifica = IsFiglio (Root->FiglioSx, Chiave, Distanza + 1);
      /*
         Se Verifica assume un valore diverso da -1,vuol dire che la persona è
         stata trovata e che abbiamo ottenuto il valore cercato (la distanza fra
         le due persone).Per questo motivo è inutile visitare gli altri nodi.
      */
      if ( Verifica == -1 )
        Verifica = IsFiglio (Root->FiglioDx, Chiave, Distanza + 1);
   }
   return Verifica;
}


int RicercaInAlbero (struct NodoAlbero *Root, int Chiave)
{
   int Trovato = False;

   if ( Root != NULL )
   {
      if ( Root->Info == Chiave )
        Trovato = True;
      else
      {
         Trovato = RicercaInAlbero (Root->FiglioSx, Chiave);

         if ( Trovato != True )
           Trovato = RicercaInAlbero (Root->FiglioDx, Chiave);
      }
   }
   return Trovato;
}


void CancellaAlbero (struct NodoAlbero **Root)

{
   if ( *Root != NULL )
   {
      CancellaAlbero ( &(*Root)->FiglioSx );
      CancellaAlbero ( &(*Root)->FiglioDx );
      free (*Root);
   }
}


int IsARB (struct NodoAlbero *Root)
{
   int Ris1, Ris2, Risposta;

   /* Funzioni di supporto */
   /*
      Questa funzione verifica se la chiave è il massimo tra le chiavi
      dei figli destri radicati nella Radice data come input.
   */
   int IsBiggest (struct NodoAlbero *Root, int Chiave)
   {
      if ( Root != NULL )
      {
         if ( Chiave >= Root->Info )
           return IsBiggest ( Root->FiglioDx, Chiave);
         else
           return False;
      }
      else
        return True;
   }

   /*
      Questa funzione verifica se la chiave è il minimo tra le chiavi
      dei figli sinitri radicati nella Radice data come input.
   */
   int IsSmallest (struct NodoAlbero *Root, int Chiave)
   {
      if ( Root != NULL )
      {
         if ( Chiave <= Root->Info )
           return IsSmallest ( Root->FiglioSx, Chiave);
         else
           return False;
      }
      else
        return True;
   }
   /* Fine funzioni di supporto */

   Risposta = True;

   if ( Root != NULL  &&  ( Root->FiglioSx != NULL  ||  Root->FiglioDx != NULL ) )
   {
      Ris1 = IsARB ( Root->FiglioSx );
      Ris2 = IsARB ( Root->FiglioDx );

      if ( Ris1 == True  &&  Ris2 == True )
      {
         Ris1 = IsBiggest ( Root->FiglioSx, Root->Info);
         Ris2 = IsSmallest ( Root->FiglioDx, Root->Info);
      }
      Risposta = Ris1 && Ris2;
   }
   return Risposta;
}


int RicercaNodoARB (struct NodoAlbero *Root, int Chiave)
{
   int Trovato = False;

   if ( Root != NULL )
   {
      if ( Root->Info == Chiave )
        Trovato = True;
      else if ( Root->Info < Chiave )
        Trovato = RicercaNodoARB (Root->FiglioDx, Chiave);
      else
        Trovato = RicercaNodoARB (Root->FiglioSx, Chiave);
   }
   return Trovato;
}


int RicercaMinimoARB (struct NodoAlbero *Root)
{
   int Minimo = 0;

   if ( Root != NULL  )
   {
      if ( Root->FiglioSx != NULL )
         Minimo = RicercaMinimoARB ( Root->FiglioSx );
      else
         Minimo = Root->Info;
   }
   else
     printf("L'albero è vuoto. Non esiste un minimo!\n");

	return Minimo;
}


int RicercaMassimoARB (struct NodoAlbero *Root)
{
   int Massimo = 0;

   if ( Root != NULL  )
   {
      if ( Root->FiglioSx != NULL )
         Massimo = RicercaMassimoARB ( Root->FiglioDx );
      else
         Massimo = Root->Info;
   }
   else
     printf("L'albero è vuoto. Non esiste un massimo!\n");

	return Massimo;
}


struct NodoAlbero *InserisciNodoARB (struct NodoAlbero *Root, struct NodoAlbero *NuovoNodo)
{
   if ( Root == NULL )
     Root = NuovoNodo;
   else
   {
      if ( Root->Info < NuovoNodo->Info )
        Root->FiglioDx = InserisciNodoARB ( Root->FiglioDx, NuovoNodo);
      else
        Root->FiglioSx = InserisciNodoARB ( Root->FiglioSx, NuovoNodo);
   }
   return Root;
}


struct NodoAlbero *CancellaNodoARB (struct NodoAlbero *Root, int Chiave)
{
   struct NodoAlbero *Temp;

   /* Funzione di supporto della cancellazione */
   struct NodoAlbero *StaccaMin (struct NodoAlbero *Root, struct NodoAlbero *Padre)
   {
      if ( Root != NULL )
      {
         if ( Root->FiglioSx != NULL )
           return StaccaMin ( Root->FiglioSx, Root);
         else
         {
            if ( Root == Padre->FiglioSx )
              Padre->FiglioSx = Root->FiglioDx;
            else
              Padre->FiglioDx = Root->FiglioDx;
         }
      }
      return Root;
   }
   /* Fine funzione di supporto */

   if ( Root != NULL )
   {
      if ( Root->Info > Chiave )
        Root->FiglioSx = CancellaNodoARB ( Root->FiglioSx, Chiave);
      else if ( Root->Info < Chiave )
        Root->FiglioDx = CancellaNodoARB ( Root->FiglioDx, Chiave);
      else
      {
         Temp = Root;

         if ( Root->FiglioDx == NULL )
           Root = Root->FiglioSx;
         else if ( Root->FiglioSx == NULL )
           Root = Root->FiglioDx;
         else
         {
            Temp = StaccaMin ( Root->FiglioDx, Root);
            Temp->FiglioDx = Root->FiglioDx;
            Temp->FiglioSx = Root->FiglioSx;
            free(Root);
            Root = Temp;
         }
      }
   }
   return Root;
}
