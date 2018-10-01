#! /usr/bin/perl

# reads the text file given on the command line, and counts words,
# lines, and paragraphs

open(INFILE,@ARGV[0]);

$line_count = 0;
$word_count = 0;
$par_count = 0;

$now_in_par = 0;  # not inside a paragraph right now

while ($line = <INFILE>) {
   $line_count++;
   if ($line ne "\n")  {
      if ($now_in_par == 0)  {
         $par_count++;
         $now_in_par = 1;
      }
      @words_on_this_line = split(" ",$line);
      $word_count += scalar(@words_on_this_line);
   }
   else  {
      $now_in_par = 0;
   }
}

print "$word_count $line_count $par_count\n";
