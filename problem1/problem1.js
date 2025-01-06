// Using loop function
var sum_to_n_a = function(n) {
    var sum = 0;
    for (var i = 0; i<=n; i++){
      sum = sum + i;
    }
 };
 
 // Using recursive function
 var sum_to_n_b = function(n) {
     if (n <= 1) {
         return n; 
     }
     return n + sum_to_n_b(n - 1);
 };
 
 // Using mathematical formula
 var sum_to_n_c = function(n) {
     return (n * (n + 1)) / 2;
 };