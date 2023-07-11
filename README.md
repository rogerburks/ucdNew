# ucdNew

This is the official project for making a public-facing page for the new Universal Chalcidoidea Database, using Taxonworks to host and manage the data. The front end is created with Vue.js with Vite and Bootstrap.

**Setup**:
1. Have Node.js installed
2. Have Vue.js 3 installed
3. Have Vite installed
4. Make an `.env` file using Vite syntax for the API calls. The contents should look like what is below. These statements cannot contain spaces or any punctuation aside from `=` and `_`.
   
   `VITE_APP_API_TOKEN=`[your api token for the Universal Chalcidoidea Database in Taxonworks]
   `VITE_APP_PROJECT_TOKEN=adhBi59dc13U7RxbgNE5HQ`

**What stage are we at?**
I regard this as beta build. 

1. There are some changes that could certainly be made to optimize performance and maintenance.
2. Additionally, there are certainly some CSS (especially) and other changes that should be made for consistency and professional-looking code.
3. Additionally, some code should be moved to components, and some functions should be refactored, both to satisfy DRY (Don't Repeat Yourself) requirements and likely for other reasons as well.
4. New ideas are on the way for design. I would also like to add some features as we go along.
5. The countries list is suboptimal at the moment, since I am not aware of a way to query `geographical_areas` to build a proper search or autocomplete.
6. A keywords search is incoming.
