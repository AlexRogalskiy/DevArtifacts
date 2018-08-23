/*
 * pixmaps.h - helper functions for pixmaps
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

#ifndef XCHAT_GNOME_PIXMAPS_H
#define XCHAT_GNOME_PIXMAPS_H

#include <gnome.h>

extern GdkPixbuf *pix_purple;
extern GdkPixbuf *pix_red;
extern GdkPixbuf *pix_op;
extern GdkPixbuf *pix_hop;
extern GdkPixbuf *pix_voice;

extern GdkPixbuf *pix_newdata;
extern GdkPixbuf *pix_nicksaid;
extern GdkPixbuf *pix_msgsaid;

extern GdkPixbuf *pix_prefs_irc;
extern GdkPixbuf *pix_prefs_colors;
extern GdkPixbuf *pix_prefs_dcc;
extern GdkPixbuf *pix_prefs_networks;
extern GdkPixbuf *pix_prefs_plugins;

extern void pixmaps_init (void);

#endif
