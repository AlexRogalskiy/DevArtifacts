/*
 * pixmaps.c - helper functions for pixmaps
 *
 * Copyright (C) 2004 David Trowbridge and Dan Kuester
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 *
 */

#include <gdk-pixbuf/gdk-pixbuf.h>
#include <gdk-pixbuf/gdk-pixdata.h>

#include "../pixmaps/inline_pngs.h"
#include "pixmaps/inline_pngs.h"

GdkPixbuf *pix_purple;
GdkPixbuf *pix_red;
GdkPixbuf *pix_op;
GdkPixbuf *pix_hop;
GdkPixbuf *pix_voice;

GdkPixbuf *pix_newdata;
GdkPixbuf *pix_nicksaid;
GdkPixbuf *pix_msgsaid;

GdkPixbuf *pix_prefs_irc;
GdkPixbuf *pix_prefs_colors;
GdkPixbuf *pix_prefs_dcc;
GdkPixbuf *pix_prefs_networks;
GdkPixbuf *pix_prefs_plugins;

void
pixmaps_init (void)
{
	GdkPixbuf *p;

	pix_purple = gdk_pixbuf_new_from_file(XCHATSHAREDIR"/purple.png", 0);
	if (!pix_purple)
		pix_purple = gdk_pixbuf_new_from_inline(-1, purplepng, FALSE, 0);

	pix_red = gdk_pixbuf_new_from_file(XCHATSHAREDIR"/red.png", 0);
	if (!pix_red)
		pix_red = gdk_pixbuf_new_from_inline(-1, redpng, FALSE, 0);

	pix_op = gdk_pixbuf_new_from_file(XCHATSHAREDIR"/op.png", 0);
	if (!pix_op)
		pix_op = gdk_pixbuf_new_from_inline(-1, oppng, FALSE, 0);

	pix_hop = gdk_pixbuf_new_from_file(XCHATSHAREDIR"/hop.png", 0);
	if (!pix_hop)
		pix_hop = gdk_pixbuf_new_from_inline(-1, hoppng, FALSE, 0);

	pix_voice = gdk_pixbuf_new_from_file(XCHATSHAREDIR"/voice.png", 0);
	if (!pix_voice)
		pix_voice = gdk_pixbuf_new_from_inline(-1, voicepng, FALSE, 0);

	p = gdk_pixbuf_new_from_file(XCHATSHAREDIR"/newdata.png", 0);
	if (!p)
		p = gdk_pixbuf_new_from_inline(-1, newdatapng, FALSE, 0);
	pix_newdata = gdk_pixbuf_scale_simple(p, 16, 16, GDK_INTERP_BILINEAR);
	gdk_pixbuf_unref(p);

	p = gdk_pixbuf_new_from_file(XCHATSHAREDIR"/nicksaid.png", 0);
	if (!p)
		p = gdk_pixbuf_new_from_inline(-1, nicksaidpng, FALSE, 0);
	pix_nicksaid = gdk_pixbuf_scale_simple(p, 16, 16, GDK_INTERP_BILINEAR);
	gdk_pixbuf_unref(p);

	p = gdk_pixbuf_new_from_file(XCHATSHAREDIR"/global-message.png", 0);
	if (!p)
		p = gdk_pixbuf_new_from_inline(-1, globalmessagepng, FALSE, 0);
	pix_msgsaid = gdk_pixbuf_scale_simple(p, 16, 16, GDK_INTERP_BILINEAR);
	gdk_pixbuf_unref(p);

	p = gdk_pixbuf_new_from_file(XCHATSHAREDIR"/irc.png", NULL);
	if (!p)
		p = gdk_pixbuf_new_from_inline(-1, ircpng, FALSE, 0);
	pix_prefs_irc = gdk_pixbuf_scale_simple(p, 16, 16, GDK_INTERP_BILINEAR);
	gdk_pixbuf_unref(p);

	p = gdk_pixbuf_new_from_file(XCHATSHAREDIR"/color.png", NULL);
	if (!p)
		p = gdk_pixbuf_new_from_inline(-1, colorpng, FALSE, 0);
	pix_prefs_colors = gdk_pixbuf_scale_simple(p, 16, 16, GDK_INTERP_BILINEAR);
	gdk_pixbuf_unref(p);

	p = gdk_pixbuf_new_from_file(XCHATSHAREDIR"/dcc.png", NULL);
	if (!p)
		p = gdk_pixbuf_new_from_inline(-1, dccpng, FALSE, 0);
	pix_prefs_dcc = gdk_pixbuf_scale_simple(p, 16, 16, GDK_INTERP_BILINEAR);
	gdk_pixbuf_unref(p);

	p = gdk_pixbuf_new_from_file(XCHATSHAREDIR"/servers.png", NULL);
	if (!p)
		p = gdk_pixbuf_new_from_inline(-1, serverspng, FALSE, 0);
	pix_prefs_networks = gdk_pixbuf_scale_simple(p, 16, 16, GDK_INTERP_BILINEAR);
	gdk_pixbuf_unref(p);

	p = gdk_pixbuf_new_from_file(XCHATSHAREDIR"/plugin-manager.png", NULL);
	if (!p)
		p = gdk_pixbuf_new_from_inline(-1, pluginmanagerpng, FALSE, 0);
	pix_prefs_plugins = gdk_pixbuf_scale_simple(p, 16, 16, GDK_INTERP_BILINEAR);
	gdk_pixbuf_unref(p);
}
