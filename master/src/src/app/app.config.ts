
export interface AppConfig {
	apiUrl: string;
	storageKey: string;
}

// venue API URL to fetch data from
export const VENUE_DI_CONFIG: AppConfig =
{
	apiUrl: 'http://172.16.17.91:8080/venue-api/external-api/event',//'http://172.16.17.91:8080/venue-api/event'//'http://172.16.17.91:8080/venue-api/external-api/event',
	storageKey: 'venue',
};
