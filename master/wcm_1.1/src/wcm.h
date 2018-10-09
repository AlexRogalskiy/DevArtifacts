/*stdio.h*/
int printf (const char* format, ...);
int sprintf (char* dest, const char* format, ...);

/*fcntl.h  Access mode for open */
#define	O_RDONLY	0
#define O_WRONLY	1
#define O_RDWR		2
#define	O_APPEND	0x0008	/* Writes will add to the end of the file. */
#define	O_CREAT		0x0100	/* Create the file if it does not exist. */
#define	O_TRUNC		0x0200	/* Truncate the file if it does exist. */
#define	O_EXCL		0x0400	/* Open only if the file does not exist. */
#define O_SHORT_LIVED  0x1000
/* NOTE: Text is the default even if the given O_TEXT bit is not on. */
#define	O_TEXT		0x4000	/* CR-LF in file becomes LF in memory. */
#define	O_BINARY	0x8000	/* Input and output is not translated. */
#define	O_RAW		O_BINARY

/*io.h*/
int open (const char* file, int mode, ...);
int read (int fileDescriptor, void* buffer, unsigned int bytes);
int write (int fileDescriptor, const void* buffer, unsigned int bytes);

/*--------------------.
|  Standar Functions  |
`--------------------*/

void freeMem(wchar_t** list);
int readFile (char** pData, char *file);
int unsignedShortStringLength (const wchar_t* src);
void printlnWCharString (wchar_t* wCharString);
void printWCharString (wchar_t* wCharString);
void pause();

/*--------------------.
|  Private Functions  |
`--------------------*/

#define FALSE 0
#define TRUE 1
void error (unsigned long errorNumber, char* mensaje);
/* the max lenght of the reason string in characters */
#define WLSAMPLE_REASON_STRING_LEN 256
void PrintReason(unsigned long reason);
#define WLAN_INVALID_COUNTER (unsigned long long)-1
void printCounterValue(unsigned long long value);
void Help(int argc, char* argv[]);
void ExecuteCommand(int argc, char* argv[]);
void pause();
void printlnSsid(DOT11_SSID ssid);
void printSsid(DOT11_SSID ssid);

/*-----------------.
|  Set Structures  |
`-----------------*/

void setConnectionParameters (PWLAN_CONNECTION_PARAMETERS parameters, PDOT11_SSID pDot11Ssid, char* connectionMode, wchar_t* profileName, char* bssType);
void setPhyRadioState (PWLAN_PHY_RADIO_STATE phyRadioState, char* radioState, unsigned long index);

/*-------------------.
|  Print Structures  |
`-------------------*/

void printAvailableNetwork (PWLAN_AVAILABLE_NETWORK pNetwork);
void printBssEntry(PWLAN_BSS_ENTRY pBss);
void printConnectionAttributes(PWLAN_CONNECTION_ATTRIBUTES pConnection);
void printConnectionNotificationData (PWLAN_CONNECTION_NOTIFICATION_DATA pData, unsigned long notificationCode);
void printRadioState(PWLAN_RADIO_STATE radioState);
void printAvailableNetworkList (PWLAN_AVAILABLE_NETWORK_LIST pList);
void printStatistics (PWLAN_STATISTICS pStatistics);
void printBssList (PWLAN_BSS_LIST pWlanBssList);
void printProfileInfoList (PWLAN_PROFILE_INFO_LIST pProfileList);
void printAvailableNetwork (PWLAN_AVAILABLE_NETWORK pNetwork);
void printInterfaceCapability (PWLAN_INTERFACE_CAPABILITY pCapability);
void printAuthCipherPairList(PWLAN_AUTH_CIPHER_PAIR_LIST list);
void printAuthCipherPair (PDOT11_AUTH_CIPHER_PAIR pair);
void printInterfaceInfoList (PWLAN_INTERFACE_INFO_LIST list);
void printInterfaceInfo (PWLAN_INTERFACE_INFO pInterface);

/*-------------------------------.
|  Format translation Functions  |
`-------------------------------*/

char* wCharToCharString (wchar_t* src);
void wCharToUCharString (const wchar_t* src, unsigned char* dest);
wchar_t* stringToWString (const char* src);
unsigned long wCharToSsid(const wchar_t* strSsid, PDOT11_SSID pSsid);
char* ssidToString(PDOT11_SSID pSsid);
wchar_t** stringToWStringList(char** profilesName);
DOT11_SSID* stringToSsid (const char* strSsid);
GUID* stringToGuid (const char* strGuid);

/*---------------------.
|  WLAN API Functions  |
`---------------------*/

void WINAPI NotificationCallback(PWLAN_NOTIFICATION_DATA pNotifData, void* pContext /*this parameter is not used*/);
void RegisterNotification(int argc, char* argv[]);
void SetProfile(int argc, char* argv[]);
void GetProfile(int argc, char* argv[]);
void DeleteProfile(int argc, char* argv[]);
void SetProfileList(int argc, char* argv[]);
void GetProfileList(int argc, char* argv[]);
void EnumInterface(int argc, char* argv[]);
void GetInterfaceCapability(int argc, char* argv[]);
void SetRadioState(int argc, char* argv[]);
void QueryInterface(int argc, char* argv[]);
void Scan(int argc, char* argv[]);
void GetVisibleNetworkList(int argc, char* argv[]);
void GetDriverStatistics(int argc, char* argv[]);
void GetBssList(int argc, char* argv[]);
void Connect(int argc, char* argv[]);
void Discover(int argc, char* argv[]);
void Disconnect(int argc, char* argv[]);
void SaveTemporaryProfile(int argc, char* argv[]);

/*------------------------------------.
|  Numeric Codes Translate Functions  |
`------------------------------------*/

char* GetInterfaceStateString (int wlanInterfaceState);
char* GetAcmNotificationString (int acmNotif);
char* GetMsmNotificationString (int msmNotif);
char* GetConnectionModeString (int wlanConnMode);
char* GetPhyTypeString (int uDot11PhyType);
char* GetBssTypeString (int dot11BssType);
char* GetRadioStateString (int radioState);
char* GetAuthAlgoString (int dot11AuthAlgo);
char* GetCipherAlgoString (int dot11CipherAlgo);
