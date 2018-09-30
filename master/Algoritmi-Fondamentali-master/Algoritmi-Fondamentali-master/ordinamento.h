/*
 * Autore:     Aurelio De Rosa <aurelioderosa@gmail.com>
 * Versione:   1.0
 * Licenza:    http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License v3
 * Link:       https://bitbucket.org/AurelioDeRosa/algoritmi-fondamentali
 */

/*
   - Funzione che partiziona un array
   - INPUT: Il puntatore ad un array, l'indice di inizio dell'array, l'indice di fine dell'array
   - OUTPUT: L'array partizionato, la posizione attuale dell'elemento discriminante
   scelto per il partizionamento
*/
int Partiziona (int *Array, int Inizio, int Fine);

/*
   - Funzione che fonde due array ordinati in un unico array (anch'esso ordinato)
   - INPUT: Due array, la loro rispettiva dimensione, (per riferimento) la lunghezza dell'array
   risultante (al momento della chiamata la variabile potrà avere un valore qualsiasi)
   - OUTPUT: Il puntatore al nuovo array, (per riferimento) la sua dimensione aggiornata
*/
int *Merge (int *Array, int Dimensione, int *Vettore, int Lunghezza, int *DimArrayRisultante);

/*
   - Funzione che dato un array non ordinato costruisce un heap al suo interno
   - INPUT: Un array, la sua dimensione
   - OUTPUT: L'array di input in cui è stato costruito un heap
*/
void CostruisciHeap (int *Array, int Dimensione);

/*
   - Funzione che ripristina la proprietà di heap al sottoalbero radicato in Indice assumendo
   che i suoi sottoalberi destro e sinistro siano già degli heap
   - INPUT: Un array, la sua dimensione, l'indice da cui partire per rendere ripristinare
   all'interno dell'array l'heap
   - OUTPUT: L'array con il ripristino della proprietà di heap
*/
void Heapify (int *Array, int Dimensione, int Indice);

/*
   - Funzione che ordina un array.La funzione usa l'algoritmo chiamato ExchangeSort
   - INPUT: Un array, l'indice di inizio dell'array, l'indice di fine dell'array
   - OUTPUT: L'array ordinato
*/
void ExchangeSort (int *Array,int Inizio,int Fine);

/*
   - Funzione che ordina un array.La funzione usa l'algoritmo chiamato InsertionSort
   - INPUT: Un array, l'indice di inizio dell'array, l'indice di fine dell'array
   - OUTPUT: L'array ordinato
*/
void InsertionSort (int *Array,int Inizio,int Fine);

/*
   - Funzione che ordina un array.La funzione usa l'algoritmo chiamato SelectionSort
   - INPUT: Un array, l'indice di inizio dell'array, l'indice di fine dell'array
   - OUTPUT: L'array ordinato
*/
void SelectionSort (int *Array, int Inizio, int Fine);
/*
   - Funzione che ordina un array.La funzione usa l'algoritmo chiamato QuickSort
   - INPUT: Un array, l'indice di inizio dell'array, l'indice di fine dell'array
   - OUTPUT: L'array ordinato
*/
void QuickSort (int *Array, int Inizio, int Fine);

/*
   - Funzione che ordina un array.La funzione usa l'algoritmo chiamato MergeSort
   - INPUT: Un array, l'indice di inizio dell'array, l'indice di fine dell'array
   - OUTPUT: L'array ordinato
*/
void MergeSort (int *Array,int Inizio, int Fine);

/*
   - Funzione che ordina un array.La funzione usa l'algoritmo chiamato CountingSort
   - INPUT: Un array con tutti gli elementi >= 0, l'indice di inizio dell'array,
   l'indice di fine dell'array
   - OUTPUT: L'array ordinato
*/
void CountingSort (int *Array, int Inizio, int Fine);

/*
   - Funzione che ordina un array.La funzione usa l'algoritmo chiamato HeapSort
   - INPUT: Un array, la sua dimensione
   - OUTPUT: L'array ordinato
*/
void HeapSort (int *Array, int Dimensione);
