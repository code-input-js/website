# code-input-js.org layout code
This contains the layout and theme of the website, while the `docs` directory of the code-input library itself contains the content.
## Run the website
* Install [Hugo](https://gohugo.io)
* `git clone` *this* repository
* `cd` into the repository
* `npm install` or `yarn install`
* Transfer libraries to the right place: `mkdir assets/ ; mkdir assets/lib/ ; rm -rf assets/lib/* ; mv node_modules/* assets/lib/` (errors about the directory already existing are fine)
* Transfer content to the right place: `mkdir content/ ; rm -rf content/* ; mv assets/lib/@webcoder49/code-input/docs/* content/ ; rm content/README.md` (errors about the directory already existing are fine)
* Run/build normally with Hugo: `hugo server` to test
