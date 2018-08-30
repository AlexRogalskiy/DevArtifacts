<?php
/**
* Create a vCard file for download
*
* $vCard = new vCard($lang,$download_dir);
* $vCard->setLastName('Mustermann');
* ...
* $vCard->writeCardFile();
* header('Location:' . $vCard->getCardFilePath());
*
* @access public
* @author Michael Wimmer <flaimo@gmx.net>
* @copyright Michael Wimmer
* @link http://www.flaimo.com/  flaimo.com
* @package vCard
* @version 1.001
*/
class vCard{
	private $first_name,
			$middle_name,
			$last_name,
			$edu_title,
			$addon,
			$nickname,
			$company,
			$organisation,
			$department,
			$job_title,
			$note,
			$tel_work1_voice,
			$tel_work2_voice,
			$tel_home1_voice,
			$tel_home2_voice,
			$tel_cell_voice,
			$tel_car_voice,
			$tel_pager_voice,
			$tel_additional,
			$tel_work_fax,
			$tel_home_fax,
			$tel_isdn,
			$tel_preferred,
			$tel_telex,
			$work_street,
			$work_zip,
			$work_city,
			$work_region,
			$work_country,
			$home_street,
			$home_zip,
			$home_city,
			$home_region,
			$home_country,
			$postal_street,
			$postal_zip,
			$postal_city,
			$postal_region,
			$postal_country,
			$url_work,
			$role,
			$birthday,
			$email,
			$rev, 
			$lang;

	public function vCard($downloaddir = '', $lang = ''){
		
		$this->download_dir = ((strlen(trim($downloaddir)) > 0) ? $downloaddir : 'vcarddownload');
		$this->card_filename = time() . '.vcf';
		$this->rev = date('Ymd\THi00\Z',time());
		$this->setLanguage($lang);
		
		if ($this->checkDownloadDir() == false){
			die('error creating download directory');
		}
	}


	/**
	* Checks if the download directory exists, else trys to create it
	*
	* @return (boolean)
	* @access private
	* @since 1.000 - 2002/10/10   
	*/
	private function checkDownloadDir()
	{
		if (!is_dir($this->download_dir)){
			if (!mkdir($this->download_dir, 0700)){
				return false;
			}
			else{
				return true;
			}
		}
		else {
			return true;
		}
	}

	/**
	* Set Language (iso code) for the Strings in the vCard file
	*
	* @param $isocode
	* @return (void)
	* @access private
	* @since 1.000 - 2002/10/10   
	*/
	private function setLanguage($isocode = ''){
		if ($this->isValidLanguageCode($isocode) == true){
			$this->lang = ';LANGUAGE=' . $isocode;
		}
		else{
			$this->lang = '';
		}
	}

	/**
	* Encodes a string for QUOTE-PRINTABLE
	*
	* @param $quotprint  String to be encoded
	* @return  Encodes string
	* @access private
	* @since 1.000 - 2002/10/20 
	* @author Harald Huemer <harald.huemer@liwest.at>
	*/
	private function quotedPrintableEncode($quotprint){ 
		return preg_replace("~([\x01-\x1F\x3D\x7F-\xFF])~e", "sprintf('=%02X', ord('\\1'))", $quotprint);  
	}

	/**
	* Checks if a given string is a valid iso-language-code
	*
	* @param $code  String that should validated
	* @return (boolean) $isvalid  If string is valid or not
	* @access private
	* @since 1.000 - 2002/10/20 
	*/
	private function isValidLanguageCode($code){
		$isvalid = false;
		if (preg_match('(^([a-z]{2})$|^([a-z]{2}_[a-z]{2})$|^([a-z]{2}-[a-z]{2})$)',trim($code)) > 0){
			$isvalid = true;
		}
		return $isvalid;  
	}


	/**
	* Set the persons first name
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setFirstName($input){
		$this->first_name = $input;
	}

	/**
	* Set the persons middle name(s)
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setMiddleName($input){
		$this->middle_name = $input;
	}

	/**
	* Set the persons last name
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setLastName($input){
		$this->last_name = $input;
	}
	
	/**
	* Set the persons title (Doctor,...)
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/  
	public function setEducationTitle($input){
		$this->edu_title = $input;
	}
	
	/**
	* Set the persons addon (jun., sen.,...)
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setAddon($input){
		$this->addon = $input;
	}
	
	/**
	* Set the persons nickname
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setNickname($input){
		$this->nickname = $input;
	}
	
	/**
	* Set the company name for which the person works for
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setCompany($input){
		$this->company = $input;
	}
	
	/**
	* Set the organisations name for which the person works for
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setOrganisation($input){
		$this->organisation = $input;
	}
	
	/**
	* Set the department name of company for which the person works for
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setDepartment($input){
		$this->department = $input;
	}
	
	/**
	* Set the persons job title
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setJobTitle($input){
		$this->job_title = $input;
	}
	
	/**
	* Set additional notes for that person
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setNote($input){
		$this->note = $input;
	}
	
	/**
	* Set telephone number (Work 1)
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setTelephoneWork1($input){
		$this->tel_work1_voice = $input;
	}
	
	/**
	* Set telephone number (Work 2)
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setTelephoneWork2($input){
		$this->tel_work2_voice = $input;
	}
	
	/**
	* Set telephone number (Home 1)
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/  
	public function setTelephoneHome1($input){
		$this->tel_home1_voice = $input;
	}  
	
	/**
	* Set telephone number (Home 2)
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setTelephoneHome2($input){
		$this->tel_home2_voice = $input;
	}
	
	/**
	* Set cellphone number
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setCellphone($input){
		$this->tel_cell_voice = $input;
	}
	
	
	/**
	* Set carphone number
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setCarphone($input){
		$this->tel_car_voice = $input;
	}
	
	/**
	* Set pager number
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setPager($input){
		$this->tel_pager_voice = $input;
	}  
	
	/**
	* Set additional phone number
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setAdditionalTelephone($input){
		$this->tel_additional = $input;
	}  
	
	/**
	* Set fax number (Work)
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setFaxWork($input){
		$this->tel_work_fax = $input;
	}  
	
	/**
	* Set fax number (Home)
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setFaxHome($input){
		$this->tel_work_home = $input;
	}  
	
	
	/**
	* Set ISDN (phone) number
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setISDN($input){
		$this->tel_isdn = $input;
	}  
	
	/**
	* Set preferred phone number
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setPreferredTelephone($input){
		$this->tel_preferred = $input;
	}  
	
	/**
	* Set telex number
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setTelex($input){
		$this->tel_telex = $input;
	}  
	
	
	/**
	* Set streetname (Work Address)
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setWorkStreet($input){
		$this->work_street = $input;
	}  
	
	/**
	* Set ZIP code (Work Address)
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setWorkZIP($input){
		$this->work_zip = $input;
	}  
	
	/**
	* Set city (Work Address)
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setWorkCity($input){
		$this->work_city = $input;
	}  
	
	/**
	* Set region (Work Address)
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setWorkRegion($input){
		$this->work_region = $input;
	}  
	
	/**
	* Set country (Work Address)
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setWorkCountry($input){
		$this->work_country = $input;
	}  
	
	
	/**
	* Set streetname (Home Address)
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setHomeStreet($input){
		$this->home_street = $input;
	}  
	
	/**
	* Set ZIP code (Home Address)
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setHomeZIP($input){
		$this->home_zip = $input;
	}  
	
	/**
	* Set city (Home Address)
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setHomeCity($input){
		$this->home_city = $input;
	}  
	
	/**
	* Set region (Home Address)
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setHomeRegion($input){
		$this->home_region = $input;
	}  
	
	/**
	* Set country (Home Address)
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setHomeCountry($input){
		$this->home_country = $input;
	}  
	
	
	/**
	* Set streetname (Postal Address)
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setPostalStreet($input){
		$this->postal_street = $input;
	}  
	
	/**
	* Set ZIP code (Postal Address)
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/  
	public function setPostalZIP($input){
		$this->postal_zip = $input;
	}  
	
	/**
	* Set city (Postal Address)
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setPostalCity($input){
		$this->postal_city = $input;
	}  
	
	/**
	* Set region (Postal Address)
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setPostalRegion($input){
		$this->postal_region = $input;
	}  
	
	/**
	* Set country (Postal Address)
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setPostalCountry($input){
		$this->postal_country = $input;
	}  
	
	
	/**
	* Set URL (Work)
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setURLWork($input){
		$this->url_work = $input;
	}  
	
	/**
	* Set role (Student,...)
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setRole($input){
		$this->role = $input;
	}  
	
	
	/**
	* Set birthday
	*
	* @param (int) $timestamp
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setBirthday($timestamp){
		$this->birthday = (int) date('Ymd',$timestamp);
	}  

	
	/**
	* Set eMail address
	*
	* @param $input
	* @return (void)
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function setEMail($input){
		$this->email = $input;
	}  

	/**
	* Generates the string to be written in the file later on
	*
	* @return $this->output
	* @see getCardOutput(), writeCardFile()
	* @access public
	* @since 1.000 - 2002/10/10   
	*/
	public function generateCardOutput()
	{
		$this->output  = "BEGIN:VCARD\r\n";
		$this->output .= "VERSION:2.1\r\n";
		$this->output .= "N;ENCODING=QUOTED-PRINTABLE:" . $this->quotedPrintableEncode($this->last_name . ";" . $this->first_name . ";" . $this->middle_name . ";" . $this->addon) . "\r\n";
		$this->output .= "FN;ENCODING=QUOTED-PRINTABLE:" . $this->quotedPrintableEncode($this->first_name . " " . $this->middle_name . " " . $this->last_name . " " . $this->addon) . "\r\n";
		
		if (strlen(trim($this->nickname)) > 0){    
			$this->output .= "NICKNAME;ENCODING=QUOTED-PRINTABLE:" . $this->quotedPrintableEncode($this->nickname) . "\r\n";
		}
		
		$this->output .= "ORG" . $this->lang . ";ENCODING=QUOTED-PRINTABLE:" . $this->quotedPrintableEncode($this->organisation) . ";" . $this->quotedPrintableEncode($this->department) . "\r\n";
		
		if (strlen(trim($this->job_title)) > 0){
			$this->output .= "TITLE" . $this->lang . ";ENCODING=QUOTED-PRINTABLE:" . $this->quotedPrintableEncode($this->job_title) . "\r\n";
		}
		
		if (strlen(trim($this->note)) > 0){
			$this->output .= "NOTE" . $this->lang . ";ENCODING=QUOTED-PRINTABLE:" . $this->quotedPrintableEncode($this->note) . "\r\n";
		}
		
		if (strlen(trim($this->tel_work1_voice)) > 0){
			$this->output .= "TEL;WORK;VOICE:" . $this->tel_work1_voice . "\r\n";
		}
		
		if (strlen(trim($this->tel_work2_voice)) > 0){
			$this->output .= "TEL;WORK;VOICE:" . $this->tel_work1_voice . "\r\n";
		}
		
		if (strlen(trim($this->tel_home1_voice)) > 0){
			$this->output .= "TEL;HOME;VOICE:" . $this->tel_home1_voice . "\r\n";
		}
		
		if (strlen(trim($this->tel_cell_voice)) > 0){
			$this->output .= "TEL;CELL;VOICE:" . $this->tel_cell_voice . "\r\n";
		}
		
		if (strlen(trim($this->tel_car_voice)) > 0){
			$this->output .= "TEL;CAR;VOICE:" . $this->tel_car_voice . "\r\n";
		}
		
		if (strlen(trim($this->tel_additional)) > 0){
			$this->output .= "TEL;VOICE:" . $this->tel_additional . "\r\n";
		}
		
		if (strlen(trim($this->tel_pager_voice)) > 0){
			$this->output .= "TEL;PAGER;VOICE:" . $this->tel_pager_voice . "\r\n";
		}
		
		if (strlen(trim($this->tel_work_fax)) > 0){
			$this->output .= "TEL;WORK;FAX:" . $this->tel_work_fax . "\r\n";
		}
		
		if (strlen(trim($this->tel_home_fax)) > 0){
			$this->output .= "TEL;HOME;FAX:" . $this->tel_home_fax . "\r\n";
		}
		
		if (strlen(trim($this->tel_home2_voice)) > 0){
			$this->output .= "TEL;HOME:" . $this->tel_home2_voice . "\r\n";
		}
		
		if (strlen(trim($this->tel_isdn)) > 0){
			$this->output .= "TEL;ISDN:" . $this->tel_isdn . "\r\n";
		}
		
		if (strlen(trim($this->tel_preferred)) > 0){
			$this->output .= "TEL;PREF:" . $this->tel_preferred . "\r\n";
		}
		
		$this->output .= "ADR;WORK:;" . $this->company . ";" . $this->work_street . ";" . $this->work_city . ";" . $this->work_region . ";" . $this->work_zip . ";" . $this->work_country . "\r\n";
		$this->output .= "LABEL;WORK;ENCODING=QUOTED-PRINTABLE:" . $this->quotedPrintableEncode($this->company) . "=0D=0A" . $this->quotedPrintableEncode($this->work_street) . "=0D=0A" . $this->quotedPrintableEncode($this->work_city) . ", " . $this->quotedPrintableEncode($this->work_region) . " " . $this->quotedPrintableEncode($this->work_zip) . "=0D=0A" . $this->quotedPrintableEncode($this->work_country) . "\r\n";
		$this->output .= "ADR;HOME;;" . $this->home_street . ";" . $this->home_city . ";" . $this->home_region . ";" . $this->home_zip . ";" . $this->home_country . "\r\n";
		$this->output .= "LABEL;HOME;ENCODING=QUOTED-PRINTABLE:" . $this->quotedPrintableEncode($this->home_street) . "=0D=0A" . $this->quotedPrintableEncode($this->home_city) . ", " . $this->quotedPrintableEncode($this->home_region) . " " . $this->quotedPrintableEncode($this->home_zip) . "=0D=0A" . $this->quotedPrintableEncode($this->home_country) . "\r\n";
		$this->output .= "ADR;POSTAL;;" . $this->postal_street . ";" . $this->postal_city . ";" . $this->postal_region . ";" . $this->postal_zip . ";" . $this->postal_country . "\r\n";
		$this->output .= "LABEL;POSTAL;ENCODING=QUOTED-PRINTABLE:" . $this->quotedPrintableEncode($this->postal_street) . "=0D=0A" . $this->quotedPrintableEncode($this->postal_city) . ", " . $this->quotedPrintableEncode($this->postal_region) . " " . $this->quotedPrintableEncode($this->postal_zip) . "=0D=0A" . $this->quotedPrintableEncode($this->postal_country) . "\r\n";
		
		if (strlen(trim($this->url_work)) > 0){
			$this->output .= "URL;WORK:" . $this->url_work . "\r\n";
		}    
		
		if (strlen(trim($this->role)) > 0){
			$this->output .= "ROLE" . $this->lang . ":" . $this->role . "\r\n";
		}  
		
		if (strlen(trim($this->birthday)) > 0){
			$this->output .= "BDAY:" . $this->birthday . "\r\n";
		}  
		
		if (strlen(trim($this->email)) > 0){
			$this->output .= "EMAIL;PREF;INTERNET:" . $this->email . "\r\n";
		}  
		
		if (strlen(trim($this->tel_telex)) > 0){
			$this->output .= "EMAIL;TLX:" . $this->tel_telex . "\r\n";
		}  
		
		$this->output .= "REV:" . $this->rev . "\r\n";
		$this->output .= "END:VCARD\r\n";
		
		return $this->output;
	}  
	
	/**
	* Loads the string into the variable if it hasn't been set before
	*
	* @return $output
	* @see generateCardOutput(), writeCardFile()
	* @access public
	* @since 1.000 - 2002/10/10   
	*/
	public function getCardOutput(){
		if (!isset($this->output)){
			$this->generateCardOutput();
		}
		return $this->output;
	}  

	/**
	* Writes the string into the file and saves it to the download directory
	*
	* @return (void)
	* @see generateCardOutput(), getCardOutput()
	* @access public
	* @since 1.000 - 2002/10/10   
	*/
	public function writeCardFile(){
		if (!isset($this->output)){
			$this->generateCardOutput();
		}
		
		$handle = fopen($this->download_dir . '/' . $this->card_filename, 'w');
		fputs($handle, $this->output);
		fclose($handle);
		
		$this->deleteOldFiles(30);
		
		if (isset($handle)) {
			unset($handle);
		}
	}      
	
	/**
	* Writes the string into the file and saves it to the download directory
	*
	* @param (int) $time  Minimum age of the files (in seconds) before files get deleted
	* @return (void)
	* @see writeCardFile()
	* @access private
	* @since 1.000 - 2002/10/20   
	*/
	private function deleteOldFiles($time = 300){
		if (!is_int($time) || $time < 1){
			$time = (int) 300;
		}
		$handle = opendir($this->download_dir);
		while ($file = readdir($handle)){
			if (!eregi("^\.{1,2}$",$file) && !is_dir($this->download_dir . '/' . $file) && eregi("\.vcf",$file) && ((time() - filemtime($this->download_dir . '/' . $file)) > $time)){
				unlink($this->download_dir . '/' . $file);
			}
		} // end while
		
		closedir($handle);
		if (isset($handle)) {
				unset($handle);
		} 
		if (isset($file)) {
			unset($file);
		} 
	}        
	
	/**
	* Returns the full path to the saved file where it can be downloaded.
	*
	* Can be used for "header(Location:..."
	*
	* @return  Full http path
	* @access public
	* @since 1.000 - 2002/10/20   
	*/
	public function getCardFilePath(){
		$path_parts = pathinfo($_SERVER['SCRIPT_NAME']);
		$port = (($_SERVER['SERVER_PORT'] != 80) ? ':' . $_SERVER['SERVER_PORT'] : '' );
		return 'http://' . $_SERVER['SERVER_NAME'] . $port . $path_parts["dirname"] . '/' . $this->download_dir . '/' . $this->card_filename;
	}    
} // end class vCard
?>
