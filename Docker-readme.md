# Stop Watch as Container

- **Time** is the most essential part of everyone's life and keeping track of this time is equally important.

- A **clock** helps us in our quest to utilize our time efficiently. In order to assist you to excel in this quest we are building a digital stopwatch.

- This **stopwatch** represents the time in **DD:HH:MM:SS** ```(day:hour:minute:second)``` format, making it easy to keep track of our time.

- The functionalities of **Start, Stop, Reset, Lap and Clear Lap** are accessible by a click of a button.

- To enhance the visual appearance it can be viewed in **both dark and light modes,** making it easier to access at all times, along with having a responsive website inorder to maximize the user experience.


## Steps to run Stop Watch as Container

- Clone repository
   `git clone <https://github.com/avinash201199/stopwatch.git>`

- Enter into folder
   `cd stopwatch`

- Build docker image
    `docker build -t stopwatch .`

- Run Image
    `docker run -p 8001:80 -d stopwatch`
    
- Open into browser
    `http://localhost:8001`