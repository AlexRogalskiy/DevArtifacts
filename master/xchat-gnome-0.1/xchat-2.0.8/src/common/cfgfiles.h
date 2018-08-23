/* cfgfiles.h */

#ifndef XCHAT_CFGFILES_H
#define XCHAT_CFGFILES_H

extern char *xdir_fs;
extern char *xdir_utf;

char *cfg_get_str (char *cfg, char *var, char *dest, int dest_len);
int cfg_get_bool (char *var);
int cfg_get_int_with_result (char *cfg, char *var, int *result);
int cfg_get_int (char *cfg, char *var);
int cfg_put_int (int fh, int value, char *var);
char *get_xdir_fs (void);
char *get_xdir_utf8 (void);
void load_config (void);
int save_config (void);
void list_free (GSList ** list);
void list_loadconf (char *file, GSList ** list, char *defaultconf);
int list_delentry (GSList ** list, char *name);
void list_addentry (GSList ** list, char *cmd, char *name);
int cmd_set (session *sess, char *tbuf, char *word[], char *word_eol[]);
int mkdir_utf8 (char *dir);

#define STRUCT_OFFSET_STR(type,field) \
( (unsigned int) (((char *) (&(((type *) NULL)->field)))- ((char *) NULL)) )

#define STRUCT_OFFSET_INT(type,field) \
( (unsigned int) (((int *) (&(((type *) NULL)->field)))- ((int *) NULL)) )

#define P_OFFSET(field) STRUCT_OFFSET_STR(struct xchatprefs, field),sizeof(prefs.field)
#define P_OFFSETNL(field) STRUCT_OFFSET_STR(struct xchatprefs, field)
#define P_OFFINT(field) STRUCT_OFFSET_INT(struct xchatprefs, field),0
#define P_OFFINTNL(field) STRUCT_OFFSET_INT(struct xchatprefs, field)

struct prefs
{
	char *name;
	unsigned short offset;
	unsigned short len;
	unsigned short type;
};

#define TYPE_STR 0
#define TYPE_INT 1
#define TYPE_BOOL 2

#endif
