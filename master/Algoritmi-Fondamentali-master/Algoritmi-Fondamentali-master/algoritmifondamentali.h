/*
 * Autore:     Aurelio De Rosa <aurelioderosa@gmail.com>
 * Versione:   1.0
 * Licenza:    http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License v3
 * Link:       https://bitbucket.org/AurelioDeRosa/algoritmi-fondamentali
 */

#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <string.h>
#include <ctype.h>

#define True 1
#define False 0

#include "algoritmifondamentali.c"
#include "gestionearray.h"
#include "gestionearray.c"
#include "ordinamento.h"
#include "ordinamento.c"
#include "gestionelista.h"
#include "gestionelista.c"
#include "calcolomatriciale.h"
#include "calcolomatriciale.c"
#include "gestionealberi.h"
#include "gestionealberi.c"

/*
   - Funzione che genera un numero casuale.Viene usata questa funzione
   poiché la semplice chiamata a rand() genera spesso gli stessi numeri.
   - INPUT: Nessuno
   - OUTPUT: Un numero casuale
*/
unsigned long Crea_Numero_Casuale (void);

/*
   - Funzione che verifica se un numero è pari
   - INPUT: Un numero
   - OUTPUT: True se il numero in input è pari,False altrimenti
*/
int IsPari (int Numero);

/*
   - Funzione che scambia due numeri
   - INPUT: Due numeri
   - OUTPUT: I due numeri scambiati
*/
void Swap (int *Numero1, int *Numero2);

/*
   - Funzione che verifica se una data è stata inserita in modo corretto
   - INPUTt: Una stringa
   - OUTPUT: True se la data è scritta nel formato esatto (gg/mm/aaaa).False in caso contrario
*/
int VerificaData (char *Data);

/*
   - Funzione che verifica se un carattere è una vocale
   - INPUT: Una carattere
   - OUTPUT: True se il carattere in input è una vocale.False altrimenti
*/
int IsVocale (char Lettera);

/*
   - Funzione che verifica se una data stringa è costituita di sole cifre decimali (ovvero è un numero decimale)
   - INPUT: Una stringa
   - OUTPUT: True se la stringa è di sole cifre decimali.False altrimenti
*/
int IsInteger (char *Stringa);

/*
   - Funzione di lettura delle stringhe (si usa perche il C nelle stringhe non contempla gli spazi)
   - INPUT: La dimensione massima che deve avere la stringa
   - OUTPUT: Il puntatore alla stringa di caratteri letta
*/
char *LetturaStringa (int DimMaxStringa);

/*
   - Funzione che verifica se un numero èprimo
   - INPUT: Un numero
   - OUTPUT: True se il numero in input è primo.False altrimenti
*/
int IsNumeroPrimo (int Numero);

/*
   - Funzione che calcola il risultato di un'equazione lineare
   - INPUT: L' array dei coefficienti, la sua dimensione, il valore dell'incognita
   - OUTPUT: Il risultato dell'equazione lineare
*/
int Horner (int *Array, int Dimensione, int ValoreIncognita);
