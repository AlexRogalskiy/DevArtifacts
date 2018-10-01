#include <iostream>
#include <vector>

using namespace std;

void print_element(int element) 
{
  cout << element << endl;
}

int main() 
{
  vector<int> v;

  v.push_back(1);
  v.push_back(2);
  v.push_back(3);

  for_each(v.begin(), v.end(), print_element);

  return 0;
}
