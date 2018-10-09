#define WINAPI __stdcall /* __cdecl */

typedef unsigned short wchar_t;

typedef void VOID;
typedef void* HANDLE;
typedef void* PVOID;
typedef void** PHANDLE;
typedef char CHAR;
typedef short VARIANT_BOOL;
typedef int BOOL;
typedef long LONG;
typedef long HRESULT;
typedef unsigned char BYTE;
typedef unsigned char UCHAR;
typedef unsigned char BOOLEAN;
typedef unsigned char* LPBYTE;
typedef unsigned char* PBYTE;
typedef unsigned short WORD;
typedef unsigned short USHORT;
typedef wchar_t WCHAR;
typedef wchar_t* LPWSTR;
typedef wchar_t* PWCHAR;
typedef wchar_t const* LPCWSTR;
typedef unsigned int UINT;
typedef unsigned long DWORD;
typedef unsigned long ULONG;
typedef unsigned long* PDWORD;
typedef unsigned long long ULONGLONG;

typedef struct _GUID {
	unsigned long  Data1;
	wchar_t Data2;
	wchar_t Data3;
	unsigned char  Data4[ 8 ];
} GUID, UUID;

/*winerror.h*/
#define ERROR_ACCESS_DENIED 5
#define ERROR_INVALID_HANDLE 6
#define ERROR_NOT_ENOUGH_MEMORY 8
#define ERROR_INVALID_DATA 13
#define ERROR_GEN_FAILURE 31
#define ERROR_NOT_SUPPORTED 50
#define ERROR_INVALID_PARAMETER 87
#define ERROR_ALREADY_EXISTS 183
#define ERROR_NOT_FOUND 1168
#define ERROR_NO_MATCH 1169
#define ERROR_BAD_PROFILE 1206
#define ERROR_REMOTE_SESSION_LIMIT_EXCEEDED 1220
#define ERROR_INVALID_STATE 5023
#define ERROR_NDIS_DOT11_POWER_STATE_INVALID 2150899714

/*Implemented in Kernel32.dll*/
void WINAPI Sleep(unsigned long mSeconds);

/*stdlib.h*/
#define NULL 0
void free (void*);
void exit(int);
void* realloc (void*, int size_t);
void* malloc (int size_t);
int mbtowc (wchar_t* wchar, const char* mbchar, int count);

/*string.h*/
int strlen (const char*);
void* memcpy (void* dest, const void* src, int size);
int stricmp (const char* string1, const char* string2);
char* strcpy(char* dest, const char* source);
int strcmp(const char *s1, const char *s2);

/*RpcDce.h*/
#define RPCRTAPI __stdcall

/*Implemented in rpcrt4.dll*/
long RPCRTAPI UuidToStringW (const UUID * Uuid, wchar_t** StringUuid);
long RPCRTAPI UuidFromStringW (wchar_t* StringUuid, UUID* Uuid);
long RPCRTAPI RpcStringFreeW (wchar_t** String);
