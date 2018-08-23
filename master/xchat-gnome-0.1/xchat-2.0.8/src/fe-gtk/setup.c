
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <sys/types.h>

#include "../common/xchat.h"
#include "../common/cfgfiles.h"
#include "../common/text.h"
#include "../common/xchatc.h"
#include "fe-gtk.h"
#include "gtkutil.h"
#include "maingui.h"
#include "palette.h"
#include "pixmaps.h"

#include <gtk/gtkcolorseldialog.h>
#include <gtk/gtktable.h>
#include <gtk/gtkentry.h>
#include <gtk/gtklabel.h>
#include <gtk/gtkmisc.h>
#include <gtk/gtkhbox.h>
#include <gtk/gtkvbox.h>
#include <gtk/gtkalignment.h>
#include <gtk/gtknotebook.h>
#include <gtk/gtkframe.h>
#include <gtk/gtkfontsel.h>
#include <gtk/gtkcheckbutton.h>
#include <gtk/gtkspinbutton.h>
#include <gtk/gtkstock.h>
#include <gtk/gtktreeview.h>
#include <gtk/gtkhbbox.h>
#include <gtk/gtkhseparator.h>
#include <gtk/gtkmenu.h>
#include <gtk/gtkmenuitem.h>
#include <gtk/gtkradiobutton.h>
#include <gtk/gtkoptionmenu.h>
#include <gtk/gtktreestore.h>
#include <gtk/gtktreeselection.h>
#include <gtk/gtkcellrenderertext.h>
#include <gtk/gtkhscale.h>
#ifdef WIN32
#include <windows.h>
#endif


GtkStyle *create_input_style (void);


static int last_selected_page = 0;
static gboolean color_change;
static struct xchatprefs setup_prefs;

enum
{
	ST_END,
	ST_TOGGLE,
	ST_ENTRY,
	ST_EFONT,
	ST_EFILE,
	ST_EOPEN,
	ST_MENU,
	ST_RADIO,
	ST_NUMBER,
	ST_HSCALE,
	ST_FRAME,
	ST_LABEL
};

typedef struct
{
	int type;
	char *label;
	int offset;
	char *tooltip;
	char **list;
	int extra;
} setting;


static const setting textbox_settings[] =
{
	{ST_EFONT,  N_("Font:"), P_OFFSETNL(font_normal), 0, 0, sizeof prefs.font_normal},
	{ST_EFILE,  N_("Background image:"), P_OFFSETNL(background), 0, 0, sizeof prefs.background},
	{ST_ENTRY,  N_("Time stamp format:"), P_OFFSETNL(stamp_format),
					N_("See strftime manpage for details."),0,sizeof prefs.stamp_format},
	{ST_TOGGLE, N_("Time stamp text"), P_OFFINTNL(timestamp),0,0,0},
	{ST_TOGGLE, N_("Transparent background"), P_OFFINTNL(transparent),0,0,0},
	{ST_TOGGLE, N_("Indent nicks"), P_OFFINTNL(indent_nicks),0,0,0},
	{ST_TOGGLE, N_("Tint transparency"), P_OFFINTNL(tint),0,0,0},
	{ST_TOGGLE, N_("Colored nicks"), P_OFFINTNL(colorednicks),0,0,0},
	{ST_TOGGLE, N_("Strip mIRC color"), P_OFFINTNL(stripcolor),0,0,0},
	{ST_NUMBER,	N_("Scrollback lines:"), P_OFFINTNL(max_lines),0,0,100000},
	{ST_HSCALE, N_("Tint red:"), P_OFFINTNL(tint_red),0,0,0},
	{ST_HSCALE, N_("Tint green:"), P_OFFINTNL(tint_green),0,0,0},
	{ST_HSCALE, N_("Tint blue:"), P_OFFINTNL(tint_blue),0,0,0},
	{ST_END, 0, 0, 0, 0, 0}
};

static const setting inputbox_settings[] =
{
	{ST_TOGGLE, N_("Interpret %nnn as an ASCII value"), P_OFFINTNL(perc_ascii),0,0,0},
	{ST_TOGGLE, N_("Automatic nick completion"), P_OFFINTNL(nickcompletion),0,0,0},
	{ST_TOGGLE, N_("Interpret %C, %B as Color, Bold etc"), P_OFFINTNL(perc_color),0,0,0},
	{ST_TOGGLE, N_("Use the Text box font and colors"), P_OFFINTNL(style_inputbox),0,0,0},
	{ST_ENTRY, N_("Nick completion suffix:"), P_OFFSETNL(nick_suffix),0,0,sizeof prefs.nick_suffix},
	{ST_END, 0, 0, 0, 0, 0}
};

static char *lagmenutext[] = 
{
	N_("Off"),
	N_("Graph"),
	N_("Info text"),
	N_("Both"),
	NULL
};

static char *ulmenutext[] = 
{
	N_("A-Z, Ops first"),
	N_("A-Z"),
	N_("Z-A, Ops last"),
	N_("Z-A"),
	N_("Unsorted"),
	NULL
};

static const setting userlist_settings[] =
{
	{ST_MENU,	N_("Lag meter:"), P_OFFINTNL(lagometer), 0, lagmenutext, 0},
	{ST_MENU,	N_("Throttle meter:"), P_OFFINTNL(throttlemeter), 0, lagmenutext, 0},
	{ST_MENU,	N_("Userlist sorted by:"), P_OFFINTNL(userlist_sort), 0, ulmenutext, 0},
	{ST_ENTRY,	N_("Double-click command:"), P_OFFSETNL(doubleclickuser), 0, 0, sizeof prefs.doubleclickuser},
	{ST_TOGGLE, N_("Show hostnames in userlist"), P_OFFINTNL(showhostname_in_userlist), 0, 0, 0},
	{ST_TOGGLE, N_("Userlist buttons enabled"), P_OFFINTNL(userlistbuttons), 0, 0, 0},
	{ST_TOGGLE, N_("Use the Text box font and colors"), P_OFFINTNL(style_namelistgad),0,0,0},
	{ST_TOGGLE, N_("Resizable userlist"), P_OFFINTNL(paned_userlist),0,0,0},
	{ST_NUMBER, N_("Track away-status on channels smaller than:"), P_OFFINTNL(away_size_max),0,0,10000},
	{ST_END, 0, 0, 0, 0, 0}
};

static char *tabwin[] =
{
	N_("Windows"),
	N_("Tabs"),
	NULL
};

static char *tabpos[] =
{
	N_("Bottom"),
	N_("Top"),
	N_("Left"),
	N_("Right"),
	N_("Hidden"),
	NULL
};

static const setting tabs_settings[] =
{
	{ST_MENU,	N_("Show tabs at:"), P_OFFINTNL(tabs_position), 0, tabpos, 0},
	{ST_MENU,	N_("Open channels in:"), P_OFFINTNL(tabchannels), 0, tabwin, 0},
	{ST_MENU,	N_("Open dialogs in:"), P_OFFINTNL(privmsgtab), 0, tabwin, 0},
	{ST_MENU,	N_("Open utilities in:"), P_OFFINTNL(windows_as_tabs), N_("Open DCC, Ignore, Notify etc, in tabs or windows?"), tabwin, 0},
	{ST_TOGGLE, N_("Open tab for server messages"), P_OFFINTNL(use_server_tab), 0, 0, 0},
	{ST_TOGGLE, N_("Open tab for server notices"), P_OFFINTNL(notices_tabs), 0, 0, 0},
	{ST_TOGGLE, N_("Pop new tabs to front"), P_OFFINTNL(newtabstofront), 0, 0, 0},
	{ST_NUMBER,	N_("Shorten tabs to:"), P_OFFINTNL(truncchans), 0, (char **)N_("letters."), 99},
	{ST_END, 0, 0, 0, 0, 0}
};

static const setting filexfer_settings[] =
{
	{ST_EOPEN,	N_("Download files to:"), P_OFFSETNL(dccdir), 0, 0, sizeof prefs.dccdir},
	{ST_EOPEN,	N_("Move completed files to:"), P_OFFSETNL(dcc_completed_dir), 0, 0, sizeof prefs.dcc_completed_dir},
	{ST_ENTRY,	N_("DCC IP address:"), P_OFFSETNL(dcc_ip_str),
					N_("Claim you are at this address when offering files."), 0, sizeof prefs.dcc_ip_str},
	{ST_NUMBER,	N_("First DCC send port:"), P_OFFINTNL(first_dcc_send_port), 0, 0, 65535},
	{ST_NUMBER,	N_("Last DCC send port:"), P_OFFINTNL(last_dcc_send_port), 0, 0, 65535},
	{ST_LABEL,	N_("(Leave ports at zero for full range).")},
	{ST_TOGGLE, N_("Auto open DCC send list"), P_OFFINTNL(autoopendccsendwindow), 0, 0, 0},
	{ST_TOGGLE, N_("Convert spaces to underscore"), P_OFFINTNL(dcc_send_fillspaces),
					N_("In filenames, before sending"), 0, 0},
	{ST_TOGGLE, N_("Auto open DCC chat list"), P_OFFINTNL(autoopendccchatwindow), 0, 0, 0},
	{ST_TOGGLE, N_("Save nickname in filenames"), P_OFFINTNL(dccwithnick), 0, 0, 0},
	{ST_TOGGLE, N_("Auto open DCC receive list"), P_OFFINTNL(autoopendccrecvwindow), 0, 0, 0},
	{ST_TOGGLE, N_("Get my IP from IRC server"), P_OFFINTNL(ip_from_server),
					N_("/WHOIS yourself to find your real address. Use this if you have a 192.168.*.* address!"), 0, 0},
	{ST_NUMBER,	N_("Max. send CPS:"), P_OFFINTNL(dcc_max_send_cps), 
					N_("Max. speed for one transfer"), 0, 1000000},
	{ST_NUMBER,	N_("Max. receive CPS:"), P_OFFINTNL(dcc_max_get_cps),
					N_("Max. speed for one transfer"), 0, 1000000},
	{ST_NUMBER,	N_("Max. global send CPS:"), P_OFFINTNL(dcc_global_max_send_cps),
					N_("Max. speed for all traffic"), 0, 1000000},
	{ST_NUMBER,	N_("Max. global receive CPS:"), P_OFFINTNL(dcc_global_max_get_cps),
					N_("Max. speed for all traffic"), 0, 1000000},
	{ST_LABEL,	N_("(Leave at zero for full speed file transfers).")},
	{ST_END, 0, 0, 0, 0, 0}
};

static const setting general_settings[] =
{
	{ST_ENTRY,	N_("Default quit message:"), P_OFFSETNL(quitreason), 0, 0, sizeof prefs.quitreason},
	{ST_ENTRY,	N_("Default part message:"), P_OFFSETNL(partreason), 0, 0, sizeof prefs.partreason},
	{ST_ENTRY,	N_("Default away message:"), P_OFFSETNL(awayreason), 0, 0, sizeof prefs.awayreason},
#ifndef WIN32
	{ST_LABEL,	N_("(Can be a text file relative to ~/.xchat2/).")},
#else
	{ST_LABEL,	N_("(Can be a text file relative to config dir).")},
#endif
	{ST_ENTRY,	N_("Extra words to highlight on:"), P_OFFSETNL(bluestring), 0, 0, sizeof prefs.bluestring},
	{ST_LABEL,	N_("(Separate multiple words with commas).")},
	{ST_TOGGLE,	N_("Show away once"), P_OFFINTNL(show_away_once), N_("Show identical away messages only once"), 0, 0},
	{ST_TOGGLE,	N_("Beep on private messages"), P_OFFINTNL(beepmsg), 0, 0, 0},
	{ST_TOGGLE,	N_("Automatically unmark away"), P_OFFINTNL(auto_unmark_away), N_("Unmark yourself as away before sending messages"), 0, 0},
	{ST_TOGGLE,	N_("Beep on channel messages"), P_OFFINTNL(beepchans), 0, 0, 0},
	{ST_TOGGLE,	N_("Announce away messages"), P_OFFINTNL(show_away_message), N_("Announce your away messages to all channels"), 0, 0},
	{ST_TOGGLE,	N_("Beep on highlighted messages"), P_OFFINTNL(beephilight), 0, 0, 0},
	{ST_TOGGLE,	N_("Display MODEs in raw form"), P_OFFINTNL(raw_modes), 0, 0, 0},
	{ST_TOGGLE,	N_("Whois on notify"), P_OFFINTNL(whois_on_notifyonline), N_("Sends a /WHOIS when a user comes online in your notify list"), 0, 0},
	{ST_TOGGLE,	N_("Hide join/part messages"), P_OFFINTNL(confmode), N_("Hide channel join/part messages by default"), 0, 0},
	{ST_NUMBER,	N_("Auto reconnect delay:"), P_OFFINTNL(recon_delay), 0, 0, 9999},
	{ST_END, 0, 0, 0, 0, 0}
};

static const setting logging_settings[] =
{
	{ST_ENTRY,	N_("Log filename mask:"), P_OFFSETNL(logmask), 0, 0, sizeof prefs.logmask},
	{ST_LABEL,	N_("(%s=Server %c=Channel %n=Network).")},
	{ST_ENTRY,	N_("Log timestamp format:"), P_OFFSETNL(timestamp_log_format), 0, 0, sizeof prefs.timestamp_log_format},
	{ST_LABEL,	N_("(See strftime manpage for details).")},
	{ST_TOGGLE,	N_("Enable logging of conversations"), P_OFFINTNL(logging), 0, 0, 0},
	{ST_TOGGLE,	N_("Insert timestamps in logs"), P_OFFINTNL(timestamp_logs), 0, 0, 0},
	{ST_END, 0, 0, 0, 0, 0}
};

static char *proxytypes[] =
{
	N_("(Disabled)"),
	N_("Wingate"),
	N_("Socks4"),
	N_("Socks5"),
	N_("HTTP"),
	NULL
};

static const setting network_settings[] =
{
	{ST_ENTRY,	N_("Address to bind to:"), P_OFFSETNL(hostname), 0, 0, sizeof prefs.hostname},
	{ST_LABEL,	N_("(Only useful for computers with multiple addresses).")},
	{ST_FRAME,	N_("Proxy server"), 0, 0, 0, 0},
	{ST_ENTRY,	N_("Hostname:"), P_OFFSETNL(proxy_host), 0, 0, sizeof prefs.proxy_host},
	{ST_ENTRY,	N_("Username:"), P_OFFSETNL(proxy_user), 0, 0, sizeof prefs.proxy_user},
	{ST_ENTRY,	N_("Password:"), P_OFFSETNL(proxy_pass), 0, GINT_TO_POINTER(1), sizeof prefs.proxy_pass},
	{ST_NUMBER,	N_("Port:"), P_OFFINTNL(proxy_port), 0, 0, 65535},
	{ST_MENU,	N_("Type:"), P_OFFINTNL(proxy_type), 0, proxytypes, 0},

	{ST_TOGGLE,	N_("Authenticate to the proxy server (only HTTP)"), P_OFFINTNL(proxy_auth), 0, 0, 0},

	{ST_END, 0, 0, 0, 0, 0}
};

#define setup_get_str(pr,set) (((char *)pr)+set->offset)
#define setup_get_int(pr,set) *(((int *)pr)+set->offset)

#define setup_set_int(pr,set,num) *((int *)pr+set->offset)=num
#define setup_set_str(pr,set,str) strcpy(((char *)pr)+set->offset,str)


static void
setup_toggle_cb (GtkToggleButton *but, const setting *set)
{
	setup_set_int (&setup_prefs, set, but->active ? 1 : 0);
}

static void
setup_create_toggle (GtkWidget *box, int row, const setting *set)
{
	GtkWidget *wid;

	wid = gtk_check_button_new_with_label (_(set->label));
	gtk_toggle_button_set_active (GTK_TOGGLE_BUTTON (wid),
											setup_get_int (&setup_prefs, set));
	g_signal_connect (G_OBJECT (wid), "toggled",
							G_CALLBACK (setup_toggle_cb), (gpointer)set);
	if (set->tooltip)
		add_tip (wid, _(set->tooltip));
	gtk_box_pack_start (GTK_BOX (box), wid, 0, 0, 0);
}

static void
setup_spin_cb (GtkSpinButton *spin, const setting *set)
{
	setup_set_int (&setup_prefs, set, gtk_spin_button_get_value_as_int (spin));
}

static void
setup_create_spin (GtkWidget *table, int row, const setting *set)
{
	GtkWidget *label, *wid, *rbox, *align;
	int add = 0;

	if (strlen (set->label) > 30)
		add = 2;

	label = gtk_label_new (_(set->label));
	gtk_misc_set_alignment (GTK_MISC (label), 1.0, 0.5);
	gtk_table_attach (GTK_TABLE (table), label, 0, 1+add, row, row + 1,
							GTK_SHRINK | GTK_FILL, GTK_SHRINK | GTK_FILL, 0, 0);

	align = gtk_alignment_new (0.0, 1.0, 0.0, 0.0);
	gtk_table_attach_defaults (GTK_TABLE (table), align, 1+add, 2+add, row, row + 1);

	rbox = gtk_hbox_new (0, 0);
	gtk_container_add (GTK_CONTAINER (align), rbox);

	wid = gtk_spin_button_new_with_range (0, set->extra, 1);
	if (set->tooltip)
		add_tip (wid, _(set->tooltip));
	gtk_spin_button_set_value (GTK_SPIN_BUTTON (wid),
										setup_get_int (&setup_prefs, set));
	g_signal_connect (G_OBJECT (wid), "value-changed",
							G_CALLBACK (setup_spin_cb), (gpointer)set);
	gtk_box_pack_start (GTK_BOX (rbox), wid, 0, 0, 0);

	if (set->list)
	{
		label = gtk_label_new (_((char *)set->list));
		gtk_box_pack_start (GTK_BOX (rbox), label, 0, 0, 5);
	}
}

static gint
setup_apply_tint (int *tag)
{
	prefs.tint_red = setup_prefs.tint_red;
	prefs.tint_green = setup_prefs.tint_green;
	prefs.tint_blue = setup_prefs.tint_blue;
	mg_update_xtext (current_sess->gui->xtext);
	*tag = 0;
	return 0;
}

static void
setup_hscale_cb (GtkHScale *wid, const setting *set)
{
	static int tag = 0;

	setup_set_int (&setup_prefs, set, gtk_range_get_value(GTK_RANGE(wid)));
	if(tag == 0)
		tag = g_idle_add ((GSourceFunc)setup_apply_tint, &tag);
}

static void
setup_create_hscale (GtkWidget *table, int row, const setting *set)
{
	GtkWidget *wid;

	wid = gtk_label_new (_(set->label));
	gtk_misc_set_alignment (GTK_MISC (wid), 1.0, 0.5);
	gtk_table_attach (GTK_TABLE (table), wid, 0, 1, row, row + 1,
							GTK_SHRINK | GTK_FILL, GTK_SHRINK | GTK_FILL, 0, 0);

	wid = gtk_hscale_new_with_range (0., 255., 1.);
	gtk_scale_set_value_pos (GTK_SCALE (wid), GTK_POS_RIGHT);
	gtk_range_set_value (GTK_RANGE (wid), setup_get_int (&setup_prefs, set));
	g_signal_connect (G_OBJECT(wid), "value_changed",
							G_CALLBACK (setup_hscale_cb), (gpointer)set);
	gtk_table_attach (GTK_TABLE (table), wid, 1, 5, row, row + 1,
							GTK_EXPAND | GTK_FILL, GTK_FILL, 0, 0);
}

#if 0
static int
setup_create_radio (GtkWidget *table, int row, setting *set)
{
	GtkWidget *wid;
	int i;
	char **text = set->list;
	GSList *group;

	wid = gtk_label_new (set->label);
	gtk_misc_set_alignment (GTK_MISC (wid), 1.0, 0.5);
	gtk_table_attach (GTK_TABLE (table), wid, 0, 1, row, row + 1,
							GTK_SHRINK | GTK_FILL, GTK_SHRINK | GTK_FILL, 0, 0);

	i = 0;
	group = NULL;
	while (text[i])
	{
		wid = gtk_radio_button_new_with_label (group, text[i]);
		group = gtk_radio_button_get_group (GTK_RADIO_BUTTON (wid));
		gtk_table_attach_defaults (GTK_TABLE (table), wid, 2, 3, row, row + 1);
		if (i == setup_get_int (&setup_prefs, set))
			gtk_toggle_button_set_active (GTK_TOGGLE_BUTTON (wid), TRUE);
		i++;
		row++;
	}

	return i;
}
#endif

static GtkWidget *proxy_user; 	/* username GtkEntry */
static GtkWidget *proxy_pass; 	/* password GtkEntry */


static void
setup_menu_cb (GtkWidget *item, const setting *set)
{
	int n = GPOINTER_TO_INT (g_object_get_data (G_OBJECT (item), "n"));

	/* set the prefs.<field> */
	setup_set_int (&setup_prefs, set, n);

	if (g_object_get_data (G_OBJECT (item), "p"))
	{
		/* only HTTP can use a username/pass */
		gtk_widget_set_sensitive (proxy_user, (n == 4));
		gtk_widget_set_sensitive (proxy_pass, (n == 4));
	}
}

static void
setup_create_menu (GtkWidget *table, int row, const setting *set)
{
	GtkWidget *wid, *menu, *item, *align;
	int i;
	char **text = set->list;

	wid = gtk_label_new (_(set->label));
	gtk_misc_set_alignment (GTK_MISC (wid), 1.0, 0.5);
	gtk_table_attach (GTK_TABLE (table), wid, 0, 1, row, row + 1,
							GTK_SHRINK | GTK_FILL, GTK_SHRINK | GTK_FILL, 0, 0);

	wid = gtk_option_menu_new ();
	if (set->tooltip)
		add_tip (wid, _(set->tooltip));
	menu = gtk_menu_new ();

	i = 0;
	while (text[i])
	{
		item = gtk_menu_item_new_with_label (_(text[i]));
		g_object_set_data (G_OBJECT (item), "n", GINT_TO_POINTER (i));

		/* set a flag for the callback to use */
		if (text == proxytypes)
			g_object_set_data (G_OBJECT (item), "p", GINT_TO_POINTER (1));	

		gtk_widget_show (item);
		gtk_menu_shell_append (GTK_MENU_SHELL (menu), item);
		g_signal_connect (G_OBJECT (item), "activate",
								G_CALLBACK (setup_menu_cb), (gpointer)set);
		i++;
	}

	gtk_option_menu_set_menu (GTK_OPTION_MENU (wid), menu);
	gtk_option_menu_set_history (GTK_OPTION_MENU (wid),
										  setup_get_int (&setup_prefs, set));

	align = gtk_alignment_new (0.0, 0.5, 0.0, 0.0);
	gtk_container_add (GTK_CONTAINER (align), wid);
	gtk_table_attach (GTK_TABLE (table), align, 1, 4, row, row + 1,
							GTK_FILL, GTK_SHRINK | GTK_FILL, 0, 0);
}

static void
setup_filereq_cb (GtkWidget *entry, char *file)
{
	if (file)
	{
		if (file[0])
			gtk_entry_set_text (GTK_ENTRY (entry), file);
	}
}

static void
setup_browsefile_cb (GtkWidget *button, GtkWidget *entry)
{
	gtkutil_file_req (_("Select an Image File"), setup_filereq_cb, entry, NULL, 0);
}

static void
setup_fontsel_cb (GtkWidget *button, GtkFontSelectionDialog *dialog)
{
	GtkWidget *entry;

	entry = g_object_get_data (G_OBJECT (button), "e");

	gtk_entry_set_text (GTK_ENTRY (entry),
							  gtk_font_selection_dialog_get_font_name (dialog));
	gtk_widget_destroy (GTK_WIDGET (dialog));
}

static void
setup_fontsel_cancel (GtkWidget *button, GtkFontSelectionDialog *dialog)
{
	gtk_widget_destroy (GTK_WIDGET (dialog));
}

#ifdef WIN32
static void
setup_browse_folder (char *dir)
{
	dir = g_locale_from_utf8 (dir, -1, 0, 0, 0);
	if (dir)
	{
		ShellExecute (0, "open", dir, NULL, NULL, SW_SHOWNORMAL);
		g_free (dir);
	}
}

static void
setup_browsefolder_cb (GtkWidget *button, GtkWidget *entry)
{
	if (GTK_ENTRY (entry)->text[0])
		setup_browse_folder (GTK_ENTRY (entry)->text);
}
#endif

static void
setup_browsefont_cb (GtkWidget *button, GtkWidget *entry)
{
	GtkFontSelection *sel;
	GtkFontSelectionDialog *dialog;

	dialog = (GtkFontSelectionDialog *) gtk_font_selection_dialog_new (_("Select font"));

	sel = (GtkFontSelection *) dialog->fontsel;

	if (GTK_ENTRY (entry)->text[0])
		gtk_font_selection_set_font_name (sel, GTK_ENTRY (entry)->text);

	g_object_set_data (G_OBJECT (dialog->ok_button), "e", entry);

	g_signal_connect (G_OBJECT (dialog->ok_button), "clicked",
							G_CALLBACK (setup_fontsel_cb), dialog);
	g_signal_connect (G_OBJECT (dialog->cancel_button), "clicked",
							G_CALLBACK (setup_fontsel_cancel), dialog);

	gtk_widget_show (GTK_WIDGET (dialog));
}

static void
setup_entry_cb (GtkEntry *entry, setting *set)
{
	setup_set_str (&setup_prefs, set, entry->text);
}

static void
setup_create_label (GtkWidget *table, int row, const setting *set)
{
	gtk_table_attach (GTK_TABLE (table), gtk_label_new (_(set->label)),
							1, 2, row, row + 1, GTK_SHRINK | GTK_FILL,
							GTK_SHRINK | GTK_FILL, 0, 0);
}

static void
setup_create_entry (GtkWidget *table, int row, const setting *set)
{
	GtkWidget *label;
	GtkWidget *wid, *bwid;

	label = gtk_label_new (_(set->label));
	gtk_misc_set_alignment (GTK_MISC (label), 1.0, 0.5);
	gtk_table_attach (GTK_TABLE (table), label, 0, 1, row, row + 1,
							GTK_SHRINK | GTK_FILL, GTK_SHRINK | GTK_FILL, 0, 0);

	wid = gtk_entry_new ();
	if (set->list)
		gtk_entry_set_visibility (GTK_ENTRY (wid), FALSE);
	if (set->tooltip)
		add_tip (wid, _(set->tooltip));
	gtk_entry_set_max_length (GTK_ENTRY (wid), set->extra - 1);
	gtk_entry_set_text (GTK_ENTRY (wid), setup_get_str (&setup_prefs, set));
	g_signal_connect (G_OBJECT (wid), "changed",
							G_CALLBACK (setup_entry_cb), (gpointer)set);

	if (set->offset == P_OFFSETNL(proxy_user))
		proxy_user = wid;
	if (set->offset == P_OFFSETNL(proxy_pass))
		proxy_pass = wid; 

	/* only http can auth */
	if ( (set->offset == P_OFFSETNL(proxy_pass) ||
			set->offset == P_OFFSETNL(proxy_user)) &&
	     setup_prefs.proxy_type != 4)
		gtk_widget_set_sensitive (wid, FALSE);

#ifdef WIN32
	if (set->type == ST_ENTRY)
#else
	if (set->type == ST_ENTRY || set->type == ST_EOPEN)
#endif
		gtk_table_attach (GTK_TABLE (table), wid, 1, 5, row, row + 1,
								GTK_EXPAND | GTK_FILL, GTK_FILL, 0, 0);
	else
	{
		gtk_table_attach (GTK_TABLE (table), wid, 1, 4, row, row + 1,
								GTK_EXPAND | GTK_FILL, GTK_FILL, 0, 0);
		bwid = gtk_button_new_with_label (_("Browse..."));
		gtk_table_attach (GTK_TABLE (table), bwid, 4, 5, row, row + 1,
								GTK_SHRINK, GTK_SHRINK, 0, 0);
		if (set->type == ST_EFILE)
			g_signal_connect (G_OBJECT (bwid), "clicked",
									G_CALLBACK (setup_browsefile_cb), wid);
		if (set->type == ST_EFONT)
			g_signal_connect (G_OBJECT (bwid), "clicked",
									G_CALLBACK (setup_browsefont_cb), wid);
#ifdef WIN32
		if (set->type == ST_EOPEN)
			g_signal_connect (G_OBJECT (bwid), "clicked",
									G_CALLBACK (setup_browsefolder_cb), wid);
#endif
	}
}

static GtkWidget *
setup_create_frame (char *label, GtkWidget **left, GtkWidget **right, GtkWidget *box)
{
	GtkWidget *tab, *hbox, *frame, *inbox = box;

	if (label)
	{
		frame = gtk_frame_new (label);
		inbox = gtk_vbox_new (FALSE, 3);
		gtk_container_set_border_width (GTK_CONTAINER (inbox), 5);
		gtk_container_add (GTK_CONTAINER (frame), inbox);
		gtk_container_add (GTK_CONTAINER (box), frame);
	}

	tab = gtk_table_new (3, 2, FALSE);
	gtk_container_set_border_width (GTK_CONTAINER (tab), 2);
	gtk_table_set_row_spacings (GTK_TABLE (tab), 2);
	gtk_table_set_col_spacings (GTK_TABLE (tab), 3);
	gtk_container_add (GTK_CONTAINER (inbox), tab);

	hbox = gtk_hbox_new (FALSE, 0);
	gtk_container_add (GTK_CONTAINER (inbox), hbox);

	*left = gtk_vbox_new (FALSE, 0);
	gtk_container_add (GTK_CONTAINER (hbox), *left);

	*right = gtk_vbox_new (FALSE, 0);
	gtk_container_add (GTK_CONTAINER (hbox), *right);

	return tab;
}

#ifdef WIN32
static void
open_data_cb (GtkWidget *button, gpointer data)
{
	ShellExecute (0, "open", get_xdir_fs (), NULL, NULL, SW_SHOWNORMAL);
}
#endif

static GtkWidget *
setup_create_page (const setting *set)
{
	int i, row;
	GtkWidget *tab, *box, *left, *right;

	box = gtk_vbox_new (FALSE, 20);
	gtk_container_set_border_width (GTK_CONTAINER (box), 4);

	tab = setup_create_frame (NULL, &left, &right, box);

	i = row = 0;
	while (set[i].type != ST_END)
	{
		switch (set[i].type)
		{
		case ST_FRAME:
			tab = setup_create_frame (_(set[i].label), &left, &right, box);
			break;
		case ST_EFONT:
		case ST_ENTRY:
		case ST_EFILE:
		case ST_EOPEN:
			setup_create_entry (tab, row, &set[i]);
			break;
		case ST_TOGGLE:
			if (i % 2)
				setup_create_toggle (right, row, &set[i]);
			else
				setup_create_toggle (left, row, &set[i]);
			break;
		case ST_MENU:
			setup_create_menu (tab, row, &set[i]);
			break;
#if 0
		case ST_RADIO:
			row += setup_create_radio (tab, row, &set[i]);
			break;
#endif
		case ST_NUMBER:
			setup_create_spin (tab, row, &set[i]);
			break;
		case ST_HSCALE:
			setup_create_hscale (tab, row, &set[i]);
			break;
		case ST_LABEL:
			setup_create_label (tab, row, &set[i]);
			break;
		}
		i++;
		row++;
	}

#ifdef WIN32
	if (set == logging_settings)

		gtkutil_button (left, GTK_STOCK_OPEN, 0, open_data_cb, 0, "Open Data Folder");
#endif

	return box;
}

static void
setup_color_ok_cb (GtkWidget *button, GtkWidget *dialog)
{
	GtkColorSelectionDialog *cdialog = GTK_COLOR_SELECTION_DIALOG (dialog);
	GdkColor *col;
	GdkColor old_color;
	GtkStyle *style;

	col = g_object_get_data (G_OBJECT (button), "c");
	old_color = *col;

	button = g_object_get_data (G_OBJECT (button), "b");

	if (!GTK_IS_WIDGET (button))
	{
		gtk_widget_destroy (dialog);
		return;
	}

	color_change = TRUE;

	gtk_color_selection_get_current_color (GTK_COLOR_SELECTION (cdialog->colorsel), col);

	gdk_colormap_alloc_color (gtk_widget_get_colormap (button), col, TRUE, TRUE);

	style = gtk_style_new ();
	style->bg[0] = *col;
	gtk_widget_set_style (button, style);
	g_object_unref (style);

	/* is this line correct?? */
	gdk_colormap_free_colors (gtk_widget_get_colormap (button), &old_color, 1);

	gtk_widget_destroy (dialog);
}

static void
setup_color_cb (GtkWidget *button, gpointer userdata)
{
	GtkWidget *dialog;
	GtkColorSelectionDialog *cdialog;
	GdkColor *color;

	color = &colors[GPOINTER_TO_INT (userdata)];

	dialog = gtk_color_selection_dialog_new (_("Select color"));
	cdialog = GTK_COLOR_SELECTION_DIALOG (dialog);

	gtk_widget_hide (cdialog->help_button);
	g_signal_connect (G_OBJECT (cdialog->ok_button), "clicked",
							G_CALLBACK (setup_color_ok_cb), dialog);
	g_signal_connect (G_OBJECT (cdialog->cancel_button), "clicked",
							G_CALLBACK (gtkutil_destroy), dialog);
	g_object_set_data (G_OBJECT (cdialog->ok_button), "c", color);
	g_object_set_data (G_OBJECT (cdialog->ok_button), "b", button);
	gtk_widget_set_sensitive (cdialog->help_button, FALSE);
	gtk_color_selection_set_current_color (GTK_COLOR_SELECTION (cdialog->colorsel), color);
	gtk_widget_show (dialog);
}

static void
setup_create_color_button (GtkWidget *table, int num, int row, int col)
{
	GtkWidget *but;
	GtkStyle *style;
	char buf[16];

	if (num > 15)
		strcpy (buf, " ");
	else
		sprintf (buf, "%d", num);
	but = gtk_button_new_with_label (buf);
	/* win32 build uses this to turn off themeing */
	g_object_set_data (G_OBJECT (but), "xchat-color", (gpointer)1);
	gtk_table_attach (GTK_TABLE (table), but, col, col+1, row, row+1,
							GTK_SHRINK | GTK_FILL, GTK_SHRINK | GTK_FILL, 0, 0);
	g_signal_connect (G_OBJECT (but), "clicked",
							G_CALLBACK (setup_color_cb), GINT_TO_POINTER (num));
	style = gtk_style_new ();
	style->bg[GTK_STATE_NORMAL] = colors[num];
	gtk_widget_set_style (but, style);
	g_object_unref (style);
}

static void
setup_create_other_color (char *text, int num, int row, GtkWidget *tab)
{
	GtkWidget *label;

	label = gtk_label_new (text);
	gtk_misc_set_alignment (GTK_MISC (label), 1.0, 0.5);
	gtk_table_attach (GTK_TABLE (tab), label, 0, 1, row, row + 1,
							GTK_SHRINK | GTK_FILL, GTK_SHRINK | GTK_FILL, 0, 0);
	setup_create_color_button (tab, num, row, 1);
}

static GtkWidget *
setup_create_color_page (void)
{
	GtkWidget *tab, *box, *label, *frame;
	int i;

	box = gtk_vbox_new (FALSE, 0);
	gtk_container_set_border_width (GTK_CONTAINER (box), 4);

	tab = gtk_table_new (9, 2, FALSE);
	gtk_container_set_border_width (GTK_CONTAINER (tab), 2);
	gtk_table_set_row_spacings (GTK_TABLE (tab), 2);
	gtk_table_set_col_spacings (GTK_TABLE (tab), 3);
	gtk_container_add (GTK_CONTAINER (box), tab);

	label = gtk_label_new (_("mIRC colors:"));
	gtk_misc_set_alignment (GTK_MISC (label), 1.0, 0.5);
	gtk_table_attach (GTK_TABLE (tab), label, 0, 1, 0, 1,
							GTK_SHRINK | GTK_FILL, GTK_SHRINK | GTK_FILL, 0, 0);

	for (i = 0; i < 16; i++)
		setup_create_color_button (tab, i, 0, i+1);


	setup_create_other_color (_("Foreground:"), 18, 1, tab);
	setup_create_other_color (_("Background:"), 19, 2, tab);

	setup_create_other_color (_("Mark fore:"), 17, 6, tab);
	setup_create_other_color (_("Mark back:"), 16, 7, tab);

	setup_create_other_color (_("Away User:"), 23, 13, tab);

	frame = gtk_frame_new (_("Tab colors"));
	gtk_container_set_border_width (GTK_CONTAINER (frame), 8);
	gtk_table_attach (GTK_TABLE (tab), frame, 3, 15, 1, 18,
							GTK_SHRINK | GTK_FILL, GTK_SHRINK | GTK_FILL, 0, 0);

	tab = gtk_table_new (9, 2, FALSE);
	gtk_container_set_border_width (GTK_CONTAINER (tab), 8);
	gtk_table_set_row_spacings (GTK_TABLE (tab), 2);
	gtk_table_set_col_spacings (GTK_TABLE (tab), 3);
	gtk_container_add (GTK_CONTAINER (frame), tab);

	setup_create_other_color (_("New Data:"), 20, 10, tab);
	setup_create_other_color (_("New Message:"), 22, 11, tab);
	setup_create_other_color (_("Highlight:"), 21, 12, tab);

	return box;
}

static void
setup_add_page (char *title, GtkWidget *book, GtkWidget *tab)
{
	GtkWidget *oframe, *frame, *label, *vvbox;
	char buf[128];

	/* frame for whole page */
	oframe = gtk_frame_new (NULL);
	gtk_frame_set_shadow_type (GTK_FRAME (oframe), GTK_SHADOW_IN);

	vvbox = gtk_vbox_new (FALSE, 0);
	gtk_container_add (GTK_CONTAINER (oframe), vvbox);

	/* border for the label */
	frame = gtk_frame_new (NULL);
	gtk_frame_set_shadow_type (GTK_FRAME (frame), GTK_SHADOW_OUT);
	gtk_box_pack_start (GTK_BOX (vvbox), frame, FALSE, TRUE, 0);

	/* label */
	label = gtk_label_new (NULL);
	snprintf (buf, sizeof (buf), "<b><big>%s</big></b>", _(title));
	gtk_label_set_markup (GTK_LABEL (label), buf);
	gtk_misc_set_alignment (GTK_MISC (label), 0.0, 0.5);
	gtk_misc_set_padding (GTK_MISC (label), 2, 1);
	gtk_container_add (GTK_CONTAINER (frame), label);

	gtk_box_pack_start (GTK_BOX (vvbox), tab, FALSE, FALSE, 0);

	gtk_notebook_append_page (GTK_NOTEBOOK (book), oframe, NULL);
}

static char *cata[] =
{
	N_("Interface"),
		N_("Text box"),
		N_("Input box"),
		N_("User list"),
		N_("Tabs"),
		N_("Colors"),
		NULL,
	N_("Chatting"),
		N_("General"),
		N_("Logging"),
		NULL,
	N_("Network"),
		N_("Network setup"),
		N_("File transfers"),
		NULL,
	NULL
};

static GtkWidget *
setup_create_pages (GtkWidget *box)
{
	GtkWidget *book;

	book = gtk_notebook_new ();

	setup_add_page (cata[1], book, setup_create_page (textbox_settings));
	setup_add_page (cata[2], book, setup_create_page (inputbox_settings));
	setup_add_page (cata[3], book, setup_create_page (userlist_settings));
	setup_add_page (cata[4], book, setup_create_page (tabs_settings));
	setup_add_page (cata[5], book, setup_create_color_page ());
	setup_add_page (cata[8], book, setup_create_page (general_settings));
	setup_add_page (cata[9], book, setup_create_page (logging_settings));
	setup_add_page (cata[12], book, setup_create_page (network_settings));
	setup_add_page (cata[13], book, setup_create_page (filexfer_settings));

	gtk_notebook_set_show_tabs (GTK_NOTEBOOK (book), FALSE);
	gtk_notebook_set_show_border (GTK_NOTEBOOK (book), FALSE);
	gtk_container_add (GTK_CONTAINER (box), book);

	return book;
}

static void
setup_tree_cb (GtkTreeView *treeview, GtkWidget *book)
{
	GtkTreeSelection *selection = gtk_tree_view_get_selection (treeview);
	GtkTreeIter iter;
	GtkTreeModel *model;
	int page;

	if (gtk_tree_selection_get_selected (selection, &model, &iter))
	{
		gtk_tree_model_get (model, &iter, 1, &page, -1);
		if (page != -1)
		{
			gtk_notebook_set_current_page (GTK_NOTEBOOK (book), page);
			last_selected_page = page;
		}
	}
}

static gboolean
setup_tree_select_filter (GtkTreeSelection *selection, GtkTreeModel *model,
								  GtkTreePath *path, gboolean path_selected,
								  gpointer data)
{
	if (gtk_tree_path_get_depth (path) > 1)
		return TRUE;
	return FALSE;
}

static void
setup_create_tree (GtkWidget *box, GtkWidget *book)
{
	GtkWidget *tree;
	GtkTreeStore *model;
	GtkTreeIter iter;
	GtkTreeIter child_iter;
	GtkTreeIter *sel_iter = NULL;
	GtkCellRenderer *renderer;
	GtkTreeSelection *sel;
	int i, page;

	model = gtk_tree_store_new (2, G_TYPE_STRING, G_TYPE_INT);

	i = 0;
	page = 0;
	do
	{
		gtk_tree_store_append (model, &iter, NULL);
		gtk_tree_store_set (model, &iter, 0, _(cata[i]), 1, -1, -1);
		i++;

		do
		{
			gtk_tree_store_append (model, &child_iter, &iter);
			gtk_tree_store_set (model, &child_iter, 0, _(cata[i]), 1, page, -1);
			if (page == last_selected_page)
				sel_iter = gtk_tree_iter_copy (&child_iter);
			page++;
			i++;
		} while (cata[i]);

		i++;

	} while (cata[i]);

	tree = gtk_tree_view_new_with_model (GTK_TREE_MODEL (model));
	g_object_unref (G_OBJECT (model));
	sel = gtk_tree_view_get_selection (GTK_TREE_VIEW (tree));
	gtk_tree_selection_set_mode (sel, GTK_SELECTION_BROWSE);
	gtk_tree_selection_set_select_function (sel, setup_tree_select_filter,
														 NULL, NULL);
	g_signal_connect (G_OBJECT (tree), "cursor_changed",
							G_CALLBACK (setup_tree_cb), book);

	renderer = gtk_cell_renderer_text_new ();
	gtk_tree_view_insert_column_with_attributes (GTK_TREE_VIEW (tree),
							    -1, _("Categories"), renderer, "text", 0, NULL);
	gtk_tree_view_expand_all (GTK_TREE_VIEW (tree));
	gtk_box_pack_start (GTK_BOX (box), tree, 0, 0, 0);
	gtk_box_reorder_child (GTK_BOX (box), tree, 0);

	if (sel_iter)
	{
		gtk_tree_selection_select_iter (sel, sel_iter);
		gtk_tree_iter_free (sel_iter);
	}
}

static void
setup_apply_entry_style (GtkWidget *entry)
{
	gtk_widget_modify_base (entry, GTK_STATE_NORMAL, &colors[19]);
	gtk_widget_modify_text (entry, GTK_STATE_NORMAL, &colors[18]);
	gtk_widget_modify_font (entry, input_style->font_desc);
}

static void
setup_apply_to_sess (session_gui *gui)
{
	mg_update_xtext (gui->xtext);

	if (prefs.style_namelistgad)
		gtk_widget_set_style (gui->user_tree, input_style);

	if (prefs.style_inputbox)
	{
		extern char cursor_color_rc[];
		char buf[256];
		sprintf (buf, cursor_color_rc,
				(colors[18].red >> 8),
				(colors[18].green >> 8),
				(colors[18].blue >> 8));
		gtk_rc_parse_string (buf);

		setup_apply_entry_style (gui->input_box);
		setup_apply_entry_style (gui->limit_entry);
		setup_apply_entry_style (gui->key_entry);
		setup_apply_entry_style (gui->topic_entry);
	}

	if (prefs.userlistbuttons)
		gtk_widget_show (gui->button_box);
	else
		gtk_widget_hide (gui->button_box);
}

static void
setup_apply (struct xchatprefs *pr)
{
	GSList *list;
	int done_main = FALSE;
	session *sess;
	GtkStyle *old_style;
	int new_pix = FALSE;
	int noapply = FALSE;
	int do_ulist = FALSE;

	if (strcmp (pr->background, prefs.background) != 0)
		new_pix = TRUE;

#define DIFF(a) (pr->a != prefs.a)

	if (DIFF (paned_userlist))
		noapply = TRUE;
	if (DIFF (lagometer))
		noapply = TRUE;
	if (DIFF (throttlemeter))
		noapply = TRUE;
	if (DIFF (showhostname_in_userlist))
		noapply = TRUE;

	if (color_change || (DIFF (away_size_max)))
		do_ulist = TRUE;

	memcpy (&prefs, pr, sizeof (prefs));

	mkdir_utf8 (prefs.dccdir);
	mkdir_utf8 (prefs.dcc_completed_dir);

	if (new_pix)
	{
		if (channelwin_pix)
			g_object_unref (channelwin_pix);
		channelwin_pix = pixmap_load_from_file (prefs.background);
	}

	old_style = input_style;
	input_style = create_input_style ();

	list = sess_list;
	while (list)
	{
		sess = list->data;
		if (sess->gui->is_tab)
		{
			/* only apply to main tabwindow once */
			if (!done_main)
			{
				done_main = TRUE;
				setup_apply_to_sess (sess->gui);
			}
		} else
		{
			setup_apply_to_sess (sess->gui);
		}

		if (prefs.logging)
			log_open (sess);
		else
			log_close (sess);

		if (do_ulist)
			userlist_rehash (sess);

		list = list->next;
	}

	mg_apply_setup ();

	g_object_unref (old_style);

	if (noapply)
		gtkutil_simpledialog (_("Some settings were changed that require a"
									 " restart to take full effect."));
}

#if 0
static void
setup_apply_cb (GtkWidget *but, GtkWidget *win)
{
	/* setup_prefs -> xchat */
	setup_apply (&setup_prefs);
}
#endif

static void
setup_ok_cb (GtkWidget *but, GtkWidget *win)
{
	gtk_widget_destroy (win);
	setup_apply (&setup_prefs);
	save_config ();
	palette_save ();
}

static GtkWidget *
setup_window_open (void)
{
	GtkWidget *wid, *win, *vbox, *hbox, *hbbox;

	win = gtkutil_window_new (_("X-Chat: Preferences"), "prefs", 0, 0, 3);

	vbox = gtk_vbox_new (FALSE, 5);
	gtk_container_set_border_width (GTK_CONTAINER (vbox), 6);
	gtk_container_add (GTK_CONTAINER (win), vbox);

	hbox = gtk_hbox_new (FALSE, 4);
	gtk_container_add (GTK_CONTAINER (vbox), hbox);

	setup_create_tree (hbox, setup_create_pages (hbox));

	hbox = gtk_hbox_new (FALSE, 0);
	gtk_box_pack_end (GTK_BOX (vbox), hbox, FALSE, FALSE, 0);

	/* prepare the button box */
	hbbox = gtk_hbutton_box_new ();
	gtk_box_set_spacing (GTK_BOX (hbbox), 4);
	gtk_box_pack_end (GTK_BOX (hbox), hbbox, FALSE, FALSE, 0);

	/* standard buttons */
	/* GNOME doesn't like apply */
#if 0
	wid = gtk_button_new_from_stock (GTK_STOCK_APPLY);
	g_signal_connect (G_OBJECT (wid), "clicked",
							G_CALLBACK (setup_apply_cb), win);
	gtk_box_pack_start (GTK_BOX (hbbox), wid, FALSE, FALSE, 0);
#endif

	wid = gtk_button_new_from_stock (GTK_STOCK_CANCEL);
	g_signal_connect (G_OBJECT (wid), "clicked",
							G_CALLBACK (gtkutil_destroy), win);
	gtk_box_pack_start (GTK_BOX (hbbox), wid, FALSE, FALSE, 0);

	wid = gtk_button_new_from_stock (GTK_STOCK_OK);
	g_signal_connect (G_OBJECT (wid), "clicked",
							G_CALLBACK (setup_ok_cb), win);
	gtk_box_pack_start (GTK_BOX (hbbox), wid, FALSE, FALSE, 0);

	wid = gtk_hseparator_new ();
	gtk_box_pack_end (GTK_BOX (vbox), wid, FALSE, FALSE, 0);

	gtk_widget_show_all (win);

	return win;
}

static void
setup_close_cb (GtkWidget *win, GtkWidget **swin)
{
	*swin = NULL;
}

void
setup_open (void)
{
	static GtkWidget *setup_window = NULL;

	if (setup_window)
	{
		gtk_window_present (GTK_WINDOW (setup_window));
		return;
	}

	memcpy (&setup_prefs, &prefs, sizeof (prefs));

	color_change = FALSE;
	setup_window = setup_window_open ();

	g_signal_connect (G_OBJECT (setup_window), "destroy",
							G_CALLBACK (setup_close_cb), &setup_window);
}
