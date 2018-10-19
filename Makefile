VERSION=0.0.1
NAME=copernicani/web-budget-g0v

TAG=$(NAME):$(VERSION)

build:
	docker build -t $(TAG) .

