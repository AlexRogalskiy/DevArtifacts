#include "windows.h"
#include "wlanapi.h"
#include "wcm.h"

/*Global variable. A handle to the service*/
HANDLE handle = NULL;

/*---------------------.
|  WLAN API Functions  |
`---------------------*/

/* Notification callback function */
void WINAPI NotificationCallback(PWLAN_NOTIFICATION_DATA pNotifData, void* pContext /*this parameter is not used*/)
{
	if (pNotifData==NULL) return;
	
	if (pNotifData->NotificationSource == WLAN_NOTIFICATION_SOURCE_ACM)
	{
		printf("Got notification %s from ACM.\n", GetAcmNotificationString(pNotifData->NotificationCode)); 

		if (pNotifData->dwDataSize < sizeof(WLAN_CONNECTION_NOTIFICATION_DATA)) return;		
		printConnectionNotificationData ((PWLAN_CONNECTION_NOTIFICATION_DATA)pNotifData->pData, pNotifData->NotificationCode);
	}
	
	else if (pNotifData->NotificationSource == WLAN_NOTIFICATION_SOURCE_MSM)
		printf("Got notification %s from MSM.\n", GetMsmNotificationString(pNotifData->NotificationCode)); 
	
	else printf("Got another notification.\n"); 
 }

/* Register for notification */
void RegisterNotification(int argc, char* argv[])
{
  	unsigned long dwError = 0;
	if (argc != 1) error (ERROR_INVALID_PARAMETER, NULL);

	/* register for ACM and MSM notifications */
	unsigned long dwPrevNotifType = 0;
	dwError = WlanRegisterNotification
	(
		handle, WLAN_NOTIFICATION_SOURCE_ACM | WLAN_NOTIFICATION_SOURCE_MSM,
		FALSE/*do not ignore duplications*/, NotificationCallback,
		NULL/*no callback context is needed*/, NULL/*reserved*/, &dwPrevNotifType
	);
	
	if (dwError != 0) error (dwError, "when trying to register notifications.\n");

	printf("ACM and MSM notifications are successfully registered. Press enter to exit.\n");

	/* wait for the user to press a key */
	pause();

	/* unregister notifications */
	dwError = WlanRegisterNotification
	(
		handle, WLAN_NOTIFICATION_SOURCE_NONE, FALSE/*do not ignore duplications*/,
		NULL/*no callback function is needed*/, NULL/*no callback context is needed*/,
		NULL/*reserved*/, &dwPrevNotifType
	);
	
	if (dwError == 0) printf("ACM and MSM notifications are successfully unregistered.\n");
	else error (dwError, "when trying to unregister notifications.\n");
}

/* set profile */
void SetProfile(int argc, char* argv[])
{
 	unsigned long dwError;
	if (argc != 3) error (ERROR_INVALID_PARAMETER, NULL);

	GUID* pGuid = stringToGuid(argv[1]);

	/* get XML string out from the file */
	
	char* file;
	dwError = readFile (&file, argv[2]);
	if (dwError == -1) error (-1, "Error: can't read the expecified file.\n");
	
	wchar_t* bstrXml = NULL;
	bstrXml = stringToWString(file);
	free(file);

	/* set profile */
	unsigned long dwReason;
	dwError = WlanSetProfile
	(
		handle, pGuid, 0/*no flags for the profile*/,
		bstrXml, NULL/*use the default ACL*/,
		TRUE/*overwrite a profile if it already exists*/,
		NULL/*reserved*/, &dwReason
	);

	free(bstrXml);
	free(pGuid);

	if (dwError == ERROR_BAD_PROFILE) PrintReason(dwReason);
	if (dwError!=0) error (dwError, "in function WlanSetProfile.\n");
	else printf("Command %s completed successfully.\n", argv[0]);
		
}

/* get profile */
void GetProfile(int argc, char* argv[])
{
 	unsigned long dwError = 0;
	if (argc != 3) error (ERROR_INVALID_PARAMETER, NULL);

	GUID* pGuid = stringToGuid(argv[1]);
	
	/* get profile */
	wchar_t* profileName = stringToWString(argv[2]);
	wchar_t* strXml;
	dwError = WlanGetProfile
	(
		handle,  pGuid, profileName, NULL/*reserved*/,
		&strXml/*XML string of the profile*/,
		NULL/*not interested in the profile flags*/,
		NULL/*don't care about ACL*/
	);

	free(profileName);
	free(pGuid);
	
	if (dwError == 0)
	{
		printf("The return profile xml is:\n");
		printlnWCharString(strXml);	
		WlanFreeMemory(strXml);
	}
	else error (-1, "The expecified profile doesn't exist.\nUse \"GetProfileList(gpl)\" to see available profiles.\n");
}

/* delete profile */
void DeleteProfile(int argc, char* argv[])
{
 	unsigned long dwError = 0;
	if (argc!=3) error (ERROR_INVALID_PARAMETER, NULL);

	GUID* pGuid = stringToGuid(argv[1]);
	
	/* delete profile */
	wchar_t* profileName = stringToWString(argv[2]);

	dwError = WlanDeleteProfile (handle, pGuid, profileName/*profile name*/, NULL/*reserved*/); 

	free(profileName);
	free(pGuid);
	
	if (dwError!=0) error (dwError, "in function WlanDeleteProfile.\n");
	else printf("Command %s completed successfully.\n", argv[0]);
}

/* set profile list */
void SetProfileList(int argc, char* argv[])
{
 	unsigned long dwError = 0;
	if (argc<3) error (ERROR_INVALID_PARAMETER, NULL);
		
	GUID* pGuid = stringToGuid(argv[1]);
	
	wchar_t** profilesName = stringToWStringList(argv+2);

	/* set profile list */
	dwError = WlanSetProfileList
	(
		handle, pGuid, argc - 2/*number of profiles*/,
		(const wchar_t**) profilesName /*the list of profiles name*/,
		NULL/*reserved*/
	);
	
	freeMem (profilesName);
	free(pGuid);
	
	if (dwError!=0) error (dwError, "in function WlanSetProfileList.\n");
	else printf("Command %s completed successfully.\n", argv[0]);
}

/* get the list of profiles */
void GetProfileList(int argc, char* argv[])
{
 	unsigned long dwError = 0;
	if (argc != 2) error (ERROR_INVALID_PARAMETER, NULL);

	GUID* pGuid = stringToGuid(argv[1]);

	/* get profile list */
	PWLAN_PROFILE_INFO_LIST pProfileList = NULL;
	dwError = WlanGetProfileList(handle, pGuid, NULL/*reserved*/, &pProfileList);
	if (dwError!=0) error (dwError, "in function WlanGetProfileList.\n");

	free(pGuid);

	printProfileInfoList(pProfileList);
	if (pProfileList != NULL) WlanFreeMemory(pProfileList);
}

/* enumerate wireless interfaces */
void EnumInterface(int argc, char* argv[])
{
 	unsigned long dwError = 0;
	if (argc != 1) error (ERROR_INVALID_PARAMETER, NULL);

	/* enumerate wireless interfaces */
	PWLAN_INTERFACE_INFO_LIST pIntfList = NULL;
	dwError = WlanEnumInterfaces (handle, NULL/*reserved*/, &pIntfList);
	if (dwError!=0) error (dwError, "in function WlanEnumInterfaces.\n");

	printInterfaceInfoList(pIntfList);
	if (pIntfList != NULL) WlanFreeMemory(pIntfList);
}

/* get interface capability and supported auth/cipher */
void GetInterfaceCapability(int argc, char* argv[])
{
 	unsigned long dwError = 0;
	if (argc != 2) error (ERROR_INVALID_PARAMETER, NULL);

	GUID* pGuid = stringToGuid(argv[1]);
	
	PWLAN_INTERFACE_CAPABILITY pCapability = NULL;
	dwError = WlanGetInterfaceCapability(handle, pGuid, NULL/*reserved*/, &pCapability);
	if (dwError!=0) error (dwError, "in function WlanGetInterfaceCapability.\n");
	
	printInterfaceCapability (pCapability);
	
	/* query supported auth/cipher for infrastructure */
	PWLAN_AUTH_CIPHER_PAIR_LIST pSupportedAuthCipherList = NULL;
	unsigned long dwDataSize;
	dwError = WlanQueryInterface
	(
		handle, pGuid,
		wlan_intf_opcode_supported_infrastructure_auth_cipher_pairs,
		NULL/*reserved*/, &dwDataSize,
		(void* *)&(pSupportedAuthCipherList),
		NULL/*not interesed in the type of the opcode value*/
	);
	
	if (dwError!=0) error (dwError, "in function WlanQueryInterface.\n");

	printf("Supported auth cipher pairs (infrastructure):\n");
	printAuthCipherPairList(pSupportedAuthCipherList);

	WlanFreeMemory(pSupportedAuthCipherList);
	pSupportedAuthCipherList = NULL;

	/* query supported auth/cipher for ad hoc */
	dwError = WlanQueryInterface
	(
		handle, pGuid,
		wlan_intf_opcode_supported_adhoc_auth_cipher_pairs,
		NULL/*reserved*/, &dwDataSize,
		(void**)&(pSupportedAuthCipherList),
		NULL/*not interesed in the type of the opcode value*/
	);
	
	if (dwError!=0) error (dwError, "in function WlanQueryInterface.\n");

	/* print auth/cipher algorithms */
	printf("Supported auth cipher pairs (ad hoc):\n");
	printAuthCipherPairList(pSupportedAuthCipherList);
	
	WlanFreeMemory(pSupportedAuthCipherList);
	free(pGuid);
}

/* set the radio state */
void SetRadioState(int argc, char* argv[])
{
 	unsigned long dwError = 0;
	if (argc != 3) error (ERROR_INVALID_PARAMETER, NULL);

	WLAN_PHY_RADIO_STATE wlanPhyRadioState;
	setPhyRadioState (&wlanPhyRadioState, argv[2], 0/*don't mind index*/);
	
	GUID* pGuid = stringToGuid(argv[1]);

	/* get interface capability, which includes the supported PHYs */
	PWLAN_INTERFACE_CAPABILITY pInterfaceCapability = NULL;
	dwError = WlanGetInterfaceCapability (handle, pGuid, NULL/*reserved*/, &pInterfaceCapability);
	if (dwError!=0) error (dwError, "in function WlanGetInterfaceCapability.\n");

	/* set radio state on every PHY */
	int i;
	for (i = 0; i < pInterfaceCapability->dwNumberOfSupportedPhys; i++)
	{
		/* set radio state on every PHY */
		wlanPhyRadioState.dwPhyIndex = i;

		dwError = WlanSetInterface
		(
			handle, pGuid, wlan_intf_opcode_radio_state, 
			sizeof(wlanPhyRadioState), (PBYTE)&wlanPhyRadioState,
			NULL/*reserved*/
		);
		
		if (dwError!=0) error (dwError, "in function WlanSetInterface.\n"); /* rollback is nice to have, but not required */
	}
	if (pInterfaceCapability != NULL) WlanFreeMemory(pInterfaceCapability);
	free(pGuid);
}

/* query basic interface information */
void QueryInterface(int argc, char* argv[])
{
 	unsigned long dwError = 0;
	if (argc != 2) error (ERROR_INVALID_PARAMETER, NULL);

	GUID* pGuid = stringToGuid(argv[1]);

	/* query radio state information */
	/* this opcode is not supported in XP */
	void* pData = NULL;
	unsigned long dwDataSize = 0;

	dwError = WlanQueryInterface
	(
		handle, pGuid, wlan_intf_opcode_radio_state,
		NULL/*reserved*/, &dwDataSize, &pData,
		NULL/*not interesed in the type of the opcode value*/
	);
	
	if (dwError!=0 && dwError!=ERROR_NOT_SUPPORTED) error (dwError, "in function WlanQueryInterface.\n");
	
	if (dwError == ERROR_NOT_SUPPORTED) printf("Querying radio state is not supported.\n");
	else
	{
		if (dwDataSize != sizeof(WLAN_RADIO_STATE)) error (ERROR_INVALID_DATA, NULL);
		printRadioState((PWLAN_RADIO_STATE)pData);
		WlanFreeMemory(pData);
		pData = NULL;
	}

	/* query interface state */
	dwError = WlanQueryInterface
	(
		handle, pGuid, wlan_intf_opcode_interface_state,
		NULL/*reserved*/, &dwDataSize, &pData,
		NULL/*not interesed in the type of the opcode value*/
	);
	
	if (dwError != 0) error (dwError, "in function WlanQueryInterface.\n");
	if (dwDataSize != sizeof(WLAN_INTERFACE_STATE))	error (ERROR_INVALID_DATA, NULL);
	
	WLAN_INTERFACE_STATE isState = *((PWLAN_INTERFACE_STATE)pData);
	printf("Interface state: %s\n", GetInterfaceStateString(isState));

	WlanFreeMemory(pData);
	pData = NULL;

	/* query the current connection */
	dwError = WlanQueryInterface
	(
		handle, pGuid, wlan_intf_opcode_current_connection,
		NULL/*reserved*/, &dwDataSize, &pData,
		NULL/*not interesed in the type of the opcode value*/
	);
	
	PWLAN_CONNECTION_ATTRIBUTES pCurrentNetwork = NULL;
	if (dwError == 0 && dwDataSize == sizeof(WLAN_CONNECTION_ATTRIBUTES))
		pCurrentNetwork = (PWLAN_CONNECTION_ATTRIBUTES)pData;

	/* we don't treat ERROR_INVALID_STATE as an printErrorMsg for querying the interface */
	if (dwError == ERROR_INVALID_STATE) dwError=0;

	/* print current connection information */
	printConnectionAttributes(pCurrentNetwork);

	if (pData!=NULL) WlanFreeMemory(pData);
	free(pGuid);
}

/* scan */
void Scan(int argc, char* argv[])
{
 	unsigned long dwError = 0;
	if (argc != 2) error (ERROR_INVALID_PARAMETER, NULL);

	GUID* pGuid = stringToGuid(argv[1]);

	/* scan */
	dwError = WlanScan
	(
		handle, pGuid,
		NULL/*don't perform additional probe for a specific SSID*/,
		NULL/*no IE data for the additional probe*/,
		NULL/*reserved*/
	);
	
	free(pGuid);
	
	if (dwError != 0) error (dwError, "in function WlanScan.\n");
	else printf("Command %s completed successfully.\n", argv[0]);
}

/* get the list of visible wireless networks */
void GetVisibleNetworkList(int argc, char* argv[])
{
	unsigned long dwError = 0;
	if (argc != 2) error (ERROR_INVALID_PARAMETER, NULL);

	GUID* pGuid = stringToGuid(argv[1]);

	PWLAN_AVAILABLE_NETWORK_LIST pVList = NULL;
	dwError = WlanGetAvailableNetworkList (handle, pGuid, 0, /*only show visible networks*/ NULL/*reserved*/, &pVList);
	if (dwError != 0) error (dwError, "in function WlanGetAvailableNetworkList.\n");
	
	/* print all visible networks */
	printAvailableNetworkList(pVList);
	
	WlanFreeMemory(pVList);
	free(pGuid);
}	

/* get driver statistics */
void GetDriverStatistics(int argc, char* argv[])
{
 	unsigned long dwError = 0;
	if (argc != 2) error (ERROR_INVALID_PARAMETER, NULL);

	GUID* pGuid = stringToGuid(argv[1]);

	void* pData = NULL;
	unsigned long dwSize;
	dwError = WlanQueryInterface
	(
		handle, pGuid, wlan_intf_opcode_statistics,
		NULL/*reserved*/, &dwSize, &pData,
		NULL/*not interesed in the type of the opcode value*/
	);
	
	if (dwError != 0) error (dwError, "in function WlanQueryInterface.\n");

	/* print statistics information */
	printStatistics ((PWLAN_STATISTICS)pData);
	
	WlanFreeMemory(pData);
	free(pGuid);
}

/* get BSS list */
void GetBssList(int argc, char* argv[])
{
 	unsigned long dwError = 0;
	if (argc != 2 && argc != 5) error (ERROR_INVALID_PARAMETER, NULL);

	GUID* pGuid = stringToGuid(argv[1]);

	PDOT11_SSID pSsid = NULL;
	DOT11_BSS_TYPE dot11BssType = dot11_BSS_type_any;
	long bSecurityEnabled = TRUE;

	if (argc == 5)
	{
		pSsid = stringToSsid(argv[2]);

		/* get BSS type */
		if (stricmp(argv[3],"adhoc") == 0 || stricmp(argv[3], "a") == 0)
			dot11BssType = dot11_BSS_type_independent;
			
		else if (stricmp(argv[3], "infrastructure") == 0 || stricmp(argv[3], "i") == 0)
			dot11BssType = dot11_BSS_type_infrastructure;
			
		else error (ERROR_INVALID_PARAMETER, NULL);

		/* get whether security enabled or not */
		if (stricmp(argv[4], "secure") == 0 || stricmp(argv[4], "s") == 0)
			bSecurityEnabled = TRUE;
			
		else if (stricmp(argv[4], "unsecure") == 0 || stricmp(argv[4], "u") == 0)
			bSecurityEnabled = FALSE;
			
		else error (ERROR_INVALID_PARAMETER, NULL);
	}
			
	PWLAN_BSS_LIST pWlanBssList = NULL;
	dwError = WlanGetNetworkBssList
	(
		handle, pGuid, pSsid,
		dot11BssType, bSecurityEnabled,
		NULL/*reserved*/, &pWlanBssList
	);
	if (dwError != 0) error (dwError, "in function WlanGetNetworkBssList.\n");
	
	printBssList(pWlanBssList);
	
	WlanFreeMemory(pWlanBssList);
	free(pGuid);
	free(pSsid);
}

/* connect to a network using a saved profile */
void Connect(int argc, char* argv[])
{
 	unsigned long dwError = 0;
	if (argc != 5) error (ERROR_INVALID_PARAMETER, NULL);

	GUID* pGuid = stringToGuid(argv[1]);

	wchar_t* profileName = stringToWString(argv[4]);
	DOT11_SSID* pSsid = stringToSsid(argv[2]);

	WLAN_CONNECTION_PARAMETERS wlanConnPara;
	setConnectionParameters (&wlanConnPara, pSsid, "profile", profileName, argv[3]);
		
	dwError = WlanConnect (handle, pGuid, &wlanConnPara, NULL/*reserved*/);
	
	free(profileName);
	free(pGuid);
	free(pSsid);
	
	if (dwError != 0) error (dwError, "in function WlanConnect.\n");
	else printf("Command %s completed successfully.\n", argv[0]);
}

/* discovery a network without using a saved profile */
void Discover(int argc, char* argv[])
{
 	unsigned long dwError = 0;
	if (argc != 5) error (ERROR_INVALID_PARAMETER, NULL);

	GUID* pGuid = stringToGuid(argv[1]);
	DOT11_SSID* pSsid = stringToSsid(argv[2]);
	
	WLAN_CONNECTION_PARAMETERS wlanConnPara;
	setConnectionParameters (&wlanConnPara, pSsid, argv[4], NULL, argv[3]);	

	dwError = WlanConnect (handle, pGuid, &wlanConnPara, NULL/*reserved*/);

	free(pGuid);
	free(pSsid);

 	if (dwError != 0) error (dwError, "in function WlanConnect.\n");
	else printf("Command %s completed successfully.\n", argv[0]);
}

/* disconnect from the current network */
void Disconnect(int argc, char* argv[])
{
 	unsigned long dwError = 0;
	if (argc != 2) error (ERROR_INVALID_PARAMETER, NULL);

	GUID* pGuid = stringToGuid(argv[1]);
	
	dwError = WlanDisconnect (handle,  pGuid, NULL/*reserved*/);

	free(pGuid);

  	if (dwError != 0) error (dwError, "in function WlanDisconnect.\n");
	else printf("Command %s completed successfully.\n", argv[0]);
}

/* save a temporary profile */
/* a temporary profile can be generated by the service for discovery */
/* or passed with WlanConnect when the connection mode is wlan_connection_mode_temporary_profile */
void SaveTemporaryProfile(int argc, char* argv[])
{
 	unsigned long dwError = 0;
	if (argc != 3) error (ERROR_INVALID_PARAMETER, NULL);

	GUID* pGuid = stringToGuid(argv[1]);

	wchar_t* profileName = stringToWString(argv[2]);

	dwError = WlanSaveTemporaryProfile
	(
		handle, pGuid, profileName/*profile name*/,
		NULL/*use default ACL*/, 0/*no profile flags*/,
		TRUE/*overwrite the existing profile*/,
		NULL/*reserved*/
	);
	
	free(profileName);
	free(pGuid);
	
  	if (dwError != 0) error (dwError, "in function WlanSaveTemporaryProfile.\n");
	else printf("Command %s completed successfully.\n", argv[0]);
}

/*--------------------.
|  Standar Functions  |
`--------------------*/

void freeMem(wchar_t** list)
{
	int i = 0;
	while (list[i]!=NULL) { free(list[i]); i++; }
}

int readFile (char** pData, char *file)
{
	#define DATA 1024

	int fileDesc = open(file, O_RDONLY|O_BINARY);
	if (fileDesc==-1) return -1;
	
	*pData=NULL;
	
	int i=0, readed;
	int finish = FALSE;
	
	while (!finish)
	{
		*pData = (char*) realloc (*pData, DATA * (i+1) +1);
		readed = read (fileDesc, *pData + DATA*i, DATA);
		if (readed<DATA) finish=TRUE;
		i++;
	}
	(*pData)[DATA*(i-1)+readed]=0;
	return 0;
}

int unsignedShortStringLength (const wchar_t* src)
{
	if (src==NULL) return 0;
	
	int i = 0;
	while (src[i] != 0) i++;
	return i;
}

void printlnWCharString (wchar_t* wCharString)
{
	printWCharString(wCharString);
	printf("\n");
}

void printWCharString (wchar_t* wCharString)
{
	int i = 0;
	while (wCharString[i]!=0)
	{
		printf("%c", wCharString[i]);
		i++;
	}
}

void pause()
{
	char buf[10];
	read(0,&buf,1);
}

/*--------------------.
|  Private Functions  |
`--------------------*/

/* the max lenght of the reason string in characters */
#define WLSAMPLE_REASON_STRING_LEN 256

/* print the reason string */
void PrintReason(unsigned long reason) 
{
	wchar_t strReason[WLSAMPLE_REASON_STRING_LEN];

	if (WlanReasonCodeToString(reason, WLSAMPLE_REASON_STRING_LEN, strReason, NULL/*reserved*/) == 0)
		printlnWCharString(strReason);

	else printf("Reason code: %lu.\n", reason);
}

#define WLAN_INVALID_COUNTER (unsigned long long)-1
/* print the counter value in driver statistics */
void printCounterValue(unsigned long long value)
{
	if (value == WLAN_INVALID_COUNTER) printf("cannot be obtained\n");
	else printf("%lu\n", (unsigned long) value);
}

/* print the error messages */
#define ERROR_INVALID_GUID 13
void error (unsigned long errorNumber, char* message)
{
	if (errorNumber==ERROR_INVALID_PARAMETER)
		printf("The parameters are not correct.\nPlease use parameter \"help xyz\" to check the usage of the command xyz.\n");
		
	else if (errorNumber==ERROR_BAD_PROFILE)
		printf("The given profile is not valid.\n");
		
	else if (errorNumber==ERROR_NOT_SUPPORTED)
		printf("This command is not supported on this version of Windows.\nWindows XP does support this command.\n");
		
	else if (errorNumber==ERROR_INVALID_GUID)
		printf("Invalid GUID.\nUse EnumInterface (ei) command to get the GUID of an interface.\n");
		
	else if (errorNumber!=-1 && message==NULL)
		printf("Got error %lu.\n", errorNumber);
	
	else
	{
		if (errorNumber!=-1) printf("Got error %lu ", errorNumber);
		if (message!=NULL) printf("%s", message);
	}

	WlanCloseHandle(handle, NULL/*reserved*/);
	exit(errorNumber);
}

void printlnSsid(DOT11_SSID ssid)
{
	printSsid(ssid);
	printf("\n");
}

void printSsid(DOT11_SSID ssid)
{
	char* strSsid = ssidToString(&ssid);
	printf("%s", strSsid);
	free(strSsid);
}

typedef void (*WLSAMPLE_FUNCTION) (int argc, char* argv[]);

typedef struct _WLSAMPLE_COMMAND {
	char* strCommandName;	/* command name */
	char* strShortHand;		/* a shorthand for the command */
	WLSAMPLE_FUNCTION Func;	/* pointer to the function */
	char* strHelpMessage;	/* help message */
	char* strParameters;	/* parameters for the command */
	long bRemarks;			/* whether have remarks for the command */
	char* strRemarks;		/* remarks */
} WLSAMPLE_COMMAND, *PWLSAMPLE_COMMAND;

WLSAMPLE_COMMAND g_Commands[] =
{
	/* interface related commands */
	{ "EnumInterface", "ei", EnumInterface, "Enumerate wireless interfaces and print the basic interface information.", "", FALSE, "" }, 
	{ "GetInterfaceCapability", "gic", GetInterfaceCapability, "Get the capability of an interface.", "<interface GUID>", TRUE, "Use EnumInterface (ei) command to get the GUID of an interface." }, 
	{ "QueryInterface", "qi", QueryInterface, "Query the basic information of an interface.", "<interface GUID>", TRUE, "Use EnumInterface (ei) command to get the GUID of an interface." }, 
	{ "SetRadioState", "srs", SetRadioState, "Set the software radio state.", "<interface GUID> <on|off>", TRUE, "Use EnumInterface (ei) command to get the GUID of an interface." },  
	{ "GetDriverStatistics", "gds", GetDriverStatistics, "Get driver statistics." , "<interface GUID>", TRUE, "Use EnumInterface (ei) command to get the GUID of an interface." }, 

	/* scan related commands */
	{ "Scan", "scn", Scan, "Scan for available wireless networks.", "<interface GUID>", TRUE, "Use EnumInterface (ei) command to get the GUID of an interface." }, 
	{ "GetBssList", "gbl", GetBssList, "Get the list of BSS." , "<interface GUID> [<SSID> <infrastructure(i)|adhoc(a)> <secure(s)|unsecure(u)>]", TRUE, "Use EnumInterface (ei) command to get the GUID of an interface." },  
	{ "GetVisibleNetworkList", "gnl", GetVisibleNetworkList, "Get the list of visible wireless networks.", "<interface GUID>", TRUE, "Use EnumInterface (ei) command to get the GUID of an interface." }, 

	/* profile releated commands */
	{ "SetProfile", "sp", SetProfile, "Save a profile.", "<interface GUID> <profile XML file path>", TRUE, "Use EnumInterface (ei) command to get the GUID of an interface." },  
	{ "SaveTempProfile", "stp", SaveTemporaryProfile, "Save the temporary profile used for the current connection.", "<interface GUID> <profile name>", TRUE, "Use EnumInterface (ei) command to get the GUID of an interface." }, 
	{ "GetProfile", "gp", GetProfile, "Get the content of a saved profile.", "<interface GUID> <profile name>", TRUE, "Use EnumInterface (ei) command to get the GUID of an interface." }, 
	{ "DeleteProfile", "dp", DeleteProfile, "Delete a saved profile.", "<interface GUID> <profile name>", TRUE, "Use EnumInterface (ei) command to get the GUID of an interface." }, 
	{ "SetProfileList", "spl", SetProfileList, "Set the preference order of saved profiles. The list must contain all profiles.", "<interface GUID> <profile name>+", TRUE, "Use EnumInterface (ei) command to get the GUID of an interface." }, 
	{ "GetProfileList", "gpl", GetProfileList, "Get the list of saved profiles, in the preference order." , "<interface GUID>", TRUE, "Use EnumInterface (ei) command to get the GUID of an interface." }, 

	/* connection related commands */
	{ "Connect", "con", Connect, "Connect to a wireless network using a saved profile.", "<interface GUID> <SSID> <infrastructure(i)|adhoc(a)> <profile name>", TRUE, "Use EnumInterface (ei) command to get the GUID of an interface." }, 
	{ "Disconnect", "dcon", Disconnect, "Disconnect from the current network.", "<interface GUID>", TRUE, "Use EnumInterface (ei) command to get the GUID of an interface." }, 
	{ "Discover", "dcov", Discover, "Connect to a network without a saved profile. The WLAN service will discover the settings for connection.", "<interface GUID> <SSID> <infrastructure(i)|adhoc(a)> <secure(s)|unsecure(u)>", TRUE, "Use EnumInterface (ei) command to get the GUID of an interface." }, 
	
	/* other commands */
	{ "RegisterNotif", "rn", RegisterNotification, "Register ACM and MSM notifications.", "", FALSE, "" }, 
	{ "help", "?", Help, "Print this help message.", "[<command>]", FALSE, "" } 
};

/* show help messages */
void Help(int argc, char* argv[])
{
	unsigned int i;

	if (argc == 1)
	{
		/* show all commands */
		printf("This is a sample showing how to use WLAN APIs to manage wireless networks.\n");
		printf("The following commands are available. Use \"help xyz\" to show the description of command xyz.\n");
		for (i=0; i < sizeof(g_Commands)/sizeof(WLSAMPLE_COMMAND); i++)
		{
				printf("\t%s", g_Commands[i].strCommandName);
				printf("(%s)\n", g_Commands[i].strShortHand);
		}
	}
	else if (argc == 2)
	{
		/* show the description of a command */
		for (i=0; i < sizeof(g_Commands)/sizeof(WLSAMPLE_COMMAND); i++)
		{
			if (stricmp(argv[1], g_Commands[i].strCommandName) == 0 ||
					stricmp(argv[1], g_Commands[i].strShortHand) == 0)
			{
				printf("Command: %s", g_Commands[i].strCommandName);
				printf("(%s)\n", g_Commands[i].strShortHand);
				printf("Description: %s\n", g_Commands[i].strHelpMessage);
				printf("Usage: %s", g_Commands[i].strCommandName);
				printf("(%s) ", g_Commands[i].strShortHand);
				printf("%s\n", g_Commands[i].strParameters);
				if (g_Commands[i].bRemarks) printf("Remarks: %s\n", g_Commands[i].strRemarks);
				break;
			}
		}
		if (i == sizeof(g_Commands)/sizeof(WLSAMPLE_COMMAND))
			printf("Invalid command %s!\n", argv[1]);
	}
	else error (ERROR_INVALID_PARAMETER, NULL);
}

/* command is stored in the global variable */
void ExecuteCommand(int argc, char* argv[])
{
	unsigned int i = 0;

	for (i=0; i < sizeof(g_Commands)/sizeof(WLSAMPLE_COMMAND); i++)
	{
		/* find the command and call the function */
		if (stricmp(argv[0], g_Commands[i].strCommandName) == 0 ||
			stricmp(argv[0], g_Commands[i].strShortHand) == 0)
		{
			g_Commands[i].Func(argc, argv);
			break;
		}
	}

	if (i == sizeof(g_Commands)/sizeof(WLSAMPLE_COMMAND))
		printf("Invalid command %s!\n", argv[0]);
}

/*-------------------.
|  The main program  |
`-------------------*/

int main(int argc, char* argv[])
{
	unsigned long dwError = 0;

	if (argc <= 1) { Help(1, NULL); return 0; }
	
	/* open a handle to the service */
	unsigned long dwServiceVersion;
	dwError = WlanOpenHandle (WLAN_API_VERSION, NULL/*reserved*/, &dwServiceVersion, &handle);
	if (dwError!=0) error(dwError, "in function WlanOpenHandle\n");

	/* check service version */
	if (WLAN_API_VERSION_MAJOR(dwServiceVersion) < WLAN_API_VERSION_MAJOR(0x00000002))
	{
		/* No-op, because the version check is for demonstration purpose only. */
		/* You can add your own logic here. */
	}

	/* don't pass in the first parameter */
	ExecuteCommand(argc-1, argv+1);
	
	if (handle != NULL) WlanCloseHandle(handle, NULL/*reserved*/);
	return 0;
}

/*------------------------------------.
|  Numeric Codes Translate Functions  |
`------------------------------------*/

char* GetInterfaceStateString (int wlanInterfaceState)
{
	char* strRetCode;

	switch(wlanInterfaceState)
	{
		case 0: strRetCode = "not ready"; break;
		case 1: strRetCode = "connected"; break;
		case 2: strRetCode = "ad hoc network formed"; break;
		case 3: strRetCode = "disconnecting"; break;
		case 4: strRetCode = "disconnected"; break;
		case 5: strRetCode = "associating"; break;
		case 6: strRetCode = "discovering"; break;
		case 7: strRetCode = "authenticating"; break;
		default: strRetCode = "invalid interface state"; break;
	}
	return strRetCode;
}

/* get ACM notification String */
char* GetAcmNotificationString (int acmNotif)
{
	char* strRetCode;

	switch(acmNotif)
	{
		case 1: strRetCode = "autoconf enabled"; break;
		case 2: strRetCode = "autoconf disabled"; break;
		case 3: strRetCode = "background scan enabled"; break;
		case 4: strRetCode = "background scan disabled"; break;
		case 6: strRetCode = "power setting change"; break;
		case 7: strRetCode = "scan complete"; break;
		case 8: strRetCode = "scan fail"; break;
		case 9: strRetCode = "connection start"; break;
		case 10: strRetCode = "connection complete"; break;
		case 11: strRetCode = "connection fail"; break;
		case 12: strRetCode = "filter list change"; break;
		case 13: strRetCode = "interface arrival"; break;
		case 14: strRetCode = "interface removal"; break;
		case 15: strRetCode = "profile change"; break;
		case 17: strRetCode = "profiles exhausted"; break;
		case 18: strRetCode = "network not available"; break;
		case 19: strRetCode = "network available"; break;
		case 20: strRetCode = "disconnecting"; break;
		case 21: strRetCode = "disconnected"; break;
		case 22: strRetCode = "ad hoc network state changes"; break;
		default: strRetCode = "unknown ACM notification";
	}
	return strRetCode;
}

/* get MSMM notification String */
char* GetMsmNotificationString (int msmNotif)
{
	char* strRetCode;

	switch(msmNotif)
	{
		case 1: strRetCode = "associating"; break;
		case 2: strRetCode = "associated"; break;
		case 3: strRetCode = "authenticating"; break;
		case 4: strRetCode = "connected"; break;
		case 5: strRetCode = "roaming start"; break;
		case 6: strRetCode = "roaming end"; break;
		case 7: strRetCode = "radio state change"; break;
		case 8: strRetCode = "signal quality change"; break;
		case 9: strRetCode = "disassociating"; break;
		case 10: strRetCode = "disconnected"; break;
		case 11: strRetCode = "a peer joins the ad hoc network"; break;
		case 12: strRetCode = "a peer leaves the ad hoc network"; break;
		case 13: strRetCode = "adapter is in a bad state"; break;
		default: strRetCode = "unknown MSM notification";
	}
	return strRetCode;
}

/* get connection mode String */
char* GetConnectionModeString (int wlanConnMode)
{
	char* strRetCode;

	switch(wlanConnMode)
	{
		case 0: strRetCode = "manual connection with a profile"; break;
		case 1: strRetCode = "manual connection with a temporary profile"; break;
		case 2: strRetCode = "connection to a secure network without a profile"; break;
		case 3: strRetCode = "connection to an unsecure network without a profile"; break;
		case 4: strRetCode = "automatic connection with a profile"; break;
		default: strRetCode = "invalid connection mode";
	}
	return strRetCode;
}

/* get PHY type String */
char* GetPhyTypeString (int uDot11PhyType)
{
	char* strRetCode;

	switch(uDot11PhyType)
	{
		case 2: strRetCode = "DSSS"; break;
		case 6: strRetCode = "802.11g"; break;
		case 1: strRetCode = "FHSS"; break;
		case 5: strRetCode = "802.11b"; break;
		case 3: strRetCode = "IR-base band"; break;
		case 4: strRetCode = "802.11a"; break;
		case 0: strRetCode = "any"; break;
		default: strRetCode = "Unknown PHY type";
	}
	return strRetCode;
}

/* get BSS type String */
char* GetBssTypeString (int dot11BssType)
{
	char* strRetCode;

	switch(dot11BssType)
	{
		case 1: strRetCode = "Infrastructure"; break;
		case 2: strRetCode = "Ad hoc"; break;
		case 3: strRetCode = "Any"; break;
		default: strRetCode = "Unknown BSS type";
	}
	return strRetCode;
}

/* get radio state String */
char* GetRadioStateString (int radioState)
{
	char* strRetCode;

	switch(radioState)
	{
		case 1: strRetCode = "on"; break;
		case 2: strRetCode = "off"; break;
		default: strRetCode = "unknown state";
	}
	return strRetCode;
}

/* get auth algorithm String */
char* GetAuthAlgoString (int dot11AuthAlgo)
{
	char* strRetCode = "Unknown algorithm";

	switch(dot11AuthAlgo)
	{
		case 1: strRetCode = "Open"; break;
		case 2: strRetCode = "Shared"; break;
		case 3: strRetCode = "WPA-Enterprise"; break;
		case 4: strRetCode = "WPA-Personal"; break;
		case 5: strRetCode = "WPA-NONE"; break;
		case 6: strRetCode = "WPA2-Enterprise"; break;
		case 7: strRetCode = "WPA2-Personal"; break;
		default: if ((dot11AuthAlgo & DOT11_AUTH_ALGO_IHV_START) == 0x0) strRetCode = "Vendor-specific algorithm";
	}
	return strRetCode;
}

/* get cipher algorithm String */
char* GetCipherAlgoString (int dot11CipherAlgo)
{
	char* strRetCode = "Unknown algorithm";

	switch(dot11CipherAlgo)
	{
		case 0: strRetCode = "None"; break;
		case 1: strRetCode = "WEP40"; break;
		case 2: strRetCode = "TKIP"; break;
		case 4: strRetCode = "AES"; break;
		case 5: strRetCode = "WEP104"; break;
		case 256: strRetCode = "USE-GROUP"; break;
		case 257: strRetCode = "WEP"; break;
		default: if ((dot11CipherAlgo & DOT11_CIPHER_ALGO_IHV_START) == 0x0) strRetCode = "Vendor-specific algorithm";
	}
	return strRetCode;
}

/*-----------------.
|  Set Structures  |
`-----------------*/


/* Set WLAN_CONNECTION_PARAMETERS structure */
void setConnectionParameters (PWLAN_CONNECTION_PARAMETERS parameters, PDOT11_SSID pDot11Ssid, char* connectionMode, wchar_t* profileName, char* bssType)
{
	/* set the SSID */
	parameters->pDot11Ssid = pDot11Ssid;
	
	/* set the connection mode */
	if (stricmp(connectionMode, "secure") == 0 || stricmp(connectionMode, "s") == 0)
		parameters->wlanConnectionMode = wlan_connection_mode_discovery_secure;
		
	else if (stricmp(connectionMode, "unsecure") == 0 || stricmp(connectionMode, "u") == 0)
		parameters->wlanConnectionMode = wlan_connection_mode_discovery_unsecure;
		
	else if (stricmp(connectionMode, "profile") == 0 || stricmp(connectionMode, "p") == 0)
		parameters->wlanConnectionMode = wlan_connection_mode_profile;
		
	else error (ERROR_INVALID_PARAMETER, NULL);
	
	/* set the profile name */
	parameters->strProfile = profileName;
	
	/* get BSS type */
	if (stricmp(bssType,"adhoc") == 0 || stricmp(bssType, "a") == 0)
		parameters->dot11BssType = dot11_BSS_type_independent;
		
	else if (stricmp(bssType, "infrastructure") == 0 || stricmp(bssType, "i") == 0)
		parameters->dot11BssType = dot11_BSS_type_infrastructure;
		
	else error (ERROR_INVALID_PARAMETER, NULL);

	/* the desired BSSID list is empty */
	parameters->pDesiredBssidList = NULL;
	
	/* no connection flags */
	parameters->dwFlags = 0;
}

/* Set WLAN_PHY_RADIO_STATE structure */
void setPhyRadioState (PWLAN_PHY_RADIO_STATE phyRadioState, char* radioState, unsigned long index)
{
	if (stricmp(radioState, "on") == 0) phyRadioState->dot11SoftwareRadioState = dot11_radio_state_on;
	else if (stricmp(radioState, "off") == 0) phyRadioState->dot11SoftwareRadioState = dot11_radio_state_off;
	else error (ERROR_INVALID_PARAMETER, NULL);	
	phyRadioState->dwPhyIndex = index;
}

/*-------------------.
|  Print Structures  |
`-------------------*/

/* Print PWLAN_STATISTICS structure */
void printStatistics (PWLAN_STATISTICS pStatistics)
{
	if (pStatistics==NULL) return;
	
	/* print statistics information */
	printf("Four way handshake failures: \t");
	printCounterValue(pStatistics->ullFourWayHandshakeFailures);

	printf("TKIP Counter Measures invoked: \t");
	printCounterValue(pStatistics->ullTKIPCounterMeasuresInvoked);

	/* frame statistics */
	printf("Unicast counters\n");
	printf("\tTransmitted frame count: \t");
	printCounterValue(pStatistics->MacUcastCounters.ullTransmittedFrameCount);
	printf("\tReceived frame count: \t");
	printCounterValue(pStatistics->MacUcastCounters.ullReceivedFrameCount);
	printf("\tWEP excluded count: \t");
	printCounterValue(pStatistics->MacUcastCounters.ullWEPExcludedCount);

	/* frame statistics */
	printf("Multicast counters\n");
	printf("\tTransmitted frame count: \t");
	printCounterValue(pStatistics->MacMcastCounters.ullTransmittedFrameCount);
	printf("\tReceived frame count: \t");
	printCounterValue(pStatistics->MacMcastCounters.ullReceivedFrameCount);
	printf("\tWEP excluded count: \t");
	printCounterValue(pStatistics->MacMcastCounters.ullWEPExcludedCount);

	int i;
	for (i = 0; i < pStatistics->dwNumberOfPhys; i++)
	{
		printf("PHY %d", i);
		printf("\tTransmitted frame count: \t");
		printCounterValue(pStatistics->PhyCounters[i].ullTransmittedFrameCount);
		printf("\tMulticast transmitted frame count: \t");
		printCounterValue(pStatistics->PhyCounters[i].ullMulticastTransmittedFrameCount);
		printf("\tReceived frame count: \t");
		printCounterValue(pStatistics->PhyCounters[i].ullReceivedFrameCount);
		printf("\tMulticast received frame count: \t");
		printCounterValue(pStatistics->PhyCounters[i].ullMulticastReceivedFrameCount);
	}
}	

/* Print PWLAN_INTERFACE_CAPABILITY structure */
void printInterfaceCapability (PWLAN_INTERFACE_CAPABILITY pCapability)
{
	if (pCapability==NULL) return;
	
	/* print interface capability information */
	if (pCapability->interfaceType == wlan_interface_type_emulated_802_11)
		printf("Emulated 802.11 NIC.\n");

	else if (pCapability->interfaceType == wlan_interface_type_native_802_11)
		printf("Native 802.11 NIC.\n");
		
	else printf("Unknown NIC.\n");
	
	/* print supported PHY type */
	printf("Supports %lu PHY types:\n", pCapability->dwNumberOfSupportedPhys);
	
	int i;
	for (i = 0; i < pCapability->dwNumberOfSupportedPhys; i++)
		printf("\t%s\n", GetPhyTypeString(pCapability->dot11PhyTypes[i]));
}

/* Print PWLAN_INTERFACE_INFO_LIST structure */
void printInterfaceInfoList (PWLAN_INTERFACE_INFO_LIST list)
{
	if (list==NULL) return;
	
	printf("There are %lu interfaces in the system.\n", list->dwNumberOfItems);

	/* print out interface information */
	int i;
	for (i = 0; i < list->dwNumberOfItems; i++)
	{
		printf("Interface %d:\n", i);
		printInterfaceInfo(&list->InterfaceInfo[i]);
	}
}

/* Print WLAN_INTERFACE_INFO structure */
/* struct WLAN_INTERFACE_INFO defines the basic information for an interface */
void printInterfaceInfo (PWLAN_INTERFACE_INFO pInterface)
{
	if (pInterface==NULL) return;

	wchar_t* strGuid = NULL;
	unsigned long dwError = UuidToStringW (&pInterface->InterfaceGuid, &strGuid);
	if (dwError!=0) error (dwError, "in function UuidToStringW.\n");

	printf("\tGUID: ");
	printlnWCharString(strGuid);
	
	printf("\t");
	printlnWCharString(pInterface->strInterfaceDescription);

	printf("\tState: %s\n", GetInterfaceStateString(pInterface->isState));

	RpcStringFreeW(&strGuid);
}

/* Print PWLAN_PROFILE_INFO structure */
/* struct WLAN_PROFILE_INFO defines the basic information of an 802.11 network profile */
void printProfileInfo(PWLAN_PROFILE_INFO profile)
{
	if (profile==NULL) return;
	printf("\t");
	printlnWCharString(profile->strProfileName);
}

/* Print PWLAN_PROFILE_INFO_LIST structure */
void printProfileInfoList (PWLAN_PROFILE_INFO_LIST pProfileList)
{
	if (pProfileList==NULL) return;
	
	printf("There are %lu profiles on the interface.\n", pProfileList->dwNumberOfItems);
	
	int i;
	for (i = 0; i < pProfileList->dwNumberOfItems; i++)
        printProfileInfo(&pProfileList->ProfileInfo[i]);
}

/* Print PWLAN_AVAILABLE_NETWORK structure */
/* struct WLAN_AVAILABLE_NETWORK defines information needed for an available network */
void printAvailableNetwork (PWLAN_AVAILABLE_NETWORK pNetwork)
{
	if (pNetwork==NULL) return;
	
	/* print the basic information of a visible wireless network */

	/* SSID */
	printf("\tSSID: ");
	printlnSsid(pNetwork->dot11Ssid);

	/* whether security is enabled */
	if (pNetwork->bSecurityEnabled) printf("\tSecurity enabled.\n");
	else printf("\tSecurity not enabled.\n");

	/* number of BSSIDs */
	printf("\tContains %lu BSSIDs.\n", pNetwork->uNumberOfBssids);

	/* whether have a profile for this SSID */
	if (pNetwork->dwFlags & WLAN_AVAILABLE_NETWORK_HAS_PROFILE)
	{
		printf("\tHas a matching profile: ");
		printlnWCharString(pNetwork->strProfileName);
	}

	/* whether it is connected */
	if (pNetwork->dwFlags & WLAN_AVAILABLE_NETWORK_CONNECTED)
		printf("\tCurrently connected.\n");

	/* whether it is connectable */
	if (!pNetwork->bNetworkConnectable)
	{
		/* the reason that it is not connectable */
		printf("\tThe network is not connectable. ");
		PrintReason(pNetwork->wlanNotConnectableReason);
	}
	else printf("\tThe network is connectable.\n");

	/* BSS type */
	printf("\tBSS type: %s\n", GetBssTypeString(pNetwork->dot11BssType));
	
	/* Signal quality */
	printf("\tSignal quality: %lu%%\n", pNetwork->wlanSignalQuality);

	/* Default auth algorithm */
	printf("\tDefault authentication algorithm: %s\n", GetAuthAlgoString(pNetwork->dot11DefaultAuthAlgorithm));

	/* Default cipher algorithm */
	printf("\tDefault cipher algorithm: %s\n", GetCipherAlgoString(pNetwork->dot11DefaultCipherAlgorithm));
}

/* Print PWLAN_AVAILABLE_NETWORK_LIST structure */
void printAvailableNetworkList (PWLAN_AVAILABLE_NETWORK_LIST pList)
{
	if (pList==NULL) return;
	
	/* print all visible networks */
	printf("Total %lu networks are visible.\n", pList->dwNumberOfItems);
	
	int i;
	for (i = 0; i < pList->dwNumberOfItems; i++)
	{
		printf("Network %d:\n", i);
		printAvailableNetwork(&pList->Network[i]);
		printf("\n");
	}
}

/* Print PWLAN_AUTH_CIPHER_PAIR_LIST structure */
void printAuthCipherPairList(PWLAN_AUTH_CIPHER_PAIR_LIST list)
{
	if (list==NULL) return;
	
	/* print auth/cipher algorithms */
	int i;
	for (i = 0; i < list->dwNumberOfItems; i++)
		printAuthCipherPair (&list->pAuthCipherPairList[i]);
}
	
/* Print DOT11_AUTH_CIPHER_PAIR structure */
void printAuthCipherPair (PDOT11_AUTH_CIPHER_PAIR pair)
{
	if (pair==NULL) return;
	
	printf
	(
		"\t%s and %s\n",
		GetAuthAlgoString(pair->AuthAlgoId),
		GetCipherAlgoString(pair->CipherAlgoId)
	);
}

/* Print PWLAN_BSS_ENTRY structure */
void printBssEntry (PWLAN_BSS_ENTRY pBss)
{
	if (pBss==NULL) return;
	
	unsigned int i;
	PBYTE pIe = NULL;
	
	if (pBss != NULL)
	{
		/* MAC address */
		printf("MAC address: ");
		for (i = 0; i < 6; i++)
			/* wcout << setw(2) << setfill(L'0') << hex << (UINT)pBss->dot11Bssid[i] <<L" "; */
			printf("%u ", pBss->dot11Bssid[i]);
		printf("\n");
		
		/* SSID */
		printf("\tSSID: ");
		printlnSsid(pBss->dot11Ssid);
		
		/* Beacon period */
		printf("\tBeacon period: %i TU\n", /*dec, */ pBss->usBeaconPeriod);
		
		/* IE */
		printf("\tIE\n");
		i = 0;
		pIe = (PBYTE)(pBss) + pBss->ulIeOffset;

		/* print 8 unsigned char per line */
		while (i < pBss->ulIeSize)
		{
			if (i % 8 == 0)	printf("\n\t\t");
			/* wcout << setw(2) << setfill(L'0') << hex << (UINT)pIe[i] << L" "; */
			printf("%u ", (unsigned int)pIe[i]);
			i++;
		}

		printf("\n");
	}
}

/* Print PWLAN_BSS_LIST structure */
void printBssList (PWLAN_BSS_LIST pWlanBssList)
{
	if (pWlanBssList==NULL) return;
	
	int i;
	for (i = 0; i < pWlanBssList->dwNumberOfItems; i++)
		printBssEntry(&pWlanBssList->wlanBssEntries[i]);
}

/* Print PWLAN_CONNECTION_ATTRIBUTES structure */
/* structure WLAN_CONNECTION_ATTRIBUTES defines attributes of a wireless connection */
void printConnectionAttributes(PWLAN_CONNECTION_ATTRIBUTES pConnection)
{
	if (pConnection==NULL) return;
		
	if (pConnection->isState == wlan_interface_state_connected)
		printf("Currently connected to: ");
		
	else if (pConnection->isState == wlan_interface_state_ad_hoc_network_formed)
		printf("Currently formed: ");
		
	else if (pConnection->isState == wlan_interface_state_authenticating)
		printf("Currently authenticating to: ");
		
	else if
	(
		pConnection->isState == wlan_interface_state_associating ||
		pConnection->isState == wlan_interface_state_discovering
	) printf("Currently connecting to: ");
	
	printlnSsid (pConnection->wlanAssociationAttributes.dot11Ssid);	
	
	printf("Using profile: ");
	printlnWCharString(pConnection->strProfileName);
	
	printf("Connection mode: %s\n", GetConnectionModeString(pConnection->wlanConnectionMode));
	printf("BSS type: %s\n", GetBssTypeString (pConnection->wlanAssociationAttributes.dot11BssType));
	printf("Current PHY type: %s\n", GetPhyTypeString(pConnection->wlanAssociationAttributes.dot11PhyType));
}

/* Print PWLAN_CONNECTION_NOTIFICATION_DATA structure */
void printConnectionNotificationData (PWLAN_CONNECTION_NOTIFICATION_DATA pData, unsigned long notificationCode)
{		
	if (pData==NULL) return;
	
	/* print some notifications as examples */
	if (notificationCode == wlan_notification_acm_connection_complete)
	{
		if (pData->wlanReasonCode == 0/*SUCCESS*/)
		{
			printf("The connection succeeded.\n");

			if (pData->wlanConnectionMode == wlan_connection_mode_discovery_secure ||
				pData->wlanConnectionMode == wlan_connection_mode_discovery_unsecure)
			{
				/* the temporary profile generated for discovery */
				printf("Temporary profile used for this connection: ");
				printlnWCharString(pData->strProfileXml);
			}
		}
		else
		{
			printf("The connection failed.\n");
			PrintReason(pData->wlanReasonCode);
		}
	}
	
	else if (notificationCode == wlan_notification_acm_connection_start)
	{
		/* print out some connection information */
		
		printf("\tCurrently connecting to ");
		printSsid(pData->dot11Ssid);
		
		printf(" using profile ");
		printWCharString(pData->strProfileName);
		
		printf(", connection mode is %s", GetConnectionModeString(pData->wlanConnectionMode));
		printf(", BSS type is %s\n", GetBssTypeString(pData->dot11BssType));
	}
}

/* Print WLAN_RADIO_STATE structure */
void printRadioState(PWLAN_RADIO_STATE radioState)
{
	if (radioState==NULL) return;
	
	int i;
	for (i = 0; i < radioState->dwNumberOfPhys; i++)
	{
		printf("PHY %lu:\n", radioState->PhyRadioState[i].dwPhyIndex);
		printf("\tSoftware radio state is %s.\n", GetRadioStateString(radioState->PhyRadioState[i].dot11SoftwareRadioState));
		printf("\tHardware radio state is %s.\n", GetRadioStateString(radioState->PhyRadioState[i].dot11HardwareRadioState));
	}
}

/*-------------------------------.
|  Format translation Functions  |
`-------------------------------*/

char* wCharToCharString (wchar_t* src)
{
	if (src==NULL) return NULL;
	
	int length = unsignedShortStringLength(src);
	char* charString = (char*) malloc((length+1) * sizeof(char));

	int i;
	for (i=0; i<length; i++) charString[i] = src[i];
	charString[i] = '\0';
	return charString;	
}

void wCharToUCharString (const wchar_t* src, unsigned char* dest)
{
	if (src==NULL){ dest = NULL; return; }
	
	int length = unsignedShortStringLength(src);

	int i;
	for (i=0; i<length; i++) dest[i] = src[i];
	dest[i] = '\0';
}

void charToUCharString (const char* src, unsigned char* dest)
{
	if (src==NULL){ dest = NULL; return; }
	
	int length = strlen(src);

	int i;
	for (i=0; i<length; i++) dest[i] = src[i];
	dest[i] = '\0';
}

wchar_t* stringToWString (const char* src)
{
	if (src==NULL) return NULL;
	
	int length = strlen(src);
	wchar_t* unsignedShortString = (wchar_t*) malloc((length+1) * sizeof(wchar_t));
	
	int i;
	for (i=0; i<length; i++) unsignedShortString[i] = src[i];
	unsignedShortString[i] = '\0';
	return unsignedShortString;	
}

/* get SSID from the wchar_t string */
unsigned long wCharToSsid(const wchar_t* strSsid, PDOT11_SSID pSsid)
{
	if (strSsid == NULL || pSsid == NULL) return ERROR_INVALID_PARAMETER;

	pSsid->uSSIDLength = unsignedShortStringLength(strSsid);
	wCharToUCharString(strSsid, pSsid->ucSSID);		

	return 0;
}

/* copy SSID to a null-terminated char string */
char* ssidToString(PDOT11_SSID pSsid)
{
	char* string = (char*) malloc(pSsid->uSSIDLength+1);
	int i;
	for(i=0; i < pSsid->uSSIDLength; i++) string[i] = pSsid->ucSSID[i];
	string[i] = '\0';
	return string;
}

wchar_t** stringToWStringList(char** profilesName)
{
	wchar_t** result;
	
	int i = 0;
	while (profilesName[i]!=NULL) { result[i] = stringToWString(profilesName[i]); i++; }
	profilesName[i] = NULL;
	
	return result;
}


/* get the interface GUID */
GUID* stringToGuid (const char* strGuid)
{
	if (strGuid==NULL) return NULL;
	
	wchar_t* wStrGuid;
	wStrGuid = stringToWString(strGuid);

	GUID* pGuid = (GUID*) malloc (sizeof(GUID));
	long error = UuidFromStringW(wStrGuid, pGuid);
		
	if (error)
	{
		free(pGuid);
		pGuid=NULL;
	}
	
	free(wStrGuid);
	return pGuid;
}

/* get the SSID */
DOT11_SSID* stringToSsid (const char* strSsid)
{
	if (strSsid==NULL) return NULL;
	
	DOT11_SSID* pSsid = (DOT11_SSID*) malloc (sizeof(DOT11_SSID));
	
	pSsid->uSSIDLength = strlen(strSsid);
	charToUCharString(strSsid, pSsid->ucSSID);		

	return pSsid;
}
