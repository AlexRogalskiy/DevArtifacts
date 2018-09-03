SET PATH=%PATH%;C:\jdk1.3\bin;C:\jdk1.3\jre\bin\hotspot
SET INCLUDE_DIR=-IC:\jdk1.3\include -IC:\jdk1.3\include\win32

cl -GX /GR First.cpp
javac FirstProgram.java
cl -GX /GR testMax2.cpp max2.cpp
cl -GX /GR squares.cpp
cl -GX /GR stringConcat.cpp
cl -GX /GR swap2.cpp
cl -GX /GR binarySearchBad.cpp
cl -GX /GR binarySearch.cpp


cl -GX /GR stringPointer.cpp
cl -GX /GR leak.cpp
cl -GX /GR stale.cpp
cl -GX /GR returnStatic.cpp

cl -GX /GR deepIntCellBad.cpp
cl -GX /GR deepIntCell.cpp
cl -GX /GR intQueue1.cpp
cl -GX /GR intQueue2.cpp
cl -GX /GR intQueue3.cpp
cl -GX /GR intQueue4.cpp
cl -GX /GR refReturn.cpp
cl -GX /GR TestIntCell.cpp IntCell.cpp
cl -GX /GR TestTicket.cpp Ticket.cpp
cl -GX /GR TestMathUtils.cpp MathUtils.cpp

cl -GX /GR TestMatrixOfDouble.cpp
cl -GX /GR TestRational.cpp Rational.cpp

cl -GX /GR inherit1.cpp
cl -GX /GR interfaces.cpp
cl -GX /GR multiple.cpp
cl -GX /GR privateInheritance.cpp IntCell.obj
cl -GX /GR hiding.cpp

cl -GX /GR findMax.cpp IntCell.obj
cl -GX /GR ambiguous.cpp
cl -GX /GR TestObjectCell1.cpp
cl -GX /GR TestMatrix.cpp
cl -GX /GR TestObjectCell.cpp ObjectCellExpand.cpp
cl -GX /GR memberTemplates.cpp
cl -GX /GR funcObjects1.cpp
cl -GX /GR funcObjects2.cpp
cl -GX /GR funcObjects3.cpp

cl -GX /GR bad1.cpp
cl -GX /GR bad2.cpp
cl -GX /GR bad3.cpp
cl -GX /GR bad4.cpp
cl -GX /GR assertDemo.cpp
cl -GX /GR exceptionDemo.cpp

cl -GX /GR readData.cpp
cl -GX /GR formattedOutput.cpp
cl -GX /GR getlineDemo.cpp
cl -GX /GR lastChars.cpp
javac TwoInts.java
cl -GX /GR twoInts1.cpp
cl -GX /GR twoInts2.cpp
cl -GX /GR toString.cpp

cl -GX /GR printContainer.cpp
cl -GX /GR heterogeneousContainers.cpp
cl -GX /GR printReverse.cpp
cl -GX /GR queueDemo.cpp
cl -GX /GR mapDemo.cpp
cl -GX /GR concordance.cpp

cl -GX /GR getInts.cpp
cl -GX /GR pointerHopping.cpp
cl -GX /GR testEcho.cpp
cl -GX /GR printEnvironment.cpp
cl -GX /GR twoD.cpp

cl -GX /GR printDebug.cpp
cl -GX /GR reinterpretCast.cpp
cl -GX /GR swapPtr.cpp
cl -GX /GR friday13.cpp
cl -GX /GR copyFile.cpp
cl -GX /GR getlineFastDemo.cpp
cl -GX /GR lastCharsInC.cpp
cl -GX /GR qsortDemo.cpp
cl -GX /GR varargsDemo.cpp

javac HelloNativeTest.java
javah HelloNative
cl -GX /GR %INCLUDE_DIR% HelloNative.cpp -LD -FeHelloNative

javac TestDate.java Date.java
javah Date
cl -GX /GR -DVERSION=1 %INCLUDE_DIR% Date.cpp -LD -FeDate

javac StringAdd.java
javah StringAdd
cl -GX /GR -DVERSION=1 %INCLUDE_DIR% StringAdd.cpp -LD -FeStringAdd

javac NativeSumDemo.java
javah NativeSumDemo
cl -GX /GR -DVERSION=1 %INCLUDE_DIR% NativeSumDemo.cpp -LD -FeSum

javac StringStuff.java
javah StringStuff
cl -GX /GR %INCLUDE_DIR% StringStuff.cpp -LD -FeStringStuff

javac Hello.java
cl -GX /GR %INCLUDE_DIR% InvokeHello.cpp C:\jdk1.3\lib\jvm.lib
