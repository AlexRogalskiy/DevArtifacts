/*
 * histogram-imager.h - An object that stores a 2D histogram and generates
 *                      images from it. Supports oversampling, gamma correction,
 *                      color interpolation, and exposure adjustment.
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

#ifndef __HISTOGRAM_IMAGER_H__
#define __HISTOGRAM_IMAGER_H__

#include <gtk/gtk.h>
#include "parameter-holder.h"

G_BEGIN_DECLS

#define HISTOGRAM_IMAGER_TYPE            (histogram_imager_get_type ())
#define HISTOGRAM_IMAGER(obj)            (G_TYPE_CHECK_INSTANCE_CAST ((obj), HISTOGRAM_IMAGER_TYPE, HistogramImager))
#define HISTOGRAM_IMAGER_CLASS(klass)    (G_TYPE_CHECK_CLASS_CAST ((klass), HISTOGRAM_IMAGER_TYPE, HistogramImagerClass))
#define IS_HISTOGRAM_IMAGER(obj)         (G_TYPE_CHECK_INSTANCE_TYPE ((obj), HISTOGRAM_IMAGER_TYPE))
#define IS_HISTOGRAM_IMAGER_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), HISTOGRAM_IMAGER_TYPE))

typedef struct _HistogramImager          HistogramImager;
typedef struct _HistogramImagerClass     HistogramImagerClass;


struct _HistogramImager {
  ParameterHolder parent;

  /* Current image size
   */
  guint width, height;
  guint oversample;
  gboolean size_dirty_flag;

  /* Rendering Parameters
   *
   * Changing these parameters will not affect the
   * histogram, only the image generated from it.
   */
  gdouble exposure, gamma;
  GdkColor fgcolor, bgcolor;
  guint fgalpha, bgalpha;
  gboolean clamped;
  gboolean render_dirty_flag;

  /* Current rendering state
   */
  gdouble total_points_plotted;
  gulong peak_density;
  GTimeVal render_start_time;

  guint *histogram;
  gboolean histogram_clear_flag;

  GdkPixbuf *image;

  guint color_table_allocated_size;
  guint color_table_filled_size;
  guint32 *color_table;
};

struct _HistogramImagerClass {
  ParameterHolderClass parent_class;
};

typedef struct {
  guint *histogram;
  guint hist_width;
  guint density;
  gulong plot_count;
} HistogramPlot;


/************************************************************************************/
/******************************************************************* Public Methods */
/************************************************************************************/

GType            histogram_imager_get_type        ();
HistogramImager* histogram_imager_new             ();

void             histogram_imager_update_image    (HistogramImager *self);
GdkPixbuf*       histogram_imager_make_thumbnail  (HistogramImager *self,
						   guint            max_width,
						   guint            max_height);

void             histogram_imager_load_image_file (HistogramImager *self,
						   const gchar     *filename);
void             histogram_imager_save_image_file (HistogramImager *self,
						   const gchar     *filename);

void             histogram_imager_get_hist_size   (HistogramImager *self,
						   int             *hist_width,
						   int             *hist_height);

void             histogram_imager_clear           (HistogramImager *self);
gdouble          histogram_imager_get_elapsed_time (HistogramImager *self);

void             histogram_imager_prepare_plots   (HistogramImager *self,
						   HistogramPlot   *plot);

void             histogram_imager_finish_plots    (HistogramImager *self,
						   HistogramPlot   *plot);


/* A macro to quickly plot a point on the histogram.
 * Must be called between histogram_imager_prepare_plots
 * and histogram_imager_finish_plots. 'plot' is a
 * HistogramPlot, *not* a pointer to a HistogramPlot.
 * The provided X and Y must be less than the dimensions
 * returned by histogram_imager_get_hist_size.
 */
#define HISTOGRAM_IMAGER_PLOT(plot, x, y) do { \
    guint bucket; \
    (plot).plot_count++; \
    bucket = ++(plot).histogram[(x) + (plot).hist_width * (y)]; \
    if (bucket > (plot).density) { \
      (plot).density = bucket; \
    } \
} while (0)


G_END_DECLS

#endif /* __HISTOGRAM_IMAGER_H__ */

/* The End */
