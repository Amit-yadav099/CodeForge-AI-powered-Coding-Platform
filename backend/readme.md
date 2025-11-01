<!-- frontend -->
HTML
CSS
React
Tailwind

<!-- backend -->
node
express
mongoDB
redis


<!-- we should not run the code in backend -->
beacause user may do unwell through its code to the backend
similar to the LLM, that don't call the API

solution:- 'JudgeO' (platform)->already have all the pre-built compilers or code  execution
we use it's API key to do the task.

<!-- we can use docker to do the little optimization on JudgeO -->

<!-- first we are going to build backend system -->

backend system
1. user autentication
   1. log in
   2. log out
   3. email-verify
   4. reset-password
   5. forget password


2. problems creation
3. submit problem (code submission)
4. 4 DSA porblems list


<!-- what about the schemas -->
1. user schema
  1. firstName
  2. lastName
  3. Role
  4. email
  5. password
  6. solved problems

2. problems
    problem id
 1. title
 2. test cases
 3. hiddn test cases
 4. intial code with languages
 5. real_solution
 6. output testcases
 7. hidden output test cases

 3. userSolution
 1. problem_id
 2. solution | accept | reject
