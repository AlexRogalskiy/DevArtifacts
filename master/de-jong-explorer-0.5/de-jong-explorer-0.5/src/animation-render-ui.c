/*
 * animation-render-ui.c - A user interface for preparing an animation
 *                         rendering and viewing its progress.
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

#include "animation-render-ui.h"

static void animation_render_ui_class_init(AnimationRenderUiClass *klass);
static void animation_render_ui_init(AnimationRenderUi *self);
static void animation_render_ui_dispose(GObject *gobject);

static void on_ok_clicked(GtkWidget *widget, AnimationRenderUi *self);
static void on_cancel_clicked(GtkWidget *widget, AnimationRenderUi *self);
static void on_select_output_file_clicked(GtkWidget *widget, AnimationRenderUi *self);
static gboolean on_delete_event(GtkWidget *widget, GdkEvent *event, AnimationRenderUi *self);

static void animation_render_ui_start(AnimationRenderUi *self);
static void animation_render_ui_stop(AnimationRenderUi *self);
static int animation_render_ui_idle_handler(gpointer user_data);
static void animation_render_ui_run_timed_calculation(AnimationRenderUi *self);

enum {
  CLOSED_SIGNAL,
  LAST_SIGNAL,
};

static guint animation_render_ui_signals[LAST_SIGNAL] = { 0 };


/************************************************************************************/
/**************************************************** Initialization / Finalization */
/************************************************************************************/

GType animation_render_ui_get_type(void) {
  static GType exp_type = 0;

  if (!exp_type) {
    static const GTypeInfo dj_info = {
      sizeof(AnimationRenderUiClass),
      NULL, /* base_init */
      NULL, /* base_finalize */
      (GClassInitFunc) animation_render_ui_class_init,
      NULL, /* class_finalize */
      NULL, /* class_data */
      sizeof(AnimationRenderUi),
      0,
      (GInstanceInitFunc) animation_render_ui_init,
    };

    exp_type = g_type_register_static(G_TYPE_OBJECT, "AnimationRenderUi", &dj_info, 0);
  }

  return exp_type;
}

static void animation_render_ui_class_init(AnimationRenderUiClass *klass) {
  GObjectClass *object_class = (GObjectClass*) klass;

  object_class->dispose = animation_render_ui_dispose;

  animation_render_ui_signals[CLOSED_SIGNAL] = g_signal_new("closed",
							    G_TYPE_FROM_CLASS(klass),
							    G_SIGNAL_RUN_FIRST | G_SIGNAL_ACTION,
							    G_STRUCT_OFFSET(AnimationRenderUiClass, animation_render_ui),
							    NULL,
							    NULL,
							    g_cclosure_marshal_VOID__VOID,
							    G_TYPE_NONE, 0);

  glade_init();
}

static void animation_render_ui_init(AnimationRenderUi *self) {
  self->xml = glade_xml_new(GLADEDIR "/animation-render.glade", NULL, NULL);

  glade_xml_signal_connect_data(self->xml, "on_ok_clicked",                 G_CALLBACK(on_ok_clicked),                 self);
  glade_xml_signal_connect_data(self->xml, "on_cancel_clicked",             G_CALLBACK(on_cancel_clicked),             self);
  glade_xml_signal_connect_data(self->xml, "on_select_output_file_clicked", G_CALLBACK(on_select_output_file_clicked), self);
  glade_xml_signal_connect_data(self->xml, "on_delete_event",               G_CALLBACK(on_delete_event),               self);

  self->dejong = de_jong_new();
  self->frame.a = PARAMETER_HOLDER(de_jong_new());
  self->frame.b = PARAMETER_HOLDER(de_jong_new());
}

static void animation_render_ui_dispose(GObject *gobject) {
  AnimationRenderUi *self = ANIMATION_RENDER_UI(gobject);

  if (self->animation) {
    g_object_unref(self->animation);
    self->animation = NULL;
  }
  if (self->frame.a) {
    g_object_unref(self->frame.a);
    self->frame.a = NULL;
  }
  if (self->frame.b) {
    g_object_unref(self->frame.b);
    self->frame.b = NULL;
  }
  if (self->avi) {
    avi_writer_close(self->avi);
    g_object_unref(self->avi);
    self->avi = NULL;
  }
  if (self->idler) {
    g_source_remove(self->idler);
    self->idler = 0;
  }
}

AnimationRenderUi* animation_render_ui_new(Animation *animation) {
  AnimationRenderUi *self = ANIMATION_RENDER_UI(g_object_new(animation_render_ui_get_type(), NULL));

  self->animation = animation_copy(animation);

  return self;
}


/************************************************************************************/
/************************************************************************ Callbacks */
/************************************************************************************/

static void on_ok_clicked(GtkWidget *widget, AnimationRenderUi *self) {
  /* Make settings insensitive and progress sensitive now that we're starting */
  gtk_widget_set_sensitive(glade_xml_get_widget(self->xml, "ok"), FALSE);
  gtk_widget_set_sensitive(glade_xml_get_widget(self->xml, "settings_box"), FALSE);
  gtk_widget_set_sensitive(glade_xml_get_widget(self->xml, "progress_box"), TRUE);

  self->filename = gtk_entry_get_text(GTK_ENTRY(glade_xml_get_widget(self->xml, "output_file")));
  self->width = gtk_spin_button_get_value(GTK_SPIN_BUTTON(glade_xml_get_widget(self->xml, "width")));
  self->height = gtk_spin_button_get_value(GTK_SPIN_BUTTON(glade_xml_get_widget(self->xml, "height")));
  self->oversample = gtk_spin_button_get_value(GTK_SPIN_BUTTON(glade_xml_get_widget(self->xml, "oversample")));
  self->target_density = gtk_spin_button_get_value(GTK_SPIN_BUTTON(glade_xml_get_widget(self->xml, "target_density")));
  self->frame_rate = gtk_spin_button_get_value(GTK_SPIN_BUTTON(glade_xml_get_widget(self->xml, "frame_rate")));

  animation_render_ui_start(self);
}

static void on_cancel_clicked(GtkWidget *widget, AnimationRenderUi *self) {
  if (self->render_in_progress)
    animation_render_ui_stop(self);
  else {
    gtk_widget_destroy(glade_xml_get_widget(self->xml, "window"));
    g_signal_emit(G_OBJECT(self), animation_render_ui_signals[CLOSED_SIGNAL], 0);
  }
}

static void on_select_output_file_clicked(GtkWidget *widget, AnimationRenderUi *self) {
  GtkWidget *dialog;

  dialog = gtk_file_selection_new("Select Output File");
  gtk_file_selection_set_filename(GTK_FILE_SELECTION(dialog),
				  gtk_entry_get_text(GTK_ENTRY(glade_xml_get_widget(self->xml, "output_file"))));

  if(gtk_dialog_run(GTK_DIALOG(dialog)) == GTK_RESPONSE_OK) {
    gtk_entry_set_text(GTK_ENTRY(glade_xml_get_widget(self->xml, "output_file")),
		       gtk_file_selection_get_filename(GTK_FILE_SELECTION(dialog)));
  }
  gtk_widget_destroy(dialog);
}

static gboolean on_delete_event(GtkWidget *widget, GdkEvent *event, AnimationRenderUi *self) {
  if (self->render_in_progress)
    animation_render_ui_stop(self);
  g_signal_emit(G_OBJECT(self), animation_render_ui_signals[CLOSED_SIGNAL], 0);
  return FALSE;
}


/************************************************************************************/
/************************************************************************ Rendering */
/************************************************************************************/

static void animation_render_ui_start(AnimationRenderUi *self) {
  g_object_set(self->dejong,
	       "width", self->width,
	       "height", self->height,
	       "oversample", self->oversample,
	       NULL);

  self->avi = avi_writer_new(fopen(self->filename, "wb"), self->width, self->height, self->frame_rate);

  /* Get the first frame ready for rendering */
  animation_iter_get_first(self->animation, &self->iter);
  animation_iter_read_frame(self->animation, &self->iter, &self->frame, self->frame_rate);
  self->continuation = FALSE;
  self->elapsed_anim_time = 0;
  self->anim_length = animation_get_length(self->animation);

  gtk_progress_bar_set_fraction(GTK_PROGRESS_BAR(glade_xml_get_widget(self->xml, "animation_progress")), 0);
  gtk_progress_bar_set_fraction(GTK_PROGRESS_BAR(glade_xml_get_widget(self->xml, "frame_progress")), 0);

  /* Start out rendering 1000 iterations per idle handler invocation.
   * Every time we calculate, it gets timed, and this figure is automatically
   * adjusted to balance efficiency with responsiveness.
   */
  self->iterations_per_idle = 1000;

  /* Set up an idle handler where we'll do the rendering in small chunks */
  self->idler = g_idle_add(animation_render_ui_idle_handler, self);

  self->render_in_progress = TRUE;
}

static void animation_render_ui_stop(AnimationRenderUi *self) {
  self->render_in_progress = FALSE;

  avi_writer_close(self->avi);
  g_object_unref(self->avi);
  self->avi = NULL;

  g_source_remove(self->idler);
  self->idler = 0;

  gtk_progress_bar_set_fraction(GTK_PROGRESS_BAR(glade_xml_get_widget(self->xml, "animation_progress")), 0);
  gtk_progress_bar_set_fraction(GTK_PROGRESS_BAR(glade_xml_get_widget(self->xml, "frame_progress")), 0);

  gtk_widget_set_sensitive(glade_xml_get_widget(self->xml, "ok"), TRUE);
  gtk_widget_set_sensitive(glade_xml_get_widget(self->xml, "settings_box"), TRUE);
  gtk_widget_set_sensitive(glade_xml_get_widget(self->xml, "progress_box"), FALSE);
}

static int animation_render_ui_idle_handler(gpointer user_data) {
  AnimationRenderUi *self = (AnimationRenderUi*) user_data;
  gdouble frame_completion, anim_completion;

  animation_render_ui_run_timed_calculation(self);

  /* Figure out how complete this frame is */
  frame_completion = ((gdouble) HISTOGRAM_IMAGER(self->dejong)->peak_density) / self->target_density;
  if (frame_completion >= 1) {
    frame_completion = 1;

    /* Write out this frame */
    histogram_imager_update_image(HISTOGRAM_IMAGER(self->dejong));
    avi_writer_append_frame(self->avi, HISTOGRAM_IMAGER(self->dejong)->image);

    /* Show the completed frame in our GUI's preview area */
    gtk_image_set_from_pixbuf(GTK_IMAGE(glade_xml_get_widget(self->xml, "preview")),
			      HISTOGRAM_IMAGER(self->dejong)->image);
    gtk_widget_show(glade_xml_get_widget(self->xml, "preview_frame"));

    /* Move to the next frame */
    if (animation_iter_read_frame(self->animation, &self->iter, &self->frame, self->frame_rate)) {

      /* We still have more to render, calculate how much we've done so far */
      self->continuation = FALSE;
      self->elapsed_anim_time += 1/self->frame_rate;
      anim_completion = self->elapsed_anim_time / self->anim_length;
    }
    else {
      /* We're done, yay. Clean up. */
      anim_completion = 1;
      animation_render_ui_stop(self);
    }

    gtk_progress_bar_set_fraction(GTK_PROGRESS_BAR(glade_xml_get_widget(self->xml, "animation_progress")), anim_completion);
  }
  else {
    /* Continue this frame later */
    self->continuation = TRUE;
  }

  gtk_progress_bar_set_fraction(GTK_PROGRESS_BAR(glade_xml_get_widget(self->xml, "frame_progress")), frame_completion);
  return 1;
}

static void animation_render_ui_run_timed_calculation(AnimationRenderUi *self) {
  /* This runs the actual de jong calculations, timing them to automatically
   * tweak the number of iterations we run at a time. More iterations at a time
   * is more efficient, but can also cause the UI to get unresponsive. We adjust
   * the number of iterations so that this takes a fixed amount of time to run,
   * set below in microseconds.
   */
  const gdouble target_microseconds = 25000;
  GTimer *timer;
  gulong elapsed;

  timer = g_timer_new();
  g_timer_start(timer);

  de_jong_calculate_motion(self->dejong, self->iterations_per_idle, self->continuation,
			   PARAMETER_INTERPOLATOR(parameter_holder_interpolate_linear),
			   &self->frame);

  g_timer_elapsed(timer, &elapsed);
  g_timer_destroy(timer);

  self->iterations_per_idle *= target_microseconds / elapsed;

  /* Put a lower limit on the iterations per idle, so even really slow
   * or heavily loaded machines will get a tiny bit of work done.
   */
  if (self->iterations_per_idle < 1000)
    self->iterations_per_idle = 1000;
}

/* The End */
