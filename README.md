Links tree
======================
Project created for a job application, requirements are described below.

Requeriments
----------------
As a product owner I would like to have a web crawler application that takes a given site (e.g. informador.com.mx) and lists the links contained there hierarchically; links contained in a second level page should also be included. This is to be replicated ad infinitum as long as the links i within the original domain.

Acceptance criteria
-------------------
 - List item
 - Links are listed in a tree structure
 - Webcrawler updates the page regularly while still looking for new links
 - Links listed should only be links that point to a different page than the one that it lives on (e.g. anchor links that point to a given section within the same page are to be excluded)
 - Any element that has links that point to a different page should also be included (e.g. images with links)
 - Only list links to external sites as a one shot, the crawler should not list secondary links within that external site (e.g. if a link from informador.com.mx points to espn.com list this link in the hierarchy, but don't show more links under espn.com )

Technical requirements
----------------------
 - The web crawler should be constructed using node.js
 - The output in the webpage should be a json that nests the links showing hierarchy
 - The tree for the links should contain real time data

Acceptable if the page has to be refreshed when new links are found, extra points if the refresh happens without user interaction.

Setup
-----
Clone the repository and install the dependencies.

    $ git clone https://github.com/abiee/links-tree.git
    $ cd links-tree
    $ npm install
    $ bower install
    $ gulp serve

Do not forget to install globally gulp and bower if not installed yet.

Testing
---------
You can run server tests with test:server

    $ gulp test:server

Licence
-------
Licensed under the MIT license.
