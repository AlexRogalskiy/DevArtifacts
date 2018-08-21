package langusta3;

/** This class works as basic desambiguator for patterns
 *
 * @todo
 * majme silný predpoklad, že jedno slovo patrí do práve jednej kombinácie
 * slovo/vzor.
 * majme predpoklad, že vzory sa neprekrývajú
 *
 * ==> dokážeme nájsť najsilnejší pattern/lemma, čo bude ten ktorý vygeneruje 
 * najviac akceptovateľných tvarov.
 * 
 * @note seq = riadky, ktoré vznikli z rovnakého slovo pre jednu predložku
 * sú oddelené prázdnym riadkom
 *
 * @algorithm ?
 * RUN 1:
 * pre každý seq ->
 *   * ulož do mapy (word) = [tag1, tag2] (ak je viackrát pridávaj len tagy)
 *
 * RUN 2:
 * pre každý seq ->
 *   * pre každý riadok ->
 *      * vygeneruj všetky tvary pre (lemma:pattern) a over ich v mape
 *
 *   * riadok s najvačším počtom úspechov vyhral
 *   * @todo otestovať, či sa oplatí zrušiť použité seq (?)
 *   * pridaj riadok medzi známe a ak ho uvidíme, tak už ho preskakuj
 *
 * @input word:partial tag:pattern:lemma
 *
 * @output pattern:lemma:#accepted lines
 * @author marx
 */
public class PatternSelector {

}
