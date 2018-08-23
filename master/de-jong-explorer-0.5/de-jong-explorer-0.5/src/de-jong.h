/*
 * de-jong.h - The DeJong object builds on the ParameterHolder and HistogramRender
 *             objects to provide a rendering of the DeJong map into a histogram image.
 *
 * de Jong Explorer - interactive exploration of the Peter de Jong attractor
 * Copyright (C) 2004 David Trowbridge and Micah Dowty
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

#ifndef __DE_JONG_H__
#define __DE_JONG_H__

#include <gtk/gtk.h>
#include "histogram-imager.h"

G_BEGIN_DECLS

#define DE_JONG_TYPE            (de_jong_get_type ())
#define DE_JONG(obj)            (G_TYPE_CHECK_INSTANCE_CAST ((obj), DE_JONG_TYPE, DeJong))
#define DE_JONG_CLASS(klass)    (G_TYPE_CHECK_CLASS_CAST ((klass), DE_JONG_TYPE, DeJongClass))
#define IS_DE_JONG(obj)         (G_TYPE_CHECK_INSTANCE_TYPE ((obj), DE_JONG_TYPE))
#define IS_DE_JONG_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), DE_JONG_TYPE))

typedef struct _DeJong      DeJong;
typedef struct _DeJongClass DeJongClass;

typedef struct {
  gdouble a, b, c, d;
} DeJongParams;

struct _DeJong {
  HistogramImager parent;

  /* Calculation Parameters */
  DeJongParams param;
  gdouble zoom, xoffset, yoffset, rotation;
  gdouble blur_radius, blur_ratio;
  gboolean tileable;
  gboolean calc_dirty_flag;

  /* Current calculation state */
  gdouble point_x, point_y;
  gdouble iterations;
};

struct _DeJongClass {
  HistogramImagerClass parent_class;
};


/************************************************************************************/
/******************************************************************* Public Methods */
/************************************************************************************/

GType      de_jong_get_type         ();
DeJong*    de_jong_new              ();

void       de_jong_calculate        (DeJong                *self,
				     guint                  iterations);

void       de_jong_calculate_motion (DeJong                *self,
				     guint                  iterations,
				     gboolean               continuation,
				     ParameterInterpolator *interp,
				     gpointer               interp_data);

G_END_DECLS

#endif /* __DE_JONG_H__ */

/* The End */
