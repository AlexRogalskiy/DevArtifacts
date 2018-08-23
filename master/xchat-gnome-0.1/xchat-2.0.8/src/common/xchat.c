/* X-Chat
 * Copyright (C) 1998 Peter Zelezny.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA
 */

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <time.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>

#define WANTSOCKET
#include "inet.h"

#ifndef WIN32
#include <sys/wait.h>
#include <signal.h>
#endif

#include "xchat.h"
#include "fe.h"
#include "util.h"
#include "cfgfiles.h"
#include "ignore.h"
#include "xchat-plugin.h"
#include "plugin.h"
#include "plugin-timer.h"
#include "notify.h"
#include "server.h"
#include "servlist.h"
#include "outbound.h"
#include "text.h"
#include "url.h"
#include "xchatc.h"

#ifdef USE_OPENSSL
#include <openssl/ssl.h>		  /* SSL_() */
#include "ssl.h"
#endif

GSList *popup_list = 0;
GSList *button_list = 0;
GSList *dlgbutton_list = 0;
GSList *command_list = 0;
GSList *ctcp_list = 0;
GSList *replace_list = 0;
GSList *sess_list = 0;
GSList *serv_list = 0;
GSList *dcc_list = 0;
GSList *ignore_list = 0;
GSList *usermenu_list = 0;
GSList *urlhandler_list = 0;
GSList *tabmenu_list = 0;
static GSList *away_list = 0;

static int in_xchat_exit = FALSE;
int xchat_is_quitting = FALSE;
int auto_connect = TRUE;
int skip_plugins = FALSE;
char *connect_url = NULL;

struct session *current_tab;
struct session *current_sess = 0;
struct xchatprefs prefs;

#ifdef USE_OPENSSL
SSL_CTX *ctx = NULL;
#endif


int
is_server (server * serv)
{
	return g_slist_find (serv_list, serv) ? 1 : 0;
}

int
is_session (session * sess)
{
	return g_slist_find (sess_list, sess) ? 1 : 0;
}

session *
find_dialog (server *serv, char *nick)
{
	GSList *list = sess_list;
	session *sess;

	while (list)
	{
		sess = list->data;
		if (sess->server == serv && sess->type == SESS_DIALOG)
		{
			if (!serv->p_cmp (nick, sess->channel))
				return (sess);
		}
		list = list->next;
	}
	return 0;
}

session *
find_channel (server *serv, char *chan)
{
	session *sess;
	GSList *list = sess_list;
	while (list)
	{
		sess = list->data;
		if ((!serv || serv == sess->server) && sess->type != SESS_DIALOG)
		{
			if (!serv->p_cmp (chan, sess->channel))
				return sess;
		}
		list = list->next;
	}
	return 0;
}

static void
lagcheck_update (void)
{
	server *serv;
	GSList *list = serv_list;
	
	if (!prefs.lagometer)
		return;

	while (list)
	{
		serv = list->data;
		if (serv->lag_sent)
			fe_set_lag (serv, -1);

		list = list->next;
	}
}

void
lag_check (void)
{
	server *serv;
	GSList *list = serv_list;
	unsigned long tim;
	char tbuf[128];
	time_t now = time (0);
	int lag;

	tim = make_ping_time ();

	while (list)
	{
		serv = list->data;
		if (serv->connected && serv->end_of_motd)
		{
			lag = now - serv->ping_recv;
			if (prefs.pingtimeout && lag > prefs.pingtimeout && lag > 0)
			{
				sprintf (tbuf, "%d", lag);
				EMIT_SIGNAL (XP_TE_PINGTIMEOUT, serv->server_session, tbuf, NULL,
								 NULL, NULL, 0);
				serv->auto_reconnect (serv, FALSE, -1);
			} else
			{
				snprintf (tbuf, sizeof (tbuf), "LAG%lu", tim);
				serv->p_ping (serv, "", tbuf);
				serv->lag_sent = tim;
				fe_set_lag (serv, -1);
			}
		}
		list = list->next;
	}
}

static int
away_check (void)
{
	session *sess;
	GSList *list;
	int full, sent, loop = 0;

	if (prefs.away_size_max < 1)
		return 1;

doover:
	/* request an update of AWAY status of 1 channel every 30 seconds */
	full = TRUE;
	sent = 0;	/* number of WHOs (users) requested */
	list = sess_list;
	while (list)
	{
		sess = list->data;

		if (sess->server->connected &&
			 sess->type == SESS_CHANNEL &&
			 sess->channel[0] &&
			 sess->total <= prefs.away_size_max)
		{
			if (!sess->done_away_check)
			{
				full = FALSE;

				/* if we're under 31 WHOs, send another channels worth */
				if (sent < 31 && !sess->doing_who)
				{
					sess->done_away_check = TRUE;
					sess->doing_who = TRUE;
					/* this'll send a WHO #channel */
					sess->server->p_away_status (sess->server, sess->channel);
					sent += sess->total;
				}
			}
		}

		list = list->next;
	}

	/* done them all, reset done_away_check to FALSE and start over */
	if (full)
	{
		list = sess_list;
		while (list)
		{
			sess = list->data;
			sess->done_away_check = FALSE;
			list = list->next;
		}
		loop++;
		if (loop < 2)
			goto doover;
	}

	return 1;
}

static int
xchat_misc_checks (void)		/* this gets called every 1/2 second */
{
	static int count = 0;

	count++;

	lagcheck_update ();			/* every 500ms */

	if (count % 2)
		dcc_check_timeouts ();	/* every 1 second */

	if (count >= 60)				/* every 30 seconds */
	{
		if (prefs.lagometer)
			lag_check ();
		count = 0;
	}

	return 1;
}

/* executed when the first irc window opens */

static void
irc_init (session *sess)
{
	static int done_init = FALSE;

	if (done_init)
		return;

	done_init = TRUE;

#ifdef USE_PLUGIN
	if (!skip_plugins)
		plugin_auto_load (sess);	/* autoload ~/.xchat *.so */
#endif
	plugin_add (sess, NULL, NULL, timer_plugin_init, NULL, NULL, FALSE);

	if (prefs.notify_timeout)
		notify_tag = fe_timeout_add (prefs.notify_timeout * 1000,
											  notify_checklist, 0);

	fe_timeout_add (prefs.away_timeout * 1000, away_check, 0);
	fe_timeout_add (500, xchat_misc_checks, 0);

	if (connect_url != NULL)
	{
		char buf[512];
		snprintf (buf, sizeof (buf), "server %s", connect_url);
		handle_command (sess, buf, FALSE);
		free (connect_url);
	}
}

static session *
new_session (server *serv, char *from, int type)
{
	session *sess;

	sess = malloc (sizeof (struct session));
	memset (sess, 0, sizeof (struct session));

	sess->server = serv;
	sess->logfd = -1;
	sess->type = type;
	sess->hide_join_part = prefs.confmode;

	if (from != NULL)
		safe_strcpy (sess->channel, from, CHANLEN);

	sess_list = g_slist_prepend (sess_list, sess);

	fe_new_window (sess);

	return sess;
}

void
set_server_defaults (server *serv)
{
	if (serv->chantypes)
		free (serv->chantypes);
	if (serv->chanmodes)
		free (serv->chanmodes);
	if (serv->nick_prefixes)
		free (serv->nick_prefixes);
	if (serv->nick_modes)
		free (serv->nick_modes);
	/*if (serv->encoding)
	{
		free (serv->encoding);
		serv->encoding = NULL;
	}*/

	serv->chantypes = strdup ("#&!+");
	serv->chanmodes = strdup ("beI,k,l");
	serv->nick_prefixes = strdup ("@%+");
	serv->nick_modes = strdup ("ohv");

	serv->nickcount = 1;
	serv->end_of_motd = FALSE;
	serv->is_away = FALSE;
	serv->supports_watch = FALSE;
	serv->bad_prefix = FALSE;
	serv->use_who = TRUE;
}

static server *
new_server (void)
{
	static int id = 0;
	server *serv;

	serv = malloc (sizeof (struct server));
	memset (serv, 0, sizeof (struct server));

	/* use server.c and proto-irc.c functions */
	server_fill_her_up (serv);

	serv->id = id++;
	serv->sok = -1;
	strcpy (serv->nick, prefs.nick1);
	set_server_defaults (serv);

	serv_list = g_slist_prepend (serv_list, serv);

	fe_new_server (serv);

	return serv;
}

session *
new_ircwindow (server *serv, char *name, int type)
{
	session *sess;

	switch (type)
	{
	case SESS_SERVER:
		serv = new_server ();
		if (prefs.use_server_tab)
		{
			register unsigned int oldh = prefs.hideuserlist;
			prefs.hideuserlist = 1;
			sess = new_session (serv, name, SESS_SERVER);
			prefs.hideuserlist = oldh;
		} else
		{
			sess = new_session (serv, name, SESS_CHANNEL);
		}
		serv->server_session = sess;
		serv->front_session = sess;
		break;
	case SESS_DIALOG:
		sess = new_session (serv, name, type);
		if (prefs.logging)
			log_open (sess);
		break;
	default:
/*	case SESS_CHANNEL:
	case SESS_NOTICES:
	case SESS_SNOTICES:*/
		sess = new_session (serv, name, type);
		break;
	}

	irc_init (sess);
	plugin_emit_dummy_print (sess, "Open Context");

	return sess;
}

static void
free_away_messages (server *serv)
{
	GSList *list, *next;
	struct away_msg *away;

	list = away_list;
	while (list)
	{
		away = list->data;
		next = list->next;
		if (away->server == serv)
		{
			away_list = g_slist_remove (away_list, away);
			if (away->message)
				free (away->message);
			free (away);
			next = away_list;
		}
		list = next;
	}
}

void
save_away_message (struct server *serv, char *nick, char *msg)
{
	struct away_msg *away = find_away_message (serv, nick);

	if (away)						  /* Change message for known user */
	{
		if (away->message)
			free (away->message);
		away->message = strdup (msg);
	} else
		/* Create brand new entry */
	{
		away = malloc (sizeof (struct away_msg));
		if (away)
		{
			away->server = serv;
			safe_strcpy (away->nick, nick, sizeof (away->nick));
			away->message = strdup (msg);
			away_list = g_slist_prepend (away_list, away);
		}
	}
}

static void
kill_server_callback (server * serv)
{
	serv->cleanup (serv);

	serv_list = g_slist_remove (serv_list, serv);

	dcc_notify_kill (serv);
	serv->flush_queue (serv);
	free_away_messages (serv);

	free (serv->nick_modes);
	free (serv->nick_prefixes);
	free (serv->chanmodes);
	free (serv->chantypes);
	if (serv->bad_nick_prefixes)
		free (serv->bad_nick_prefixes);
	if (serv->last_away_reason)
		free (serv->last_away_reason);
	if (serv->eom_cmd)
		free (serv->eom_cmd);
	if (serv->username)
		free (serv->username);
	if (serv->realname)
		free (serv->realname);
	if (serv->networkname)
		free (serv->networkname);
	if (serv->encoding)
		free (serv->encoding);

	fe_server_callback (serv);

	free (serv);

	notify_cleanup ();
}

static void
exec_notify_kill (session * sess)
{
#ifndef WIN32
	struct nbexec *re;
	if (sess->running_exec != NULL)
	{
		re = sess->running_exec;
		sess->running_exec = NULL;
		kill (re->childpid, SIGKILL);
		waitpid (re->childpid, NULL, WNOHANG);
		fe_input_remove (re->iotag);
		close (re->myfd);
		if (re->linebuf)
			free(re->linebuf);
		free (re);
	}
#endif
}

static void
send_quit_or_part (session * killsess)
{
	int willquit = TRUE;
	GSList *list;
	session *sess;
	server *killserv = killsess->server;

	/* check if this is the last session using this server */
	list = sess_list;
	while (list)
	{
		sess = (session *) list->data;
		if (sess->server == killserv && sess != killsess)
		{
			willquit = FALSE;
			list = 0;
		} else
			list = list->next;
	}

	if (xchat_is_quitting)
		willquit = TRUE;

	if (killserv->connected)
	{
		if (willquit)
		{
			if (!killserv->sent_quit)
			{
				killserv->flush_queue (killserv);
				server_sendquit (killsess);
				killserv->sent_quit = TRUE;
			}
		} else
		{
			if (killsess->type == SESS_CHANNEL && killsess->channel[0])
			{
				server_sendpart (killserv, killsess->channel, 0);
			}
		}
	}
}

void
kill_session_callback (session * killsess)
{
	server *killserv = killsess->server;
	session *sess;
	GSList *list;

	plugin_emit_dummy_print (killsess, "Close Context");

	if (current_tab == killsess)
		current_tab = NULL;

	if (killserv->server_session == killsess)
		killserv->server_session = NULL;

	if (killserv->front_session == killsess)
	{
		/* front_session is closed, find a valid replacement */
		killserv->front_session = NULL;
		list = sess_list;
		while (list)
		{
			sess = (session *) list->data;
			if (sess != killsess && sess->server == killserv)
			{
				killserv->front_session = sess;
				if (!killserv->server_session)
					killserv->server_session = sess;
				break;
			}
			list = list->next;
		}
	}

	if (!killserv->server_session)
		killserv->server_session = killserv->front_session;

	sess_list = g_slist_remove (sess_list, killsess);

	if (killsess->type == SESS_CHANNEL)
		free_userlist (killsess);

	exec_notify_kill (killsess);

	log_close (killsess);

	send_quit_or_part (killsess);

	history_free (&killsess->history);
	if (killsess->topic)
		free (killsess->topic);
	if (killsess->current_modes)
		free (killsess->current_modes);

	fe_session_callback (killsess);

	if (current_sess == killsess && sess_list)
		current_sess = sess_list->data;

	free (killsess);

	if (!sess_list && !in_xchat_exit)
		xchat_exit ();						/* sess_list is empty, quit! */

	list = sess_list;
	while (list)
	{
		sess = (session *) list->data;
		if (sess->server == killserv)
			return;					  /* this server is still being used! */
		list = list->next;
	}

	kill_server_callback (killserv);
}

static void
free_sessions (void)
{
	GSList *list = sess_list;

	while (list)
	{
		fe_close_window (list->data);
		list = sess_list;
	}
}

struct away_msg *
find_away_message (struct server *serv, char *nick)
{
	struct away_msg *away;
	GSList *list = away_list;
	while (list)
	{
		away = (struct away_msg *) list->data;
		if (away->server == serv && !serv->p_cmp (nick, away->nick))
			return away;
		list = list->next;
	}
	return 0;
}

#define XTERM "gnome-terminal -x "

#define defaultconf_ctcp \
	"NAME TIME\n"				"CMD nctcp %s TIME %t\n\n"\
	"NAME PING\n"				"CMD nctcp %s PING %d\n\n"

#define defaultconf_replace \
	"NAME teh\n"				"CMD the\n\n"
/*	"NAME r\n"					"CMD are\n\n"\
	"NAME u\n"					"CMD you\n\n"*/

#define defaultconf_commands \
	"NAME ACTION\n"		"CMD me &2\n\n"\
	"NAME AME\n"			"CMD allchan me &2\n\n"\
	"NAME ANICK\n"			"CMD allserv nick &2\n\n"\
	"NAME AMSG\n"			"CMD allchan say &2\n\n"\
	"NAME BACK\n"			"CMD away\n\n"\
	"NAME BANLIST\n"		"CMD quote MODE %c +b\n\n"\
	"NAME CHAT\n"			"CMD dcc chat %2\n\n"\
	"NAME DIALOG\n"		"CMD query %2\n\n"\
	"NAME DMSG\n"			"CMD msg =%2 &3\n\n"\
	"NAME EXIT\n"			"CMD quit\n\n"\
	"NAME J\n"				"CMD join &2\n\n"\
	"NAME KILL\n"			"CMD quote KILL %2 :&3\n\n"\
	"NAME LEAVE\n"			"CMD part &2\n\n"\
	"NAME M\n"				"CMD msg &2\n\n"\
	"NAME ONOTICE\n"		"CMD notice @%c &2\n\n"\
	"NAME RAW\n"			"CMD quote &2\n\n"\
	"NAME SERVHELP\n"		"CMD quote HELP\n\n"\
	"NAME SPING\n"			"CMD ping\n\n"\
	"NAME SQUERY\n"		"CMD quote SQUERY %2 :&3\n\n"\
	"NAME SSLSERVER\n"	"CMD server -ssl &2\n\n"\
	"NAME SV\n"				"CMD echo xchat %v %m\n\n"\
	"NAME UMODE\n"			"CMD mode %n &2\n\n"\
	"NAME UPTIME\n"		"CMD quote STATS u\n\n"\
	"NAME VER\n"			"CMD ctcp %2 VERSION\n\n"\
	"NAME VERSION\n"		"CMD ctcp %2 VERSION\n\n"\
	"NAME WALLOPS\n"		"CMD quote WALLOPS :&2\n\n"\
	"NAME WII\n"			"CMD quote WHOIS %2 %2\n\n"

#ifdef WIN32
#define defaultconf_urlhandlers \
	"NAME Connect as IRC server\n"		"CMD newserver %s\n\n"
#else
#define defaultconf_urlhandlers \
	"NAME SUB\n"								"CMD Epiphany...\n\n"\
		"NAME Open\n"							"CMD !epiphany '%s'\n\n"\
		"NAME Open in new tab\n"			"CMD !epiphany -n '%s'\n\n"\
		"NAME Open in new window\n"		"CMD !epiphany -w '%s'\n\n"\
	"NAME ENDSUB\n"							"CMD \n\n"\
	"NAME SUB\n"								"CMD Netscape...\n\n"\
		"NAME Open in existing\n"			"CMD !netscape -remote 'openURL(%s)'\n\n"\
		"NAME Open in new window\n"		"CMD !netscape -remote 'openURL(%s,new-window)'\n\n"\
		"NAME Run new Netscape\n"			"CMD !netscape %s\n\n"\
	"NAME ENDSUB\n"							"CMD \n\n"\
	"NAME SUB\n"								"CMD Mozilla...\n\n"\
		"NAME Open in existing\n"			"CMD !mozilla -remote 'openURL(%s)'\n\n"\
		"NAME Open in new window\n"		"CMD !mozilla -remote 'openURL(%s,new-window)'\n\n"\
		"NAME Open in new tab\n"			"CMD !mozilla -remote 'openURL(%s,new-tab)'\n\n"\
		"NAME Run new Mozilla\n"			"CMD !mozilla %s\n\n"\
	"NAME ENDSUB\n"							"CMD \n\n"\
	"NAME SUB\n"								"CMD Mozilla FireFox...\n\n"\
		"NAME Open in existing\n"			"CMD !firefox -remote 'openURL(%s)'\n\n"\
		"NAME Open in new window\n"		"CMD !firefox -remote 'openURL(%s,new-window)'\n\n"\
		"NAME Open in new tab\n"			"CMD !firefox -remote 'openURL(%s,new-tab)'\n\n"\
		"NAME Run new Mozilla FireFox\n"	"CMD !firefox %s\n\n"\
	"NAME ENDSUB\n"							"CMD \n\n"\
	"NAME SUB\n"								"CMD Galeon...\n\n"\
		"NAME Open in existing\n"			"CMD !galeon -x '%s'\n\n"\
		"NAME Open in new window\n"		"CMD !galeon -w '%s'\n\n"\
		"NAME Open in new tab\n"			"CMD !galeon -n '%s'\n\n"\
		"NAME Run new Galeon\n"				"CMD !galeon '%s'\n\n"\
	"NAME ENDSUB\n"							"CMD \n\n"\
	"NAME SUB\n"								"CMD Opera...\n\n"\
		"NAME Open in existing\n"			"CMD !opera -remote 'openURL(%s)'\n\n"\
		"NAME Open in new window\n"		"CMD !opera -remote 'openURL(%s,new-window)'\n\n"\
		"NAME Open in new tab\n"			"CMD !opera -remote 'openURL(%s,new-page)'\n\n"\
		"NAME Run new Opera\n"				"CMD !opera %s\n\n"\
	"NAME ENDSUB\n"							"CMD \n\n"\
	"NAME SUB\n"								"CMD Send URL to...\n\n"\
		"NAME Gnome URL Handler\n"			"CMD !gnome-moz-remote %s\n\n"\
		"NAME Lynx\n"							"CMD !"XTERM"lynx %s\n\n"\
		"NAME Links\n"							"CMD !"XTERM"links %s\n\n"\
		"NAME w3m\n"							"CMD !"XTERM"w3m %s\n\n"\
		"NAME lFTP\n" 							"CMD !"XTERM"lftp %s\n\n"\
		"NAME gFTP\n"							"CMD !gftp %s\n\n"\
		"NAME Konqueror\n"					"CMD !konqueror %s\n\n"\
		"NAME Telnet\n"						"CMD !"XTERM"telnet %s\n\n"\
		"NAME Ping\n"							"CMD !"XTERM"ping -c 4 %s\n\n"\
	"NAME ENDSUB\n"							"CMD \n\n"\
	"NAME Connect as IRC server\n"		"CMD newserver %s\n\n"
#endif

#ifdef USE_SIGACTION
/* Close and open log files on SIGUSR1. Usefull for log rotating */

static void 
sigusr1_handler (int signal, siginfo_t *si, void *un)
{
	GSList *list = sess_list;
	session *sess;

	if (prefs.logging)
	{
		while (list)
		{
			sess = list->data;
			log_open (sess);
			list = list->next;
		}
	}
}

/* Execute /SIGUSR2 when SIGUSR2 received */

static void
sigusr2_handler (int signal, siginfo_t *si, void *un)
{
	session *sess = current_sess;

	if (sess)
		handle_command (sess, "SIGUSR2", FALSE);
}
#endif

static gint
xchat_auto_connect (gpointer userdata)
{
	servlist_auto_connect (NULL);
	return 0;
}

static void
xchat_init (void)
{
	char buf[2048];
	const char *cs = NULL;

#ifdef WIN32
	WSADATA wsadata;

#ifdef USE_IPV6
	if (WSAStartup(0x0202, &wsadata) != 0)
	{
		MessageBox (NULL, "Cannot find winsock 2.2+", "Error", MB_OK);
		exit (0);
	}
#else
	WSAStartup(0x0101, &wsadata);
#endif	/* !USE_IPV6 */
#endif	/* !WIN32 */

#ifdef USE_SIGACTION
	struct sigaction act;

	/* ignore SIGPIPE's */
	act.sa_handler = SIG_IGN;
	act.sa_flags = 0;
	sigemptyset (&act.sa_mask);
	sigaction (SIGPIPE, &act, NULL);

	/* Deal with SIGUSR1's & SIGUSR2's */
	act.sa_sigaction = sigusr1_handler;
	act.sa_flags = 0;
	sigemptyset (&act.sa_mask);
	sigaction (SIGUSR1, &act, NULL);

	act.sa_sigaction = sigusr2_handler;
	act.sa_flags = 0;
	sigemptyset (&act.sa_mask);
	sigaction (SIGUSR2, &act, NULL);
#else
#ifndef WIN32
	/* good enough for these old systems */
	signal (SIGPIPE, SIG_IGN);
#endif
#endif

	if (g_get_charset (&cs))
		prefs.utf8_locale = TRUE;

	load_text_events ();
	notify_load ();
	ignore_load ();

	snprintf (buf, sizeof (buf),
	"NAME SUB\n"				"CMD %s\n\n"\
		"NAME %s\n"				"CMD dcc send %%s\n\n"\
		"NAME %s\n"				"CMD dcc chat %%s\n\n"\
		"NAME %s\n"				"CMD dcc close chat %%s\n\n"\
	"NAME ENDSUB\n"			"CMD \n\n"\
	"NAME SUB\n"				"CMD CTCP\n\n"\
		"NAME %s\n"				"CMD ctcp %%s VERSION\n\n"\
		"NAME %s\n"				"CMD ctcp %%s USERINFO\n\n"\
		"NAME %s\n"				"CMD ctcp %%s CLIENTINFO\n\n"\
		"NAME %s\n"				"CMD ping %%s\n\n"\
		"NAME %s\n"				"CMD ctcp %%s TIME\n\n"\
		"NAME %s\n"				"CMD ctcp %%s FINGER\n\n"\
		"NAME XDCC List\n"	"CMD ctcp %%s XDCC LIST\n\n"\
		"NAME CDCC List\n"	"CMD ctcp %%s CDCC LIST\n\n"\
	"NAME ENDSUB\n"			"CMD \n\n"\
	"NAME SUB\n"				"CMD %s\n\n"\
		"NAME %s\n"				"CMD quote KILL %%s :die!\n\n"\
	"NAME ENDSUB\n"			"CMD \n\n"\
	"NAME SUB\n"				"CMD %s\n\n"\
		"NAME %s\n"				"CMD voice %%a\n\n"\
		"NAME %s\n"				"CMD devoice %%a\n"\
		"NAME SEP\n"			"CMD \n\n"\
		"NAME %s\n"				"CMD op %%a\n\n"\
		"NAME %s\n"				"CMD deop %%a\n\n"\
	"NAME ENDSUB\n"			"CMD \n\n"\
	"NAME SUB\n"				"CMD %s\n\n"\
		"NAME %s\n"				"CMD ignore %%s!*@* ALL\n\n"\
		"NAME %s\n"				"CMD unignore %%s!*@*\n\n"\
	"NAME ENDSUB\n"			"CMD \n\n"\
	"NAME SUB\n"				"CMD %s\n\n"\
		"NAME %s\n"				"CMD kick %%s\n\n"\
		"NAME %s\n"				"CMD ban %%s\n\n"\
		"NAME SEP\n"			"CMD \n\n"\
		"NAME %s *!*@*.host\n""CMD ban %%s 0\n\n"\
		"NAME %s *!*@domain\n""CMD ban %%s 1\n\n"\
		"NAME %s *!*user@*.host\n""CMD ban %%s 2\n\n"\
		"NAME %s *!*user@domain\n""CMD ban %%s 3\n\n"\
		"NAME SEP\n"			"CMD \n\n"\
		"NAME %s *!*@*.host\n""CMD kickban %%s 0\n\n"\
		"NAME %s *!*@domain\n""CMD kickban %%s 1\n\n"\
		"NAME %s *!*user@*.host\n""CMD kickban %%s 2\n\n"\
		"NAME %s *!*user@domain\n""CMD kickban %%s 3\n\n"\
	"NAME ENDSUB\n"			"CMD \n\n"\
	"NAME SUB\n"				"CMD %s\n\n"\
		"NAME %s\n"				"CMD quote WHO %%s\n\n"\
		"NAME %s\n"				"CMD quote WHOIS %%s %%s\n\n"\
		"NAME %s\n"				"CMD dns %%s\n\n"\
		"NAME %s\n"				"CMD quote TRACE %%s\n\n"\
		"NAME %s\n"				"CMD quote USERHOST %%s\n\n"\
	"NAME ENDSUB\n"			"CMD \n\n"\
	"NAME SUB\n"				"CMD %s\n\n"\
		"NAME %s\n"				"CMD !"XTERM"/usr/sbin/traceroute %%h\n\n"\
		"NAME %s\n"				"CMD !"XTERM"ping -c 4 %%h\n\n"\
		"NAME %s\n"				"CMD !"XTERM"telnet %%h\n\n"\
	"NAME ENDSUB\n"			"CMD \n\n"\
	"NAME %s\n"					"CMD query %%s\n\n",
		_("Direct client-to-client"),
		_("Send File"),
		_("Offer Chat"),
		_("Abort Chat"),
		_("Version"),
		_("Userinfo"),
		_("Clientinfo"),
		_("Ping"),
		_("Time"),
		_("Finger"),
		_("Oper"),
		_("Kill this user"),
		_("Mode"),
		_("Give Voice"),
		_("Take Voice"),
		_("Give Ops"),
		_("Take Ops"),
		_("Ignore"),
		_("Ignore User"),
		_("UnIgnore User"),
		_("Kick/Ban"),
		_("Kick"),
		_("Ban"),
		_("Ban"),
		_("Ban"),
		_("Ban"),
		_("Ban"),
		_("KickBan"),
		_("KickBan"),
		_("KickBan"),
		_("KickBan"),
		_("Info"),
		_("Who"),
		_("WhoIs"),
		_("DNS Lookup"),
		_("Trace"),
		_("UserHost"),
		_("External"),
		_("Traceroute"),
		_("Ping"),
		_("Telnet"),
		_("Open Dialog Window")
		);
	list_loadconf ("popup.conf", &popup_list, buf);

	snprintf (buf, sizeof (buf),
		"NAME %s\n"				"CMD discon\n\n"
		"NAME %s\n"				"CMD reconnect\n\n"
		"NAME %s\n"				"CMD part\n\n"
		"NAME %s\n"				"CMD getstr # join \"%s\"\n\n"
		"NAME %s\n"				"CMD quote LINKS\n\n"
		"NAME %s\n"				"CMD ping\n\n"
		"NAME TOGGLE %s\n"	"CMD irc_hide_version\n\n",
				_("Disconnect"),
				_("Reconnect"),
				_("Leave Channel"),
				_("Join Channel..."),
				_("Enter Channel to Join:"),
				_("Server Links"),
				_("Ping Server"),
				_("Hide Version"));
	list_loadconf ("usermenu.conf", &usermenu_list, buf);

	snprintf (buf, sizeof (buf),
		"NAME %s\n"		"CMD op %%a\n\n"
		"NAME %s\n"		"CMD deop %%a\n\n"
		"NAME %s\n"		"CMD ban %%s\n\n"
		"NAME %s\n"		"CMD getstr %s \"kick %%s\" \"%s\"\n\n"
		"NAME %s\n"		"CMD dcc send %%s\n\n"
		"NAME %s\n"		"CMD query %%s\n\n",
				_("Op"),
				_("DeOp"),
				_("Ban"),
				_("Kick"),
				_("bye"),
				_("Enter reason to kick %s:"),
				_("Sendfile"),
				_("Dialog"));
	list_loadconf ("buttons.conf", &button_list, buf);

	snprintf (buf, sizeof (buf),
		"NAME %s\n"				"CMD whois %%s %%s\n\n"
		"NAME %s\n"				"CMD dcc send %%s\n\n"
		"NAME %s\n"				"CMD dcc chat %%s\n\n"
		"NAME %s\n"				"CMD clear\n\n"
		"NAME %s\n"				"CMD ping %%s\n\n",
				_("WhoIs"),
				_("Send"),
				_("Chat"),
				_("Clear"),
				_("Ping"));
	list_loadconf ("dlgbuttons.conf", &dlgbutton_list, buf);

	list_loadconf ("tabmenu.conf", &tabmenu_list, NULL);
	list_loadconf ("ctcpreply.conf", &ctcp_list, defaultconf_ctcp);
	list_loadconf ("commands.conf", &command_list, defaultconf_commands);
	list_loadconf ("replace.conf", &replace_list, defaultconf_replace);
	list_loadconf ("urlhandlers.conf", &urlhandler_list,
						defaultconf_urlhandlers);

	servlist_init ();							/* load server list */

	if (!prefs.slist_skip)
		fe_serverlist_open (NULL);

	/* turned OFF via -a arg */
	if (auto_connect)
	{
		/* do any auto connects */
		if (!servlist_have_auto ())	/* if no new windows open .. */
		{
			/* and no serverlist gui ... */
			if (prefs.slist_skip || connect_url)
				/* we'll have to open one. */
				new_ircwindow (NULL, NULL, SESS_SERVER);
		} else
		{
			fe_idle_add (xchat_auto_connect, NULL);
		}
	} else
	{
		if (prefs.slist_skip)
			new_ircwindow (NULL, NULL, SESS_SERVER);
	}
}

void
xchat_exit (void)
{
	xchat_is_quitting = TRUE;
	in_xchat_exit = TRUE;
	plugin_kill_all ();
	fe_cleanup ();
	if (prefs.autosave)
	{
		save_config ();
		pevent_save (NULL);
	}
	if (prefs.autosave_url)
		url_autosave ();
	notify_save ();
	ignore_save ();
	free_sessions ();
	fe_exit ();
}

#ifndef WIN32

static int
child_handler (gpointer userdata)
{
	int pid = GPOINTER_TO_INT (userdata);

	if (waitpid (pid, 0, WNOHANG) == pid)
		return 0;					  /* remove timeout handler */
	return 1;						  /* keep the timeout handler */
}

#endif

void
xchat_exec (char *cmd)
{
#ifdef WIN32
	util_exec (cmd);
#else
	int pid = util_exec (cmd);
	if (pid != -1)
	/* zombie avoiding system. Don't ask! it has to be like this to work
      with zvt (which overrides the default handler) */
		fe_timeout_add (1000, child_handler, GINT_TO_POINTER (pid));
#endif
}

int
main (int argc, char *argv[])
{

#ifdef SOCKS
	SOCKSinit (argv[0]);
#endif

	if (!fe_args (argc, argv))
		return 0;

	load_config ();

	fe_init ();

	xchat_init ();

	fe_main ();

#ifdef USE_OPENSSL
	if (ctx)
		_SSL_context_free (ctx);
#endif

#ifdef USE_DEBUG
	xchat_mem_list ();
#endif

#ifdef WIN32
	WSACleanup ();
#endif

	return 0;
}
