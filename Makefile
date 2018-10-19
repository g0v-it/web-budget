VERSION=0.0.1
NAME=copernicani/web-budget

TAG=$(NAME):$(VERSION)

build:
	docker build  --no-cache  -t $(TAG) .

