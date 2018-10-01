# the subroutine findfirst(v,w,b) finds the first instance of a value v
# in a block of w consecutive words of memory beginning at b, returning
# either the index of the word where v was found (0, 1, 2, ...) or -1 if
# v was not found; beginning with _start, we have a short test of the
# subroutine

.data  # data segment
x:
      .long   1
      .long   5
      .long   3
      .long   168
      .long   8888
.text  # code segment
.globl _start  # required
_start:  # required to use this label unless special action taken
      # push the arguments on the stack, then make the call
      push $x+4  # start search at the 5
      push $168  # search for 168 (deliberately out of order)
      push $4  # search 4 words
      call findfirst
done:
      movl %edi, %edi  # dummy instruction for breakpoint
findfirst:
      # finds first instance of a specified value in a block of words
      # EBX will contain the value to be searched for
      # ECX will contain the number of words to be searched 
      # EAX will point to the current word to search
      # return value (EAX) will be index of the word found (-1 if not found)
      # fetch the arguments from the stack
      movl 4(%esp), %ebx
      movl 8(%esp), %ecx  
      movl 12(%esp), %eax  
      movl %eax, %edx # save block start location
      # top of loop; compare the current word to the search value
top:  cmpl (%eax), %ebx
      jz found
      decl %ecx  # decrement counter of number of words left to search
      jz notthere  # if counter has reached 0, the search value isn't there
      addl $4, %eax  # otherwise, go on to the next word
      jmp top
found: 
      subl %edx, %eax  # get offset from start of block
      shrl $2, %eax  # divide by 4, to convert from byte offset to index
      ret
notthere:
      movl $-1, %eax
      ret
