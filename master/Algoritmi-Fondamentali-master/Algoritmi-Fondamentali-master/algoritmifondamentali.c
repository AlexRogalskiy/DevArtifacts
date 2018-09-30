/*
 * Autore:     Aurelio De Rosa <aurelioderosa@gmail.com>
 * Versione:   1.0
 * Licenza:    http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License v3
 * Link:       https://bitbucket.org/AurelioDeRosa/algoritmi-fondamentali
 */

int IsPari (int Numero)
{
   return ( Numero % 2 == 0 ) ? True : False ;
}


void Swap (int *Numero1, int *Numero2)
{
   int Temp;

   Temp = *Numero1;
   *Numero1 = *Numero2;
   *Numero2 = Temp;
}


unsigned long Crea_Numero_Casuale (void)
{
   int i;
   unsigned long Numero;
   char Stringa[11];

   srand((unsigned)time(NULL));

   for (i = 0; i < 10; i++)
     {Stringa[i]= ( rand() % 10 ) + 48;}
   Stringa[10]='\0';
   /*
      Converto il numero presente in Stringa che è composto di caratteri in
      un numero (di tipo long) così da restituirlo alla funzione chiamante
   */
   Numero=atol(Stringa);

   return Numero;
}


int VerificaData (char *Data)
{
   int i,Mese,Giorno,Anno,Coeff_anno,Verifica;

   Verifica=True;
   /*
      Se la stringa è più lunga o più breve di 10 caratteri è stata scritta in modo errato e il programma
      chiede di reinserirla
   */
   if ( strlen(Data) != 10 )
     {goto FormatoNonValido;}
   else
   {
      i=0;
      /*
         Questo ciclo verifica che tutta la stringa (saltando le posizioni 2 e 5 che devono essere '/') sia fatta da cifre.
         Esso termina se incontra un carattere che non è una cifra oppure se ha analizzato tutta la stringa.
      */
      do
      {
         if ( !isdigit(Data[i]) )
           {goto FormatoNonValido;}
         ( (i == 1) || (i == 4) ) ?  i+=2 : i++ ;
      }
      while( i<10 );

      /* Nel formato richiesto i caratteri in posizione 2 e 5 devono essere '/' */
      if ( Data[2] != '/'  ||  Data[5] != '/' )
      {goto FormatoNonValido;}

      /*
         Trasformo la parte di data riguardante il mese in un intero e,nell'istruzione successiva,verifico se
         è compresa tra 1 e 12 (quindi tra Gennaio e Dicembre)
      */
      Mese=( ( Data[3]-'0' ) * 10 ) + ( Data[4]-'0' );

      if ( Mese < 1  ||  Mese > 12 )
      {goto MeseNonValido;}

      /*
         Trasformo la parte riguardante l'anno in un intero.Questa conversione è necessaria
         per verificare se si tratta di un anno bisestile per il quale è consentito inserire
         come giorno il 29 per il mese di Febbraio.
      */
      Anno=0;
      Coeff_anno=1000;
      for(i=6;i<10;i++)
      {
         Anno += (Data[i] - '0') * Coeff_anno;
         Coeff_anno /= 10;
      }
      /*
         Trasformo la parte di data riguardante il giorno in un intero e,nell'istruzione successiva,verifico se
         è compresa tra 1 e 31.Inoltre,verifico che per i mesi che prevedono solo 30giorni,non vi sia inserito come
         giorno il 31.Nel caso in cui il mese è Febbraio verifico che non sia maggiore di 28 in casi normali,mentre
         se nell'anno indicato il mese è bisestile,si verifica che non sia maggiore di 29
      */
      Giorno= ( ( Data[0] - '0' ) * 10 ) + ( Data[1] - '0' );

      if ( Giorno < 1  ||  Giorno > 31 )
         {goto GiornoNonValido;}
      else
      {
         if ( Mese >= 1  &&  Mese <= 7 )
         {
            if ( Mese == 2 )
            {
               /*
                  Se il mese è Febbraio e l'anno è bisestile,si verifica che non è stato inserito un giorno
                  maggiore di 29.Se l'anno non è bisestile che il giorno non sia maggiore di 28.
               */
               if ( ( Anno % 4 == 0  &&  Anno % 100 != 0)  ||  Anno % 400 == 0 )
               {
                  if ( Giorno > 29 )
                  {goto GiornoNonValido;}
               }
               else if ( Giorno > 28 )
               {goto GiornoNonValido;}
            }
            else if ( Mese % 2 == 0  &&  Giorno > 30 )
            {goto GiornoNonValido;}
         }
         else
         {
            if ( Mese % 2 == 1  &&  Giorno > 30 )
            {goto GiornoNonValido;}
         }
      }
   }

   /*
      L' if si rende necessario nel solo caso la data sia giusta per far si
      che tali istruzioni non vengano eseguite.
   */
   if ( Verifica != True )
   {
      /*
         Questa etichetta viene usata perché una volta che è stata appurata la scorrettezza anche di un solo
         dato è inutile andare a controllare gli altri.Non ho usato il return perché se si vuole apportare
         qualche modifica dover cambiare dei return sparsi per il sorgente isulta complicato.
      */
      FormatoNonValido:
                       printf("\nErrore! Non hai inserito la data di nascita nel formato corretto (gg/mm/aaaa)\n");
                       /*
                          Una volta stampato l'appropriato messaggio di errore,si salta all'etichetta che assegna
                          False a Verifica (e non esegue le etichette successive) e si ritorna il valore.
                       */
                       goto Fine;

      MeseNonValido:
                    printf("\nSi e' verificato un errore con il mese inserito.\nPer favore,controlla questo dato\n");
                    goto Fine;

      GiornoNonValido:
                      printf("\nSi e' verificato un errore con il giorno inserito.\nPer favore,controlla questo dato\n");

      Fine:
           Verifica=False;

   }

   return Verifica;
}


char *LetturaStringa (int DimMaxStringa)
{
   char *Buffer,*Stringa;
   int DimBuffer,Carattere,i;

   i = -1;
   /* Alloco il buffer per DimMaxStringa caratteri. */
   Buffer=(char *)malloc(DimMaxStringa*sizeof(char));
   /*
      Faccio leggere i caratteri uno a volta fino a che l'utente non preme il tasto INVIO.
      A quel punto,la funzione,sovrascrive il carattere INVIO che è stato "assorbito" dal
      getch e lo sostituisce con il carattere predefinito del C che determina la fine di
      una stringa (\0).Tutto ciò,al fine di ovviare il fatto che il C non consente la
      presenza di spazi nella lettura in input di una stringa.
   */
   do
   {
      /* Leggo un carattere */
      Carattere = getch ();
      /*
         Questo controllo serve quando viene inserito come primo carattere Backspace
         e quindi serve per non far bloccare il programma
      */
      if ( i != -1  || Carattere != 8 )
      {
         /*
            Se il carattere inserito è il carattere Back allora diminuiamo il contatore e
            faccio riscrivere il carattere all' utente nella posizione corretta
         */
         if ( i >= 0  &&  Carattere == 8 )
         {
            Buffer[i--]='\0';
            /* Sullo schermo viene cancellato l'ultimo carattere che era stato cancellato */
            putch (Carattere); /* Visualizzo il carattere letto a video */
            putch (32);
            putch (Carattere);
         }
         else
         {
            /*
               Se non si va oltre la dimensione massima della stringa,
               inserisco il carattere ricevuto in input nell'array Buffer
            */
            putch (Carattere); /* Visualizzo il carattere letto a video */
            if ( i < DimMaxStringa )
            {Buffer[++i]=Carattere;}
         }
      }
   }
   while ( Carattere != '\n' );
   /* Finché non viene premuto invio */

   Buffer[i]='\0';
   /* Calcolo la lunghezza del Buffer */
   DimBuffer = strlen (Buffer);
   /* Alloco la stringa per DimBuffer + 1 (a causa del carattere "\0") caratteri */
   Stringa=(char *)malloc((DimBuffer+1) * sizeof (char));
   /* Copio i caratteri scritti fino ad ora (che sono contenuti in Buffer) in Stringa */
   strcpy (Stringa,Buffer);
   /* Libero lo spazio occupato da Buffer */
   free(Buffer);
   printf("\n");

   return Stringa;
}


int IsVocale (char Lettera)
{
   if
   (
     Lettera == 'a'  ||
     Lettera == 'A'  ||
     Lettera == 'e'  ||
     Lettera == 'E'  ||
     Lettera == 'i'  ||
     Lettera == 'I'  ||
     Lettera == 'o'  ||
     Lettera == 'O'  ||
     Lettera == 'u'  ||
     Lettera == 'U'
   )
     {return True;}
   else
     {return False;}
}


int IsInteger (char *Stringa)
{
   int i,Verifica;

   Verifica = True;

   for (i = 0; i < strlen (Stringa)  &&  Verifica == True; i++)
   {
      if ( ! isdigit (Stringa[i]) )
        Verifica = False;
   }

   return Verifica;
}

int IsNumeroPrimo (int Numero)
{
   int i,Verifica;

   Verifica=True;
   /*
      Se:
      - Il numero è minore di 2
      - Il numero è pari e non è 2
      - Il numero è divisibile per 5 ma non è 5

      sicuramente non è primo
   */
   if ( ( Numero < 2 ) || ( Numero % 2 == 0  &&  Numero != 2 ) || ( Numero % 5 == 0  &&  Numero != 5 ) )
     Verifica=False;
   else
   {
      i=3;
      while ( i <= (Numero/i)  &&  Verifica == True )
      {
         if ( Numero % i == 0 )
           {Verifica=False;}
         /*
            E' inutile avanzare i di 1 poiché ciò farebbe diventare i pari e quindi il controllo
            dell'if sarebbe inutile in quanto si è già stabilito che il numero analizzato è dispari.
            Inoltre,è inutile verificare anche se il numero è divisibile per 5.
         */
         i += ( i == 3 ) ? 2 : 4 ;
      }
   }
   return Verifica;
}


int Horner (int *Array, int Dimensione, int ValoreIncognita)
{
   int i,Risultato;

   Risultato = Array[Dimensione - 1];

   for ( i = Dimensione - 2; i >= 0; i--)
     Risultato = ( Risultato * ValoreIncognita ) + Array[i];

   return Risultato;
}
