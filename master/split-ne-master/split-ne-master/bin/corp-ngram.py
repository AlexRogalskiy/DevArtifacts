#!/usr/bin/python -tt
# -*- coding: utf-8 -*-

import sys
import manatee
import codecs
import locale
import math

def get_ngram_count(words, verbose = ""):
	if len(words) > 1:
		refngram = refngr.locate_id(map(refattr.str2id, words))
		reff = refngram != -1 and refngr.freq(refngram) or 0
	else:
		reff = refattr.freq(refattr.str2id(words[0]))

	if len(verbose):
		print str(reff) + "\t" + verbose + "\t" + " ".join(words)

	return reff

sys.stdout = codecs.getwriter("utf-8")(sys.stdout)

refcorp = manatee.Corpus('cztenten12_8')
refattr = refcorp.get_attr('word')
refngr = manatee.NGram(refcorp.get_conf('PATH') + '/word.ngr')

## end of initialization

if not len(sys.argv) in [2, 3, 4]:
	print u"You have to enter token sequence to check in quotes"
	print u"\te.g. \"New York Rangers Jaromír Jágr\""
	print u"\tthe 2nd argument is first correct n-gram e.g. \"New York Rangers\""
	sys.exit(1)

##print "#test#sequence bi_dice ngram_dice bi_mi ngram_mi diff4 diff1"

tokens = sys.argv[1].decode("utf-8").split(" ")

sequence_count = get_ngram_count(tokens)

print str(sequence_count) + "\t" + " ".join(tokens)
if sequence_count == 0:
	sequence_count = 1
	print "\t<<Count with 1 occurency>>"
print

low_bigram_mi = 1000
low_bigram_mi_idx = -1
low_bigram_dice = 1000
low_bigram_dice_idx = -1

high_ngram_mi = -1000
high_ngram_mi_idx = -1
high_ngram_dice = -1000
high_ngram_dice_idx = -1

low_remove = 10000000000
low_remove_idx = -1
low_remove4 = 10000000000
low_remove4_idx = -1

for i in range(len(tokens)-1):
	# n-grams according to sequence
	pos1 = get_ngram_count(tokens[0:i+1], "ngram")
	pos2 = get_ngram_count(tokens[i+1:], "ngram")

	# remove negative (simplification with just one prev/next token)
	sequence_count_bi = get_ngram_count(tokens[i:i+2])
	pos1_neg = pos1 - get_ngram_count(tokens[0:i+1+1], "neg")
	pos2_neg = pos2 - get_ngram_count(tokens[i:], "neg")

	real1_neg = get_ngram_count(tokens[0:i+1+1], "neg-real")
	real2_neg = get_ngram_count(tokens[i:], "neg-real")

	# always bigrams
	pos1_bi = get_ngram_count(tokens[i:i+1], "bi")
	pos2_bi = get_ngram_count(tokens[i+1:i+2], "bi")

	print
	print "NEG-4: %s" % (pos1_neg + pos2_neg)
#	print "NEG-4: %i" % (pos1 + pos2 - pos1_neg - pos2_neg)
	print "NEG-1: %i" % (real1_neg + real2_neg)
	print

	if low_remove4 > (pos1_neg + pos2_neg):
		low_remove4 = pos1_neg + pos2_neg
		low_remove4_idx = i

	if low_remove > (pos1 + pos2 - pos1_neg - pos2_neg):
		low_remove = (pos1 + pos2 - pos1_neg - pos2_neg)
		low_remove_idx = i

	### logDice
	if (pos1 + pos2 == 0) or ((2.0 * sequence_count / (pos1 + pos2)) == 0):
		print "logDice (n-gram): N/A"
	else:
		ngram_dice = (14.0 + math.log((2.0*sequence_count/(pos1+pos2)),2))
		print "logDice (n-gram): %f" % (ngram_dice)
		if high_ngram_dice < ngram_dice:
			high_ngram_dice = ngram_dice
			high_ngram_dice_idx = i

	if (pos1_neg + pos2_neg == 0) or ((2.0 * sequence_count / (pos1_neg + pos2_neg)) == 0):
		print "logDice (n-gram-remove): N/A"
	else:
		print "logDice (n-gram-remove): %f" % (14.0 + math.log((2.0*sequence_count/(pos1_neg+pos2_neg)),2))

	if (pos1_bi + pos2_bi == 0) or ((2.0 * sequence_count_bi / (pos1_bi + pos2_bi)) == 0):
		print "logDice (bi-gram): N/A"
	else:
		bigram_dice = (14.0 + math.log((2.0*sequence_count_bi/(pos1_bi + pos2_bi)),2))
		print "logDice (bi-gram): %f" % (bigram_dice)
		if low_bigram_dice > bigram_dice:
			low_bigram_dice = bigram_dice
			low_bigram_dice_idx = i

	### MI
	### flag_fix means numbers have to be changed
	flag_fix = True
	if pos1 == 0:
		pos1 = 1
		flag_fix = False
	if pos2 == 0:
		pos2 = 1
		flag_fix = False

	print

	print
	if (pos1 * pos2 == 0) or ((2.0 * sequence_count / (pos1 * pos2)) == 0):
		print "MI-score (n-gram): N/A"
	else:
		ngram_mi = (math.log(1.0 * sequence_count/(pos1*pos2)))
		print "MI-score (n-gram): %f" % (ngram_mi)
		if high_ngram_mi< ngram_mi:
			high_ngram_mi = ngram_mi
			high_ngram_mi_idx = i

	if (pos1_neg * pos2_neg == 0) or ((2.0 * sequence_count / (pos1_neg * pos2_neg)) == 0):
		print "MI-score (n-gram-remove): N/A"
	else:
		print "MI-score (n-gram-remove): %f" % (math.log(1.0 * sequence_count/(pos1_neg*pos2_neg)))

	if (pos1_bi * pos2_bi == 0) or ((2.0 * sequence_count_bi / (pos1_bi * pos2_bi)) == 0):
		print "MI-score (bi-gram): N/A"
	else:
		bigram_mi = math.log(1.0 * sequence_count/(pos1_bi*pos2_bi))
		print "MI-score (bi-gram): %f" % (bigram_mi)
		if low_bigram_mi > bigram_mi:
			low_bigram_mi = bigram_mi
			low_bigram_mi_idx = i

	print
	print "--------------------------------------------------------------------------"
	
print "MIN bigram dice: %s %s" % (tokens[0:low_bigram_dice_idx+1], tokens[low_bigram_dice_idx+1:])
print "MAX ngram dice: %s %s" % (tokens[0:high_ngram_dice_idx+1], tokens[high_ngram_dice_idx+1:])

print "MIN bigram MI: %s %s" % (tokens[0:low_bigram_mi_idx+1], tokens[low_bigram_mi_idx+1:])
print "MAX ngram MI: %s %s" % (tokens[0:high_ngram_mi_idx+1], tokens[high_ngram_mi_idx+1:])

print "DIFF4 ngram-remove: %s %s" % (tokens[0:low_remove4_idx+1], tokens[low_remove4_idx+1:])
print "DIFF1 ngram-remove: %s %s" % (tokens[0:low_remove_idx+1], tokens[low_remove_idx+1:])

## test output against data (sys.argv[2])
tokens_ngram1_test = sys.argv[2].decode("utf-8").split(" ")
count = len(tokens_ngram1_test) - 1 # we want last index that is inside

print u"#test# '%s' %d %d %d %d %d %d" % (sys.argv[1].decode("utf-8"), int(count == low_bigram_dice_idx), int(count == high_ngram_dice_idx), int(count == low_bigram_mi_idx), int(count == high_ngram_mi_idx), int(count == low_remove4_idx), int (count == low_remove_idx))
