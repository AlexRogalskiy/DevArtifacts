/*
 * cell-renderer-transition.h - A GtkCellRenderer for viewing a keyframe's transition,
 *                              including the transition curve and duration.
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

#ifndef __CELL_RENDERER_TRANSITION_H__
#define __CELL_RENDERER_TRANSITION_H__

#include <glib.h>
#include <glib-object.h>
#include <gtk/gtkcellrenderer.h>
#include "spline.h"

G_BEGIN_DECLS

#define CELL_RENDERER_TRANSITION_TYPE            (cell_renderer_transition_get_type ())
#define CELL_RENDERER_TRANSITION(obj)            (G_TYPE_CHECK_INSTANCE_CAST ((obj), CELL_RENDERER_TRANSITION_TYPE, CellRendererTransition))
#define CELL_RENDERER_TRANSITION_CLASS(klass)    (G_TYPE_CHECK_CLASS_CAST ((klass), CELL_RENDERER_TRANSITION_TYPE, CellRendererTransitionClass))
#define IS_CELL_RENDERER_TRANSITION(obj)         (G_TYPE_CHECK_INSTANCE_TYPE ((obj), CELL_RENDERER_TRANSITION_TYPE))
#define IS_CELL_RENDERER_TRANSITION_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), CELL_RENDERER_TRANSITION_TYPE))

typedef struct _CellRendererTransition      CellRendererTransition;
typedef struct _CellRendererTransitionClass CellRendererTransitionClass;

struct _CellRendererTransition {
  GtkCellRenderer parent;

  double duration;
  Spline *spline;
  guint spline_size;
};

struct _CellRendererTransitionClass {
  GtkCellRendererClass parent_class;

  void (* cell_renderer_transition) (CellRendererTransition *cb);
};

GType            cell_renderer_transition_get_type();
GtkCellRenderer* cell_renderer_transition_new();

G_END_DECLS

#endif /* __CELL_RENDERER_TRANSITION_H__ */

/* The End */
