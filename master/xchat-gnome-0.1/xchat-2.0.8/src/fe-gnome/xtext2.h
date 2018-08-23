#ifndef __XTEXT2_H__
#define __XTEXT2_H__

#include <gtk/gtk.h>

G_BEGIN_DECLS

#define XTEXT2_TYPE            (xtext2_get_type ())
#define XTEXT2(obj)            (G_TYPE_CHECK_INSTANCE_CAST ((obj), XTEXT2_TYPE, XText2))
#define XTEXT2_CLASS(klass)    (G_TYPE_CHECK_CLASS_CAST ((klass), XTEXT2_TYPE, XText2Class))
#define IS_XTEXT2(obj)         (G_TYPE_CHECK_INSTANCE_TYPE ((obj), XTEXT2_TYPE))
#define IS_XTEXT2_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), XTEXT2_TYPE))

typedef struct _XText2        XText2;
typedef struct _XText2Class   XText2Class;
typedef struct _XText2Private XText2Private;

struct _XText2
{
  GtkWidget parent;

  XText2Private *priv;
  GtkAdjustment *adj;
};

struct _XText2Class
{
  GtkWidgetClass parent_class;

  /* signals */
  void (*word_click) (XText2 * xtext, char *word, GdkEventButton *event);
};

GType      xtext2_get_type           (void) G_GNUC_CONST;
GtkWidget* xtext2_new                (GdkColor palette[], gboolean separator);

G_END_DECLS

#endif
