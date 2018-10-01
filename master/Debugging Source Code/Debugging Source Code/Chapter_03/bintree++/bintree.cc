// bintree.cc: routines to do insert and sorted print of a binary tree in C++

#include <cstdlib>
#include <iostream>
using namespace std;

class node {
	public:
		static class node *root;    // root of the entire tree
      int val;                    // stored value
      class node *left;           // ptr to smaller child
      class node *right;          // ptr to larger child
      node(int x);                // constructor, setting val = x
      static void insert(int x);  // insert x into the tree
      static void printtree(class node *nptr);  // print subtree rooted at *nptr
};

class node *node::root = 0;


node::node(int x)
{  
   val = x;  
   left = right = 0;
}
 

void node::insert(int x)
{  
   if (node::root == 0)  {
      node::root = new node(x);
      return;
   }
   class node *tmp=root;
   while (1)
   {
      if (x < tmp->val)
      {

         if (tmp->left != 0) {
            tmp = tmp->left;
         } else {
            tmp->left = new node(x);
            break;
         }

      } else {

         if (tmp->right != 0) {
            tmp = tmp->right;
         } else {
            tmp->right = new node(x);
            break;
         }

      }
   }
}


void node::printtree(class node *np)
{
   if (np == 0) return;
   node::printtree(np->left);
   cout << np->val << endl;
   node::printtree(np->right);
}


int main(int argc, char *argv[])
{
   for (int i = 1; i < argc; i++)
      node::insert(atoi(argv[i]));
   node::printtree(node::root);
}
