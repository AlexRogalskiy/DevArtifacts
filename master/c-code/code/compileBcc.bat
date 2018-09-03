SET PATH=%PATH%;C:\jdk1.3\bin;C:\jdk1.3\jre\bin\hotspot
SET INCLUDE_DIR=-IC:\jdk1.3\include -IC:\jdk1.3\include\win32

bcc32 First.cpp
javac FirstProgram.java
bcc32 testMax2.cpp max2.cpp
bcc32 -w-8012 squares.cpp
bcc32 stringConcat.cpp
bcc32 swap2.cpp
bcc32 binarySearchBad.cpp
bcc32 binarySearch.cpp


bcc32 stringPointer.cpp
bcc32 leak.cpp
bcc32 stale.cpp
bcc32 returnStatic.cpp

bcc32 deepIntCellBad.cpp
bcc32 deepIntCell.cpp
bcc32 -w-inl intQueue1.cpp
bcc32 -w-inl intQueue2.cpp
bcc32 -w-inl intQueue3.cpp
bcc32 -w-inl intQueue4.cpp
bcc32 -w-8012 refreturn.cpp
bcc32 -c TestIntCell.cpp IntCell.cpp
bcc32 TestIntCell.obj IntCell.obj
bcc32 TestTicket.cpp Ticket.cpp
bcc32 -w-inl TestMathUtils.cpp MathUtils.cpp

bcc32 -w-inl TestMatrixOfDouble.cpp
bcc32 TestRational.cpp Rational.cpp

bcc32 inherit1.cpp
bcc32 interfaces.cpp
bcc32 multiple.cpp
bcc32 privateInheritance.cpp IntCell.obj
bcc32 hiding.cpp

bcc32 -w-8012 findMax.cpp IntCell.obj
bcc32 ambiguous.cpp
bcc32 TestObjectCell1.cpp
bcc32 -w-inl TestMatrix.cpp
bcc32 TestObjectCell.cpp ObjectCellExpand.cpp
bcc32 memberTemplates.cpp
bcc32 -w-8012 funcObjects1.cpp
bcc32 -w-8012 funcObjects2.cpp
bcc32 -w-8012 funcObjects3.cpp

bcc32 bad1.cpp
bcc32 bad2.cpp
bcc32 bad3.cpp
bcc32 bad4.cpp
bcc32 assertDemo.cpp
bcc32 exceptionDemo.cpp

bcc32 -w-8012 readData.cpp
bcc32 -w-8012 formattedOutput.cpp
bcc32 getlineDemo.cpp
bcc32 lastChars.cpp
javac TwoInts.java
bcc32 twoInts1.cpp
bcc32 twoInts2.cpp
bcc32 toString.cpp

bcc32 printContainer.cpp
bcc32 heterogeneousContainers.cpp
bcc32 printReverse.cpp
bcc32 queueDemo.cpp
bcc32 mapDemo.cpp
bcc32 concordance.cpp

bcc32 getInts.cpp
bcc32 pointerHopping.cpp
bcc32 testEcho.cpp
bcc32 -w-par printEnvironment.cpp
bcc32 twoD.cpp

bcc32 printDebug.cpp
bcc32 reinterpretCast.cpp
bcc32 swapPtr.cpp
bcc32 friday13.cpp
bcc32 copyFile.cpp
bcc32 getlineFastDemo.cpp
bcc32 lastCharsInC.cpp
bcc32 qsortDemo.cpp
bcc32 varargsDemo.cpp

javac HelloNativeTest.java
javah HelloNative
bcc32 -w-par -c %INCLUDE_DIR% HelloNative.cpp
bcc32 -tWD HelloNative.obj

javac TestDate.java Date.java
javah Date
bcc32 -w-par -c %INCLUDE_DIR% -DVERSION=1 Date.cpp
bcc32 -tWD Date.obj

javac StringAdd.java
javah StringAdd
bcc32 -w-par -c %INCLUDE_DIR% -DVERSION=1 StringAdd.cpp
bcc32 -tWD StringAdd.obj

javac NativeSumDemo.java
javah NativeSumDemo
bcc32 -w-par -c %INCLUDE_DIR% -DVERSION=1 NativeSumDemo.cpp
bcc32 -tWD NativeSumDemo.obj -oSum.dll

javac StringStuff.java
javah StringStuff
bcc32 -w-par -c %INCLUDE_DIR% StringStuff.cpp
bcc32 -tWD StringStuff.obj

javac Hello.java
bcc32 -w-par %INCLUDE_DIR% InvokeHello.cpp C:\jdk1.3\lib\jvm.lib
