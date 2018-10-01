#include <stdio.h>
#include <assert.h>

// The following macro lets us treat the ÒrealÓ type that fpadd and fpsub
// deal with as a C float type.

#define asreal(x) (*((float *) &x))


// The ÒrealÓ type that fpadd and fpsub deal with.  WeÕll use
// a 32-bit unsigned integer so we can easily get at the bits.

typedef long unsigned real;


// Here are some utility functions that extract various fields
// of our 32-bit floating point values:
//
// extractExponent-
//
// Extracts bits 23..31 (which contain the exponent) and
// subtracts out 127 to convert the bias-127 exponent to a
// signed number

inline int extractExponent( real from )
{
    return ((from >> 23) & 0xff) - 127;
}


// extractMantissa-
//
// Extracts bits 0..22 from the number and then sets bit 23 to
// one (the implied bit).  Unless, of course, the value is zero,
// in which case this function simply returns zero.

inline int extractMantissa( real from )
{
    if( from == 0 ) return 0;
    return ((from & 0xFFFFFF) | 0x800000 );
}

// extractSign-
//
// Returns the sign of the mantissa.

inline int extractSign( real from )
{
    return( from >> 31);
}


// packFP-
//
// Packs the sign, exponent, and mantissa fields into a
// 32-bit "real" value.  Works for normalized values, denormalized
// values, and zero, but does not work for NaNs and infinities.

inline real packFP( int sign, int exponent, int mantissa )
{
   return 
        (real)
        ( 
                (sign << 31) 
            |   ((exponent + 127) << 23)  
            |   (mantissa & 0x7fffff)
        );
}


// shiftAndRound-
//
// Shifts a mantissa to the right the number of bits specified.
// Rounds the result according to the IEEE rules for rounding, which
// are:
//
//  If the bits we shift out are a value that is greater than one-half the value
//   of the L.O. bit we are left with, then we need
//   to round the value up by adding one to the L.O. bit position.
//  If the bits we shift out are a value that is less than one-half the value
//   of the L.O. bit we are left with (after denormalization), then we need
//   to round the value down (i.e., just leave the value alone).
//  If the bits we shift out are exactly one-half the value of the L.O. bit
//   we are left with, then we need to round the value to the number that has
//   a zero in the L.O. bit (round up if there's currently a one, leave the
//   value unchanged if the L.O. bit contains a zero).

void shiftAndRound( long unsigned *valToShift, int bitsToShift )
{
    // Masks is used to mask out bits to check for a "sticky" bit.
    
    static unsigned masks[24] =
    {
        0, 1, 3, 7, 0xf, 0x1f, 0x3f, 0x7f, 
        0xff, 0x1ff, 0x3ff, 0x7ff, 0xfff, 0x1fff, 0x3fff, 0x7fff,
        0xffff, 0x1ffff, 0x3ffff, 0x7ffff, 0xfffff, 0x1fffff, 0x3fffff, 0x7fffff
    };
        
    // HOmasks - masks out the H.O. bit of the value masked by the masks entry.
    
    static unsigned HOmasks[24] =
    {
        0, 
        1, 2, 4, 0x8, 0x10, 0x20, 0x40, 0x80, 
        0x100, 0x200, 0x400, 0x800, 0x1000, 0x2000, 0x4000, 0x8000, 
        0x10000, 0x20000, 0x40000, 0x80000, 0x100000, 0x200000, 0x400000
    };
        
    // shiftedOut- Holds the value that will be shifted out of a mantissa
    // during the denormalization operation (used to round a denormalized value).
    
    int             shiftedOut;
    
    assert( bitsToShift <= 23 );
    
    
    // Okay, first grab the bits we're going to shift out (so we can determine
    // how to round this value after the shift).
    
    shiftedOut = *valToShift & masks[ bitsToShift ];
    
    // Shift the value to the right the specified number of bits:
    
    *valToShift = *valToShift >> bitsToShift;
    
    // If necessary, round the value:
    
    if( shiftedOut > HOmasks[ bitsToShift ] )
    {
        // If the bits we shifted out are greater than 1/2 the L.O. bit, then
        // round the value up by one.
       
        *valToShift = *valToShift + 1;
    }
    else if( shiftedOut == HOmasks[ bitsToShift ] )
    {
        // If the bits we shifted out are exactly 1/2 of the L.O. bit's value,
        // then round the value to the nearest number whose L.O. bit is zero.
       
        *valToShift = *valToShift + ((*valToShift & 1) == 1);
    }
    // else we round the value down to the previous value.  The current
    // value is already truncated (rounded down), so we don't have to do anything.
}

    
       
       
    


// fpadd-
//
//   Computes: 
//      dest = left + right
// where all three operands are ÒrealÓ values (32-bit floats).

void fpadd( real left, real right, real *dest )
{   
    // The following variables hold the fields associated with the left operand
    
    int             Lexponent;
    long unsigned   Lmantissa;
    int             Lsign;
    
    // The following variables hold the fields associated with the right operand.
    
    int             Rexponent;
    long unsigned   Rmantissa;
    int             Rsign;
    
    // The following variables hold the separate fields of the result.
    
    int   Dexponent;
    long  unsigned Dmantissa;
    int   Dsign;

    
    // Extract the fields so that theyÕre easy to work with:
    
    Lexponent = extractExponent( left );
    Lmantissa = extractMantissa( left );
    Lsign     = extractSign( left );
    
    Rexponent = extractExponent( right );
    Rmantissa = extractMantissa( right );
    Rsign     = extractSign( right );
    
    
    // Code to handle special operands (infinity and NaNs)
    
    if( Lexponent == 127 )
    {
        if( Lmantissa == 0 )
        {
            // If the left operand is infinity, then the result
            // depends upon the value of the right operand.
            
            if( Rexponent == 127 )
            {
                // If the exponent is all one bits (127 after unbiasing)
                // then the mantissa determines if we have an infinity value
                // (zero mantissa), a QNaN (mantissa = 0x800000) or a SNaN
                // (non-zero mantissa not equal to 0x800000). 
                
                if( Rmantissa == 0 )  // Do we have infinity?
                {
                    // infinity + Infinity = Infinity
                    // -infinity - infinity = -infinity
                    // -infinity + infinity = NaN
                    // infinity - infinity = NaN
                    
                    if( Lsign == Rsign )
                    {
                        *dest = right;
                    }
                    else
                    {
                        *dest = 0x7fC00000;  // +QNaN
                    }
                }
                else  // Rmantissa is non-zero, so it's a NaN
                {
                    *dest = right;  // Right is a NaN, propogate it.
                }
            }
            
        }
        else // Lmantissa is non-zero, Lexponent is all ones.
        {
            //  If the left operand is some NaN, then the result will
            // also be the same NaN.
            
            *dest = left;
        }
        
        // We've already calculated the result, so just return.
        
        return;
        
    }
    else if( Rexponent == 127 )
    {
        // Two case: right is either a NaN (in which case we need to
        // propogate the NaN regardless of left's value) or it is
        // +/- infinity.  Since left is a "normal" number, we'll also
        // wind up propogating the infinity since any normal number
        // plus infinity is infinity.
        
        *dest = right;  // Right is a NaN, propogate it.
        return;
    }
    


    // Okay, we've got two actual floating point values.  Let's add them together.
    // First, we have to "denormalize" one of the operands if their exponents aren't
    // the same (when adding or subtracting values, the exponents must be the same).
    // 
    // Algorithm: choose the value with the smaller exponent.  Shift its mantissa
    // to the right the number of bits specified by the difference between the two
    // exponents.
    
    if( Rexponent > Lexponent )
    {
        shiftAndRound( &Lmantissa, (Rexponent - Lexponent));
        Dexponent = Rexponent;
    }
    else if( Rexponent < Lexponent )
    {
        shiftAndRound( &Rmantissa, (Lexponent - Rexponent));
        Dexponent = Lexponent;
    }
    
    // Okay, add the mantissas.  There is one catch, if the signs are opposite
    // then weÕve actually got to subtract one value from the other (since the
    // FP format is 1Õs complement, weÕll subtract the larger mantissa from the
    // smaller and set the destination sign according to a combination of the
    // original sign values and the largest mantissa).

    if( Rsign ^ Lsign )
    {
        // Signs are different, must subtract one value from the other.
        
        if( Lmantissa > Rmantissa )
        {
            // The left value is greater, so the result inherits the
            // sign of the left operand.
       
            Dmantissa = Lmantissa - Rmantissa;
            Dsign = Lsign;
        }
        else
        {
            // The right value is greater, so the result inherits the
            // sign of the right operand.
       
            Dmantissa = Rmantissa - Lmantissa;
            Dsign = Rsign;
        }
        
    }
    else
    {
        // Signs are the same, so add the values:
        
        Dsign = Lsign;
        Dmantissa = Lmantissa + Rmantissa;
    }
    
    // Normalize the result here
    //
    // Note that during addition/subtraction, overflow of one bit is possible.
    // deal with that possibility here (if overflow occured, shift the mantissa
    // to the right one position and adjust for this by incrementing the exponent).
    // Note that this code returns infinity if overflow occurs when incrementing
    // the exponent (infinity is a value with an exponent of $FF);

   if( Dmantissa >= 0x1000000 )
    {
        // Never more than one extra bit when doing addition/subtraction.
        // Note that by virtue of the floating point format we're using,
        // the maximum value we can produce via addition or subtraction is
        // a mantissa value of 0x1fffffe.  Therefore, when we round this
        // value it will not produce an overflow into the 25th bit.
        
        shiftAndRound( &Dmantissa, 1 ); // Move result into 24 bits.
        ++Dexponent;                    // Shift operation did a div by two,
                                        //  this counteracts the effect of
                                        //  the shift (incrementing exponent
                                        //  multiplies the value by two).
    }
    else
    {
        // If the H.O. bit is clear, normalize the result
        // by shifting bits up and simultaneously decrementing
        // the exponent.  We will treat zero as a special case
        // because it's a common enough result.
        
        if( Dmantissa != 0 )
        {
            
            // The while loop multiplies the mantissa by two (via a left shift)
            // and then divides the whole number by two (by decrementing the
            // exponent.  This continues until the H.O. bit of Dmantissa is
            // set or the exponent becomes -127 (zero in the biased-127 form).
            // If Dexponent drops down to -128, then we've got a denormalized
            // number and we can stop.
                                                         
            while( (Dmantissa < 0x800000) && (Dexponent > -127 ))
            {
                Dmantissa = Dmantissa << 1;
                --Dexponent;
            }
            
        }
        else
        {
            // If the mantissa went to zero, clear everything else, too.
            
            Dsign = 0;
            Dexponent = 0;
        }
    }
    
    // Reconstruct the result and store it away:

    *dest = packFP( Dsign, Dexponent, Dmantissa );
    
}
                                                         
                                                         
                                                         
                                                         

// We could repeat all the code above for subtract, or we could do subtraction
// the easy way by flipping one of the signs and doing an add.  Guess which way
// this is :-)

void fpsub( real left, real right, real *dest )
{

    right = right ^ 0x80000000;
    fpadd( left, right, dest );
}


// A simple main program that does some trivial tests on fpadd and fpsub.

int main( int argc, char **argv )
{
    real l, r, d;
    
    asreal(l) = 1.0;

    asreal(r) = 2.0;
    
    fpadd( l, r, &d );
    printf( "dest = %x\n", d );
    printf( "dest = %12E\n", asreal( d ));
    
    l = d;
    asreal(r) = 4.0;
    fpsub( l, r, &d );
    printf( "dest2 = %x\n", d );
    printf( "dest2 = %12E\n", asreal( d ));
}