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
 *
 * Wayne Conrad, 3 Apr 1999: Color-coded DCC file transfer status windows
 * Bernhard Valenti <bernhard.valenti@gmx.net> 2000-11-21: Fixed DCC send behind nat
 *
 * 2001-03-08 Added support for getting "dcc_ip" config parameter.
 * Jim Seymour (jseymour@LinxNet.com)
 */

/* we only use 32 bits, but without this define, you get only 31! */
#define _FILE_OFFSET_BITS 64
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <errno.h>
#include <sys/stat.h>
#include <unistd.h>
#include <fcntl.h>

#define WANTSOCKET
#define WANTARPA
#define WANTDNS
#include "inet.h"

#ifdef WIN32
#include <windows.h>
#endif

#include "xchat.h"
#include "util.h"
#include "fe.h"
#include "outbound.h"
#include "inbound.h"
#include "network.h"
#include "plugin.h"
#include "server.h"
#include "text.h"
#include "url.h"
#include "xchatc.h"


static char *dcctypes[] = { "SEND", "RECV", "CHAT", "CHAT" };

struct dccstat_info dccstat[] = {
	{N_("Waiting"), 1 /*black */ },
	{N_("Active"), 12 /*cyan */ },
	{N_("Failed"), 4 /*red */ },
	{N_("Done"), 3 /*green */ },
	{N_("Connect"), 1 /*black */ },
	{N_("Aborted"), 4 /*red */ },
};

static int dcc_global_throttle;	/* 0x1 = sends, 0x2 = gets */
static int dcc_sendcpssum, dcc_getcpssum;

static struct DCC *new_dcc (void);
static void dcc_close (struct DCC *dcc, int dccstat, int destroy);
static gboolean dcc_send_data (GIOChannel *, GIOCondition, struct DCC *);
static gboolean dcc_read (GIOChannel *, GIOCondition, struct DCC *);
static gboolean dcc_read_ack (GIOChannel *source, GIOCondition condition, struct DCC *dcc);

static int new_id()
{
	static int id = 1;
	return id++;
}

static double
timeval_diff (GTimeVal *greater,
				 GTimeVal *less)
{
	long usecdiff;
	double result;
	
	result = greater->tv_sec - less->tv_sec;
	usecdiff = (long) greater->tv_usec - less->tv_usec;
	result += (double) usecdiff / 1000000;
	
	return result;
}

static void
dcc_unthrottle (struct DCC *dcc)
{
	/* don't unthrottle here, but delegate to funcs */
	if (dcc->type == TYPE_RECV)
		dcc_read (NULL, 0, dcc);
	else
		dcc_send_data (NULL, 0, dcc);
}

static void
dcc_calc_cps (struct DCC *dcc)
{
	GTimeVal now;
	int oldcps;
	double timediff, startdiff;
	int glob_throttle_bit, wasthrottled;
	int *cpssum, glob_limit;
	unsigned int pos, posdiff;

	g_get_current_time (&now);

	/* the pos we use for sends is an average
		between pos and ack */
	if (dcc->type == TYPE_SEND)
	{
		/* carefull to avoid 32bit overflow */
		pos = dcc->pos - ((dcc->pos - dcc->ack) / 2);
		glob_throttle_bit = 0x1;
		cpssum = &dcc_sendcpssum;
		glob_limit = prefs.dcc_global_max_send_cps;
	}
	else
	{
		pos = dcc->pos;
		glob_throttle_bit = 0x2;
		cpssum = &dcc_getcpssum;
		glob_limit = prefs.dcc_global_max_get_cps;
	}

	if (!dcc->firstcpstv.tv_sec && !dcc->firstcpstv.tv_usec)
		dcc->firstcpstv = now;
	else
	{
		startdiff = timeval_diff (&now, &dcc->firstcpstv);
		if (startdiff < 1)
			startdiff = 1;
		else if (startdiff > CPS_AVG_WINDOW)
			startdiff = CPS_AVG_WINDOW;

		timediff = timeval_diff (&now, &dcc->lastcpstv);
		if (timediff > startdiff)
			timediff = startdiff = 1;

		posdiff = pos - dcc->lastcpspos;
		oldcps = dcc->cps;
		dcc->cps = ((double) posdiff / timediff) * (timediff / startdiff) +
			(double) dcc->cps * (1.0 - (timediff / startdiff));

		*cpssum += dcc->cps - oldcps;
	}

	dcc->lastcpspos = pos;
	dcc->lastcpstv = now;

	/* now check cps against set limits... */
	wasthrottled = dcc->throttled;

	/* check global limits first */
	dcc->throttled &= ~0x2;
	if (glob_limit > 0 && *cpssum >= glob_limit)
	{
		dcc_global_throttle |= glob_throttle_bit;
		if (dcc->maxcps >= 0)
			dcc->throttled |= 0x2;
	}
	else
		dcc_global_throttle &= ~glob_throttle_bit;

	/* now check per-connection limit */
	if (dcc->maxcps > 0 && dcc->cps > dcc->maxcps)
		dcc->throttled |= 0x1;
	else
		dcc->throttled &= ~0x1;

	/* take action */
	if (wasthrottled && !dcc->throttled)
		dcc_unthrottle (dcc);
}

static void
dcc_remove_from_sum (struct DCC *dcc)
{
	if (dcc->dccstat != STAT_ACTIVE)
		return;
	if (dcc->type == TYPE_SEND)
		dcc_sendcpssum -= dcc->cps;
	else if (dcc->type == TYPE_RECV)
		dcc_getcpssum -= dcc->cps;
}

/* this is called from xchat.c:xchat_misc_checks() every 2 seconds. */

void
dcc_check_timeouts (void)
{
	struct DCC *dcc;
	time_t tim = time (0);
	GSList *next, *list = dcc_list;

	while (list)
	{
		dcc = (struct DCC *) list->data;
		next = list->next;

		switch (dcc->dccstat)
		{
		case STAT_ACTIVE:
			dcc_calc_cps (dcc);
			fe_dcc_update (dcc);

			if (dcc->type == TYPE_SEND || dcc->type == TYPE_RECV)
			{
				if (prefs.dccstalltimeout > 0)
				{
					if (!dcc->throttled
						&& tim - dcc->lasttime > prefs.dccstalltimeout)
					{
						EMIT_SIGNAL (XP_TE_DCCSTALL, dcc->serv->front_session,
										 dcctypes[dcc->type],
										 file_part (dcc->file), dcc->nick, NULL, 0);
						dcc_close (dcc, STAT_ABORTED, FALSE);
					}
				}
			}
			break;
		case STAT_QUEUED:
			if (dcc->type == TYPE_SEND || dcc->type == TYPE_CHATSEND)
			{
				if (tim - dcc->offertime > prefs.dcctimeout)
				{
					if (prefs.dcctimeout > 0)
					{
						EMIT_SIGNAL (XP_TE_DCCTOUT, dcc->serv->front_session,
										 dcctypes[dcc->type],
										 file_part (dcc->file), dcc->nick, NULL, 0);
						dcc_close (dcc, STAT_ABORTED, FALSE);
					}
				}
			}
			break;
		case STAT_DONE:
		case STAT_FAILED:
		case STAT_ABORTED:
			if (prefs.dcc_remove)
				dcc_close (dcc, 0, TRUE);
			break;
		}
		list = next;
	}
}

static int
dcc_connect_sok (struct DCC *dcc)
{
	int sok;
	struct sockaddr_in addr;

	sok = socket (AF_INET, SOCK_STREAM, 0);
	if (sok == -1)
		return -1;

	memset (&addr, 0, sizeof (addr));
	addr.sin_port = htons (dcc->port);
	addr.sin_family = AF_INET;
	addr.sin_addr.s_addr = htonl (dcc->addr);

	set_nonblocking (sok);
	connect (sok, (struct sockaddr *) &addr, sizeof (addr));

	return sok;
}

static void
dcc_close (struct DCC *dcc, int dccstat, int destroy)
{
	if (dcc->wiotag)
	{
		fe_input_remove (dcc->wiotag);
		dcc->wiotag = 0;
	}

	if (dcc->iotag)
	{
		fe_input_remove (dcc->iotag);
		dcc->iotag = 0;
	}

	if (dcc->sok != -1)
	{
		closesocket (dcc->sok);
		dcc->sok = -1;
	}

	dcc_remove_from_sum (dcc);

	if (dcc->fp != -1)
	{
		close (dcc->fp);
		dcc->fp = -1;

		if(dccstat == STAT_DONE)
		{
			/* if we just completed a dcc recieve, move the */
			/* completed file to the completed directory */
			if(dcc->type == TYPE_RECV)
			{			
				/* mgl: change this to use destfile_fs for correctness and to */
				/* handle the case where dccwithnick is set */
				download_move_to_completed_dir(prefs.dccdir, prefs.dcc_completed_dir, 
					dcc->destfile_fs, prefs.dccpermissions);
			}

		}
	}

	dcc->dccstat = dccstat;
	if (dcc->dccchat)
	{
		free (dcc->dccchat);
		dcc->dccchat = NULL;
	}

	if (destroy)
	{
		dcc_list = g_slist_remove (dcc_list, dcc);
		fe_dcc_remove (dcc);
		if (dcc->file)
			free (dcc->file);
		if (dcc->destfile)
			g_free (dcc->destfile);
		if (dcc->destfile_fs)
			g_free (dcc->destfile_fs);
		free (dcc->nick);
		free (dcc);
		return;
	}

	fe_dcc_update (dcc);
}

void
dcc_abort (session *sess, struct DCC *dcc)
{
	if (dcc)
	{
		switch (dcc->dccstat)
		{
		case STAT_QUEUED:
		case STAT_CONNECTING:
		case STAT_ACTIVE:
			dcc_close (dcc, STAT_ABORTED, FALSE);
			switch (dcc->type)
			{
			case TYPE_CHATSEND:
			case TYPE_CHATRECV:
				EMIT_SIGNAL (XP_TE_DCCCHATABORT, sess, dcc->nick, NULL, NULL,
								 NULL, 0);
				break;
			case TYPE_SEND:
				EMIT_SIGNAL (XP_TE_DCCSENDABORT, sess, dcc->nick,
								 file_part (dcc->file), NULL, NULL, 0);
				break;
			case TYPE_RECV:
				EMIT_SIGNAL (XP_TE_DCCRECVABORT, sess, dcc->nick,
								 dcc->file, NULL, NULL, 0);
			}
			break;
		default:
			dcc_close (dcc, 0, TRUE);
		}
	}
}

void
dcc_notify_kill (struct server *serv)
{
	struct server *replaceserv = 0;
	struct DCC *dcc;
	GSList *list = dcc_list;
	if (serv_list)
		replaceserv = (struct server *) serv_list->data;
	while (list)
	{
		dcc = (struct DCC *) list->data;
		if (dcc->serv == serv)
			dcc->serv = replaceserv;
		list = list->next;
	}
}

struct DCC *
dcc_write_chat (char *nick, char *text)
{
	struct DCC *dcc;

	dcc = find_dcc (nick, "", TYPE_CHATRECV);
	if (!dcc)
		dcc = find_dcc (nick, "", TYPE_CHATSEND);
	if (dcc && dcc->dccstat == STAT_ACTIVE)
	{
		char *locale;
		gsize loc_len;
		int len;

		len = strlen (text);

		if (dcc->serv->encoding == NULL)	/* system */
		{
			locale = NULL;
			if (!prefs.utf8_locale)
				locale = g_locale_from_utf8 (text, len, NULL, &loc_len, NULL);
		} else
		{
			locale = g_convert (text, len, dcc->serv->encoding, "UTF-8", 0, &loc_len, 0);
		}

		if (locale)
		{
			text = locale;
			len = loc_len;
		}

		dcc->size += len;
		send (dcc->sok, text, len, 0);
		send (dcc->sok, "\n", 1, 0);
		fe_dcc_update (dcc);
		if (locale)
			g_free (locale);
		return dcc;
	}
	return 0;
}

/* returns: 0 - ok
				1 - the dcc is closed! */

static int
dcc_chat_line (struct DCC *dcc, char *line, char *tbuf)
{
	session *sess;
	char *word[PDIWORDS];
	char *po;
	char *utf;
	char *conv;
	int ret, i;
	int len;
	gsize utf_len;

	len = strlen (line);

	if (dcc->serv->encoding == NULL)     /* system */
		utf = g_locale_to_utf8 (line, len, NULL, &utf_len, NULL);
	else
		utf = g_convert (line, len, "UTF-8", dcc->serv->encoding, 0, &utf_len, 0);

	if (utf)
	{
		line = utf;
		len = utf_len;
	}

	/* we really need valid UTF-8 now */
	conv = text_validate (&line, &len);

	sess = find_dialog (dcc->serv, dcc->nick);
	if (!sess)
		sess = dcc->serv->front_session;

	sprintf (tbuf, "%d", dcc->port);

	word[0] = "DCC Chat Text";
	word[1] = net_ip (dcc->addr);
	word[2] = tbuf;
	word[3] = dcc->nick;
	word[4] = line;
	for (i = 5; i < PDIWORDS; i++)
		word[i] = "\000";

	ret = plugin_emit_print (sess, word);

	/* did the plugin close it? */
	if (!g_slist_find (dcc_list, dcc))
	{
		if (utf)
			g_free (utf);
		if (conv)
			g_free (conv);
		return 1;
	}

	/* did the plugin eat the event? */
	if (ret)
	{
		if (utf)
			g_free (utf);
		if (conv)
			g_free (conv);
		return 0;
	}

	url_check (line);

	if (line[0] == 1 && !strncasecmp (line + 1, "ACTION", 6))
	{
		po = strchr (line + 8, '\001');
		if (po)
			po[0] = 0;
		inbound_action (sess, dcc->serv->nick, dcc->nick, line + 8, FALSE);
	} else
	{
		inbound_privmsg (dcc->serv, dcc->nick, "", line);
	}
	if (utf)
		g_free (utf);
	if (conv)
		g_free (conv);
	return 0;
}

static gboolean
dcc_read_chat (GIOChannel *source, GIOCondition condition, struct DCC *dcc)
{
	int i, len, dead;
	char tbuf[1226];
	char lbuf[1026];
	char *temp;

	while (1)
	{
		if (dcc->throttled)
		{
			fe_input_remove (dcc->iotag);
			dcc->iotag = 0;
			return FALSE;
		}

		if (!dcc->iotag)
			dcc->iotag = fe_input_add (dcc->sok, FIA_READ|FIA_EX, dcc_read, dcc);

		len = recv (dcc->sok, lbuf, sizeof (lbuf) - 2, 0);
		if (len < 1)
		{
			if (len < 0)
			{
				if (would_block_again ())
					return TRUE;
			}
			sprintf (tbuf, "%d", dcc->port);
			EMIT_SIGNAL (XP_TE_DCCCHATF, dcc->serv->front_session, dcc->nick,
							 net_ip (dcc->addr), tbuf,
							 errorstring ((len < 0) ? sock_error () : 0), 0);
			dcc_close (dcc, STAT_FAILED, FALSE);
			return TRUE;
		}
		i = 0;
		lbuf[len] = 0;
		while (i < len)
		{
			switch (lbuf[i])
			{
			case '\r':
				break;
			case '\n':
				dcc->dccchat->linebuf[dcc->dccchat->pos] = 0;

				if (prefs.stripcolor)
				{
					temp = strip_color (dcc->dccchat->linebuf);
					dead = dcc_chat_line (dcc, temp, tbuf);
					free (temp);
				} else
				{
					dead = dcc_chat_line (dcc, dcc->dccchat->linebuf, tbuf);
				}

				if (dead || !dcc->dccchat) /* the dcc has been closed, don't use (DCC *)! */
					return TRUE;

				dcc->pos += dcc->dccchat->pos;
				dcc->dccchat->pos = 0;
				fe_dcc_update (dcc);
				break;
			default:
				dcc->dccchat->linebuf[dcc->dccchat->pos] = lbuf[i];
				if (dcc->dccchat->pos < 1022)
					dcc->dccchat->pos++;
			}
			i++;
		}
	}
}

static void
dcc_calc_average_cps (struct DCC *dcc)
{
	time_t sec;

	sec = time (0) - dcc->starttime;
	if (sec < 1)
		sec = 1;
	if (dcc->type == TYPE_SEND)
		dcc->cps = (dcc->ack - dcc->resumable) / sec;
	else
		dcc->cps = (dcc->pos - dcc->resumable) / sec;
}

static gboolean
dcc_read (GIOChannel *source, GIOCondition condition, struct DCC *dcc)
{
	char *old;
	char buf[4096];
	guint32 pos;
	int n;

	if (dcc->fp == -1)
	{

		/* try to create the download dir (even if it exists, no harm) */
		mkdir_utf8 (prefs.dccdir);

		if (dcc->resumable)
		{
			dcc->fp = open (dcc->destfile_fs, O_WRONLY | O_APPEND | OFLAGS);
			dcc->pos = dcc->resumable;
			dcc->ack = dcc->resumable;
		} else
		{
			if (access (dcc->destfile_fs, F_OK) == 0)
			{
				n = 0;
				do
				{
					n++;
					snprintf (buf, sizeof (buf), "%s.%d", dcc->destfile_fs, n);
				}
				while (access (buf, F_OK) == 0);

				g_free (dcc->destfile_fs);
				dcc->destfile_fs = g_strdup (buf);

				old = dcc->destfile;
				dcc->destfile = g_filename_to_utf8 (buf, -1, 0, 0, 0);

				EMIT_SIGNAL (XP_TE_DCCRENAME, dcc->serv->front_session,
								 old, dcc->destfile, NULL, NULL, 0);
				g_free (old);
			}
			dcc->fp =
				open (dcc->destfile_fs, OFLAGS | O_TRUNC | O_WRONLY | O_CREAT,
						prefs.dccpermissions);
		}
	}
	if (dcc->fp == -1)
	{
		/* the last executed function is open(), errno should be valid */
		EMIT_SIGNAL (XP_TE_DCCFILEERR, dcc->serv->front_session, dcc->destfile,
						 errorstring (errno), NULL, NULL, 0);
		dcc_close (dcc, STAT_FAILED, FALSE);
		return TRUE;
	}
	while (1)
	{
		if (dcc->throttled)
		{
			fe_input_remove (dcc->iotag);
			dcc->iotag = 0;
			return FALSE;
		}

		if (!dcc->iotag)
			dcc->iotag = fe_input_add (dcc->sok, FIA_READ|FIA_EX, dcc_read, dcc);

		n = recv (dcc->sok, buf, sizeof (buf), 0);
		if (n < 1)
		{
			if (n < 0)
			{
				if (would_block_again ())
					return TRUE;
			}
			EMIT_SIGNAL (XP_TE_DCCRECVERR, dcc->serv->front_session, dcc->file,
							 dcc->destfile, dcc->nick,
							 errorstring ((n < 0) ? sock_error () : 0), 0);
			dcc_close (dcc, STAT_FAILED, FALSE);
			return TRUE;
		}

		if (write (dcc->fp, buf, n) == -1) /* could be out of hdd space */
		{
			EMIT_SIGNAL (XP_TE_DCCRECVERR, dcc->serv->front_session, dcc->file,
							 dcc->destfile, dcc->nick, errorstring (errno), 0);
			dcc_close (dcc, STAT_FAILED, FALSE);
			return TRUE;
		}
		dcc->pos += n;
		pos = htonl (dcc->pos);
		send (dcc->sok, (char *) &pos, 4, 0);

		dcc->lasttime = time (0);

		if (dcc->pos >= dcc->size)
		{
			dcc_calc_average_cps (dcc);
			sprintf (buf, "%d", dcc->cps);
			dcc_close (dcc, STAT_DONE, FALSE);
			EMIT_SIGNAL (XP_TE_DCCRECVCOMP, dcc->serv->front_session,
							 dcc->file, dcc->destfile, dcc->nick, buf, 0);
			return TRUE;
		}

		dcc_calc_cps (dcc);
	}
}

static gboolean
dcc_connect_finished (GIOChannel *source, GIOCondition condition, struct DCC *dcc)
{
	int er;
	char host[128];
	struct sockaddr_in addr;

	if (dcc->iotag)
	{
		fe_input_remove (dcc->iotag);
		dcc->iotag = 0;
	}

#ifdef WIN32
	if (condition & G_IO_ERR)
	{
		int len;

		/* find the last errno for this socket */
		len = sizeof (er);
		getsockopt (dcc->sok, SOL_SOCKET, SO_ERROR, (char *)&er, &len);
		EMIT_SIGNAL (XP_TE_DCCCONFAIL, dcc->serv->front_session,
						 dcctypes[dcc->type], dcc->nick, errorstring (er),
						 NULL, 0);
		dcc->dccstat = STAT_FAILED;
		fe_dcc_update (dcc);
		return TRUE;
	}

#else
	memset (&addr, 0, sizeof (addr));
	addr.sin_port = htons (dcc->port);
	addr.sin_family = AF_INET;
	addr.sin_addr.s_addr = htonl (dcc->addr);

	/* check if it's already connected; This always fails on winXP */
	if (connect (dcc->sok, (struct sockaddr *) &addr, sizeof (addr)) != 0)
	{
		er = sock_error ();
#ifndef WIN32
		if (er != EISCONN)
#else
		if (er != WSAEISCONN)
#endif
		{
			EMIT_SIGNAL (XP_TE_DCCCONFAIL, dcc->serv->front_session,
							 dcctypes[dcc->type], dcc->nick, errorstring (er),
							 NULL, 0);
			dcc->dccstat = STAT_FAILED;
			fe_dcc_update (dcc);
			return TRUE;
		}
	}
#endif

	dcc->dccstat = STAT_ACTIVE;
	snprintf (host, sizeof host, "%s:%d", net_ip (dcc->addr), dcc->port);

	switch (dcc->type)
	{
	case TYPE_RECV:
		dcc->iotag = fe_input_add (dcc->sok, FIA_READ|FIA_EX, dcc_read, dcc);
		EMIT_SIGNAL (XP_TE_DCCCONRECV, dcc->serv->front_session,
						 dcc->nick, host, dcc->file, NULL, 0);
		break;
	case TYPE_SEND:
		/* passive send */
		dcc->fastsend = prefs.fastdccsend;
		if (dcc->fastsend)
			dcc->wiotag = fe_input_add (dcc->sok, FIA_WRITE, dcc_send_data, dcc);
		dcc->iotag = fe_input_add (dcc->sok, FIA_READ|FIA_EX, dcc_read_ack, dcc);
		dcc_send_data (NULL, 0, (gpointer)dcc);
		EMIT_SIGNAL (XP_TE_DCCCONSEND, dcc->serv->front_session,
						 dcc->nick, host, dcc->file, NULL, 0);
		break;
	case TYPE_CHATRECV:
		dcc->iotag = fe_input_add (dcc->sok, FIA_READ|FIA_EX, dcc_read_chat, dcc);
		dcc->dccchat = malloc (sizeof (struct dcc_chat));
		dcc->dccchat->pos = 0;
		EMIT_SIGNAL (XP_TE_DCCCONCHAT, dcc->serv->front_session,
						 dcc->nick, host, NULL, NULL, 0);
		break;
	}
	dcc->starttime = time (0);
	dcc->lasttime = dcc->starttime;
	fe_dcc_update (dcc);

	return TRUE;
}

static int dcc_listen_init (struct DCC *, struct session *);

static void
dcc_connect (struct DCC *dcc)
{
	int ret;
	char tbuf[400];

	if (dcc->dccstat == STAT_CONNECTING)
		return;
	dcc->dccstat = STAT_CONNECTING;

	if (dcc->pasvid && dcc->port == 0)
	{
		/* accepted a passive dcc send */
		ret = dcc_listen_init (dcc, dcc->serv->front_session);
		if (!ret)
		{
			dcc_close (dcc, STAT_FAILED, FALSE);
			return;
		}
		/* possible problems with filenames containing spaces? */
		if (dcc->type == TYPE_RECV)
			snprintf (tbuf, sizeof (tbuf), strchr (dcc->file, ' ') ?
					"DCC SEND \"%s\" %lu %d %u %d" :
					"DCC SEND %s %lu %d %u %d", dcc->file,
					dcc->addr, dcc->port, dcc->size, dcc->pasvid);
		else
			snprintf (tbuf, sizeof (tbuf), "DCC CHAT chat %lu %d %d",
				dcc->addr, dcc->port, dcc->pasvid);
		dcc->serv->p_ctcp (dcc->serv, dcc->nick, tbuf);
	}
	else
	{
		dcc->sok = dcc_connect_sok (dcc);
		if (dcc->sok == -1)
		{
			dcc->dccstat = STAT_FAILED;
			fe_dcc_update (dcc);
			return;
		}
		dcc->iotag = fe_input_add (dcc->sok, FIA_WRITE|FIA_EX, dcc_connect_finished, dcc);
	}
	
	fe_dcc_update (dcc);
}

static gboolean
dcc_send_data (GIOChannel *source, GIOCondition condition, struct DCC *dcc)
{
	char *buf;
	int len, sent, sok = dcc->sok;

	if (prefs.dcc_blocksize < 1) /* this is too little! */
		prefs.dcc_blocksize = 1024;

	if (prefs.dcc_blocksize > 102400)	/* this is too much! */
		prefs.dcc_blocksize = 102400;

	if (dcc->throttled)
	{
		fe_input_remove (dcc->wiotag);
		dcc->wiotag = 0;
		return FALSE;
	}

	if (!dcc->fastsend)
	{
		if (dcc->ack < dcc->pos)
			return TRUE;
	}
	else if (!dcc->wiotag)
		dcc->wiotag = fe_input_add (sok, FIA_WRITE, dcc_send_data, dcc);

	buf = malloc (prefs.dcc_blocksize);
	if (!buf)
		return TRUE;

	lseek (dcc->fp, dcc->pos, SEEK_SET);
	len = read (dcc->fp, buf, prefs.dcc_blocksize);
	if (len < 1)
		goto abortit;
	sent = send (sok, buf, len, 0);

	if (sent < 0 && !(would_block ()))
	{
abortit:
		free (buf);
		EMIT_SIGNAL (XP_TE_DCCSENDFAIL, dcc->serv->front_session,
						 file_part (dcc->file), dcc->nick,
						 errorstring (sock_error ()), NULL, 0);
		dcc_close (dcc, STAT_FAILED, FALSE);
		return TRUE;
	}
	if (sent > 0)
	{
		dcc->pos += sent;
		dcc->lasttime = time (0);
		dcc_calc_cps (dcc);
	}

	/* have we sent it all yet? */
	if (dcc->pos >= dcc->size)
	{
		/* it's all sent now, so remove the WRITE/SEND handler */
		if (dcc->wiotag)
		{
			fe_input_remove (dcc->wiotag);
			dcc->wiotag = 0;
		}
	}

	free (buf);

	return TRUE;
}

static gboolean
dcc_read_ack (GIOChannel *source, GIOCondition condition, struct DCC *dcc)
{
	int len;
	guint32 ack;
	char buf[16];
	int sok = dcc->sok;

	len = recv (sok, (char *) &ack, 4, MSG_PEEK);
	if (len < 1)
	{
		if (len < 0)
		{
			if (would_block_again ())
				return TRUE;
		}
		EMIT_SIGNAL (XP_TE_DCCSENDFAIL, dcc->serv->front_session,
						 file_part (dcc->file), dcc->nick,
						 errorstring ((len < 0) ? sock_error () : 0), NULL, 0);
		dcc_close (dcc, STAT_FAILED, FALSE);
		return TRUE;
	}
	if (len < 4)
		return TRUE;
	recv (sok, (char *) &ack, 4, 0);
	dcc->ack = ntohl (ack);

	/* fix for BitchX */
	if (dcc->ack < dcc->resumable)
		dcc->ackoffset = TRUE;
	if (dcc->ackoffset)
		dcc->ack += dcc->resumable;

	/* DCC complete check */
	if (dcc->pos >= dcc->size && dcc->ack >= dcc->size)
	{
		dcc_calc_average_cps (dcc);
		dcc_close (dcc, STAT_DONE, FALSE);
		sprintf (buf, "%d", dcc->cps);
		EMIT_SIGNAL (XP_TE_DCCSENDCOMP, dcc->serv->front_session,
						 file_part (dcc->file), dcc->nick, buf, NULL, 0);
	}
	else if ((!dcc->fastsend) && (dcc->ack >= dcc->pos))
	{
		dcc_send_data (NULL, 0, (gpointer)dcc);
	}

	return TRUE;
}

static gboolean
dcc_accept (GIOChannel *source, GIOCondition condition, struct DCC *dcc)
{
	char host[128];
	struct sockaddr_in CAddr;
	int sok;
	socklen_t len;

	len = sizeof (CAddr);
	sok = accept (dcc->sok, (struct sockaddr *) &CAddr, &len);
	fe_input_remove (dcc->iotag);
	dcc->iotag = 0;
	closesocket (dcc->sok);
	if (sok < 0)
	{
		dcc->sok = -1;
		dcc_close (dcc, STAT_FAILED, FALSE);
		return TRUE;
	}
	set_nonblocking (sok);
	dcc->sok = sok;
	dcc->addr = ntohl (CAddr.sin_addr.s_addr);

	if (dcc->pasvid)
		return dcc_connect_finished (NULL, 0, dcc);

	dcc->dccstat = STAT_ACTIVE;
	dcc->lasttime = dcc->starttime = time (0);
	dcc->fastsend = prefs.fastdccsend;

	snprintf (host, sizeof (host), "%s:%d", net_ip (dcc->addr), dcc->port);

	switch (dcc->type)
	{
	case TYPE_SEND:
		if (dcc->fastsend)
			dcc->wiotag = fe_input_add (sok, FIA_WRITE, dcc_send_data, dcc);
		dcc->iotag = fe_input_add (sok, FIA_READ|FIA_EX, dcc_read_ack, dcc);
		dcc_send_data (NULL, 0, (gpointer)dcc);
		EMIT_SIGNAL (XP_TE_DCCCONSEND, dcc->serv->front_session,
						 dcc->nick, host, dcc->file, NULL, 0);
		break;

	case TYPE_CHATSEND:
		if (prefs.autodialog)
		{
			char *cmd = malloc (8 + strlen (dcc->nick));
			sprintf (cmd, "query %s", dcc->nick);
			handle_command (dcc->serv->server_session, cmd, FALSE);
			free (cmd);
		}
		dcc->iotag = fe_input_add (dcc->sok, FIA_READ|FIA_EX, dcc_read_chat, dcc);
		dcc->dccchat = malloc (sizeof (struct dcc_chat));
		dcc->dccchat->pos = 0;
		EMIT_SIGNAL (XP_TE_DCCCONCHAT, dcc->serv->front_session,
						 dcc->nick, host, NULL, NULL, 0);
		break;
	}

	fe_dcc_update (dcc);

	return TRUE;
}

static int
dcc_listen_init (struct DCC *dcc, session *sess)
{
	unsigned long my_addr;
	struct sockaddr_in SAddr;
	struct hostent *dns_query;
	int i, bindretval = -1;
	socklen_t len;

	dcc->sok = socket (AF_INET, SOCK_STREAM, 0);
	if (dcc->sok == -1)
		return FALSE;

	memset (&SAddr, 0, sizeof (struct sockaddr_in));

	len = sizeof (SAddr);
	getsockname (dcc->serv->sok, (struct sockaddr *) &SAddr, &len);

	SAddr.sin_family = AF_INET;

	/*if local_ip is specified use that*/
	if (prefs.local_ip != 0)
	{
		my_addr = prefs.local_ip;
		SAddr.sin_addr.s_addr = prefs.local_ip;
	}
	/*otherwise use the default*/
	else
		my_addr = SAddr.sin_addr.s_addr;

	/*if we have a valid portrange try to use that*/
	if (prefs.first_dcc_send_port > 0)
	{
		SAddr.sin_port = 0;
		i = 0;
		while ((prefs.last_dcc_send_port > ntohs(SAddr.sin_port)) &&
				(bindretval == -1))
		{
			SAddr.sin_port = htons (prefs.first_dcc_send_port + i);
			i++;
			/*printf("Trying to bind against port: %d\n",ntohs(SAddr.sin_port));*/
			bindretval = bind (dcc->sok, (struct sockaddr *) &SAddr, sizeof (SAddr));
		}
	} else
	{
		/* try random port */
		SAddr.sin_port = 0;
		bindretval = bind (dcc->sok, (struct sockaddr *) &SAddr, sizeof (SAddr));
	}

	if (bindretval == -1)
	{
		/* failed to bind */
		PrintText (sess, "Failed to bind to any address or port.\n");
		return FALSE;
	}

	len = sizeof (SAddr);
	getsockname (dcc->sok, (struct sockaddr *) &SAddr, &len);

	dcc->port = ntohs (SAddr.sin_port);

	/*if we have a dcc_ip, we use that, so the remote client can connect*/
	/*else we try to take an address from dcc_ip_str*/
	/*if something goes wrong we tell the client to connect to our LAN ip*/

	dcc->addr = 0;

	if (prefs.ip_from_server != 0 && prefs.dcc_ip != 0)
		dcc->addr = prefs.dcc_ip;
	else if (prefs.dcc_ip_str[0])
	{
	   dns_query = gethostbyname ((const char *) prefs.dcc_ip_str);

	   if (dns_query != NULL &&
	       dns_query->h_length == 4 &&
	       dns_query->h_addr_list[0] != NULL)
		  {
		    /*we're offered at least one IPv4 address: we take the first*/

		    dcc->addr = (unsigned long) *((guint32*) dns_query->h_addr_list[0]);
		  }
	}

	/*if nothing else worked we use the address we bound to*/
	if (dcc->addr == 0)
	   dcc->addr = my_addr;

	dcc->addr = ntohl (dcc->addr);

	set_nonblocking (dcc->sok);
	listen (dcc->sok, 1);
	set_blocking (dcc->sok);

	dcc->iotag = fe_input_add (dcc->sok, FIA_READ|FIA_EX, dcc_accept, dcc);

	return TRUE;
}

static struct session *dccsess;
static char *dccto;				  /* lame!! */
static int dccmaxcps;
static int recursive = FALSE;

static void
dcc_send_wild (char *file)
{
	dcc_send (dccsess, dccto, file, dccmaxcps, 0);
}

void
dcc_send (struct session *sess, char *to, char *file, int maxcps, int passive)
{
	char outbuf[512];
	struct stat st;
	struct DCC *dcc;
	char *file_fs;

	/* this is utf8 */
	file = expand_homedir (file);

	if (!recursive && (strchr (file, '*') || strchr (file, '?')))
	{
		char path[256];
		char wild[256];

		safe_strcpy (wild, file_part (file), sizeof (wild));
		path_part (file, path, sizeof (path));
		if (path[0] != '/' || path[1] != '\0')
			path[strlen (path) - 1] = 0;	/* remove trailing slash */

		dccsess = sess;
		dccto = to;
		dccmaxcps = maxcps;

		free (file);

		recursive = TRUE;
		for_files (path, wild, dcc_send_wild);
		recursive = FALSE;

		return;
	}

	dcc = new_dcc ();
	if (!dcc)
		return;
	dcc->file = file;
	dcc->maxcps = maxcps;

	/* get the local filesystem encoding */
	file_fs = g_filename_from_utf8 (file, -1, 0, 0, 0);

	if (stat (file_fs, &st) != -1)
	{
		if (sizeof (st.st_size) > 4 && st.st_size > 4294967295U)
		{
			PrintText (sess, "Cannot send files larger than 4 GB.\n");
			goto noaxs;
		}

		if (*file_part (file_fs) && !S_ISDIR (st.st_mode))
		{
			if (st.st_size > 0)
			{
				dcc->offertime = time (0);
				dcc->serv = sess->server;
				dcc->dccstat = STAT_QUEUED;
				dcc->size = st.st_size;
				dcc->type = TYPE_SEND;
				dcc->fp = open (file_fs, OFLAGS | O_RDONLY);
				if (dcc->fp != -1)
				{
					g_free (file_fs);
					if (passive || dcc_listen_init (dcc, sess))
					{
						char havespaces = 0;
						file = dcc->file;
						while (*file)
						{
							if (*file == ' ')
							{
								if (prefs.dcc_send_fillspaces)
						    		*file = '_';
							  	else
							   	havespaces = 1;
							}
							file++;
						}
						dcc->nick = strdup (to);
						if (prefs.autoopendccsendwindow)
						{
							if (fe_dcc_open_send_win (TRUE))	/* already open? add */
								fe_dcc_add (dcc);
						} else
							fe_dcc_add (dcc);

						if (passive)
						{
							dcc->pasvid = new_id();
							snprintf (outbuf, sizeof (outbuf), (havespaces) ?
									"DCC SEND \"%s\" %lu %d %u %d" :
									"DCC SEND %s %lu %d %u %d",
									file_part (dcc->file), 199ul,
									0, dcc->size, dcc->pasvid);
						} else
						{
							snprintf (outbuf, sizeof (outbuf), (havespaces) ?
									"DCC SEND \"%s\" %lu %d %u" :
									"DCC SEND %s %lu %d %u",
									file_part (dcc->file), dcc->addr,
									dcc->port, dcc->size);
						}
						sess->server->p_ctcp (sess->server, to, outbuf);

						EMIT_SIGNAL (XP_TE_DCCOFFER, sess, file_part (dcc->file),
										 to, dcc->file, NULL, 0);
					} else
					{
						dcc_close (dcc, 0, TRUE);
					}
					return;
				}
			}
		}
	}
	PrintTextf (sess, _("Cannot access %s\n"), dcc->file);
noaxs:
	g_free (file_fs);
	dcc_close (dcc, 0, TRUE);
}

static struct DCC *
find_dcc_from_id (int id, int type)
{
	struct DCC *dcc;
	GSList *list = dcc_list;
	while (list)
	{
		dcc = (struct DCC *) list->data;
		if (dcc->pasvid == id &&
		dcc->dccstat == STAT_QUEUED && dcc->type == type)
		return dcc;
		list = list->next;
	}
	return 0;
}


static struct DCC *
find_dcc_from_port (int port, int type)
{
	struct DCC *dcc;
	GSList *list = dcc_list;
	while (list)
	{
		dcc = (struct DCC *) list->data;
		if (dcc->port == port &&
			 dcc->dccstat == STAT_QUEUED && dcc->type == type)
			return dcc;
		list = list->next;
	}
	return 0;
}

struct DCC *
find_dcc (char *nick, char *file, int type)
{
	GSList *list = dcc_list;
	struct DCC *dcc;
	while (list)
	{
		dcc = (struct DCC *) list->data;
		if (nick == NULL || !rfc_casecmp (nick, dcc->nick))
		{
			if (type == -1 || dcc->type == type)
			{
				if (!file[0])
					return dcc;
				if (!strcasecmp (file, file_part (dcc->file)))
					return dcc;
				if (!strcasecmp (file, dcc->file))
					return dcc;
			}
		}
		list = list->next;
	}
	return 0;
}

/* called when we receive a NICK change from server */

void
dcc_change_nick (struct server *serv, char *oldnick, char *newnick)
{
	struct DCC *dcc;
	GSList *list = dcc_list;

	while (list)
	{
		dcc = (struct DCC *) list->data;
		if (dcc->serv == serv)
		{
			if (!serv->p_cmp (dcc->nick, oldnick))
			{
				if (dcc->nick)
					free (dcc->nick);
				dcc->nick = strdup (newnick);
			}
		}
		list = list->next;
	}
}

void
dcc_get (struct DCC *dcc)
{
	switch (dcc->dccstat)
	{
	case STAT_QUEUED:
		if (dcc->type != TYPE_CHATSEND)
		{
			if (dcc->type == TYPE_RECV && prefs.autoresume && dcc->resumable)
			{
				dcc_resume (dcc);
			}
			else
			{
				dcc->resumable = 0;
				dcc->pos = 0;
				dcc_connect (dcc);
			}
		}
		break;
	case STAT_DONE:
	case STAT_FAILED:
	case STAT_ABORTED:
		dcc_close (dcc, 0, TRUE);
		break;
	}
}

void
dcc_get_nick (struct session *sess, char *nick)
{
	struct DCC *dcc;
	GSList *list = dcc_list;
	while (list)
	{
		dcc = (struct DCC *) list->data;
		if (!sess->server->p_cmp (nick, dcc->nick))
		{
			if (dcc->dccstat == STAT_QUEUED && dcc->type == TYPE_RECV)
			{
				dcc->resumable = 0;
				dcc->pos = 0;
				dcc->ack = 0;
				dcc_connect (dcc);
				return;
			}
		}
		list = list->next;
	}
	if (sess)
		EMIT_SIGNAL (XP_TE_DCCIVAL, sess, NULL, NULL, NULL, NULL, 0);
}

static struct DCC *
new_dcc (void)
{
	struct DCC *dcc = malloc (sizeof (struct DCC));
	if (!dcc)
		return 0;
	memset (dcc, 0, sizeof (struct DCC));
	dcc->sok = -1;
	dcc->fp = -1;
	dcc_list = g_slist_prepend (dcc_list, dcc);
	return (dcc);
}

void
dcc_chat (struct session *sess, char *nick)
{
	char outbuf[512];
	struct DCC *dcc;

	dcc = find_dcc (nick, "", TYPE_CHATSEND);
	if (dcc)
	{
		switch (dcc->dccstat)
		{
		case STAT_ACTIVE:
		case STAT_QUEUED:
		case STAT_CONNECTING:
			EMIT_SIGNAL (XP_TE_DCCCHATREOFFER, sess, nick, NULL, NULL, NULL, 0);
			return;
		case STAT_ABORTED:
		case STAT_FAILED:
			dcc_close (dcc, 0, TRUE);
		}
	}
	dcc = find_dcc (nick, "", TYPE_CHATRECV);
	if (dcc)
	{
		switch (dcc->dccstat)
		{
		case STAT_QUEUED:
			dcc_connect (dcc);
			break;
		case STAT_FAILED:
		case STAT_ABORTED:
			dcc_close (dcc, 0, TRUE);
		}
		return;
	}
	/* offer DCC CHAT */

	dcc = new_dcc ();
	if (!dcc)
		return;
	dcc->starttime = dcc->offertime = time (0);
	dcc->serv = sess->server;
	dcc->dccstat = STAT_QUEUED;
	dcc->type = TYPE_CHATSEND;
	dcc->nick = strdup (nick);
	if (dcc_listen_init (dcc, sess))
	{
		if (prefs.autoopendccchatwindow)
		{
			if (fe_dcc_open_chat_win (TRUE))	/* already open? add only */
				fe_dcc_add (dcc);
		} else
			fe_dcc_add (dcc);
		snprintf (outbuf, sizeof (outbuf), "DCC CHAT chat %lu %d",
						dcc->addr, dcc->port);
		dcc->serv->p_ctcp (dcc->serv, nick, outbuf);
		EMIT_SIGNAL (XP_TE_DCCCHATOFFERING, sess, nick, NULL, NULL, NULL, 0);
	} else
	{
		dcc_close (dcc, 0, TRUE);
	}
}

static void
dcc_malformed (struct session *sess, char *nick, char *data)
{
	EMIT_SIGNAL (XP_TE_MALFORMED, sess, nick, data, NULL, NULL, 0);
}

static int
is_resumable (struct DCC *dcc)
{
	dcc->resumable = 0;

	/* Check the file size */
	if (access (dcc->destfile_fs, W_OK) == 0)
	{
		struct stat st;

		if (stat (dcc->destfile_fs, &st) != -1)
		{
			if (st.st_size < dcc->size)
			{
				dcc->resumable = st.st_size;
				dcc->pos = st.st_size;
			}
			else
				dcc->resume_error = 2;
		} else
		{
			dcc->resume_errno = errno;
			dcc->resume_error = 1;
		}
	} else
	{
		dcc->resume_errno = errno;
		dcc->resume_error = 1;
	}

	/* Now verify that this DCC is not already in progress from someone else */

	if (dcc->resumable)
	{
		GSList *list = dcc_list;
		struct DCC *d;
		while (list)
		{
			d = list->data;
			if (d->type == TYPE_RECV && d->dccstat != STAT_ABORTED &&
				 d->dccstat != STAT_DONE && d->dccstat != STAT_FAILED)
			{
				if (d != dcc && strcmp (d->destfile, dcc->destfile) == 0)
				{
					dcc->resumable = 0;
					dcc->pos = 0;
					break;
				}
			}
			list = list->next;
		}
	}

	return dcc->resumable;
}

int
dcc_resume (struct DCC *dcc)
{
	char tbuf[500];

	if (dcc->dccstat == STAT_QUEUED && dcc->resumable)
	{
		/* filename contains spaces? Quote them! */
		snprintf (tbuf, sizeof (tbuf) - 10, strchr (dcc->file, ' ') ?
					  "DCC RESUME \"%s\" %d %u" :
					  "DCC RESUME %s %d %u",
					  dcc->file, dcc->port, dcc->resumable);

		if (dcc->pasvid)
 			sprintf (tbuf + strlen (tbuf), " %d", dcc->pasvid);

		dcc->serv->p_ctcp (dcc->serv, dcc->nick, tbuf);
		return 1;
	}

	return 0;
}

static void
dcc_confirm_send (void *ud)
{
	struct DCC *dcc = (struct DCC *) ud;
	dcc_get (dcc);
}

static void
dcc_deny_send (void *ud)
{
	struct DCC *dcc = (struct DCC *) ud;
	dcc_abort (dcc->serv->front_session, dcc);
}

static void
dcc_confirm_chat (void *ud)
{
	struct DCC *dcc = (struct DCC *) ud;
	dcc_connect (dcc);
}

static void
dcc_deny_chat (void *ud)
{
	struct DCC *dcc = (struct DCC *) ud;
	dcc_abort (dcc->serv->front_session, dcc);
}

void
handle_dcc (struct session *sess, char *nick, char *word[],
				char *word_eol[])
{
	char tbuf[512];
	struct DCC *dcc;
	char *type = word[5];
	int port, pasvid = 0;
	unsigned long size, addr;

	if (!strcasecmp (type, "CHAT"))
	{
		port = atoi (word[8]);
		sscanf (word[7], "%lu", &addr);

		if (port == 0)
			pasvid = atoi (word[9]);

		if (!addr /*|| (port < 1024 && port != 0)*/
			|| port > 0xffff || (port == 0 && pasvid == 0))
		{
			dcc_malformed (sess, nick, word_eol[4] + 2);
			return;
		}
		dcc = find_dcc (nick, "", TYPE_CHATSEND);
		if (dcc)
			dcc_close (dcc, 0, TRUE);

		dcc = find_dcc (nick, "", TYPE_CHATRECV);
		if (dcc)
			dcc_close (dcc, 0, TRUE);

		dcc = new_dcc ();
		if (dcc)
		{
			dcc->serv = sess->server;
			dcc->type = TYPE_CHATRECV;
			dcc->dccstat = STAT_QUEUED;
			dcc->addr = addr;
			dcc->port = port;
			dcc->pasvid = pasvid;
			dcc->nick = strdup (nick);
			dcc->starttime = time (0);

			EMIT_SIGNAL (XP_TE_DCCCHATOFFER, sess->server->front_session, nick,
							 NULL, NULL, NULL, 0);

			if (prefs.autoopendccchatwindow)
			{
				if (fe_dcc_open_chat_win (TRUE))	/* already open? add only */
					fe_dcc_add (dcc);
			} else
				fe_dcc_add (dcc);

			if (prefs.autodccchat == 1)
				dcc_connect (dcc);
			else if (prefs.autodccchat == 2)
			{
				char buff[128];
				snprintf (buff, sizeof (buff), "%s is offering DCC Chat.  Do you want to accept?", nick);
				fe_confirm (buff, dcc_confirm_chat, dcc_deny_chat, dcc);
			}
		}
		return;
	}
	if (!strcasecmp (type, "RESUME"))
	{
		port = atoi (word[7]);

		if (port == 0)
		{ /* PASSIVE */
			pasvid = atoi(word[9]);
			dcc = find_dcc_from_id(pasvid, TYPE_SEND);
		} else
		{
			dcc = find_dcc_from_port (port, TYPE_SEND);
		}
		if (!dcc)
			dcc = find_dcc (nick, word[6], TYPE_SEND);
		if (dcc)
		{
			sscanf (word[8], "%lu", &size);
			dcc->resumable = size;
			if (dcc->resumable < dcc->size)
			{
				dcc->pos = dcc->resumable;
				dcc->ack = dcc->resumable;
				lseek (dcc->fp, dcc->pos, SEEK_SET);

				/* Checking if dcc is passive and if filename contains spaces */
				if (dcc->pasvid)
					snprintf (tbuf, sizeof (tbuf), strchr (file_part (dcc->file), ' ') ?
							"DCC ACCEPT \"%s\" %d %u %d" :
							"DCC ACCEPT %s %d %u %d",
							file_part (dcc->file), port, dcc->resumable, dcc->pasvid);
				else
					snprintf (tbuf, sizeof (tbuf), strchr (file_part (dcc->file), ' ') ?
							"DCC ACCEPT \"%s\" %d %u" :
							"DCC ACCEPT %s %d %u",
							file_part (dcc->file), port, dcc->resumable);

				dcc->serv->p_ctcp (dcc->serv, dcc->nick, tbuf);
			}
			sprintf (tbuf, "%u", dcc->pos);
			EMIT_SIGNAL (XP_TE_DCCRESUMEREQUEST, sess, nick,
							 file_part (dcc->file), tbuf, NULL, 0);
		}
		return;
	}
	if (!strcasecmp (type, "ACCEPT"))
	{
		port = atoi (word[7]);
		dcc = find_dcc_from_port (port, TYPE_RECV);
		if (dcc && dcc->dccstat == STAT_QUEUED)
		{
			dcc_connect (dcc);
		}
		return;
	}
	if (!strcasecmp (type, "SEND"))
	{
		char *file = file_part (word[6]);
		int psend = 0;

		port = atoi (word[8]);
		sscanf (word[7], "%lu", &addr);
		sscanf (word[9], "%lu", &size);

		if (port == 0) /* Passive dcc requested */
			pasvid = atoi (word[10]);
		else if (word[10][0] != 0)
		{
			/* Requesting passive dcc.
			 * Destination user of an active dcc is giving his
			 * TRUE address/port/pasvid data.
			 * This information will be used later to
			 * establish the connection to the user.
			 * We can recognize this type of dcc using word[10]
			 * because this field is always null (no pasvid)
			 * in normal dcc sends.
			 */
			pasvid = atoi (word[10]);
			psend = 1;
		}


		if (!addr || !size /*|| (port < 1024 && port != 0)*/
			|| port > 0xffff || (port == 0 && pasvid == 0))
		{
			dcc_malformed (sess, nick, word_eol[4] + 2);
			return;
		}

		if (psend)
		{
			/* Third Step of Passive send.
			 * Connecting to the destination and finally
			 * sending file.
			 */
			dcc = find_dcc_from_id (pasvid, TYPE_SEND);
			if (dcc)
			{
				dcc->addr = addr;
				dcc->port = port;
				dcc_connect (dcc);
			} else
			{
				dcc_malformed (sess, nick, word_eol[4] + 2);
			}
			return;
		}

		dcc = new_dcc ();
		if (dcc)
		{
			dcc->file = strdup (file);

			dcc->destfile = g_malloc (strlen (prefs.dccdir) + strlen (nick) +
											  strlen (file) + 4);

			strcpy (dcc->destfile, prefs.dccdir);
			if (prefs.dccdir[strlen (prefs.dccdir) - 1] != '/')
				strcat (dcc->destfile, "/");
			if (prefs.dccwithnick)
			{
#ifdef WIN32
				char *t = strlen (dcc->destfile) + dcc->destfile;
				strcpy (t, nick);
				while (*t)
				{
					if (*t == '\\' || *t == '|')
						*t = '_';
					t++;
				}
#else
 				strcat (dcc->destfile, nick);
#endif
				strcat (dcc->destfile, ".");
			}
			strcat (dcc->destfile, file);

			/* get the local filesystem encoding */
			dcc->destfile_fs = g_filename_from_utf8 (dcc->destfile, -1, 0, 0, 0);

			dcc->resumable = 0;
			dcc->pos = 0;
			dcc->serv = sess->server;
			dcc->type = TYPE_RECV;
			dcc->dccstat = STAT_QUEUED;
			dcc->addr = addr;
			dcc->port = port;
			dcc->pasvid = pasvid;
			dcc->size = size;
			dcc->nick = strdup (nick);
			dcc->maxcps = prefs.dcc_max_get_cps;

			is_resumable (dcc);

			/* autodccsend is really autodccrecv.. right? */

			if (prefs.autodccsend == 1)
			{
				dcc_get (dcc);
			}
			else if (prefs.autodccsend == 2)
			{
				char buff[128];
				snprintf (buff, sizeof (buff), "%s is offering \"%s\" via DCC.  Do you want to accept the transfer?", nick, file);
				fe_confirm (buff, dcc_confirm_send, dcc_deny_send, dcc);
			}
			if (prefs.autoopendccrecvwindow)
			{
				if (fe_dcc_open_recv_win (TRUE))	/* was already open? just add*/
					fe_dcc_add (dcc);
			} else
				fe_dcc_add (dcc);
		}
		sprintf (tbuf, "%lu", size);
		snprintf (tbuf + 24, 300, "%s:%d", net_ip (dcc->addr), dcc->port);
		EMIT_SIGNAL (XP_TE_DCCSENDOFFER, sess->server->front_session, nick,
						 file, tbuf, tbuf + 24, 0);
	} else
		EMIT_SIGNAL (XP_TE_DCCGENERICOFFER, sess->server->front_session,
						 word_eol[4] + 2, nick, NULL, NULL, 0);
}

void
dcc_show_list (struct session *sess)
{
	int i = 0;
	struct DCC *dcc;
	GSList *list = dcc_list;

	EMIT_SIGNAL (XP_TE_DCCHEAD, sess, NULL, NULL, NULL, NULL, 0);
	while (list)
	{
		dcc = (struct DCC *) list->data;
		i++;
		PrintTextf (sess, " %s  %-10.10s %-7.7s %-7u %-7u %s\n",
					 dcctypes[dcc->type], dcc->nick,
					 _(dccstat[dcc->dccstat].name), dcc->size, dcc->pos,
					 file_part (dcc->file));
		list = list->next;
	}
	if (!i)
		PrintText (sess, _("No active DCCs\n"));
}
