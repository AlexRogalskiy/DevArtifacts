/*
 * parameter-holder.c - A base class for GObjects whose properties include
 *                      algorithm parameters that can be serialized to key/value
 *                      pairs and interpolated between.
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

#include "parameter-holder.h"
#include <stdlib.h>

static void parameter_holder_class_init(ParameterHolderClass *klass);

static void value_transform_string_uint(const GValue *src_value, GValue *dest_value);
static void value_transform_string_double(const GValue *src_value, GValue *dest_value);
static void value_transform_string_boolean(const GValue *src_value, GValue *dest_value);
static void value_transform_string_ulong(const GValue *src_value, GValue *dest_value);


/************************************************************************************/
/**************************************************** Initialization / Finalization */
/************************************************************************************/

GType parameter_holder_get_type(void) {
  static GType dj_type = 0;

  if (!dj_type) {
    static const GTypeInfo dj_info = {
      sizeof(ParameterHolderClass),
      NULL, /* base_init */
      NULL, /* base_finalize */
      (GClassInitFunc) parameter_holder_class_init,
      NULL, /* class_finalize */
      NULL, /* class_data */
      sizeof(ParameterHolder),
      0,
      NULL, /* instance init */
    };

    dj_type = g_type_register_static(G_TYPE_OBJECT, "ParameterHolder", &dj_info, 0);
  }

  return dj_type;
}

static void parameter_holder_class_init(ParameterHolderClass *klass) {
  GObjectClass *object_class;
  object_class = (GObjectClass*) klass;

  /* Register a few custom GValueTransforms, since glib doesn't have
   * built-in transforms from strings to other types.
   */
  g_value_register_transform_func(G_TYPE_STRING, G_TYPE_UINT,    value_transform_string_uint);
  g_value_register_transform_func(G_TYPE_STRING, G_TYPE_DOUBLE,  value_transform_string_double);
  g_value_register_transform_func(G_TYPE_STRING, G_TYPE_BOOLEAN, value_transform_string_boolean);
  g_value_register_transform_func(G_TYPE_STRING, G_TYPE_ULONG,   value_transform_string_ulong);
}

ParameterHolder* parameter_holder_new() {
  return PARAMETER_HOLDER(g_object_new(parameter_holder_get_type(), NULL));
}

void parameter_holder_pair_free(ParameterHolderPair *self) {
  if (self->a)
    g_object_unref(self->a);
  if (self->b)
    g_object_unref(self->b);
  g_free(self);
}


/************************************************************************************/
/************************************************************** Transform Functions */
/************************************************************************************/

static void value_transform_string_uint(const GValue *src_value, GValue *dest_value) {
  dest_value->data[0].v_uint = strtoul(src_value->data[0].v_pointer, NULL, 10);
}

static void value_transform_string_double(const GValue *src_value, GValue *dest_value) {
  dest_value->data[0].v_double = strtod(src_value->data[0].v_pointer, NULL);
}

static void value_transform_string_boolean(const GValue *src_value, GValue *dest_value) {
  if (!g_strcasecmp(src_value->data[0].v_pointer, "true")) {
    dest_value->data[0].v_int = TRUE;
  }
  else if (!g_strcasecmp(src_value->data[0].v_pointer, "false")) {
    dest_value->data[0].v_int = FALSE;
  }
  else {
    dest_value->data[0].v_int = strtoul(src_value->data[0].v_pointer, NULL, 10) != 0;
  }
}

static void value_transform_string_ulong(const GValue *src_value, GValue *dest_value) {
  dest_value->data[0].v_ulong = strtoul(src_value->data[0].v_pointer, NULL, 10);
}


/************************************************************************************/
/*********************************************************************** Properties */
/************************************************************************************/

void parameter_holder_set(ParameterHolder *self, const gchar* property, const gchar* value) {
  /* Set a property, casting a string value to whatever type the property expects */
  GValue strval, converted;
  GParamSpec *spec;

  /* Look up the GParamSpec for this property */
  spec = g_object_class_find_property(G_OBJECT_GET_CLASS(self), property);
  if (!spec) {
    g_log(G_LOG_DOMAIN, G_LOG_LEVEL_WARNING,
	  "Ignoring attempt to set undefined property '%s' to '%s'",
	  property, value);
    return;
  }

  memset(&strval, 0, sizeof(GValue));
  memset(&converted, 0, sizeof(GValue));
  g_value_init(&strval, G_TYPE_STRING);
  g_value_init(&converted, spec->value_type);
  g_value_set_string(&strval, value);

  if (g_value_transform(&strval, &converted)) {
    g_object_set_property(G_OBJECT(self), property, &converted);
  }
  else {
    g_log(G_LOG_DOMAIN, G_LOG_LEVEL_WARNING,
	  "Couldn't convert value '%s' for property '%s'",
	  value, property);
  }

  g_value_unset(&strval);
  g_value_unset(&converted);
}


void parameter_holder_reset_to_defaults(ParameterHolder *self) {
  /* Reset all G_PARAM_CONSTRUCT properties to their default values
   */
  GParamSpec** properties;
  guint n_properties;
  int i;
  GValue val;

  properties = g_object_class_list_properties(G_OBJECT_GET_CLASS(self), &n_properties);
  for (i=0; i<n_properties; i++) {
    if (properties[i]->flags & G_PARAM_CONSTRUCT) {
      /* Make a GValue with the default in it */
      memset(&val, 0, sizeof(val));
      g_value_init(&val, properties[i]->value_type);
      g_param_value_set_default(properties[i], &val);

      g_object_set_property(G_OBJECT(self), properties[i]->name, &val);

      g_value_unset(&val);
    }

  }
  g_free(properties);
}

void parameter_holder_interpolate_linear(ParameterHolder *self, double alpha, ParameterHolderPair *p) {
  /* A ParameterInterpolator function that takes a ParameterHolderPair as its parameter.
   * Linearly interpolates between the points 'a' and 'b' in the pair.
   */
  GParamSpec** properties;
  guint n_properties;
  int i;
  GValue a_val, b_val, self_val;

  properties = g_object_class_list_properties(G_OBJECT_GET_CLASS(self), &n_properties);
  for (i=0; i<n_properties; i++) {
    if (properties[i]->flags & PARAM_INTERPOLATE) {

      /* Initialize a place to put our source and destination values */
      memset(&a_val, 0, sizeof(a_val));
      g_value_init(&a_val, properties[i]->value_type);
      memset(&b_val, 0, sizeof(b_val));
      g_value_init(&b_val, properties[i]->value_type);
      memset(&self_val, 0, sizeof(self_val));
      g_value_init(&self_val, properties[i]->value_type);

      /* Get a and b's current values for this parameter */
      g_object_get_property(G_OBJECT(p->a), properties[i]->name, &a_val);
      g_object_get_property(G_OBJECT(p->b), properties[i]->name, &b_val);

      /* Now pick a type-dependent interpolation procedure...
       */
      if (properties[i]->value_type == G_TYPE_DOUBLE) {
	g_value_set_double(&self_val,
			   g_value_get_double(&a_val) * (1-alpha) +
			   g_value_get_double(&b_val) * (alpha));
      }

      else if (properties[i]->value_type == G_TYPE_BOOLEAN) {
	if (alpha < 0.5)
	  g_value_set_boolean(&self_val, g_value_get_boolean(&a_val));
	else
	  g_value_set_boolean(&self_val, g_value_get_boolean(&b_val));
      }

      else if (properties[i]->value_type == GDK_TYPE_COLOR) {
	GdkColor *color_a = g_value_get_boxed(&a_val);
	GdkColor *color_b = g_value_get_boxed(&b_val);
	GdkColor interp;
	interp.red   = color_a->red   * (1-alpha) + color_b->red   * alpha;
	interp.green = color_a->green * (1-alpha) + color_b->green * alpha;
	interp.blue  = color_a->blue  * (1-alpha) + color_b->blue  * alpha;
	g_value_set_boxed(&self_val, &interp);
      }

      else if (properties[i]->value_type == G_TYPE_UINT) {
	g_value_set_uint(&self_val,
			 g_value_get_uint(&a_val) * (1-alpha) +
			 g_value_get_uint(&a_val) * (alpha));
      }

      else {
	g_log(G_LOG_DOMAIN, G_LOG_LEVEL_WARNING,
	      "Can't interpolate values of type %s",
	      g_type_name(properties[i]->value_type));
	g_value_unset(&a_val);
	g_value_unset(&b_val);
	continue;
      }

      /* Save the interpolated value */
      g_object_set_property(G_OBJECT(self), properties[i]->name, &self_val);

      g_value_unset(&a_val);
      g_value_unset(&b_val);
      g_value_unset(&self_val);
    }
  }
  g_free(properties);
}

gchar* parameter_holder_save_string(ParameterHolder *self) {
  /* Create a new string consisting of key-value pairs, one per line,
   * listing the value of all parameters that are no longer set to
   * their default value. This string can be loaded back into
   * parameter_holder_load_string to recreate the same property values.
   */
  gchar* joined;
  gchar** lines;
  guint n_properties;
  GParamSpec** properties;
  int i, n_lines;
  GValue val, strval;

  /* Get a list of all properties, and use that to allocate an array of lines
   * large enough to handle the worst case, where each property has a non-default value
   */
  properties = g_object_class_list_properties(G_OBJECT_GET_CLASS(self), &n_properties);
  lines = g_malloc0(sizeof(lines[0]) * (n_properties+1));

  /* Search for non-default properties, creating lines for each */
  n_lines = 0;
  for (i=0; i<n_properties; i++) {

    /* We have our own GParamFlag indicating whether a parameter should be serialized */
    if (properties[i]->flags & PARAM_SERIALIZED) {

      memset(&val, 0, sizeof(val));
      g_value_init(&val, properties[i]->value_type);
      g_object_get_property(G_OBJECT(self), properties[i]->name, &val);

      if (!g_param_value_defaults(properties[i], &val)) {

	/* Yay, we have a readable and writeable non-default value. Convert it to a string */
	memset(&strval, 0, sizeof(strval));
	g_value_init(&strval, G_TYPE_STRING);
	g_value_transform(&val, &strval);
	lines[n_lines++] = g_strdup_printf("%s = %s", properties[i]->name, g_value_get_string(&strval));
	g_value_unset(&strval);

      }
      g_value_unset(&val);
    }
  }

  lines[n_lines] = NULL;
  joined = g_strjoinv("\n", lines);

  g_free(properties);
  g_strfreev(lines);

  return joined;
}

void parameter_holder_load_string(ParameterHolder *self, const gchar *params) {
  /* Load all recognized parameters from a string given in the same
   * format as the one produced by save_parameters()
   */
  gchar *copy, *line, *nextline;
  gchar *key, *value;

  /* Always start with defaults */
  parameter_holder_reset_to_defaults(self);

  /* Make a copy of the parameters, since we'll be modifying it */
  copy = g_strdup(params);

  /* Iterate over lines... */
  line = copy;
  while (line) {
    nextline = strchr(line, '\n');
    if (nextline) {
      *nextline = '\0';
      nextline++;
    }

    /* Separate it into key and value */
    key = g_malloc(strlen(line)+1);
    value = g_malloc(strlen(line)+1);
    if (sscanf(line, " %s = %s", key, value) == 2)
      parameter_holder_set(self, key, value);
    g_free(key);
    line = nextline;
  }
  g_free(copy);
}

void param_spec_set_group (GParamSpec  *pspec,
			   const gchar *group_name) {
  g_param_spec_set_qdata(pspec, g_quark_from_static_string("group-name"), (gpointer) group_name);
}

void param_spec_set_increments (GParamSpec  *pspec,
				gdouble      step,
				gdouble      page,
				int          digits) {
  ParameterIncrements *pi = g_new(ParameterIncrements, 1);
  pi->step = step;
  pi->page = page;
  pi->digits = digits;
  g_param_spec_set_qdata_full(pspec, g_quark_from_static_string("increments"), pi, g_free);
}

const gchar* param_spec_get_group (GParamSpec  *pspec) {
  return g_param_spec_get_qdata(pspec, g_quark_from_static_string("group-name"));
}

const ParameterIncrements* param_spec_get_increments (GParamSpec  *pspec) {
  return g_param_spec_get_qdata(pspec, g_quark_from_static_string("increments"));
}

/* The End */
