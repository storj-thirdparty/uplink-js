MODULEDIR=$(shell node scripts/module-dir.js)
GOBUNDLE=$(MODULEDIR)/go.tar.gz
GOBIN=$(MODULEDIR)/go/bin/go

# Go parameters
GOCMD=go
GOBUILD=$(GOCMD) build
GOCLEAN=$(GOCMD) clean
GOTEST=$(GOCMD) test
GOGET=$(GOCMD) get
# Uplink-c
GIT_REPO=https://github.com/storj/uplink-c
UPLINKC_NAME=uplink-c
UPLINKC_VERSION=v1.0.5
#Library Name
LIBRARY_NAME_LINUX=libuplinkc.so
LIBRARY_NAME_DARWIN=libuplinkc.dylib
LIBRARY_NAME_WIN=libuplinkc.dll
LIBRARY_UPLINK=uplink_definitions.h
DELETE_LIBRARY_HEADER=libuplinkc.h
#Color
RED_COLOR=\033[31m
GREEN_COLOR=\033[32m
RESET_COLOR=\033[0m
#
clean:
	rm -rf uplink-c;

build: uplink-c

uplink-c:
	if [ ! -d $(UPLINKC_NAME) ]; then\
		git clone -b $(UPLINKC_VERSION) $(GIT_REPO);\
	fi;
ifeq "$(shell uname)" "Darwin"
	curl $(shell node scripts/go-url.js) --output $(GOBUNDLE);\
	gunzip -c $(GOBUNDLE) | tar xopf -;\
	rm $(GOBUNDLE);\
	chmod +x $(GOBIN);\
	export PATH=$(MODULEDIR)/go/bin:$(PATH);\
	export GOROOT=$(MODULEDIR)/go;\
	mkdir -p $(MODULEDIR)/go;\
	echo go version;\
	cd $(UPLINKC_NAME);\
	$(GOCMD) build -o ../$(LIBRARY_NAME_DARWIN) -buildmode=c-shared;\
	mv $(LIBRARY_UPLINK) ../;\
	cd ../;
endif
ifeq "$(shell uname)" "Linux"
	curl $(shell node scripts/go-url.js) -o $(GOBUNDLE);\
	PWD="$(MODULEDIR)" tar xvfs $(GOBUNDLE);\
	rm $(GOBUNDLE);\
	chmod +x $(GOBIN);\
	export PATH=$(MODULEDIR)/go/bin:$(PATH);\
	export GOROOT=$(MODULEDIR)/go;\
	mkdir -p $(MODULEDIR)/go;\
	$(GOBIN) version;\
	cd $(UPLINKC_NAME);\
	$(GOBIN) build -o ../$(LIBRARY_NAME_LINUX) -buildmode=c-shared;\
	mv $(LIBRARY_UPLINK) ../;\
	cd ../;
endif
