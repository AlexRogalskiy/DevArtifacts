/*
 * Autore:     Aurelio De Rosa <aurelioderosa@gmail.com>
 * Versione:   1.0
 * Licenza:    http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License v3
 * Link:       https://bitbucket.org/AurelioDeRosa/algoritmi-fondamentali
 */

/*
   - Funzione per calcolare il prodotto scalare di due array
   - INPUT: Due array e la loro dimensione
   - OUTPUT: Il prodotto scalare dei due array
*/
int ProdottoScalare (int *Array, int *Vettore, int Dimensione);

/*
   - Funzione per calcolare il prodotto scalare di due array
   - INPUT: Due array, la loro dimensione, il numero per cui deve essere
   moltiplicato il secondo array
   - OUTPUT: Un vettore (l'algoritmo opera "in place",ovvero il risultato è scritto
   nel primo array) cui ogni elemento è sommato al prodotto del moltiplicatore per
   l'elemento di pari posizione nel secondo array
*/
void Saxpy (int *Array, int *Vettore, int Dimensione, int Moltiplicatore);

/*
   - Funzione per calcolare il prodotto scalare di due array
   - INPUT: Una Matrice, il numero di righe della matrice, il numero di colonne
   della matrice, due array, la loro dimensione (deve essere uguale al numero di colonne
   della matrice)
   - OUTPUT:  Un vettore (l'algoritmo opera "in place",ovvero il risultato è scritto
   nel secondo array di input) cui ogni elemento è sommato al prodotto dell' i-esimo elemento
   del primo array per la i-esima riga (numero dopo numero) della matrice
*/
void Gaxpy (int **Matrice, int Righe, int Colonne, int *Array, int *Vettore, int DimensioneArray);

/*
   - Funzione per calcolare il prodotto di una matrice per un vettore
   - INPUT: Una Matrice, il numero di righe della matrice, il numero di colonne della
   matrice, un array, la sua dimensione (deve essere uguale al numero di colonne
   della matrice), (per riferimento) la lunghezza dell'array risultante (al momento della
   chiamata la variabile potrà avere un valore qualsiasi)
   - OUTPUT:  Il puntatore all' array risultante, (per riferimento) la sua dimensione aggiornata
*/
int *ProdottoMatriceVettore (int **Matrice, int Righe, int Colonne, int *Array, int DimensioneArray,
                             int *DimArrayRisultante);

/*
   - Funzione per calcolare il prodotto di una matrice per una matrice
   - INPUT: Una Matrice, il numero di righe della matrice, il numero di colonne della
   matrice, una matrice, il numero di righe della seconda matrice (deve essere uguale al numero
   di colonne della prima), il numero di colonne della seconda matrice, (per riferimento) il numero
   di righe della matrice risultante (al momento della chiamata la variabile potrà avere un valore
   qualsiasi), (per riferimento) il numero di colonne della matrice risultante (al momento della
   chiamata la variabile potrà avere un valore qualsiasi)
   - OUTPUT:  Il puntatore alla matrice risultante, (per riferimento) il numero delle sue righe aggiornato,
   (per riferimento) il numero delle sue colonne aggiornato
*/
int **ProdottoMatriceMatrice (int **Matrice, int Righe, int Colonne, int **Matrix, int Rows, int Columns,
                              int *RigheMatriceRisultante, int *ColonneMatriceRisultante);
