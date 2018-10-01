class textfile:
   ntfiles = 0  # count of number of textfile objects
   def __init__(self,fname):
      textfile.ntfiles += 1
      self.name = fname  # name 
      self.fh = open(fname)
      self.nlines = 0  # number of lines 
      self.nwords = 0  # number of words
      self.npars = 0  # number of words
      self.lines = self.fh.readlines()
      self.wordlineparcount()
   def wordlineparcount(self):
      "finds the number of lines and words in the file"
      self.nlines = len(self.lines)
      inparagraph = 0
      for l in self.lines:
         w = l.split()
         self.nwords += len(w)
         if l == '\n':
            if inparagraph:
               inparagraph = 0
         elif not inparagraph:
            self.npars += 1
            inparagraph = 1

   def grep(self,target):
      "prints out all lines in the file containing target"
      for l in self.lines:
         if l.find(target) >= 0:
            print l
         print i

def main():
   t = textfile('test.txt')
   print t.nwords, t.nlines, t.npars

if __name__ == '__main__': 
   main()
