/*
 * Autore:     Aurelio De Rosa <aurelioderosa@gmail.com>
 * Versione:   1.0
 * Licenza:    http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License v3
 * Link:       https://bitbucket.org/AurelioDeRosa/algoritmi-fondamentali
 */

struct NodoLista *CreaNodoLista (int Chiave, struct NodoLista *Successivo)
{
   struct NodoLista *Nodo;

   Nodo = (struct NodoLista *)malloc(sizeof(struct NodoLista));
   Nodo->Info = Chiave;
   Nodo->Next = Successivo;

   return Nodo;
}

struct NodoLista *PilaPush (struct NodoLista *Testa, struct NodoLista *NuovoNodo)
{
   if ( Testa == NULL )
     Testa = NuovoNodo;
   else
   {
      NuovoNodo->Next = Testa;
	   Testa = NuovoNodo;
   }
   return Testa;
}


int PilaPop (struct NodoLista **Testa)
{
   struct NodoLista *Temp;
   int Chiave;

   if ( *Testa == NULL )
   {
      printf("Pila vuota!\n");
      Chiave = 0;
   }
   else
   {
      Chiave=(*Testa)->Info;
      Temp=(*Testa)->Next;
      free(*Testa);
      *Testa=Temp;
   }
   return Chiave;
}


void PilaStampa (struct NodoLista *Testa)
{
   printf("#---#\n");

   while(Testa != NULL)
   {
      printf("| %d |\n",Testa->Info);
      printf("#---#\n");
      Testa=Testa->Next;
   }
   printf("\n\n");
}


struct NodoLista *CodaPush (struct NodoLista *Testa, struct NodoLista *NuovoNodo)
{
   if ( Testa == NULL )
     Testa = NuovoNodo;
   else
     Testa->Next = CodaPush (Testa->Next, NuovoNodo);

   return Testa;
}


int CodaPop (struct NodoLista **Testa)
{
   struct NodoLista *Temp;
   int Chiave;

   if (*Testa == NULL)
   {
      printf("Coda vuota!\n");
      Chiave = 0;
   }
   else
   {
      Chiave=(*Testa)->Info;
      Temp=(*Testa)->Next;
      free(*Testa);
      *Testa=Temp;
   }
   return Chiave;
}


void CodaStampa (struct NodoLista *Testa)
{
   while ( Testa != NULL )
   {
      printf("%d ---> ",Testa->Info);
      Testa=Testa->Next;
   }
   printf("\n\n");
}


struct NodoLista *InserimentoOrdinatoInLista (struct NodoLista *Testa, struct NodoLista *NuovoNodo)
{
   if ( Testa == NULL )
     Testa = NuovoNodo;
   else if ( Testa->Info > NuovoNodo->Info )
   {
      NuovoNodo->Next = Testa;
      Testa = NuovoNodo;
   }
   else
     Testa->Next = InserimentoOrdinatoInLista (Testa->Next, NuovoNodo);

   return Testa;
}


int RicercaInLista (struct NodoLista *Testa, int Chiave)
{
   int Trovato = False;

   while ( Testa != NULL  &&  Trovato == False )
   {
      if ( Testa->Info == Chiave )
        Trovato = True;
   }
   return Trovato;
}


int RicercaInListaOrdinata (struct NodoLista *Testa, int Chiave)
{
   int Trovato = False;

   while ( Testa != NULL  &&  Trovato == False &&  Testa->Info < Chiave )
   {
      if ( Testa->Info == Chiave )
        Trovato = True;
   }
   return Trovato;
}
