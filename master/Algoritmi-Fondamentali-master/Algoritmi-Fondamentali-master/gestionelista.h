/*
 * Autore:     Aurelio De Rosa <aurelioderosa@gmail.com>
 * Versione:   1.0
 * Licenza:    http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License v3
 * Link:       https://bitbucket.org/AurelioDeRosa/algoritmi-fondamentali
 */

struct NodoLista
{
   int Info;
   struct NodoLista *Next;
};

/*
   - Funzione che crea un nodo di una lista
   - INPUT: La chiave che dovrà avere il nodo, il puntatore al nodo che si
   vuole sia il successivo di quello che si sta creando
   - OUTPUT: Il puntatore al nodo creato
*/
struct NodoLista *CreaNodoLista (int Chiave, struct NodoLista *Successivo);

/*
   - Funzione di inserimento in una coda
   - INPUT: La testa della coda, il nuovo Nodo da inserire
   - OUTPUT: La testa della coda aggiornata
*/
struct NodoLista *CodaPush (struct NodoLista *Testa, struct NodoLista *NuovoNodo);

/*
   - Funzione di esrtrazione da una coda
   - INPUT: (per riferimento) La testa della coda
   - OUTPUT: (per riferimento) La coda modificata, la chiave del NodoLista estratto
*/
int CodaPop (struct NodoLista **Testa);

/*
   - Funzione di stampa di una coda
   - INPUT: La testa della coda
   - OUTPUT: Nessuno
*/
void CodaStampa (struct NodoLista *Testa);

/*
   - Funzione di inserimento in una pila
   - INPUT: La testa della pila, il nuovo NodoLista da inserire
   - OUTPUT: La testa della pila aggiornata
*/
struct NodoLista *PilaPush (struct NodoLista *Testa, struct NodoLista *NuovoNodoLista);

/*
   - Funzione di estrazione da una pila
   - INPUT: (per riferimento) La testa della pila
   - OUTPUT: (per riferimento) La pila modificata,la chiave del NodoLista estratto
*/
int PilaPop (struct NodoLista **Testa);

/*
   - Funzione di stampa di una pila
   - INPUT: La testa della pila
   - OUTPUT: Nessuno
*/
void PilaStampa (struct NodoLista *Testa);

/*
   - Funzione di inserimento ordinato (in modo crescente) in una coda
   - INPUT: La testa della coda, il nodo da inserire
   - OUTPUT: La testa della coda aggiornata
*/
struct NodoLista *InserimentoOrdinatoInLista (struct NodoLista *Testa, struct NodoLista *NuovoNodo);

/*
   - Funzione di ricerca in una lista (adatta sia per una pila che per una coda)
   - INPUT: La testa della lista, la chiave da cercare
   - OUTPUT: True se la chiave è stata trovata. False altrimenti
*/
int RicercaInLista (struct NodoLista *Testa, int Chiave);

/*
   - Funzione di ricerca in una lista ordinata (adatta sia per una pila che per una coda)
   - INPUT: La testa della lista, la chiave da cercare
   - OUTPUT: True se la chiave è stata trovata. False altrimenti
*/
int RicercaInListaOrdinata (struct NodoLista *Testa, int Chiave);
