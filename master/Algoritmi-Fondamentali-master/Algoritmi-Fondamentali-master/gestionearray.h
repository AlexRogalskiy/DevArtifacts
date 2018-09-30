/*
 * Autore:     Aurelio De Rosa <aurelioderosa@gmail.com>
 * Versione:   1.0
 * Licenza:    http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License v3
 * Link:       https://bitbucket.org/AurelioDeRosa/algoritmi-fondamentali
 */

/*
   - Funzione che legge un array da tastiera
   - INPUT: La dimensione che deve avere l'array
   - OUTPUT: Il puntatore all'array contenente i dati letti
*/
int *ArrayLeggi (int Dimensione);

/*
   - Funzione che stampa a video un array
   - INPUT: Un array, la sua dimensione
   - OUTPUT: Nessuno
*/
void ArrayStampa (int *Array, int Dimensione);

/*
   - Funzione che legge un matrice da tastiera
   - INPUT: La dimensione della riga e della colonna che deve avere la matrice
   - OUTPUT: Il puntatore alla matrice contenente i dati letti
*/
int **MatriceLeggi (int DimRiga, int DimCol);

/*
   - Funzione che stampa a video un matrice
   - INPUT: Una matrice, la sua dimensione di riga e colonna
   - OUTPUT: Nessuno
*/
void MatriceStampa (int **Matrice, int DimRiga, int DimCol);

/*
   - Funzione che cancella i doppioni da un array ordinato
   - INPUT: Un array ordinato, la sua dimensione
   - OUTPUT: (per riferimento) l'array in input con la cancellazione dei doppioni,
   la dimensione aggiornata
*/
void CancellazioneDoppioni (int *Array, int *Dimensione);

/*
   - Funzione che cerca una chiave all'interno di un array.La funzione sfrutta
   l'algoritmo di ricerca sequenziale
   - INPUT: Un array, l'indice di inizio dell'array, l'indice di fine dell'array,
   la chiave da cercare
   - OUTPUT: True se la chiave è stata trovata.False altrimenti
*/
int RicercaSequenziale (int *Array, int Inizio, int Fine, int Chiave);

/*
   - Funzione che cerca una chiave all'interno di un array ordinato.La funzione sfrutta
   l'algoritmo di ricerca binaria
   - INPUT: Un array ordinato, l'indice di inizio dell'array, l'indice di fine dell'array,
   la chiave da cercare
   - OUTPUT: True se la chiave è stata trovata.False altrimenti
*/
int RicercaBinaria (int *Array, int Inizio, int Fine, int Chiave);
