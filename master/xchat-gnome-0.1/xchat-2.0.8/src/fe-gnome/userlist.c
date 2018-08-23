/*
 * userlist.c - the userlist object
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

#include "userlist.h"
#include "palette.h"
#include "pixmaps.h"

static void userlist_class_init (UserlistClass *klass);
static void userlist_init       (Userlist *userlist);
static void userlist_dispose    (GObject *object);
static void userlist_finalize   (GObject *object);

typedef struct
{
  GtkListStore *liststore;
  GCompletion *completion;
	GList *completion_items;
} Store;

GType
userlist_get_type (void)
{
  static GType userlist_type = 0;
  if (!userlist_type)
  {
    static const GTypeInfo userlist_info =
    {
      sizeof (UserlistClass),
      NULL,               /* base init */
      NULL,               /* base finalize */
      (GClassInitFunc)    userlist_class_init,
      NULL,               /* class finalize */
      NULL,               /* class data */
      sizeof (Userlist),
      0,                  /* n preallocs */
      (GInstanceInitFunc) userlist_init,
    };

    userlist_type = g_type_register_static (G_TYPE_OBJECT, "Userlist", &userlist_info, 0);
  }

  return userlist_type;
}

static void
userlist_class_init (UserlistClass *klass)
{
  GObjectClass *object_class = (GObjectClass*) klass;

  object_class->dispose = userlist_dispose;
  object_class->finalize = userlist_finalize;
}

static void
userlist_init (Userlist *userlist)
{
  userlist->stores = g_hash_table_new (g_direct_hash, g_direct_equal);
}

static gboolean
destroy_store (session *session, Store *store, gpointer data)
{
  g_object_unref (store->liststore);
  g_completion_free (store->completion);
  g_free (store);
  return TRUE;
}

static void
userlist_dispose (GObject *object)
{
  Userlist *userlist = (Userlist*) object;
  g_hash_table_foreach_remove (userlist->stores, (GHRFunc) destroy_store, NULL);
}

static void
userlist_finalize (GObject *object)
{
  Userlist *userlist = (Userlist*) object;
  g_hash_table_destroy (userlist->stores);
}

Userlist*
userlist_new (void)
{
  return USERLIST (g_object_new (userlist_get_type (), NULL));
}

static Store*
create_userlist (Userlist *userlist, session *sess)
{
  Store *store = g_new (Store, 1);

  store->liststore = gtk_list_store_new (4, GDK_TYPE_PIXBUF, G_TYPE_STRING, G_TYPE_POINTER, GDK_TYPE_COLOR);
  store->completion = g_completion_new (NULL);
	store->completion_items = NULL;

  g_hash_table_insert (userlist->stores, sess, store);
  return store;
}

static GdkPixbuf*
get_user_icon (struct server *serv, struct User *user)
{
  char *pre;
  int level;

  if (!user)
    return NULL;

  switch (user->prefix[0])
  {
    case '\0': return NULL;
    case '@':  return pix_op;
    case '%':  return pix_hop;
    case '+':  return pix_voice;
  }

  /* find out how many levels above Operator this user is */
  pre = strchr (serv->nick_prefixes, '@');
  if (pre && pre != serv->nick_prefixes)
  {
    pre--;
    level = 0;
    while (1)
    {
      if (pre[0] == user->prefix[0])
      {
	switch (level)
	{
	  case 0: return pix_red;
	  case 1: return pix_purple;
	}
	break; /* 3+, no icons */
      }
      level++;
      if (pre == serv->nick_prefixes)
	break;
      pre--;
    }
  }
  return NULL;
}

void
userlist_insert (Userlist *userlist, session *sess, struct User *newuser, int row, gboolean selected)
{
  Store *store = (Store*) g_hash_table_lookup (userlist->stores, sess);
  GtkTreeIter iter;
  GdkPixbuf *icon;
	GList *item;

  if (!store)
    store = create_userlist (userlist, sess);

  icon = get_user_icon (sess->server, newuser);

  gtk_list_store_insert (store->liststore, &iter, row);
  gtk_list_store_set (store->liststore, &iter, 0, icon, 1, newuser->nick, 2, newuser, 3, newuser->away ? &colors[23] : NULL, -1);

  item = g_list_append (NULL, newuser->nick);
  g_completion_add_items (store->completion, item);
  store->completion_items = g_list_concat (store->completion_items, item);
}

static GtkTreeIter*
find_user (Store *store, struct User *user)
{
  static GtkTreeIter iter;
  struct User *row_user;
  GtkTreeModel *model = GTK_TREE_MODEL (store->liststore);

  if (gtk_tree_model_get_iter_first (model, &iter))
  {
    do
    {
      gtk_tree_model_get (model, &iter, 2, &row_user, -1);
      if (row_user == user)
	return &iter;
    } while (gtk_tree_model_iter_next (model, &iter));
  }
  return NULL;
}

gboolean
userlist_remove (Userlist *userlist, session *sess, struct User *user)
{
  Store *store = (Store*) g_hash_table_lookup (userlist->stores, sess);
  GtkTreeIter *iter;
  GList *item;

  g_return_val_if_fail (store != NULL, FALSE);

  iter = find_user (store, user);
  if (!iter)
    return FALSE;

  gtk_list_store_remove (store->liststore, iter);

  item = g_list_find_custom (store->completion_items, user->nick, (GCompareFunc) strcmp);
	store->completion_items = g_list_remove_link (store->completion_items, item);
  g_completion_remove_items (store->completion, item);
  g_list_free (item);

  return TRUE;
}

void
userlist_update (Userlist *userlist, session *sess, struct User *user)
{
  Store *store = g_hash_table_lookup (userlist->stores, sess);
  GtkTreeIter *iter;
  gchar *nick;
  GList *item;

  g_assert (store != NULL);

  iter = find_user (store, user);
  gtk_tree_model_get (GTK_TREE_MODEL (store->liststore), iter, 1, &nick, -1);

  item = g_list_find_custom (store->completion_items, nick, (GCompareFunc) strcmp);
	store->completion_items = g_list_remove_link (store->completion_items, item);
	g_completion_remove_items (store->completion, item);
	g_list_free (item);

  gtk_list_store_set (store->liststore, iter, 1, user->nick, 3, user->away ? &colors[23] : NULL, -1);

	item = g_list_append (NULL, user->nick);
  g_completion_add_items (store->completion, item);
  store->completion_items = g_list_concat (store->completion_items, item);
}

void
userlist_move (Userlist *userlist, session *sess, struct User *user, int new_row)
{
  Store *store = g_hash_table_lookup (userlist->stores, sess);
  GtkTreeIter *iter1, iter2;
  GdkPixbuf *icon;

  g_assert (store != NULL);

  iter1 = find_user (store, user);
  gtk_list_store_remove (store->liststore, iter1);

  icon = get_user_icon (sess->server, user);

  gtk_list_store_insert (store->liststore, &iter2, new_row);
  gtk_list_store_set (store->liststore, &iter2, 0, icon, 1, user->nick, 2, user, 3, user->away ? &colors[23] : NULL, -1);
}

void
userlist_clear (Userlist *userlist, session *sess)
{
  Store *store = g_hash_table_lookup (userlist->stores, sess);

  if (store == NULL)
    store = create_userlist (userlist, sess);

  g_completion_clear_items (store->completion);
  gtk_list_store_clear (store->liststore);
}

void
userlist_erase (Userlist *userlist, session *sess)
{
  Store *store = g_hash_table_lookup (userlist->stores, sess);

  g_assert (store != NULL);

  g_object_unref (store->liststore);
  g_completion_free (store->completion);
  g_free (store);
  g_hash_table_remove (userlist->stores, sess);
}

GtkListStore*
userlist_get_store (Userlist *userlist, session *sess)
{
  Store *store = g_hash_table_lookup (userlist->stores, sess);
  if (store == NULL)
    store = create_userlist (userlist, sess);
  return store->liststore;
}

GCompletion*
userlist_get_completion (Userlist *userlist, session *sess)
{
  Store *store = g_hash_table_lookup (userlist->stores, sess);
  g_assert (store != NULL);
  return store->completion;
}
