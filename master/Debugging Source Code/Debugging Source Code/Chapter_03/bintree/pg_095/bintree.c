//  bintree.c:  routines to do insert and sorted print of a binary tree

#include <stdio.h>
#include <stdlib.h>

struct node {
   int val;             // stored value
   struct node *left;   // ptr to smaller child
   struct node *right;  // ptr to larger child
};

typedef struct node *nsp;

nsp root;

nsp makenode(int x)
{
   nsp tmp;  

   tmp = (nsp) malloc(sizeof(struct node));  
   tmp->val = x;  
   tmp->left = tmp->right = 0;
   return tmp;
}

void insert(nsp *btp, int x)
{
   nsp tmp = *btp;

   if (*btp == 0) {
      *btp = makenode(x);
      return;
   }

   while (1)
   {
      if (x < tmp->val) {

         if (tmp->left != 0) {
            tmp = tmp->left;
         } else {
            tmp->left = makenode(x);
            break;
         }

      } else {

         if (tmp->right != 0) {
            tmp = tmp->right;
         } else {
            tmp->left = makenode(x);
            break;
         }
      }

   }
}


void printtree(nsp bt)
{
   if (bt == 0) return;
   printtree(bt->left);
   printf("%d\n",bt->val);
   printtree(bt->right);
}


int main(int argc, char *argv[])
{
   root = 0;
   for (int i = 1; i < argc; i++)
      insert(&root, atoi(argv[i]));
   printtree(root);
}
