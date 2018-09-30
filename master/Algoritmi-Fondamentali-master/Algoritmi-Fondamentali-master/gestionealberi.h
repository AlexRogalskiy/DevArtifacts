/*
 * Autore:     Aurelio De Rosa <aurelioderosa@gmail.com>
 * Versione:   1.0
 * Licenza:    http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License v3
 * Link:       https://bitbucket.org/AurelioDeRosa/algoritmi-fondamentali
 */

struct NodoAlbero
{
   int Info;
   struct NodoAlbero *FiglioSx;
   struct NodoAlbero *FiglioDx;
};

/*
   - Funzione che crea un nodo di un albero
   - INPUT: La chiave che dovrà avere il nodo, il puntatore al nodo che si vuole sia il
   figlio sinistro, il puntatore al nodo che si vuole sia il figlio destro
   - OUTPUT: Il puntatore al nodo creato
*/
struct NodoAlbero *CreaNodoAlbero (int Chiave, struct NodoAlbero *Sinistro, struct NodoAlbero *Destro);

/*
   - Funzione che visita (e stampa i nodi di)un albero in Preorder.In questo tipo di visita si
   visualizza prima la radice e dopo,ricorsivamente,si passa al figlio sinistro e poi al destro.
   Schema: Radice, Sinistra, Destra
   - INPUT: La radice dell'albero
   - OUTPUT: Nessuno
*/
void VisitaPreorder (struct NodoAlbero *Root);

/*
   - Funzione che visita (e stampa i nodi di)un albero in Inorder.
   Schema: Sinistra, Radice, Destra
   - INPUT: La radice dell'albero
   - OUTPUT: Nessuno
*/
void VisitaInorder(struct NodoAlbero *Root);

/*
   - Funzione che visita (e stampa i nodi di)un albero in Postorder.
   Schema: Sinistra, Destra, Radice
   - INPUT: La radice dell'albero
   - OUTPUT: Nessuno
*/
void VisitaPostorder (struct NodoAlbero *Root);

/*
   - Funzione che conta il numero di nodi di un albero
   - INPUT: La radice dell'albero
   - OUTPUT: Il numero di nodi dell'albero
*/
int ContaNodiAlbero (struct NodoAlbero *Root);

/*
   - Funzione che cerca la Chiave del nodo all'interno dell'albero per verificare se
   tale nodo è Figlio di un altro nodo dato in input
   - INPUT: Il nodo cui si vuole verifiare se è padre della chiave (non necessariamente
   è la testa dell'albero), la chiave del nodo da cercare, la distanza tra i due contatti
   (inizializzato a 0)
   - OUTPUT: La distanza tra la radice (quindi la persona che dovrebbe essere il padre) e
   la persona cercata, altrimenti viene tornato il valore predefinito -1
*/
int IsFiglio (struct NodoAlbero *Root, int Chiave, int Distanza);

/*
   - Funzione che cerca una chiave all'interno di un albero
   - INPUT: La radice dell'albero, la chiave da cercare
   - OUTPUT: True se la chiave è stata trovata. False altrimenti
*/
int RicercaInAlbero (struct NodoAlbero *Root, int Chiave);

/*
   - Funzione che libera la memora dell'albero radicato nella radice passata come input
   - INPUT: La radice dell'albero
   - OUTPUT: Nessuno
*/
void CancellaAlbero (struct NodoAlbero **Root);

/*
   - Funzione che verifica se l'albero in ingresso è un ARB
   - INPUT: La radice dell'albero
   - OUTPUT: True se l'albero è un Albero binario di ricarca. False altrimenti
*/
int IsARB (struct NodoAlbero *Root);

/*
   - Funzione che cerca una chiave all'interno di un ARB
   - INPUT: La radice dell'albero, la chiave da cercare
   - OUTPUT: True se la chiave è stata trovata. False altrimenti
*/
int RicercaNodoARB (struct NodoAlbero *Root, int Chiave);

/*
   - Funzione che cerca il minimo all'interno di un ARB
   - INPUT: La radice dell'albero
   - OUTPUT: Il minimo elemento dell'albero
*/
int RicercaMinimoARB (struct NodoAlbero *Root);

/*
   - Funzione che cerca il massimo all'interno di un ARB
   - INPUT: La radice dell'albero
   - OUTPUT: Il massimo elemento dell'albero
*/
int RicercaMassimoARB (struct NodoAlbero *Root);

/*
   - Funzione che dato un ARB,inserisce un nuovo nodo nella sua giusta posizione
   - INPUT: La radice dell'albero, il nodo da inserire
   - OUTPUT: La testa dell'albero aggiornato
*/
struct NodoAlbero *InserisciNodoARB (struct NodoAlbero *Root, struct NodoAlbero *NuovoNodo);

/*
   - Funzione che dato un ARB,cancella un nodo contenente la Chiave data in input
   - INPUT: La radice dell'albero, la chiave da cancellare
   - OUTPUT: La testa dell'albero aggiornato
*/
struct NodoAlbero *CancellaNodoARB (struct NodoAlbero *Root, int Chiave);
