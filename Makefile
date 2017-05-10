.PHONY: run
run:
	node app.js

.PHONY: run-dev
run-dev:
	./node_modules/.bin/nodemon app.js
