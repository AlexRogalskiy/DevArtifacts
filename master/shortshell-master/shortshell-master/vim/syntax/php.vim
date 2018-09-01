" Vim syntax file
" Language: php PHP 3/4/5
" Author:   Lutz Eymers
" Email:        lutz ___AT___ ipdienste ___DOT___ net
" URL:      http://www.ipdienste.net/data/php.vim
" Last Change:  2006 Aug 06
"
" ----------------------------------------------------------------------------
" 2006 Aug 6    Function and Methods ripped from php_manual_de.tar.gz Aug 2006
" ----------------------------------------------------------------------------
"
" Options   php_sql_query = 1  for SQL syntax highlighting inside strings
"       php_htmlInStrings = 1  for HTML syntax highlighting inside strings
"       php_baselib = 1  for highlighting baselib functions
"       php_asp_tags = 1  for highlighting ASP-style short tags
"       php_parent_error_close = 1  for highlighting parent error ] or )
"       php_parent_error_open = 1  for skipping an php end tag, if there exists an open ( or [ without a closing one
"       php_oldStyle = 1  for using old colorstyle
"       php_noShortTags = 1  don't sync <? ?> as php
"       php_folding = 1  for folding classes and functions
"       php_folding = 2  for folding all { } regions
"       php_sync_method = x
"           x=-1 to sync by search ( default )
"           x>0 to sync at least x lines backwards
"           x=0 to sync from start

" Note
" Setting php_folding=1 will match a closing } by comparing the indent
" before the class or function keyword with the indent of a matching }.
" Setting php_folding=2 will match all of pairs of {,} ( see known
" bugs ii )

" Known bugs
" setting  php_parent_error_close  on  and  php_parent_error_open  off
" has these two leaks:
"  i) An closing ) or ] inside a string match to the last open ( or [
"     before the string, when the the closing ) or ] is on the same line
"     where the string started. In this case a following ) or ] after
"     the string would be highlighted as an error, what is incorrect.
" ii) Same problem if you are setting php_folding = 2 with a closing
"     } inside an string on the first line of this string.

" For version 5.x: Clear all syntax items
" For version 6.x: Quit when a syntax file was already loaded
if version < 600
  syntax clear
elseif exists("b:current_syntax")
  finish
endif

if !exists("main_syntax")
  let main_syntax = 'php'
endif

if version < 600
  unlet! php_folding
  if exists("php_sync_method") && !php_sync_method
    let php_sync_method=-1
  endif
  so <sfile>:p:h/html.vim
else
  runtime syntax/html.vim
  unlet b:current_syntax
endif

" accept old options
if !exists("php_sync_method")
  if exists("php_minlines")
    let php_sync_method=php_minlines
  else
    let php_sync_method=-1
  endif
endif

if exists("php_parentError") && !exists("php_parent_error_open") && !exists("php_parent_error_close")
  let php_parent_error_close=1
  let php_parent_error_open=1
endif

syn cluster htmlPreproc add=phpRegion,phpRegionAsp,phpRegionSc

if version < 600
  syn include @sqlTop <sfile>:p:h/sql.vim
else
  syn include @sqlTop syntax/sql.vim
endif
syn sync clear
unlet b:current_syntax
syn cluster sqlTop remove=sqlString,sqlComment
if exists( "php_sql_query")
  syn cluster phpAddStrings contains=@sqlTop
endif

if exists( "php_htmlInStrings")
  syn cluster phpAddStrings add=@htmlTop
endif

syn case match

" Env Variables
syn keyword phpEnvVar   GATEWAY_INTERFACE SERVER_NAME SERVER_SOFTWARE SERVER_PROTOCOL REQUEST_METHOD QUERY_STRING DOCUMENT_ROOT HTTP_ACCEPT HTTP_ACCEPT_CHARSET HTTP_ENCODING HTTP_ACCEPT_LANGUAGE HTTP_CONNECTION HTTP_HOST HTTP_REFERER HTTP_USER_AGENT REMOTE_ADDR REMOTE_PORT SCRIPT_FILENAME SERVER_ADMIN SERVER_PORT SERVER_SIGNATURE PATH_TRANSLATED SCRIPT_NAME REQUEST_URI contained

" Internal Variables
syn keyword phpIntVar   GLOBALS PHP_ERRMSG PHP_SELF HTTP_GET_VARS HTTP_POST_VARS HTTP_COOKIE_VARS HTTP_POST_FILES HTTP_ENV_VARS HTTP_SERVER_VARS HTTP_SESSION_VARS HTTP_RAW_POST_DATA HTTP_STATE_VARS _GET _POST _COOKIE _FILES _SERVER _ENV _SERVER _REQUEST _SESSION  contained

" Constants
syn keyword phpCoreConstant PHP_VERSION PHP_OS DEFAULT_INCLUDE_PATH PEAR_INSTALL_DIR PEAR_EXTENSION_DIR PHP_EXTENSION_DIR PHP_BINDIR PHP_LIBDIR PHP_DATADIR PHP_SYSCONFDIR PHP_LOCALSTATEDIR PHP_CONFIG_FILE_PATH PHP_OUTPUT_HANDLER_START PHP_OUTPUT_HANDLER_CONT PHP_OUTPUT_HANDLER_END E_ERROR E_WARNING E_PARSE E_NOTICE E_CORE_ERROR E_CORE_WARNING E_COMPILE_ERROR E_COMPILE_WARNING E_USER_ERROR E_USER_WARNING E_USER_NOTICE E_ALL  contained

syn case ignore

syn keyword phpConstant  __LINE__ __FILE__ __FUNCTION__ __METHOD__ __CLASS__    contained


" Function and Methods ripped from php_manual_de.tar.gz Aug 2006
syn keyword phpFunctions    apache_child_terminate apache_get_modules apache_get_version apache_getenv apache_lookup_uri apache_note apache_request_headers apache_reset_timeout apache_response_headers apache_setenv ascii2ebcdic ebcdic2ascii getallheaders virtual  contained
syn keyword phpFunctions    apc_cache_info apc_clear_cache apc_define_constants apc_delete apc_fetch apc_load_constants apc_sma_info apc_store  contained
syn keyword phpFunctions    apd_breakpoint apd_callstack apd_clunk apd_continue apd_croak apd_dump_function_table apd_dump_persistent_resources apd_dump_regular_resources apd_echo apd_get_active_symbols apd_set_pprof_trace apd_set_session_trace apd_set_session apd_set_socket_session_trace override_function rename_function contained
syn keyword phpFunctions    array_change_key_case array_chunk array_combine array_count_values array_diff_assoc array_diff_key array_diff_uassoc array_diff_ukey array_diff array_fill array_filter array_flip array_intersect_assoc array_intersect_key array_intersect_uassoc array_intersect_ukey array_intersect array_key_exists array_keys array_map array_merge_recursive array_merge array_multisort array_pad array_pop array_product array_push array_rand array_reduce array_reverse array_search array_shift array_slice array_splice array_sum array_udiff_assoc array_udiff_uassoc array_udiff array_uintersect_assoc array_uintersect_uassoc array_uintersect array_unique array_unshift array_values array_walk_recursive array_walk array arsort asort compact count current each end extract in_array key krsort ksort list natcasesort natsort next pos prev range reset rsort shuffle sizeof sort uasort uksort usort   contained
syn keyword phpFunctions    aspell_check aspell_new aspell_suggest  contained
syn keyword phpFunctions    bcadd bccomp bcdiv bcmod bcmul bcpow bcpowmod bcscale bcsqrt bcsub  contained
syn keyword phpFunctions    bcompiler_load_exe bcompiler_load bcompiler_parse_class bcompiler_read bcompiler_write_class bcompiler_write_constant bcompiler_write_exe_footer bcompiler_write_file bcompiler_write_footer bcompiler_write_function bcompiler_write_functions_from_file bcompiler_write_header    contained
syn keyword phpFunctions    bzclose bzcompress bzdecompress bzerrno bzerror bzerrstr bzflush bzopen bzread bzwrite  contained
syn keyword phpFunctions    cal_days_in_month cal_from_jd cal_info cal_to_jd easter_date easter_days frenchtojd gregoriantojd jddayofweek jdmonthname jdtofrench jdtogregorian jdtojewish jdtojulian jdtounix jewishtojd juliantojd unixtojd    contained
syn keyword phpFunctions    ccvs_add ccvs_auth ccvs_command ccvs_count ccvs_delete ccvs_done ccvs_init ccvs_lookup ccvs_new ccvs_report ccvs_return ccvs_reverse ccvs_sale ccvs_status ccvs_textvalue ccvs_void contained
syn keyword phpFunctions    classkit_import classkit_method_add classkit_method_copy classkit_method_redefine classkit_method_remove classkit_method_rename contained
syn keyword phpFunctions    call_user_method_array call_user_method class_exists get_class_methods get_class_vars get_class get_declared_classes get_declared_interfaces get_object_vars get_parent_class interface_exists is_a is_subclass_of method_exists property_exists    contained
syn keyword phpFunctions    com DOTNET VARIANT com_addref com_create_guid com_event_sink com_get_active_object com_get com_invoke com_isenum com_load_typelib com_load com_message_pump com_print_typeinfo com_propget com_propput com_propset com_release com_set variant_abs variant_add variant_and variant_cast variant_cat variant_cmp variant_date_from_timestamp variant_date_to_timestamp variant_div variant_eqv variant_fix variant_get_type variant_idiv variant_imp variant_int variant_mod variant_mul variant_neg variant_not variant_or variant_pow variant_round variant_set_type variant_set variant_sub variant_xor   contained
syn keyword phpFunctions    cpdf_add_annotation cpdf_add_outline cpdf_arc cpdf_begin_text cpdf_circle cpdf_clip cpdf_close cpdf_closepath_fill_stroke cpdf_closepath_stroke cpdf_closepath cpdf_continue_text cpdf_curveto cpdf_end_text cpdf_fill_stroke cpdf_fill cpdf_finalize_page cpdf_finalize cpdf_global_set_document_limits cpdf_import_jpeg cpdf_lineto cpdf_moveto cpdf_newpath cpdf_open cpdf_output_buffer cpdf_page_init cpdf_place_inline_image cpdf_rect cpdf_restore cpdf_rlineto cpdf_rmoveto cpdf_rotate_text cpdf_rotate cpdf_save_to_file cpdf_save cpdf_scale cpdf_set_action_url cpdf_set_char_spacing cpdf_set_creator cpdf_set_current_page cpdf_set_font_directories cpdf_set_font_map_file cpdf_set_font cpdf_set_horiz_scaling cpdf_set_keywords cpdf_set_leading cpdf_set_page_animation cpdf_set_subject cpdf_set_text_matrix cpdf_set_text_pos cpdf_set_text_rendering cpdf_set_text_rise cpdf_set_title cpdf_set_viewer_preferences cpdf_set_word_spacing cpdf_setdash cpdf_setflat cpdf_setgray_fill cpdf_setgray_stroke cpdf_setgray cpdf_setlinecap cpdf_setlinejoin cpdf_setlinewidth cpdf_setmiterlimit cpdf_setrgbcolor_fill cpdf_setrgbcolor_stroke cpdf_setrgbcolor cpdf_show_xy cpdf_show cpdf_stringwidth cpdf_stroke cpdf_text cpdf_translate    contained
syn keyword phpFunctions    crack_check crack_closedict crack_getlastmessage crack_opendict contained
syn keyword phpFunctions    ctype_alnum ctype_alpha ctype_cntrl ctype_digit ctype_graph ctype_lower ctype_print ctype_punct ctype_space ctype_upper ctype_xdigit    contained
syn keyword phpFunctions    curl_close curl_copy_handle curl_errno curl_error curl_exec curl_getinfo curl_init curl_multi_add_handle curl_multi_close curl_multi_exec curl_multi_getcontent curl_multi_info_read curl_multi_init curl_multi_remove_handle curl_multi_select curl_setopt_array curl_setopt curl_version  contained
syn keyword phpFunctions    cybercash_base64_decode cybercash_base64_encode cybercash_decr cybercash_encr   contained
syn keyword phpFunctions    cybermut_creerformulairecm cybermut_creerreponsecm cybermut_testmac contained
syn keyword phpFunctions    cyrus_authenticate cyrus_bind cyrus_close cyrus_connect cyrus_query cyrus_unbind    contained
syn keyword phpFunctions    checkdate date_default_timezone_get date_default_timezone_set date_sunrise date_sunset date getdate gettimeofday gmdate gmmktime gmstrftime idate localtime microtime mktime strftime strptime strtotime time   contained
syn keyword phpFunctions    dba_close dba_delete dba_exists dba_fetch dba_firstkey dba_handlers dba_insert dba_key_split dba_list dba_nextkey dba_open dba_optimize dba_popen dba_replace dba_sync  contained
syn keyword phpFunctions    dbase_add_record dbase_close dbase_create dbase_delete_record dbase_get_header_info dbase_get_record_with_names dbase_get_record dbase_numfields dbase_numrecords dbase_open dbase_pack dbase_replace_record    contained
syn keyword phpFunctions    dblist dbmclose dbmdelete dbmexists dbmfetch dbmfirstkey dbminsert dbmnextkey dbmopen dbmreplace    contained
syn keyword phpFunctions    dbplus_add dbplus_aql dbplus_chdir dbplus_close dbplus_curr dbplus_errcode dbplus_errno dbplus_find dbplus_first dbplus_flush dbplus_freealllocks dbplus_freelock dbplus_freerlocks dbplus_getlock dbplus_getunique dbplus_info dbplus_last dbplus_lockrel dbplus_next dbplus_open dbplus_prev dbplus_rchperm dbplus_rcreate dbplus_rcrtexact dbplus_rcrtlike dbplus_resolve dbplus_restorepos dbplus_rkeys dbplus_ropen dbplus_rquery dbplus_rrename dbplus_rsecindex dbplus_runlink dbplus_rzap dbplus_savepos dbplus_setindex dbplus_setindexbynumber dbplus_sql dbplus_tcl dbplus_tremove dbplus_undo dbplus_undoprepare dbplus_unlockrel dbplus_unselect dbplus_update dbplus_xlockrel dbplus_xunlockrel   contained
syn keyword phpFunctions    dbx_close dbx_compare dbx_connect dbx_error dbx_escape_string dbx_fetch_row dbx_query dbx_sort  contained
syn keyword phpFunctions    dio_close dio_fcntl dio_open dio_read dio_seek dio_stat dio_tcsetattr dio_truncate dio_write    contained
syn keyword phpFunctions    chdir chroot dir closedir getcwd opendir readdir rewinddir scandir  contained
syn keyword phpFunctions    dom_import_simplexml    contained
syn keyword phpMethods  __construct isId appendData deleteData insertData replaceData substringData __construct __construct createAttribute createAttributeNS createCDATASection createComment createDocumentFragment createElement createElementNS createEntityReference createProcessingInstruction createTextNode getElementById getElementsByTagName getElementsByTagNameNS importNode load loadHTML loadHTMLFile loadXML normalize relaxNGValidate relaxNGValidateSource save saveHTML saveHTMLFile saveXML schemaValidate schemaValidateSource validate xinclude appendXML __construct getAttribute getAttributeNode getAttributeNodeNS getAttributeNS getElementsByTagName getElementsByTagNameNS hasAttribute hasAttributeNS removeAttribute removeAttributeNode removeAttributeNS setAttribute setAttributeNode setAttributeNodeNS setAttributeNS __construct __construct createDocument createDocumentType hasFeature getNamedItem getNamedItemNS item appendChild cloneNode hasAttributes hasChildNodes insertBefore isSameNode isSupported lookupNamespaceURI lookupPrefix normalize removeChild replaceChild item __construct __construct isWhitespaceInElementContent splitText __construct evaluate query registerNamespace  contained
syn keyword phpFunctions    domxml_new_doc domxml_open_file domxml_open_mem domxml_version domxml_xmltree domxml_xslt_stylesheet_doc domxml_xslt_stylesheet_file domxml_xslt_stylesheet domxml_xslt_version xpath_eval_expression xpath_eval xpath_new_context xpath_register_ns_auto xpath_register_ns xptr_eval xptr_new_context  contained
syn keyword phpMethods  name set_value specified value create_attribute create_cdata_section create_comment create_element_ns create_element create_entity_reference create_processing_instruction create_text_node doctype document_element dump_file dump_mem get_element_by_id get_elements_by_tagname html_dump_mem xinclude entities internal_subset name notations public_id system_id get_attribute_node get_attribute get_elements_by_tagname has_attribute remove_attribute set_attribute_node set_attribute tagname add_namespace append_child append_sibling attributes child_nodes clone_node dump_node first_child get_content has_attributes has_child_nodes insert_before is_blank_node last_child next_sibling node_name node_type node_value owner_document parent_node prefix previous_sibling remove_child replace_child replace_node set_content set_name set_namespace unlink_node data target process result_dump_file result_dump_mem    contained
syn keyword phpFunctions    dotnet_load contained
syn keyword phpFunctions    debug_backtrace debug_print_backtrace error_log error_reporting restore_error_handler restore_exception_handler set_error_handler set_exception_handler trigger_error user_error    contained
syn keyword phpFunctions    escapeshellarg escapeshellcmd exec passthru proc_close proc_get_status proc_nice proc_open proc_terminate shell_exec system contained
syn keyword phpFunctions    exif_imagetype exif_read_data EXIFCRONYM JPEGCRONYM TIFFCRONYM exif_tagname exif_thumbnail read_exif_data   contained
syn keyword phpFunctions    expect_expectl expect_popen contained
syn keyword phpFunctions    fam_cancel_monitor fam_close fam_monitor_collection fam_monitor_directory fam_monitor_file fam_next_event fam_open fam_pending fam_resume_monitor fam_suspend_monitor   contained
syn keyword phpFunctions    fbsql_affected_rows fbsql_autocommit fbsql_blob_size fbsql_change_user fbsql_clob_size fbsql_close fbsql_commit fbsql_connect fbsql_create_blob fbsql_create_clob fbsql_create_db fbsql_data_seek fbsql_database_password fbsql_database fbsql_db_query fbsql_db_status fbsql_drop_db fbsql_errno fbsql_error fbsql_fetch_array fbsql_fetch_assoc fbsql_fetch_field fbsql_fetch_lengths fbsql_fetch_object fbsql_fetch_row fbsql_field_flags fbsql_field_len fbsql_field_name fbsql_field_seek fbsql_field_table fbsql_field_type fbsql_free_result fbsql_get_autostart_info fbsql_hostname fbsql_insert_id fbsql_list_dbs fbsql_list_fields fbsql_list_tables fbsql_next_result fbsql_num_fields fbsql_num_rows fbsql_password fbsql_pconnect fbsql_query fbsql_read_blob fbsql_read_clob fbsql_result fbsql_rollback fbsql_select_db fbsql_set_lob_mode fbsql_set_password fbsql_set_transaction fbsql_start_db fbsql_stop_db fbsql_tablename fbsql_username fbsql_warnings   contained
syn keyword phpFunctions    fdf_add_doc_javascript fdf_add_template fdf_close fdf_create fdf_enum_values fdf_errno fdf_error fdf_get_ap fdf_get_attachment fdf_get_encoding fdf_get_file fdf_get_flags fdf_get_opt fdf_get_status fdf_get_value fdf_get_version fdf_header fdf_next_field_name fdf_open_string fdf_open fdf_remove_item fdf_save_string fdf_save fdf_set_ap fdf_set_encoding fdf_set_file fdf_set_flags fdf_set_javascript_action fdf_set_on_import_javascript fdf_set_opt fdf_set_status fdf_set_submit_form_action fdf_set_target_frame fdf_set_value fdf_set_version contained
syn keyword phpFunctions    finfo_buffer finfo_close finfo_file finfo_open finfo_set_flags  contained
syn keyword phpFunctions    filepro_fieldcount filepro_fieldname filepro_fieldtype filepro_fieldwidth filepro_retrieve filepro_rowcount filepro contained
syn keyword phpFunctions    basename chgrp chmod chown clearstatcache copy delete dirname disk_free_space disk_total_space diskfreespace fclose feof fflush fgetc fgetcsv fgets fgetss file_exists file_get_contents file_put_contents file fileatime filectime filegroup fileinode filemtime fileowner fileperms filesize filetype flock fnmatch fopen fpassthru fputcsv fputs fread fscanf fseek fstat ftell ftruncate fwrite glob is_dir is_executable is_file is_link is_readable is_uploaded_file is_writable is_writeable lchgrp lchown link linkinfo lstat mkdir move_uploaded_file parse_ini_file pathinfo pclose popen readfile readlink realpath rename rewind rmdir set_file_buffer stat symlink tempnam tmpfile touch umask unlink  contained
syn keyword phpFunctions    filter_data input_filters_list input_get_args input_get input_has_variable input_name_to_filter contained
syn keyword phpFunctions    fribidi_log2vis contained
syn keyword phpFunctions    ftp_alloc ftp_cdup ftp_chdir ftp_chmod ftp_close ftp_connect ftp_delete ftp_exec ftp_fget ftp_fput ftp_get_option ftp_get ftp_login ftp_mdtm ftp_mkdir ftp_nb_continue ftp_nb_fget ftp_nb_fput ftp_nb_get ftp_nb_put ftp_nlist ftp_pasv ftp_put ftp_pwd ftp_quit ftp_raw ftp_rawlist ftp_rename ftp_rmdir ftp_set_option ftp_site ftp_size ftp_ssl_connect ftp_systype  contained
syn keyword phpFunctions    call_user_func_array call_user_func create_function func_get_arg func_get_args func_num_args function_exists get_defined_functions register_shutdown_function register_tick_function unregister_tick_function   contained
syn keyword phpFunctions    bind_textdomain_codeset bindtextdomain dcgettext dcngettext dgettext dngettext gettext ngettext textdomain  contained
syn keyword phpFunctions    gmp_abs gmp_add gmp_and gmp_clrbit gmp_cmp gmp_com gmp_div_q gmp_div_qr gmp_div_r gmp_div gmp_divexact gmp_fact gmp_gcd gmp_gcdext gmp_hamdist gmp_init gmp_intval gmp_invert gmp_jacobi gmp_legendre gmp_mod gmp_mul gmp_neg gmp_nextprime gmp_or gmp_perfect_square gmp_popcount gmp_pow gmp_powm gmp_prob_prime gmp_random gmp_scan0 gmp_scan1 gmp_setbit gmp_sign gmp_sqrt gmp_sqrtrem gmp_strval gmp_sub gmp_xor   contained
syn keyword phpFunctions    gnupg_adddecryptkey gnupg_addencryptkey gnupg_addsignkey gnupg_cleardecryptkeys gnupg_clearencryptkeys gnupg_clearsignkeys gnupg_decrypt gnupg_decryptverify gnupg_encrypt gnupg_encryptsign gnupg_export gnupg_geterror gnupg_getprotocol gnupg_import gnupg_keyinfo gnupg_setarmor gnupg_seterrormode gnupg_setsignmode gnupg_sign gnupg_verify   contained
syn keyword phpFunctions    hash_algos hash_file hash_final hash_hmac_file hash_hmac hash_init hash_update_file hash_update_stream hash_update hash contained
syn keyword phpFunctions    header headers_list headers_sent setcookie setrawcookie contained
syn keyword phpFunctions    hw_api_attribute hwapi_hgcsp hw_api_content hw_api_object   contained
syn keyword phpMethods  key langdepvalue value values checkin checkout children mimetype read content copy dbstat dcstat dstanchors dstofsrcanchor count reason find ftstat hwstat identify info insert insertanchor insertcollection insertdocument link lock move assign attreditable count insert remove title value object objectbyanchor parents description type remove replace setcommittedversion srcanchors srcsofdst unlock user userlist contained
syn keyword phpFunctions    hw_Array2Objrec hw_changeobject hw_Children hw_ChildrenObj hw_Close hw_Connect hw_connection_info hw_cp hw_Deleteobject hw_DocByAnchor hw_DocByAnchorObj hw_Document_Attributes hw_Document_BodyTag hw_Document_Content hw_Document_SetContent hw_Document_Size hw_dummy hw_EditText hw_Error hw_ErrorMsg hw_Free_Document hw_GetAnchors hw_GetAnchorsObj hw_GetAndLock hw_GetChildColl hw_GetChildCollObj hw_GetChildDocColl hw_GetChildDocCollObj hw_GetObject hw_GetObjectByQuery hw_GetObjectByQueryColl hw_GetObjectByQueryCollObj hw_GetObjectByQueryObj hw_GetParents hw_GetParentsObj hw_getrellink hw_GetRemote hw_getremotechildren hw_GetSrcByDestObj hw_GetText hw_getusername hw_Identify hw_InCollections hw_Info hw_InsColl hw_InsDoc hw_insertanchors hw_InsertDocument hw_InsertObject hw_mapid hw_Modifyobject hw_mv hw_New_Document hw_objrec2array hw_Output_Document hw_pConnect hw_PipeDocument hw_Root hw_setlinkroot hw_stat hw_Unlock hw_Who   contained
syn keyword phpFunctions    ibase_add_user ibase_affected_rows ibase_backup ibase_blob_add ibase_blob_cancel ibase_blob_close ibase_blob_create ibase_blob_echo ibase_blob_get ibase_blob_import ibase_blob_info ibase_blob_open ibase_close ibase_commit_ret ibase_commit ibase_connect ibase_db_info ibase_delete_user ibase_drop_db ibase_errcode ibase_errmsg ibase_execute ibase_fetch_assoc ibase_fetch_object ibase_fetch_row ibase_field_info ibase_free_event_handler ibase_free_query ibase_free_result ibase_gen_id ibase_maintain_db ibase_modify_user ibase_name_result ibase_num_fields ibase_num_params ibase_param_info ibase_pconnect ibase_prepare ibase_query ibase_restore ibase_rollback_ret ibase_rollback ibase_server_info ibase_service_attach ibase_service_detach ibase_set_event_handler ibase_timefmt ibase_trans ibase_wait_event contained
syn keyword phpFunctions    db2_autocommit db2_bind_param db2_client_info db2_close db2_column_privileges db2_columns db2_commit db2_conn_error db2_conn_errormsg db2_connect db2_cursor_type db2_exec db2_execute db2_fetch_array db2_fetch_assoc db2_fetch_both db2_fetch_object db2_fetch_row db2_field_display_size db2_field_name db2_field_num db2_field_precision db2_field_scale db2_field_type db2_field_width db2_foreign_keys db2_free_result db2_free_stmt db2_next_result db2_num_fields db2_num_rows db2_pconnect db2_prepare db2_primary_keys db2_procedure_columns db2_procedures db2_result db2_rollback db2_server_info db2_special_columns db2_statistics db2_stmt_error db2_stmt_errormsg db2_table_privileges db2_tables   contained
syn keyword phpFunctions    icap_close icap_create_calendar icap_delete_calendar icap_delete_event icap_fetch_event icap_list_alarms icap_list_events icap_open icap_rename_calendar icap_reopen icap_snooze icap_store_event   contained
syn keyword phpFunctions    iconv_get_encoding iconv_mime_decode_headers iconv_mime_decode iconv_mime_encode iconv_set_encoding iconv_strlen iconv_strpos iconv_strrpos iconv_substr iconv ob_iconv_handler contained
syn keyword phpFunctions    id3_get_frame_long_name id3_get_frame_short_name id3_get_genre_id id3_get_genre_list id3_get_genre_name id3_get_tag id3_get_version id3_remove_tag id3_set_tag  contained
syn keyword phpFunctions    ifx_affected_rows ifx_blobinfile_mode ifx_byteasvarchar ifx_close ifx_connect ifx_copy_blob ifx_create_blob ifx_create_char ifx_do ifx_error ifx_errormsg ifx_fetch_row ifx_fieldproperties ifx_fieldtypes ifx_free_blob ifx_free_char ifx_free_result ifx_get_blob ifx_get_char ifx_getsqlca ifx_htmltbl_result ifx_nullformat ifx_num_fields ifx_num_rows ifx_pconnect ifx_prepare ifx_query ifx_textasvarchar ifx_update_blob ifx_update_char ifxus_close_slob ifxus_create_slob ifxus_free_slob ifxus_open_slob ifxus_read_slob ifxus_seek_slob ifxus_tell_slob ifxus_write_slob    contained
syn keyword phpFunctions    iis_add_server iis_get_dir_security iis_get_script_map iis_get_server_by_comment iis_get_server_by_path iis_get_server_rights iis_get_service_state iis_remove_server iis_set_app_settings iis_set_dir_security iis_set_script_map iis_set_server_rights iis_start_server iis_start_service iis_stop_server iis_stop_service    contained
syn keyword phpFunctions    gd_info getimagesize image_type_to_extension image_type_to_mime_type image2wbmp imagealphablending imageantialias imagearc imagechar imagecharup imagecolorallocate imagecolorallocatealpha imagecolorat imagecolorclosest imagecolorclosestalpha imagecolorclosesthwb imagecolordeallocate imagecolorexact imagecolorexactalpha imagecolormatch imagecolorresolve imagecolorresolvealpha imagecolorset imagecolorsforindex imagecolorstotal imagecolortransparent imageconvolution imagecopy imagecopymerge imagecopymergegray imagecopyresampled imagecopyresized imagecreate imagecreatefromgd2 imagecreatefromgd2part imagecreatefromgd imagecreatefromgif imagecreatefromjpeg imagecreatefrompng imagecreatefromstring imagecreatefromwbmp imagecreatefromxbm imagecreatefromxpm imagecreatetruecolor imagedashedline imagedestroy imageellipse imagefill imagefilledarc imagefilledellipse imagefilledpolygon imagefilledrectangle imagefilltoborder imagefilter imagefontheight imagefontwidth imageftbbox imagefttext imagegammacorrect imagegd2 imagegd imagegif imageinterlace imageistruecolor imagejpeg imagelayereffect imageline imageloadfont imagepalettecopy imagepng imagepolygon imagepsbbox imagepsencodefont imagepsextendfont imagepsfreefont imagepsloadfont imagepsslantfont imagepstext imagerectangle imagerotate imagesavealpha imagesetbrush imagesetpixel imagesetstyle imagesetthickness imagesettile imagestring imagestringup imagesx imagesy imagetruecolortopalette imagettfbbox imagettftext imagetypes imagewbmp imagexbm iptcembed iptcparse jpeg2wbmp png2wbmp    contained
syn keyword phpFunctions    imap_8bit imap_alerts imap_append imap_base64 imap_binary imap_body imap_bodystruct imap_check imap_clearflag_full imap_close imap_createmailbox imap_delete imap_deletemailbox imap_errors imap_expunge imap_fetch_overview imap_fetchbody imap_fetchheader imap_fetchstructure imap_get_quota imap_get_quotaroot imap_getacl imap_getmailboxes imap_getsubscribed imap_header imap_headerinfo imap_headers imap_last_error imap_list imap_listmailbox imap_listscan imap_listsubscribed imap_lsub imap_mail_compose imap_mail_copy imap_mail_move imap_mail imap_mailboxmsginfo imap_mime_header_decode imap_msgno imap_num_msg imap_num_recent imap_open imap_ping imap_qprint imap_renamemailbox imap_reopen imap_rfc822_parse_adrlist imap_rfc822_parse_headers imap_rfc822_write_address imap_scanmailbox imap_search imap_set_quota imap_setacl imap_setflag_full imap_sort imap_status imap_subscribe imap_thread imap_timeout imap_uid imap_undelete imap_unsubscribe imap_utf7_decode imap_utf7_encode imap_utf8  contained
syn keyword phpFunctions    assert_options assert dl extension_loaded get_cfg_var get_current_user get_defined_constants get_extension_funcs get_include_path get_included_files get_loaded_extensions get_magic_quotes_gpc get_magic_quotes_runtime get_required_files getenv getlastmod getmygid getmyinode getmypid getmyuid getopt getrusage ini_alter ini_get_all ini_get ini_restore ini_set main memory_get_peak_usage memory_get_usage php_ini_scanned_files php_logo_guid php_sapi_name php_uname phpcredits phpinfo phpversion putenv restore_include_path set_include_path set_magic_quotes_runtime set_time_limit sys_get_temp_dir version_compare zend_logo_guid zend_version  contained
syn keyword phpFunctions    ingres_autocommit ingres_close ingres_commit ingres_connect ingres_cursor ingres_errno ingres_error ingres_errsqlstate ingres_fetch_array ingres_fetch_object ingres_fetch_row ingres_field_length ingres_field_name ingres_field_nullable ingres_field_precision ingres_field_scale ingres_field_type ingres_num_fields ingres_num_rows ingres_pconnect ingres_query ingres_rollback   contained
syn keyword phpFunctions    ircg_channel_mode ircg_disconnect ircg_eval_ecmascript_params ircg_fetch_error_msg ircg_get_username ircg_html_encode ircg_ignore_add ircg_ignore_del ircg_invite ircg_is_conn_alive ircg_join ircg_kick ircg_list ircg_lookup_format_messages ircg_lusers ircg_msg ircg_names ircg_nick ircg_nickname_escape ircg_nickname_unescape ircg_notice ircg_oper ircg_part ircg_pconnect ircg_register_format_messages ircg_set_current ircg_set_file ircg_set_on_die ircg_topic ircg_who ircg_whois  contained
syn keyword phpFunctions    java_last_exception_clear java_last_exception_get   contained
syn keyword phpFunctions    kadm5_chpass_principal kadm5_create_principal kadm5_delete_principal kadm5_destroy kadm5_flush kadm5_get_policies kadm5_get_principal kadm5_get_principals kadm5_init_with_password kadm5_modify_principal  contained
syn keyword phpFunctions    ldap_8859_to_t61 ldap_add ldap_bind ldap_close ldap_compare ldap_connect ldap_count_entries ldap_delete ldap_dn2ufn ldap_err2str ldap_errno ldap_error ldap_explode_dn ldap_first_attribute ldap_first_entry ldap_first_reference ldap_free_result ldap_get_attributes ldap_get_dn ldap_get_entries ldap_get_option ldap_get_values_len ldap_get_values ldap_list ldap_mod_add ldap_mod_del ldap_mod_replace ldap_modify ldap_next_attribute ldap_next_entry ldap_next_reference ldap_parse_reference ldap_parse_result ldap_read ldap_rename ldap_sasl_bind ldap_search ldap_set_option ldap_set_rebind_proc ldap_sort ldap_start_tls ldap_t61_to_8859 ldap_unbind contained
syn keyword phpFunctions    libxml_clear_errors libxml_get_errors libxml_get_last_error libxml_set_streams_context libxml_use_internal_errors   contained
syn keyword phpFunctions    lzf_compress lzf_decompress lzf_optimized_for   contained
syn keyword phpFunctions    ezmlm_hash mail contained
syn keyword phpFunctions    mailparse_determine_best_xfer_encoding mailparse_msg_create mailparse_msg_extract_part_file mailparse_msg_extract_part mailparse_msg_free mailparse_msg_get_part_data mailparse_msg_get_part mailparse_msg_get_structure mailparse_msg_parse_file mailparse_msg_parse mailparse_rfc822_parse_addresses mailparse_stream_encode mailparse_uudecode_all   contained
syn keyword phpFunctions    abs acos acosh asin asinh atan2 atan atanh base_convert bindec ceil cos cosh decbin dechex decoct deg2rad exp expm1 floor fmod getrandmax hexdec hypot is_finite is_infinite is_nan lcg_value log10 log1p log max min mt_getrandmax mt_rand mt_srand octdec pi pow rad2deg rand round sin sinh sqrt srand tan tanh  contained
syn keyword phpFunctions    maxdb_affected_rows maxdb_autocommit maxdb_bind_param maxdb_bind_result maxdb_change_user maxdb_character_set_name maxdb_client_encoding maxdb_close_long_data maxdb_close maxdb_commit maxdb_connect_errno maxdb_connect_error maxdb_connect maxdb_data_seek maxdb_debug maxdb_disable_reads_from_master maxdb_disable_rpl_parse maxdb_dump_debug_info maxdb_embedded_connect maxdb_enable_reads_from_master maxdb_enable_rpl_parse maxdb_errno maxdb_error maxdb_escape_string maxdb_execute maxdb_fetch_array maxdb_fetch_assoc maxdb_fetch_field_direct maxdb_fetch_field maxdb_fetch_fields maxdb_fetch_lengths maxdb_fetch_object maxdb_fetch_row maxdb_fetch maxdb_field_count maxdb_field_seek maxdb_field_tell maxdb_free_result maxdb_get_client_info maxdb_get_client_version maxdb_get_host_info maxdb_get_metadata maxdb_get_proto_info maxdb_get_server_info maxdb_get_server_version maxdb_info maxdb_init maxdb_insert_id maxdb_kill maxdb_master_query maxdb_more_results maxdb_multi_query maxdb_next_result maxdb_num_fields maxdb_num_rows maxdb_options maxdb_param_count maxdb_ping maxdb_prepare maxdb_query maxdb_real_connect maxdb_real_escape_string maxdb_real_query maxdb_report maxdb_rollback maxdb_rpl_parse_enabled maxdb_rpl_probe maxdb_rpl_query_type maxdb_select_db maxdb_send_long_data maxdb_send_query maxdb_server_end maxdb_server_init maxdb_set_opt maxdb_sqlstate maxdb_ssl_set maxdb_stat maxdb_stmt_affected_rows maxdb_stmt_bind_param maxdb_stmt_bind_result maxdb_stmt_close_long_data maxdb_stmt_close maxdb_stmt_data_seek maxdb_stmt_errno maxdb_stmt_error maxdb_stmt_execute maxdb_stmt_fetch maxdb_stmt_free_result maxdb_stmt_init maxdb_stmt_num_rows maxdb_stmt_param_count maxdb_stmt_prepare maxdb_stmt_reset maxdb_stmt_result_metadata maxdb_stmt_send_long_data maxdb_stmt_sqlstate maxdb_stmt_store_result maxdb_store_result maxdb_thread_id maxdb_thread_safe maxdb_use_result maxdb_warning_count  contained
syn keyword phpFunctions    mb_convert_case mb_convert_encoding mb_convert_kana mb_convert_variables mb_decode_mimeheader mb_decode_numericentity mb_detect_encoding mb_detect_order mb_encode_mimeheader mb_encode_numericentity mb_ereg_match mb_ereg_replace mb_ereg_search_getpos mb_ereg_search_getregs mb_ereg_search_init mb_ereg_search_pos mb_ereg_search_regs mb_ereg_search_setpos mb_ereg_search mb_ereg mb_eregi_replace mb_eregi mb_get_info mb_http_input mb_http_output mb_internal_encoding mb_language mb_list_encodings mb_output_handler mb_parse_str mb_preferred_mime_name mb_regex_encoding mb_regex_set_options mb_send_mail mb_split mb_strcut mb_strimwidth mb_strlen mb_strpos mb_strrpos mb_strtolower mb_strtoupper mb_strwidth mb_substitute_character mb_substr_count mb_substr  contained
syn keyword phpFunctions    mcal_append_event mcal_close mcal_create_calendar mcal_date_compare mcal_date_valid mcal_day_of_week mcal_day_of_year mcal_days_in_month mcal_delete_calendar mcal_delete_event mcal_event_add_attribute mcal_event_init mcal_event_set_alarm mcal_event_set_category mcal_event_set_class mcal_event_set_description mcal_event_set_end mcal_event_set_recur_daily mcal_event_set_recur_monthly_mday mcal_event_set_recur_monthly_wday mcal_event_set_recur_none mcal_event_set_recur_weekly mcal_event_set_recur_yearly mcal_event_set_start mcal_event_set_title mcal_expunge mcal_fetch_current_stream_event mcal_fetch_event mcal_is_leap_year mcal_list_alarms mcal_list_events mcal_next_recurrence mcal_open mcal_popen mcal_rename_calendar mcal_reopen mcal_snooze mcal_store_event mcal_time_valid mcal_week_of_year contained
syn keyword phpFunctions    mcrypt_cbc mcrypt_cfb mcrypt_create_iv mcrypt_decrypt mcrypt_ecb mcrypt_enc_get_algorithms_name mcrypt_enc_get_block_size mcrypt_enc_get_iv_size mcrypt_enc_get_key_size mcrypt_enc_get_modes_name mcrypt_enc_get_supported_key_sizes mcrypt_enc_is_block_algorithm_mode mcrypt_enc_is_block_algorithm mcrypt_enc_is_block_mode mcrypt_enc_self_test mcrypt_encrypt mcrypt_generic_deinit mcrypt_generic_end mcrypt_generic_init mcrypt_generic mcrypt_get_block_size mcrypt_get_cipher_name mcrypt_get_iv_size mcrypt_get_key_size mcrypt_list_algorithms mcrypt_list_modes mcrypt_module_close mcrypt_module_get_algo_block_size mcrypt_module_get_algo_key_size mcrypt_module_get_supported_key_sizes mcrypt_module_is_block_algorithm_mode mcrypt_module_is_block_algorithm mcrypt_module_is_block_mode mcrypt_module_open mcrypt_module_self_test mcrypt_ofb mdecrypt_generic  contained
syn keyword phpFunctions    m_checkstatus m_completeauthorizations m_connect m_connectionerror m_deletetrans m_destroyconn m_destroyengine m_getcell m_getcellbynum m_getcommadelimited m_getheader m_initconn m_initengine m_iscommadelimited m_maxconntimeout m_monitor m_numcolumns m_numrows m_parsecommadelimited m_responsekeys m_responseparam m_returnstatus m_setblocking m_setdropfile m_setip m_setssl_cafile m_setssl_files m_setssl m_settimeout m_sslcert_gen_hash m_transactionssent m_transinqueue m_transkeyval m_transnew m_transsend m_uwait m_validateidentifier m_verifyconnection m_verifysslcert contained
syn keyword phpFunctions    memcache_debug  contained
syn keyword phpMethods  add addServer close connect decrement delete flush get getExtendedStats getStats getVersion increment pconnect replace set setCompressThreshold contained
syn keyword phpFunctions    mhash_count mhash_get_block_size mhash_get_hash_name mhash_keygen_s2k mhash contained
syn keyword phpFunctions    mime_content_type   contained
syn keyword phpFunctions    SWFPrebuiltClip SWFSound SWFVideoStream ming_keypress ming_setcubicthreshold ming_setscale ming_useConstants ming_useswfversion SWFAction SWFBitmap SWFbutton SWFFill SWFFont SWFGradient SWFMorph SWFMovie SWFShape SWFSprite SWFText SWFTextField contained
syn keyword phpMethods  addASound setMenu addAction endMask getRot getX getXScale getXSkew getY getYScale getYSkew setMaskLevel setMatrix getAscent getDescent getLeading getShape getUTF8Width addChars addUTF8Chars addExport addFont importChar importFont labelFrame saveToFile startSound stopSound writeExports drawArc drawCircle drawCubic drawCubicTo drawGlyph loopCount loopInPoint loopOutPoint noMultiple labelFrame startSound stopSound addUTF8String getAscent getDescent getLeading getUTF8Width addChars setPadding getNumFrames setDimension getHeight getWidth addAction addShape setAction setdown setHit setOver setUp addColor move moveTo multColor remove Rotate rotateTo scale scaleTo setDepth setName setRatio skewX skewXTo skewY skewYTo moveTo rotateTo scaleTo skewXTo skewYTo getwidth addEntry getshape1 getshape2 add nextframe output remove save setbackground setdimension setframes setrate streammp3 addFill drawCurve drawCurveTo drawLine drawLineTo movePen movePenTo setLeftFill setLine setRightFill add nextframe remove setframes addString getWidth moveTo setColor setFont setHeight setSpacing addstring align setbounds setcolor setFont setHeight setindentation setLeftMargin setLineSpacing setMargins setname setrightMargin contained
syn keyword phpFunctions    connection_aborted connection_status connection_timeout constant define defined die eval exit get_browser __halt_compiler highlight_file highlight_string ignore_user_abort pack php_check_syntax php_strip_whitespace show_source sleep sys_getloadavg time_nanosleep time_sleep_until uniqid unpack usleep    contained
syn keyword phpFunctions    udm_add_search_limit udm_alloc_agent_array udm_alloc_agent udm_api_version udm_cat_list udm_cat_path udm_check_charset udm_check_stored udm_clear_search_limits udm_close_stored udm_crc32 udm_errno udm_error udm_find udm_free_agent udm_free_ispell_data udm_free_res udm_get_doc_count udm_get_res_field udm_get_res_param udm_hash32 udm_load_ispell_data udm_open_stored udm_set_agent_param  contained
syn keyword phpFunctions    msession_connect msession_count msession_create msession_destroy msession_disconnect msession_find msession_get_array msession_get_data msession_get msession_inc msession_list msession_listvar msession_lock msession_plugin msession_randstr msession_set_array msession_set_data msession_set msession_timeout msession_uniq msession_unlock    contained
syn keyword phpFunctions    msql_affected_rows msql_close msql_connect msql_create_db msql_createdb msql_data_seek msql_db_query msql_dbname msql_drop_db msql_error msql_fetch_array msql_fetch_field msql_fetch_object msql_fetch_row msql_field_flags msql_field_len msql_field_name msql_field_seek msql_field_table msql_field_type msql_fieldflags msql_fieldlen msql_fieldname msql_fieldtable msql_fieldtype msql_free_result msql_list_dbs msql_list_fields msql_list_tables msql_num_fields msql_num_rows msql_numfields msql_numrows msql_pconnect msql_query msql_regcase msql_result msql_select_db msql_tablename msql    contained
syn keyword phpFunctions    mssql_bind mssql_close mssql_connect mssql_data_seek mssql_execute mssql_fetch_array mssql_fetch_assoc mssql_fetch_batch mssql_fetch_field mssql_fetch_object mssql_fetch_row mssql_field_length mssql_field_name mssql_field_seek mssql_field_type mssql_free_result mssql_free_statement mssql_get_last_message mssql_guid_string mssql_init mssql_min_error_severity mssql_min_message_severity mssql_next_result mssql_num_fields mssql_num_rows mssql_pconnect mssql_query mssql_result mssql_rows_affected mssql_select_db    contained
syn keyword phpFunctions    muscat_close muscat_get muscat_give muscat_setup_net muscat_setup   contained
syn keyword phpFunctions    mysql_affected_rows mysql_change_user mysql_client_encoding mysql_close mysql_connect mysql_create_db mysql_data_seek mysql_db_name mysql_db_query mysql_drop_db mysql_errno mysql_error mysql_escape_string mysql_fetch_array mysql_fetch_assoc mysql_fetch_field mysql_fetch_lengths mysql_fetch_object mysql_fetch_row mysql_field_flags mysql_field_len mysql_field_name mysql_field_seek mysql_field_table mysql_field_type mysql_free_result mysql_get_client_info mysql_get_host_info mysql_get_proto_info mysql_get_server_info mysql_info mysql_insert_id mysql_list_dbs mysql_list_fields mysql_list_processes mysql_list_tables mysql_num_fields mysql_num_rows mysql_pconnect mysql_ping mysql_query mysql_real_escape_string mysql_result mysql_select_db mysql_stat mysql_tablename mysql_thread_id mysql_unbuffered_query    contained
syn keyword phpFunctions    mysqli_affected_rows mysqli_autocommit mysqli_bind_param mysqli_bind_result mysqli_change_user mysqli_character_set_name mysqli_client_encoding mysqli_close mysqli_commit mysqli_connect_errno mysqli_connect_error mysqli_connect mysqli_data_seek mysqli_debug mysqli_disable_reads_from_master mysqli_disable_rpl_parse mysqli_dump_debug_info mysqli_embedded_connect mysqli_enable_reads_from_master mysqli_enable_rpl_parse mysqli_errno mysqli_error mysqli_escape_string mysqli_execute mysqli_fetch_array mysqli_fetch_assoc mysqli_fetch_field_direct mysqli_fetch_field mysqli_fetch_fields mysqli_fetch_lengths mysqli_fetch_object mysqli_fetch_row mysqli_fetch mysqli_field_count mysqli_field_seek mysqli_field_tell mysqli_free_result mysqli_get_client_info mysqli_get_client_version mysqli_get_host_info mysqli_get_metadata mysqli_get_proto_info mysqli_get_server_info mysqli_get_server_version mysqli_info mysqli_init mysqli_insert_id mysqli_kill mysqli_master_query mysqli_more_results mysqli_multi_query mysqli_next_result mysqli_num_fields mysqli_num_rows mysqli_options mysqli_param_count mysqli_ping mysqli_prepare mysqli_query mysqli_real_connect mysqli_real_escape_string mysqli_real_query mysqli_report mysqli_rollback mysqli_rpl_parse_enabled mysqli_rpl_probe mysqli_rpl_query_type mysqli_select_db mysqli_send_long_data mysqli_send_query mysqli_server_end mysqli_server_init mysqli_set_charset mysqli_set_opt mysqli_sqlstate mysqli_ssl_set mysqli_stat mysqli_stmt_affected_rows mysqli_stmt_bind_param mysqli_stmt_bind_result mysqli_stmt_close mysqli_stmt_data_seek mysqli_stmt_errno mysqli_stmt_error mysqli_stmt_execute mysqli_stmt_fetch mysqli_stmt_free_result mysqli_stmt_init mysqli_stmt_num_rows mysqli_stmt_param_count mysqli_stmt_prepare mysqli_stmt_reset mysqli_stmt_result_metadata mysqli_stmt_send_long_data mysqli_stmt_sqlstate mysqli_stmt_store_result mysqli_store_result mysqli_thread_id mysqli_thread_safe mysqli_use_result mysqli_warning_count    contained
syn keyword phpFunctions    ncurses_addch ncurses_addchnstr ncurses_addchstr ncurses_addnstr ncurses_addstr ncurses_assume_default_colors ncurses_attroff ncurses_attron ncurses_attrset ncurses_baudrate ncurses_beep ncurses_bkgd ncurses_bkgdset ncurses_border ncurses_bottom_panel ncurses_can_change_color ncurses_cbreak ncurses_clear ncurses_clrtobot ncurses_clrtoeol ncurses_color_content ncurses_color_set ncurses_curs_set ncurses_def_prog_mode ncurses_def_shell_mode ncurses_define_key ncurses_del_panel ncurses_delay_output ncurses_delch ncurses_deleteln ncurses_delwin ncurses_doupdate ncurses_echo ncurses_echochar ncurses_end ncurses_erase ncurses_erasechar ncurses_filter ncurses_flash ncurses_flushinp ncurses_getch ncurses_getmaxyx ncurses_getmouse ncurses_getyx ncurses_halfdelay ncurses_has_colors ncurses_has_ic ncurses_has_il ncurses_has_key ncurses_hide_panel ncurses_hline ncurses_inch ncurses_init_color ncurses_init_pair ncurses_init ncurses_insch ncurses_insdelln ncurses_insertln ncurses_insstr ncurses_instr ncurses_isendwin ncurses_keyok ncurses_keypad ncurses_killchar ncurses_longname ncurses_meta ncurses_mouse_trafo ncurses_mouseinterval ncurses_mousemask ncurses_move_panel ncurses_move ncurses_mvaddch ncurses_mvaddchnstr ncurses_mvaddchstr ncurses_mvaddnstr ncurses_mvaddstr ncurses_mvcur ncurses_mvdelch ncurses_mvgetch ncurses_mvhline ncurses_mvinch ncurses_mvvline ncurses_mvwaddstr ncurses_napms ncurses_new_panel ncurses_newpad ncurses_newwin ncurses_nl ncurses_nocbreak ncurses_noecho ncurses_nonl ncurses_noqiflush ncurses_noraw ncurses_pair_content ncurses_panel_above ncurses_panel_below ncurses_panel_window ncurses_pnoutrefresh ncurses_prefresh ncurses_putp ncurses_qiflush ncurses_raw ncurses_refresh ncurses_replace_panel ncurses_reset_prog_mode ncurses_reset_shell_mode ncurses_resetty ncurses_savetty ncurses_scr_dump ncurses_scr_init ncurses_scr_restore ncurses_scr_set ncurses_scrl ncurses_show_panel ncurses_slk_attr ncurses_slk_attroff ncurses_slk_attron ncurses_slk_attrset ncurses_slk_clear ncurses_slk_color ncurses_slk_init ncurses_slk_noutrefresh ncurses_slk_refresh ncurses_slk_restore ncurses_slk_set ncurses_slk_touch ncurses_standend ncurses_standout ncurses_start_color ncurses_termattrs ncurses_termname ncurses_timeout ncurses_top_panel ncurses_typeahead ncurses_ungetch ncurses_ungetmouse ncurses_update_panels ncurses_use_default_colors ncurses_use_env ncurses_use_extended_names ncurses_vidattr ncurses_vline ncurses_waddch ncurses_waddstr ncurses_wattroff ncurses_wattron ncurses_wattrset ncurses_wborder ncurses_wclear ncurses_wcolor_set ncurses_werase ncurses_wgetch ncurses_whline ncurses_wmouse_trafo ncurses_wmove ncurses_wnoutrefresh ncurses_wrefresh ncurses_wstandend ncurses_wstandout ncurses_wvline contained
syn keyword phpFunctions    gopher_parsedir contained
syn keyword phpFunctions    checkdnsrr closelog debugger_off debugger_on define_syslog_variables dns_check_record dns_get_mx dns_get_record fsockopen gethostbyaddr gethostbyname gethostbynamel getmxrr getprotobyname getprotobynumber getservbyname getservbyport inet_ntop inet_pton ip2long long2ip openlog pfsockopen socket_get_status socket_set_blocking socket_set_timeout syslog contained
syn keyword phpFunctions    newt_bell newt_button_bar newt_button newt_centered_window newt_checkbox_get_value newt_checkbox_set_flags newt_checkbox_set_value newt_checkbox_tree_add_item newt_checkbox_tree_find_item newt_checkbox_tree_get_current newt_checkbox_tree_get_entry_value newt_checkbox_tree_get_multi_selection newt_checkbox_tree_get_selection newt_checkbox_tree_multi newt_checkbox_tree_set_current newt_checkbox_tree_set_entry_value newt_checkbox_tree_set_entry newt_checkbox_tree_set_width newt_checkbox_tree newt_checkbox newt_clear_key_buffer newt_cls newt_compact_button newt_component_add_callback newt_component_takes_focus newt_create_grid newt_cursor_off newt_cursor_on newt_delay newt_draw_form newt_draw_root_text newt_entry_get_value newt_entry_set_filter newt_entry_set_flags newt_entry_set newt_entry newt_finished newt_form_add_component newt_form_add_components newt_form_add_host_key newt_form_destroy newt_form_get_current newt_form_run newt_form_set_background newt_form_set_height newt_form_set_size newt_form_set_timer newt_form_set_width newt_form_watch_fd newt_form newt_get_screen_size newt_grid_add_components_to_form newt_grid_basic_window newt_grid_free newt_grid_get_size newt_grid_h_close_stacked newt_grid_h_stacked newt_grid_place newt_grid_set_field newt_grid_simple_window newt_grid_v_close_stacked newt_grid_v_stacked newt_grid_wrapped_window_at newt_grid_wrapped_window newt_init newt_label_set_text newt_label newt_listbox_append_entry newt_listbox_clear_selection newt_listbox_clear newt_listbox_delete_entry newt_listbox_get_current newt_listbox_get_selection newt_listbox_insert_entry newt_listbox_item_count newt_listbox_select_item newt_listbox_set_current_by_key newt_listbox_set_current newt_listbox_set_data newt_listbox_set_entry newt_listbox_set_width newt_listbox newt_listitem_get_data newt_listitem_set newt_listitem newt_open_window newt_pop_help_line newt_pop_window newt_push_help_line newt_radio_get_current newt_radiobutton newt_redraw_help_line newt_reflow_text newt_refresh newt_resize_screen newt_resume newt_run_form newt_scale_set newt_scale newt_scrollbar_set newt_set_help_callback newt_set_suspend_callback newt_suspend newt_textbox_get_num_lines newt_textbox_reflowed newt_textbox_set_height newt_textbox_set_text newt_textbox newt_vertical_scrollbar newt_wait_for_key newt_win_choice newt_win_entries newt_win_menu newt_win_message newt_win_messagev newt_win_ternary   contained
syn keyword phpFunctions    yp_all yp_cat yp_err_string yp_errno yp_first yp_get_default_domain yp_master yp_match yp_next yp_order contained
syn keyword phpFunctions    notes_body notes_copy_db notes_create_db notes_create_note notes_drop_db notes_find_note notes_header_info notes_list_msgs notes_mark_read notes_mark_unread notes_nav_create notes_search notes_unread notes_version   contained
syn keyword phpFunctions    nsapi_request_headers nsapi_response_headers nsapi_virtual  contained
syn keyword phpFunctions    aggregate_info aggregate_methods_by_list aggregate_methods_by_regexp aggregate_methods aggregate_properties_by_list aggregate_properties_by_regexp aggregate_properties aggregate aggregation_info deaggregate  contained
syn keyword phpFunctions    oci_bind_array_by_name oci_bind_by_name oci_cancel oci_close oci_commit oci_connect oci_define_by_name oci_error oci_execute oci_fetch_all oci_fetch_array oci_fetch_assoc oci_fetch_object oci_fetch_row oci_fetch oci_field_is_null oci_field_name oci_field_precision oci_field_scale oci_field_size oci_field_type_raw oci_field_type oci_free_statement oci_internal_debug oci_lob_copy oci_lob_is_equal oci_new_collection oci_new_connect oci_new_cursor oci_new_descriptor oci_num_fields oci_num_rows oci_parse oci_password_change oci_pconnect oci_result oci_rollback oci_server_version oci_set_prefetch oci_statement_type ocibindbyname ocicancel ocicloselob ocicollappend ocicollassign ocicollassignelem ocicollgetelem ocicollmax ocicollsize ocicolltrim ocicolumnisnull ocicolumnname ocicolumnprecision ocicolumnscale ocicolumnsize ocicolumntype ocicolumntyperaw ocicommit ocidefinebyname ocierror ociexecute ocifetch ocifetchinto ocifetchstatement ocifreecollection ocifreecursor ocifreedesc ocifreestatement ociinternaldebug ociloadlob ocilogoff ocilogon ocinewcollection ocinewcursor ocinewdescriptor ocinlogon ocinumcols ociparse ociplogon ociresult ocirollback ocirowcount ocisavelob ocisavelobfile ociserverversion ocisetprefetch ocistatementtype ociwritelobtofile ociwritetemporarylob  contained
syn keyword phpFunctions    Usage   contained
syn keyword phpFunctions    openal_buffer_create openal_buffer_data openal_buffer_destroy openal_buffer_get openal_buffer_loadwav openal_context_create openal_context_current openal_context_destroy openal_context_process openal_context_suspend openal_device_close openal_device_open openal_listener_get openal_listener_set openal_source_create openal_source_destroy openal_source_get openal_source_pause openal_source_play openal_source_rewind openal_source_set openal_source_stop openal_stream  contained
syn keyword phpFunctions    openssl_csr_export_to_file openssl_csr_export openssl_csr_new openssl_csr_sign openssl_error_string openssl_free_key openssl_get_privatekey openssl_get_publickey openssl_open openssl_pkcs7_decrypt openssl_pkcs7_encrypt openssl_pkcs7_sign openssl_pkcs7_verify openssl_pkey_export_to_file openssl_pkey_export openssl_pkey_free openssl_pkey_get_private openssl_pkey_get_public openssl_pkey_new openssl_private_decrypt openssl_private_encrypt openssl_public_decrypt openssl_public_encrypt openssl_seal openssl_sign openssl_verify openssl_x509_check_private_key openssl_x509_checkpurpose openssl_x509_export_to_file openssl_x509_export openssl_x509_free openssl_x509_parse openssl_x509_read   contained
syn keyword phpFunctions    ora_bind ora_close ora_columnname ora_columnsize ora_columntype ora_commit ora_commitoff ora_commiton ora_do ora_error ora_errorcode ora_exec ora_fetch_into ora_fetch ora_getcolumn ora_logoff ora_logon ora_numcols ora_numrows ora_open ora_parse ora_plogon ora_rollback    contained
syn keyword phpFunctions    flush ob_clean ob_end_clean ob_end_flush ob_flush ob_get_clean ob_get_contents ob_get_flush ob_get_length ob_get_level ob_get_status ob_gzhandler ob_implicit_flush ob_list_handlers ob_start output_add_rewrite_var output_reset_rewrite_vars  contained
syn keyword phpFunctions    overload    contained
syn keyword phpFunctions    ovrimos_close ovrimos_commit ovrimos_connect ovrimos_cursor ovrimos_exec ovrimos_execute ovrimos_fetch_into ovrimos_fetch_row ovrimos_field_len ovrimos_field_name ovrimos_field_num ovrimos_field_type ovrimos_free_result ovrimos_longreadlen ovrimos_num_fields ovrimos_num_rows ovrimos_prepare ovrimos_result_all ovrimos_result ovrimos_rollback  contained
syn keyword phpFunctions    px_close px_create_fp px_date2string px_delete_record px_delete px_get_field px_get_info px_get_parameter px_get_record px_get_schema px_get_value px_insert_record px_new px_numfields px_numrecords px_open_fp px_put_record px_retrieve_record px_set_blob_file px_set_parameter px_set_tablename px_set_targetencoding px_set_value px_timestamp2string px_update_record    contained
syn keyword phpFunctions    parsekit_compile_file parsekit_compile_string parsekit_func_arginfo contained
syn keyword phpFunctions    pcntl_alarm pcntl_exec pcntl_fork pcntl_getpriority pcntl_setpriority pcntl_signal pcntl_wait pcntl_waitpid pcntl_wexitstatus pcntl_wifexited pcntl_wifsignaled pcntl_wifstopped pcntl_wstopsig pcntl_wtermsig  contained
syn keyword phpFunctions    preg_grep preg_last_error preg_match_all preg_match preg_quote preg_replace_callback preg_replace preg_split    contained
syn keyword phpFunctions    PDF_activate_item PDF_add_annotation PDF_add_bookmark PDF_add_launchlink PDF_add_locallink PDF_add_nameddest PDF_add_note PDF_add_outline PDF_add_pdflink PDF_add_thumbnail PDF_add_weblink PDF_arc PDF_arcn PDF_attach_file PDF_begin_document PDF_begin_font PDF_begin_glyph PDF_begin_item PDF_begin_layer PDF_begin_page_ext PDF_begin_page PDF_begin_pattern PDF_begin_template PDF_circle PDF_clip PDF_close_image PDF_close_pdi_page PDF_close_pdi PDF_close PDF_closepath_fill_stroke PDF_closepath_stroke PDF_closepath PDF_concat PDF_continue_text PDF_create_action PDF_create_annotation PDF_create_bookmark PDF_create_field PDF_create_fieldgroup PDF_create_gstate PDF_create_pvf PDF_create_textflow PDF_curveto PDF_define_layer PDF_delete_pvf PDF_delete_textflow PDF_delete PDF_encoding_set_char PDF_end_document PDF_end_font PDF_end_glyph PDF_end_item PDF_end_layer PDF_end_page_ext PDF_end_page PDF_end_pattern PDF_end_template PDF_endpath PDF_fill_imageblock PDF_fill_pdfblock PDF_fill_stroke PDF_fill_textblock PDF_fill PDF_findfont PDF_fit_image PDF_fit_pdi_page PDF_fit_textflow PDF_fit_textline PDF_get_apiname PDF_get_buffer PDF_get_errmsg PDF_get_errnum PDF_get_font PDF_get_fontname PDF_get_fontsize PDF_get_image_height PDF_get_image_width PDF_get_majorversion PDF_get_minorversion PDF_get_parameter PDF_get_pdi_parameter PDF_get_pdi_value PDF_get_value PDF_info_textflow PDF_initgraphics PDF_lineto PDF_load_font PDF_load_iccprofile PDF_load_image PDF_makespotcolor PDF_moveto PDF_new PDF_open_ccitt PDF_open_file PDF_open_gif PDF_open_image_file PDF_open_image PDF_open_jpeg PDF_open_memory_image PDF_open_pdi_page PDF_open_pdi PDF_open_tiff PDF_place_image PDF_place_pdi_page PDF_process_pdi PDF_rect PDF_restore PDF_resume_page PDF_rotate PDF_save PDF_scale PDF_set_border_color PDF_set_border_dash PDF_set_border_style PDF_set_char_spacing PDF_set_duration PDF_set_gstate PDF_set_horiz_scaling PDF_set_info_author PDF_set_info_creator PDF_set_info_keywords PDF_set_info_subject PDF_set_info_title PDF_set_info PDF_set_layer_dependency PDF_set_leading PDF_set_parameter PDF_set_text_matrix PDF_set_text_pos PDF_set_text_rendering PDF_set_text_rise PDF_set_value PDF_set_word_spacing PDF_setcolor PDF_setdash PDF_setdashpattern PDF_setflat PDF_setfont PDF_setgray_fill PDF_setgray_stroke PDF_setgray PDF_setlinecap PDF_setlinejoin PDF_setlinewidth PDF_setmatrix PDF_setmiterlimit PDF_setpolydash PDF_setrgbcolor_fill PDF_setrgbcolor_stroke PDF_setrgbcolor PDF_shading_pattern PDF_shading PDF_shfill PDF_show_boxed PDF_show_xy PDF_show PDF_skew PDF_stringwidth PDF_stroke PDF_suspend_page PDF_translate PDF_utf16_to_utf8 PDF_utf8_to_utf16  contained
syn keyword phpMethods  beginTransaction commit __construct errorCode errorInfo exec getAttribute getAvailableDrivers lastInsertId prepare query quote rollBack setAttribute bindColumn bindParam bindValue closeCursor columnCount errorCode errorInfo execute fetch fetchAll fetchColumn fetchObject getAttribute getColumnMeta nextRowset rowCount setAttribute setFetchMode contained
syn keyword phpMethods  pgsqlLOBCreate pgsqlLOBOpen pgsqlLOBUnlink  contained
syn keyword phpMethods  sqliteCreateAggregate sqliteCreateFunction  contained
syn keyword phpFunctions    pfpro_cleanup pfpro_init pfpro_process_raw pfpro_process pfpro_version  contained
syn keyword phpFunctions    pg_affected_rows pg_cancel_query pg_client_encoding pg_close pg_connect pg_connection_busy pg_connection_reset pg_connection_status pg_convert pg_copy_from pg_copy_to pg_dbname pg_delete pg_end_copy pg_escape_bytea pg_escape_string pg_execute pg_fetch_all_columns pg_fetch_all pg_fetch_array pg_fetch_assoc pg_fetch_object pg_fetch_result pg_fetch_row pg_field_is_null pg_field_name pg_field_num pg_field_prtlen pg_field_size pg_field_table pg_field_type_oid pg_field_type pg_free_result pg_get_notify pg_get_pid pg_get_result pg_host pg_insert pg_last_error pg_last_notice pg_last_oid pg_lo_close pg_lo_create pg_lo_export pg_lo_import pg_lo_open pg_lo_read_all pg_lo_read pg_lo_seek pg_lo_tell pg_lo_unlink pg_lo_write pg_meta_data pg_num_fields pg_num_rows pg_options pg_parameter_status pg_pconnect pg_ping pg_port pg_prepare pg_put_line pg_query_params pg_query pg_result_error_field pg_result_error pg_result_seek pg_result_status pg_select pg_send_execute pg_send_prepare pg_send_query_params pg_send_query pg_set_client_encoding pg_set_error_verbosity pg_trace pg_transaction_status pg_tty pg_unescape_bytea pg_untrace pg_update pg_version contained
syn keyword phpFunctions    posix_access posix_ctermid posix_get_last_error posix_getcwd posix_getegid posix_geteuid posix_getgid posix_getgrgid posix_getgrnam posix_getgroups posix_getlogin posix_getpgid posix_getpgrp posix_getpid posix_getppid posix_getpwnam posix_getpwuid posix_getrlimit posix_getsid posix_getuid posix_isatty posix_kill posix_mkfifo posix_mknod posix_setegid posix_seteuid posix_setgid posix_setpgid posix_setsid posix_setuid posix_strerror posix_times posix_ttyname posix_uname    contained
syn keyword phpFunctions    printer_abort printer_close printer_create_brush printer_create_dc printer_create_font printer_create_pen printer_delete_brush printer_delete_dc printer_delete_font printer_delete_pen printer_draw_bmp printer_draw_chord printer_draw_elipse printer_draw_line printer_draw_pie printer_draw_rectangle printer_draw_roundrect printer_draw_text printer_end_doc printer_end_page printer_get_option printer_list printer_logical_fontheight printer_open printer_select_brush printer_select_font printer_select_pen printer_set_option printer_start_doc printer_start_page printer_write   contained
syn keyword phpFunctions    ps_add_bookmark ps_add_launchlink ps_add_locallink ps_add_note ps_add_pdflink ps_add_weblink ps_arc ps_arcn ps_begin_page ps_begin_pattern ps_begin_template ps_circle ps_clip ps_close_image ps_close ps_closepath_stroke ps_closepath ps_continue_text ps_curveto ps_delete ps_end_page ps_end_pattern ps_end_template ps_fill_stroke ps_fill ps_findfont ps_get_buffer ps_get_parameter ps_get_value ps_hyphenate ps_lineto ps_makespotcolor ps_moveto ps_new ps_open_file ps_open_image_file ps_open_image ps_place_image ps_rect ps_restore ps_rotate ps_save ps_scale ps_set_border_color ps_set_border_dash ps_set_border_style ps_set_info ps_set_parameter ps_set_text_pos ps_set_value ps_setcolor ps_setdash ps_setflat ps_setfont ps_setgray ps_setlinecap ps_setlinejoin ps_setlinewidth ps_setmiterlimit ps_setpolydash ps_shading_pattern ps_shading ps_shfill ps_show_boxed ps_show_xy ps_show ps_string_geometry ps_stringwidth ps_stroke ps_symbol_name ps_symbol_width ps_symbol ps_translate    contained
syn keyword phpFunctions    pspell_add_to_personal pspell_add_to_session pspell_check pspell_clear_session pspell_config_create pspell_config_data_dir pspell_config_dict_dir pspell_config_ignore pspell_config_mode pspell_config_personal pspell_config_repl pspell_config_runtogether pspell_config_save_repl pspell_new_config pspell_new_personal pspell_new pspell_save_wordlist pspell_store_replacement pspell_suggest contained
syn keyword phpFunctions    qdom_error qdom_tree    contained
syn keyword phpFunctions    radius_acct_open radius_add_server radius_auth_open radius_close radius_config radius_create_request radius_cvt_addr radius_cvt_int radius_cvt_string radius_demangle_mppe_key radius_demangle radius_get_attr radius_get_vendor_attr radius_put_addr radius_put_attr radius_put_int radius_put_string radius_put_vendor_addr radius_put_vendor_attr radius_put_vendor_int radius_put_vendor_string radius_request_authenticator radius_send_request radius_server_secret radius_strerror   contained
syn keyword phpFunctions    rar_close rar_entry_get rar_list rar_open   contained
syn keyword phpMethods  extract getAttr getCrc getFileTime getHostOs getMethod getName getPackedSize getUnpackedSize getVersion contained
syn keyword phpFunctions    readline_add_history readline_callback_handler_install readline_callback_handler_remove readline_callback_read_char readline_clear_history readline_completion_function readline_info readline_list_history readline_on_new_line readline_read_history readline_redisplay readline_write_history readline   contained
syn keyword phpFunctions    recode_file recode_string recode    contained
syn keyword phpFunctions    ereg_replace ereg eregi_replace eregi split spliti sql_regcase  contained
syn keyword phpFunctions    rpm_close rpm_get_tag rpm_is_valid rpm_open rpm_version contained
syn keyword phpFunctions    Runkit_Sandbox Runkit_Sandbox_Parent runkit_class_adopt runkit_class_emancipate runkit_constant_add runkit_constant_redefine runkit_constant_remove runkit_function_add runkit_function_copy runkit_function_redefine runkit_function_remove runkit_function_rename runkit_import runkit_lint_file runkit_lint runkit_method_add runkit_method_copy runkit_method_redefine runkit_method_remove runkit_method_rename runkit_return_value_used runkit_sandbox_output_handler runkit_superglobals contained
syn keyword phpFunctions    OrbitEnum OrbitObject OrbitStruct satellite_caught_exception satellite_exception_id satellite_exception_value satellite_get_repository_id satellite_load_idl satellite_object_to_string contained
syn keyword phpMethods  applyChanges __construct createRootDataObject executePreparedQuery executeQuery contained
syn keyword phpMethods  getRootDataObject getRootElementName getRootElementURI setEncoding setXMLDeclaration setXMLVersion addTypes create createDataObject createDocument loadFile loadString saveFile saveString  contained
syn keyword phpMethods  beginLogging endLogging getChangeType getChangedDataObjects getOldContainer getOldValues isLogging addPropertyToType addType getDataFactory getChangeSummary getListIndex getPropertyIndex getPropertyName getValue isSet create clear createDataObject getContainer getSequence getTypeName getTypeNamespaceURI getCause insert getContainingType getDefault getName getType isContainment isMany __construct export getContainmentProperty getInstanceProperties getType getBaseType getName getNamespaceURI getProperties getProperty isAbstractType isDataType isInstance isOpenType isSequencedType getProperty insert move    contained
syn keyword phpFunctions    ftok msg_get_queue msg_receive msg_remove_queue msg_send msg_set_queue msg_stat_queue sem_acquire sem_get sem_release sem_remove shm_attach shm_detach shm_get_var shm_put_var shm_remove_var shm_remove    contained
syn keyword phpFunctions    sesam_affected_rows sesam_commit sesam_connect sesam_diagnostic sesam_disconnect sesam_errormsg sesam_execimm sesam_fetch_array sesam_fetch_result sesam_fetch_row sesam_field_array sesam_field_name sesam_free_result sesam_num_fields sesam_query sesam_rollback sesam_seek_row sesam_settransaction contained
syn keyword phpFunctions    session_cache_expire session_cache_limiter session_commit session_decode session_destroy session_encode session_get_cookie_params session_id session_is_registered session_module_name session_name session_regenerate_id session_register session_save_path session_set_cookie_params session_set_save_handler session_start session_unregister session_unset session_write_close  contained
syn keyword phpFunctions    session_pgsql_add_error session_pgsql_get_error session_pgsql_get_field session_pgsql_reset session_pgsql_set_field session_pgsql_status    contained
syn keyword phpFunctions    shmop_close shmop_delete shmop_open shmop_read shmop_size shmop_write   contained
syn keyword phpFunctions    simplexml_import_dom simplexml_load_file simplexml_load_string  contained
syn keyword phpMethods  addAttribute addChild asXML attributes children __construct getDocNamespaces getName getNamespaces registerXPathNamespace xpath contained
syn keyword phpFunctions    snmp_get_quick_print snmp_get_valueretrieval snmp_read_mib snmp_set_enum_print snmp_set_oid_numeric_print snmp_set_quick_print snmp_set_valueretrieval snmpget snmpgetnext snmprealwalk snmpset snmpwalk snmpwalkoid    contained
syn keyword phpFunctions    is_soap_fault use_soap_error_handler    contained
syn keyword phpMethods  __call __construct __doRequest __getFunctions __getLastRequest __getLastRequestHeaders __getLastResponse __getLastResponseHeaders __getTypes __setCookie __soapCall __construct __construct __construct addFunction __construct fault getFunctions handle setClass setPersistence __construct   contained
syn keyword phpFunctions    socket_accept socket_bind socket_clear_error socket_close socket_connect socket_create_listen socket_create_pair socket_create socket_get_option socket_getpeername socket_getsockname socket_last_error socket_listen socket_read socket_recv socket_recvfrom socket_select socket_send socket_sendto socket_set_block socket_set_nonblock socket_set_option socket_shutdown socket_strerror socket_write  contained
syn keyword phpFunctions    class_implements class_parents iterator_count iterator_to_array spl_autoload_call spl_autoload_extensions spl_autoload_functions spl_autoload_register spl_autoload_unregister spl_autoload spl_classes contained
syn keyword phpMethods  current key next rewind seek valid append __construct count getIterator offsetExists offsetGet offsetSet offsetUnset hasNext next rewind __toString valid getChildren hasChildren __construct current getATime getCTime getChildren getFilename getGroup getInode getMTime getOwner getPath getPathname getPerms getSize getType isDir isDot isExecutable isFile isLink isReadable isWritable key next rewind valid current getInnerIterator key next rewind valid getPosition next rewind seek valid getChildren hasChildren next rewind getChildren hasChildren key next rewind current getDepth getSubIterator key next rewind valid current getChildren hasChildren key next rewind valid   contained
syn keyword phpFunctions    sqlite_array_query sqlite_busy_timeout sqlite_changes sqlite_close sqlite_column sqlite_create_aggregate sqlite_create_function sqlite_current sqlite_error_string sqlite_escape_string sqlite_exec sqlite_factory sqlite_fetch_all sqlite_fetch_array sqlite_fetch_column_types sqlite_fetch_object sqlite_fetch_single sqlite_fetch_string sqlite_field_name sqlite_has_more sqlite_has_prev sqlite_key sqlite_last_error sqlite_last_insert_rowid sqlite_libencoding sqlite_libversion sqlite_next sqlite_num_fields sqlite_num_rows sqlite_open sqlite_popen sqlite_prev sqlite_query sqlite_rewind sqlite_seek sqlite_single_query sqlite_udf_decode_binary sqlite_udf_encode_binary sqlite_unbuffered_query sqlite_valid  contained
syn keyword phpFunctions    ssh2_auth_hostbased_file ssh2_auth_none ssh2_auth_password ssh2_auth_pubkey_file ssh2_connect ssh2_exec ssh2_fetch_stream ssh2_fingerprint ssh2_methods_negotiated ssh2_publickey_add ssh2_publickey_init ssh2_publickey_list ssh2_publickey_remove ssh2_scp_recv ssh2_scp_send ssh2_sftp_lstat ssh2_sftp_mkdir ssh2_sftp_readlink ssh2_sftp_realpath ssh2_sftp_rename ssh2_sftp_rmdir ssh2_sftp_stat ssh2_sftp_symlink ssh2_sftp_unlink ssh2_sftp ssh2_shell ssh2_tunnel   contained
syn keyword phpFunctions    stats_absolute_deviation stats_cdf_beta stats_cdf_binomial stats_cdf_cauchy stats_cdf_chisquare stats_cdf_exponential stats_cdf_f stats_cdf_gamma stats_cdf_laplace stats_cdf_logistic stats_cdf_negative_binomial stats_cdf_noncentral_chisquare stats_cdf_noncentral_f stats_cdf_poisson stats_cdf_t stats_cdf_uniform stats_cdf_weibull stats_covariance stats_den_uniform stats_dens_beta stats_dens_cauchy stats_dens_chisquare stats_dens_exponential stats_dens_f stats_dens_gamma stats_dens_laplace stats_dens_logistic stats_dens_negative_binomial stats_dens_normal stats_dens_pmf_binomial stats_dens_pmf_hypergeometric stats_dens_pmf_poisson stats_dens_t stats_dens_weibull stats_harmonic_mean stats_kurtosis stats_rand_gen_beta stats_rand_gen_chisquare stats_rand_gen_exponential stats_rand_gen_f stats_rand_gen_funiform stats_rand_gen_gamma stats_rand_gen_ibinomial_negative stats_rand_gen_ibinomial stats_rand_gen_int stats_rand_gen_ipoisson stats_rand_gen_iuniform stats_rand_gen_noncenral_chisquare stats_rand_gen_noncentral_f stats_rand_gen_noncentral_t stats_rand_gen_normal stats_rand_gen_t stats_rand_get_seeds stats_rand_phrase_to_seeds stats_rand_ranf stats_rand_setall stats_skew stats_standard_deviation stats_stat_binomial_coef stats_stat_correlation stats_stat_gennch stats_stat_independent_t stats_stat_innerproduct stats_stat_noncentral_t stats_stat_paired_t stats_stat_percentile stats_stat_powersum stats_variance contained
syn keyword phpFunctions    stream_bucket_append stream_bucket_make_writeable stream_bucket_new stream_bucket_prepend stream_context_create stream_context_get_default stream_context_get_options stream_context_set_option stream_context_set_params stream_copy_to_stream stream_filter_append stream_filter_prepend stream_filter_register stream_filter_remove stream_get_contents stream_get_filters stream_get_line stream_get_meta_data stream_get_transports stream_get_wrappers stream_register_wrapper stream_select stream_set_blocking stream_set_timeout stream_set_write_buffer stream_socket_accept stream_socket_client stream_socket_enable_crypto stream_socket_get_name stream_socket_pair stream_socket_recvfrom stream_socket_sendto stream_socket_server stream_wrapper_register stream_wrapper_restore stream_wrapper_unregister contained
syn keyword phpFunctions    addcslashes addslashes bin2hex chop chr chunk_split convert_cyr_string convert_uudecode convert_uuencode count_chars crc32 crypt echo explode fprintf get_html_translation_table hebrev hebrevc html_entity_decode htmlentities htmlspecialchars_decode htmlspecialchars implode join levenshtein localeconv ltrim md5_file md5 metaphone money_format nl_langinfo nl2br number_format ord parse_str print printf quoted_printable_decode quotemeta rtrim setlocale sha1_file sha1 similar_text soundex sprintf sscanf str_ireplace str_pad str_repeat str_replace str_rot13 str_shuffle str_split str_word_count strcasecmp strchr strcmp strcoll strcspn strip_tags stripcslashes stripos stripslashes stristr strlen strnatcasecmp strnatcmp strncasecmp strncmp strpbrk strpos strrchr strrev strripos strrpos strspn strstr strtok strtolower strtoupper strtr substr_compare substr_count substr_replace substr trim ucfirst ucwords vfprintf vprintf vsprintf wordwrap   contained
syn keyword phpFunctions    swf_actiongeturl swf_actiongotoframe swf_actiongotolabel swf_actionnextframe swf_actionplay swf_actionprevframe swf_actionsettarget swf_actionstop swf_actiontogglequality swf_actionwaitforframe swf_addbuttonrecord swf_addcolor swf_closefile swf_definebitmap swf_definefont swf_defineline swf_definepoly swf_definerect swf_definetext swf_endbutton swf_enddoaction swf_endshape swf_endsymbol swf_fontsize swf_fontslant swf_fonttracking swf_getbitmapinfo swf_getfontinfo swf_getframe swf_labelframe swf_lookat swf_modifyobject swf_mulcolor swf_nextid swf_oncondition swf_openfile swf_ortho2 swf_ortho swf_perspective swf_placeobject swf_polarview swf_popmatrix swf_posround swf_pushmatrix swf_removeobject swf_rotate swf_scale swf_setfont swf_setframe swf_shapearc swf_shapecurveto3 swf_shapecurveto swf_shapefillbitmapclip swf_shapefillbitmaptile swf_shapefilloff swf_shapefillsolid swf_shapelinesolid swf_shapelineto swf_shapemoveto swf_showframe swf_startbutton swf_startdoaction swf_startshape swf_startsymbol swf_textwidth swf_translate swf_viewport contained
syn keyword phpFunctions    sybase_affected_rows sybase_close sybase_connect sybase_data_seek sybase_deadlock_retry_count sybase_fetch_array sybase_fetch_assoc sybase_fetch_field sybase_fetch_object sybase_fetch_row sybase_field_seek sybase_free_result sybase_get_last_message sybase_min_client_severity sybase_min_error_severity sybase_min_message_severity sybase_min_server_severity sybase_num_fields sybase_num_rows sybase_pconnect sybase_query sybase_result sybase_select_db sybase_set_message_handler sybase_unbuffered_query   contained
syn keyword phpFunctions    tcpwrap_check   contained
syn keyword phpFunctions    ob_tidyhandler tidy_access_count tidy_clean_repair tidy_config_count tidy_diagnose tidy_error_count tidy_get_body tidy_get_config tidy_get_error_buffer tidy_get_head tidy_get_html_ver tidy_get_html tidy_get_opt_doc tidy_get_output tidy_get_release tidy_get_root tidy_get_status tidy_getopt tidy_is_xhtml tidy_is_xml tidy_load_config tidy_parse_file tidy_parse_string tidy_repair_file tidy_repair_string tidy_reset_config tidy_save_config tidy_set_encoding tidy_setopt tidy_warning_count  contained
syn keyword phpMethods  __construct get_attr get_nodes next prev hasChildren hasSiblings isAsp isComment isHtml isJste isPhp isText contained
syn keyword phpFunctions    token_get_all token_name    contained
syn keyword phpFunctions    i18n_loc_get_default i18n_loc_set_default unicode_encode unicode_semantics  contained
syn keyword phpFunctions    odbc_autocommit odbc_binmode odbc_close_all odbc_close odbc_columnprivileges odbc_columns odbc_commit odbc_connect odbc_cursor odbc_data_source odbc_do odbc_error odbc_errormsg odbc_exec odbc_execute odbc_fetch_array odbc_fetch_into odbc_fetch_object odbc_fetch_row odbc_field_len odbc_field_name odbc_field_num odbc_field_precision odbc_field_scale odbc_field_type odbc_foreignkeys odbc_free_result odbc_gettypeinfo odbc_longreadlen odbc_next_result odbc_num_fields odbc_num_rows odbc_pconnect odbc_prepare odbc_primarykeys odbc_procedurecolumns odbc_procedures odbc_result_all odbc_result odbc_rollback odbc_setoption odbc_specialcolumns odbc_statistics odbc_tableprivileges odbc_tables    contained
syn keyword phpFunctions    base64_decode base64_encode get_headers get_meta_tags http_build_query parse_url rawurldecode rawurlencode urldecode urlencode  contained
syn keyword phpFunctions    debug_zval_dump doubleval empty floatval get_defined_vars get_resource_type gettype import_request_variables intval is_array is_bool is_callable is_double is_float is_int is_integer is_long is_null is_numeric is_object is_real is_resource is_scalar is_string isset print_r serialize settype strval unserialize unset var_dump var_export contained
syn keyword phpFunctions    vpopmail_add_alias_domain_ex vpopmail_add_alias_domain vpopmail_add_domain_ex vpopmail_add_domain vpopmail_add_user vpopmail_alias_add vpopmail_alias_del_domain vpopmail_alias_del vpopmail_alias_get_all vpopmail_alias_get vpopmail_auth_user vpopmail_del_domain_ex vpopmail_del_domain vpopmail_del_user vpopmail_error vpopmail_passwd vpopmail_set_user_quota    contained
syn keyword phpFunctions    w32api_deftype w32api_init_dtype w32api_invoke_function w32api_register_function w32api_set_call_method contained
syn keyword phpFunctions    wddx_add_vars wddx_deserialize wddx_packet_end wddx_packet_start wddx_serialize_value wddx_serialize_vars wddx_unserialize  contained
syn keyword phpFunctions    win32_ps_list_procs win32_ps_stat_mem win32_ps_stat_proc    contained
syn keyword phpFunctions    win32_create_service win32_delete_service win32_get_last_control_message win32_query_service_status win32_set_service_status win32_start_service_ctrl_dispatcher win32_start_service win32_stop_service contained
syn keyword phpFunctions    xattr_get xattr_list xattr_remove xattr_set xattr_supported contained
syn keyword phpFunctions    xdiff_file_diff_binary xdiff_file_diff xdiff_file_merge3 xdiff_file_patch_binary xdiff_file_patch xdiff_string_diff_binary xdiff_string_diff xdiff_string_merge3 xdiff_string_patch_binary xdiff_string_patch   contained
syn keyword phpFunctions    utf8_decode utf8_encode xml_error_string xml_get_current_byte_index xml_get_current_column_number xml_get_current_line_number xml_get_error_code xml_parse_into_struct xml_parse xml_parser_create_ns xml_parser_create xml_parser_free xml_parser_get_option xml_parser_set_option xml_set_character_data_handler xml_set_default_handler xml_set_element_handler xml_set_end_namespace_decl_handler xml_set_external_entity_ref_handler xml_set_notation_decl_handler xml_set_object xml_set_processing_instruction_handler xml_set_start_namespace_decl_handler xml_set_unparsed_entity_decl_handler contained
syn keyword phpMethods  close expand getAttribute getAttributeNo getAttributeNS getParserProperty isValid lookupNamespace moveToAttribute moveToAttributeNo moveToAttributeNs moveToElement moveToFirstAttribute moveToNextAttribute next open read setParserProperty setRelaxNGSchema setRelaxNGSchemaSource XML   contained
syn keyword phpFunctions    xmlrpc_decode_request xmlrpc_decode xmlrpc_encode_request xmlrpc_encode xmlrpc_get_type xmlrpc_is_fault xmlrpc_parse_method_descriptions xmlrpc_server_add_introspection_data xmlrpc_server_call_method xmlrpc_server_create xmlrpc_server_destroy xmlrpc_server_register_introspection_callback xmlrpc_server_register_method xmlrpc_set_type  contained
syn keyword phpFunctions    xmlwriter_end_attribute xmlwriter_end_cdata xmlwriter_end_comment xmlwriter_end_document xmlwriter_end_dtd_attlist xmlwriter_end_dtd_element xmlwriter_end_dtd_entity xmlwriter_end_dtd xmlwriter_end_element xmlwriter_end_pi xmlwriter_flush xmlwriter_full_end_element xmlwriter_open_memory xmlwriter_open_uri xmlwriter_output_memory xmlwriter_set_indent_string xmlwriter_set_indent xmlwriter_start_attribute_ns xmlwriter_start_attribute xmlwriter_start_cdata xmlwriter_start_comment xmlwriter_start_document xmlwriter_start_dtd_attlist xmlwriter_start_dtd_element xmlwriter_start_dtd_entity xmlwriter_start_dtd xmlwriter_start_element_ns xmlwriter_start_element xmlwriter_start_pi xmlwriter_text xmlwriter_write_attribute_ns xmlwriter_write_attribute xmlwriter_write_cdata xmlwriter_write_comment xmlwriter_write_dtd_attlist xmlwriter_write_dtd_element xmlwriter_write_dtd_entity xmlwriter_write_dtd xmlwriter_write_element_ns xmlwriter_write_element xmlwriter_write_pi xmlwriter_write_raw contained
syn keyword phpMethods  __construct getParameter hasExsltSupport importStylesheet registerPHPFunctions removeParameter setParameter transformToDoc transformToURI transformToXML    contained
syn keyword phpFunctions    xslt_backend_info xslt_backend_name xslt_backend_version xslt_create xslt_errno xslt_error xslt_free xslt_getopt xslt_process xslt_set_base xslt_set_encoding xslt_set_error_handler xslt_set_log xslt_set_object xslt_set_sax_handler xslt_set_sax_handlers xslt_set_scheme_handler xslt_set_scheme_handlers xslt_setopt   contained
syn keyword phpFunctions    yaz_addinfo yaz_ccl_conf yaz_ccl_parse yaz_close yaz_connect yaz_database yaz_element yaz_errno yaz_error yaz_es_result yaz_es yaz_get_option yaz_hits yaz_itemorder yaz_present yaz_range yaz_record yaz_scan_result yaz_scan yaz_schema yaz_search yaz_set_option yaz_sort yaz_syntax yaz_wait    contained
syn keyword phpFunctions    zip_close zip_entry_close zip_entry_compressedsize zip_entry_compressionmethod zip_entry_filesize zip_entry_name zip_entry_open zip_entry_read zip_open zip_read    contained
syn keyword phpFunctions    gzclose gzcompress gzdeflate gzencode gzeof gzfile gzgetc gzgets gzgetss gzinflate gzopen gzpassthru gzputs gzread gzrewind gzseek gztell gzuncompress gzwrite readgzfile zlib_get_coding_type  contained

if exists( "php_baselib" )
  syn keyword   phpMethods  query next_record num_rows affected_rows nf f p np num_fields haltmsg seek link_id query_id metadata table_names nextid connect halt free register unregister is_registered delete url purl self_url pself_url hidden_session add_query padd_query reimport_get_vars reimport_post_vars reimport_cookie_vars set_container set_tokenname release_token put_headers get_id get_id put_id freeze thaw gc reimport_any_vars start url purl login_if is_authenticated auth_preauth auth_loginform auth_validatelogin auth_refreshlogin auth_registerform auth_doregister start check have_perm permsum perm_invalid contained
  syn keyword   phpFunctions    page_open page_close sess_load sess_save    contained
endif

" Conditional
syn keyword phpConditional  declare else enddeclare endswitch elseif endif if switch    contained

" Repeat
syn keyword phpRepeat   as do endfor endforeach endwhile for foreach while  contained

" Repeat
syn keyword phpLabel    case default switch contained

" Statement
syn keyword phpStatement    return break continue exit  contained

" Keyword
syn keyword phpKeyword  var const   contained

" Type
syn keyword phpType bool[ean] int[eger] real double float string array object NULL  contained

" Structure
syn keyword phpStructure    extends implements instanceof parent self   contained

" Operator
syn match   phpOperator "[-=+%^&|*!.~?:]"   contained display
syn match   phpOperator "[-+*/%^&|.]="  contained display
syn match   phpOperator "/[^*/]"me=e-1  contained display
syn match   phpOperator "\$"    contained display
syn match   phpOperator "&&\|\<and\>"   contained display
syn match   phpOperator "||\|\<x\=or\>" contained display
syn match   phpRelation "[!=<>]="   contained display
syn match   phpRelation "[<>]"  contained display
syn match   phpMemberSelector   "->"    contained display
syn match   phpVarSelector  "\$"    contained display

" Identifier
syn match   phpIdentifier   "$\h\w*"    contained contains=phpEnvVar,phpIntVar,phpVarSelector display
syn match   phpIdentifierSimply "${\h\w*}"  contains=phpOperator,phpParent  contained display
syn region  phpIdentifierComplex    matchgroup=phpParent start="{\$"rs=e-1 end="}"  contains=phpIdentifier,phpMemberSelector,phpVarSelector,phpIdentifierComplexP   contained extend
syn region  phpIdentifierComplexP   matchgroup=phpParent start="\[" end="]" contains=@phpClInside   contained

" Methoden
syn match   phpMethodsVar   "->\h\w*"   contained contains=phpMethods,phpMemberSelector display

" Include
syn keyword phpInclude  include require include_once require_once   contained

" Define
syn keyword phpDefine   new contained

" Boolean
syn keyword phpBoolean  true false  contained

" Number
syn match phpNumber "-\=\<\d\+\>"   contained display
syn match phpNumber "\<0x\x\{1,8}\>"    contained display

" Float
syn match phpFloat  "\(-\=\<\d+\|-\=\)\.\d\+\>" contained display

" SpecialChar
syn match phpSpecialChar    "\\[abcfnrtyv\\]"   contained display
syn match phpSpecialChar    "\\\d\{3}"  contained contains=phpOctalError display
syn match phpSpecialChar    "\\x\x\{2}" contained display

" Error
syn match phpOctalError "[89]"  contained display
if exists("php_parent_error_close")
  syn match phpParentError  "[)\]}]"    contained display
endif

" Todo
syn keyword phpTodo todo fixme xxx  contained

" Comment
if exists("php_parent_error_open")
  syn region    phpComment  start="/\*" end="\*/"   contained contains=phpTodo
else
  syn region    phpComment  start="/\*" end="\*/"   contained contains=phpTodo extend
endif
if version >= 600
  syn match phpComment  "#.\{-}\(?>\|$\)\@="    contained contains=phpTodo
  syn match phpComment  "//.\{-}\(?>\|$\)\@="   contained contains=phpTodo
else
  syn match phpComment  "#.\{-}$"   contained contains=phpTodo
  syn match phpComment  "#.\{-}?>"me=e-2    contained contains=phpTodo
  syn match phpComment  "//.\{-}$"  contained contains=phpTodo
  syn match phpComment  "//.\{-}?>"me=e-2   contained contains=phpTodo
endif

" String
if exists("php_parent_error_open")
  syn region    phpStringDouble matchgroup=None start=+"+ skip=+\\\\\|\\"+ end=+"+  contains=@phpAddStrings,phpIdentifier,phpSpecialChar,phpIdentifierSimply,phpIdentifierComplex   contained keepend
  syn region    phpBacktick matchgroup=None start=+`+ skip=+\\\\\|\\"+ end=+`+  contains=@phpAddStrings,phpIdentifier,phpSpecialChar,phpIdentifierSimply,phpIdentifierComplex   contained keepend
  syn region    phpStringSingle matchgroup=None start=+'+ skip=+\\\\\|\\'+ end=+'+  contains=@phpAddStrings contained keepend
else
  syn region    phpStringDouble matchgroup=None start=+"+ skip=+\\\\\|\\"+ end=+"+  contains=@phpAddStrings,phpIdentifier,phpSpecialChar,phpIdentifierSimply,phpIdentifierComplex contained extend keepend
  syn region    phpBacktick matchgroup=None start=+`+ skip=+\\\\\|\\"+ end=+`+  contains=@phpAddStrings,phpIdentifier,phpSpecialChar,phpIdentifierSimply,phpIdentifierComplex contained extend keepend
  syn region    phpStringSingle matchgroup=None start=+'+ skip=+\\\\\|\\'+ end=+'+  contains=@phpAddStrings contained keepend extend
endif

" HereDoc
if version >= 600
  syn case match
  syn region    phpHereDoc  matchgroup=Delimiter start="\(<<<\)\@<=\z(\I\i*\)$" end="^\z1\(;\=$\)\@="   contained contains=phpIdentifier,phpIdentifierSimply,phpIdentifierComplex,phpSpecialChar,phpMethodsVar keepend extend
" including HTML,JavaScript,SQL even if not enabled via options
  syn region    phpHereDoc  matchgroup=Delimiter start="\(<<<\)\@<=\z(\(\I\i*\)\=\(html\)\c\(\i*\)\)$" end="^\z1\(;\=$\)\@="    contained contains=@htmlTop,phpIdentifier,phpIdentifierSimply,phpIdentifierComplex,phpSpecialChar,phpMethodsVar keepend extend
  syn region    phpHereDoc  matchgroup=Delimiter start="\(<<<\)\@<=\z(\(\I\i*\)\=\(sql\)\c\(\i*\)\)$" end="^\z1\(;\=$\)\@=" contained contains=@sqlTop,phpIdentifier,phpIdentifierSimply,phpIdentifierComplex,phpSpecialChar,phpMethodsVar keepend extend
  syn region    phpHereDoc  matchgroup=Delimiter start="\(<<<\)\@<=\z(\(\I\i*\)\=\(javascript\)\c\(\i*\)\)$" end="^\z1\(;\=$\)\@="  contained contains=@htmlJavascript,phpIdentifierSimply,phpIdentifier,phpIdentifierComplex,phpSpecialChar,phpMethodsVar keepend extend
  syn case ignore
endif

" Parent
if exists("php_parent_error_close") || exists("php_parent_error_open")
  syn match phpParent   "[{}]"  contained
  syn region    phpParent   matchgroup=Delimiter start="(" end=")"  contained contains=@phpClInside transparent
  syn region    phpParent   matchgroup=Delimiter start="\[" end="\]"    contained contains=@phpClInside transparent
  if !exists("php_parent_error_close")
    syn match phpParent "[\])]" contained
  endif
else
  syn match phpParent   "[({[\]})]" contained
endif

syn cluster phpClConst  contains=phpFunctions,phpIdentifier,phpConditional,phpRepeat,phpStatement,phpOperator,phpRelation,phpStringSingle,phpStringDouble,phpBacktick,phpNumber,phpFloat,phpKeyword,phpType,phpBoolean,phpStructure,phpMethodsVar,phpConstant,phpCoreConstant,phpException
syn cluster phpClInside contains=@phpClConst,phpComment,phpLabel,phpParent,phpParentError,phpInclude,phpHereDoc
syn cluster phpClFunction   contains=@phpClInside,phpDefine,phpParentError,phpStorageClass
syn cluster phpClTop    contains=@phpClFunction,phpFoldFunction,phpFoldClass,phpFoldInterface,phpFoldTry,phpFoldCatch

" Php Region
if exists("php_parent_error_open")
  if exists("php_noShortTags")
    syn region   phpRegion  matchgroup=Delimiter start="<?php" end="?>" contains=@phpClTop
  else
    syn region   phpRegion  matchgroup=Delimiter start="<?\(php\)\=" end="?>"   contains=@phpClTop
  endif
  syn region     phpRegionSc    matchgroup=Delimiter start=+<script language="php">+ end=+</script>+    contains=@phpClTop
  if exists("php_asp_tags")
    syn region   phpRegionAsp   matchgroup=Delimiter start="<%\(=\)\=" end="%>" contains=@phpClTop
  endif
else
  if exists("php_noShortTags")
    syn region   phpRegion  matchgroup=Delimiter start="<?php" end="?>" contains=@phpClTop keepend
  else
    syn region   phpRegion  matchgroup=Delimiter start="<?\(php\)\=" end="?>"   contains=@phpClTop keepend
  endif
  syn region     phpRegionSc    matchgroup=Delimiter start=+<script language="php">+ end=+</script>+    contains=@phpClTop keepend
  if exists("php_asp_tags")
    syn region   phpRegionAsp   matchgroup=Delimiter start="<%\(=\)\=" end="%>" contains=@phpClTop keepend
  endif
endif

" Fold
if exists("php_folding") && php_folding==1
" match one line constructs here and skip them at folding
  syn keyword   phpSCKeyword    abstract final private protected public static  contained
  syn keyword   phpFCKeyword    function    contained
  syn keyword   phpStorageClass global  contained
  syn match phpDefine   "\(\s\|^\)\(abstract\s\+\|final\s\+\|private\s\+\|protected\s\+\|public\s\+\|static\s\+\)*function\(\s\+.*[;}]\)\@="    contained contains=phpSCKeyword
  syn match phpStructure    "\(\s\|^\)\(abstract\s\+\|final\s\+\)*class\(\s\+.*}\)\@="  contained
  syn match phpStructure    "\(\s\|^\)interface\(\s\+.*}\)\@="  contained
  syn match phpException    "\(\s\|^\)try\(\s\+.*}\)\@="    contained
  syn match phpException    "\(\s\|^\)catch\(\s\+.*}\)\@="  contained

  set foldmethod=syntax
  syn region    phpFoldHtmlInside   matchgroup=Delimiter start="?>" end="<?\(php\)\=" contained transparent contains=@htmlTop
  syn region    phpFoldFunction matchgroup=Storageclass start="^\z(\s*\)\(abstract\s\+\|final\s\+\|private\s\+\|protected\s\+\|public\s\+\|static\s\+\)*function\s\([^};]*$\)\@="rs=e-9 matchgroup=Delimiter end="^\z1}" contains=@phpClFunction,phpFoldHtmlInside,phpFCKeyword contained transparent fold extend
  syn region    phpFoldFunction matchgroup=Define start="^function\s\([^};]*$\)\@=" matchgroup=Delimiter end="^}" contains=@phpClFunction,phpFoldHtmlInside contained transparent fold extend
  syn region    phpFoldClass    matchgroup=Structure start="^\z(\s*\)\(abstract\s\+\|final\s\+\)*class\s\+\([^}]*$\)\@=" matchgroup=Delimiter end="^\z1}" contains=@phpClFunction,phpFoldFunction,phpSCKeyword contained transparent fold extend
  syn region    phpFoldInterface    matchgroup=Structure start="^\z(\s*\)interface\s\+\([^}]*$\)\@=" matchgroup=Delimiter end="^\z1}" contains=@phpClFunction,phpFoldFunction contained transparent fold extend
  syn region    phpFoldCatch    matchgroup=Exception start="^\z(\s*\)catch\s\+\([^}]*$\)\@=" matchgroup=Delimiter end="^\z1}" contains=@phpClFunction,phpFoldFunction contained transparent fold extend
  syn region    phpFoldTry  matchgroup=Exception start="^\z(\s*\)try\s\+\([^}]*$\)\@=" matchgroup=Delimiter end="^\z1}" contains=@phpClFunction,phpFoldFunction contained transparent fold extend
elseif exists("php_folding") && php_folding==2
  syn keyword   phpDefine   function    contained
  syn keyword   phpStructure    abstract class interface    contained
  syn keyword   phpException    catch throw try contained
  syn keyword   phpStorageClass final global private protected public static    contained

  set foldmethod=syntax
  syn region    phpFoldHtmlInside   matchgroup=Delimiter start="?>" end="<?\(php\)\=" contained transparent contains=@htmlTop
  syn region    phpParent   matchgroup=Delimiter start="{" end="}"  contained contains=@phpClFunction,phpFoldHtmlInside transparent fold
else
  syn keyword   phpDefine   function    contained
  syn keyword   phpStructure    abstract class interface    contained
  syn keyword   phpException    catch throw try contained
  syn keyword   phpStorageClass final global private protected public static    contained
endif


" Sync
if php_sync_method==-1
  if exists("php_noShortTags")
    syn sync match phpRegionSync grouphere phpRegion "^\s*<?php\s*$"
  else
    syn sync match phpRegionSync grouphere phpRegion "^\s*<?\(php\)\=\s*$"
  endif
  syn sync match phpRegionSync grouphere phpRegionSc +^\s*<script language="php">\s*$+
  if exists("php_asp_tags")
    syn sync match phpRegionSync grouphere phpRegionAsp "^\s*<%\(=\)\=\s*$"
  endif
  syn sync match phpRegionSync grouphere NONE "^\s*?>\s*$"
  syn sync match phpRegionSync grouphere NONE "^\s*%>\s*$"
  syn sync match phpRegionSync grouphere phpRegion "function\s.*(.*\$"
  "syn sync match phpRegionSync grouphere NONE "/\i*>\s*$"
elseif php_sync_method>0
  exec "syn sync minlines=" . php_sync_method
else
  exec "syn sync fromstart"
endif

" Define the default highlighting.
" For version 5.7 and earlier: only when not done already
" For version 5.8 and later: only when an item doesn't have highlighting yet
if version >= 508 || !exists("did_php_syn_inits")
  if version < 508
    let did_php_syn_inits = 1
    command -nargs=+ HiLink hi link <args>
  else
    command -nargs=+ HiLink hi def link <args>
  endif

  HiLink     phpConstant    Constant
  HiLink     phpCoreConstant    Constant
  HiLink     phpComment Comment
  HiLink     phpException   Exception
  HiLink     phpBoolean Boolean
  HiLink     phpStorageClass    StorageClass
  HiLink     phpSCKeyword   StorageClass
  HiLink     phpFCKeyword   Define
  HiLink     phpStructure   Structure
  HiLink     phpStringSingle    String
  HiLink     phpStringDouble    String
  HiLink     phpBacktick    String
  HiLink     phpNumber  Number
  HiLink     phpFloat   Float
  HiLink     phpMethods Function
  HiLink     phpFunctions   Function
  HiLink     phpBaselib Function
  HiLink     phpRepeat  Repeat
  HiLink     phpConditional Conditional
  HiLink     phpLabel   Label
  HiLink     phpStatement   Statement
  HiLink     phpKeyword Statement
  HiLink     phpType    Type
  HiLink     phpInclude Include
  HiLink     phpDefine  Define
  HiLink     phpSpecialChar SpecialChar
  HiLink     phpParent  Delimiter
  HiLink     phpIdentifierConst Delimiter
  HiLink     phpParentError Error
  HiLink     phpOctalError  Error
  HiLink     phpTodo    Todo
  HiLink     phpMemberSelector  Structure
  if exists("php_oldStyle")
    hi  phpIntVar guifg=Red ctermfg=DarkRed
    hi  phpEnvVar guifg=Red ctermfg=DarkRed
    hi  phpOperator guifg=SeaGreen ctermfg=DarkGreen
    hi  phpVarSelector guifg=SeaGreen ctermfg=DarkGreen
    hi  phpRelation guifg=SeaGreen ctermfg=DarkGreen
    hi  phpIdentifier guifg=DarkGray ctermfg=Brown
    hi  phpIdentifierSimply guifg=DarkGray ctermfg=Brown
  else
    HiLink  phpIntVar   Identifier
    HiLink  phpEnvVar   Identifier
    HiLink  phpOperator Operator
    HiLink  phpVarSelector  Operator
    HiLink  phpRelation Operator
    HiLink  phpIdentifier   Identifier
    HiLink  phpIdentifierSimply Identifier
  endif

  delcommand HiLink
endif

let b:current_syntax = "php"

if main_syntax == 'php'
  unlet main_syntax
endif

" vim: ts=8

