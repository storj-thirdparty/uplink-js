GOBUNDLE=$(PWD)/go.tar.gz
GOBIN=$(PWD)/go/bin/go
GOURL_DARWIN_AMD64=https://dl.google.com/go/go1.15.2.darwin-amd64.tar.gz

GOURL_LINUX_AMD64=
GOURL_LINUX_ARM64=https://dl.google.com/go/go1.15.2.linux-arm64.tar.gz

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
build:
	if [ ! -d $(UPLINKC_NAME) ]; then\
		git clone -b $(UPLINKC_VERSION) $(GIT_REPO);\
	fi;
ifeq "$(shell uname)" "Darwin"
	echo "text: $(shell TEXT)";\
	cd $(UPLINKC_NAME);\
	$(GOCMD) build -o ../$(LIBRARY_NAME_DARWIN) -buildmode=c-shared;\
	mv $(LIBRARY_UPLINK) ../;\
	cd ../;\
endif
ifeq "$(shell uname)" "Linux"
	curl $(shell node scripts/go-url.js) -o $(GOBUNDLE);\
	tar xvfs $(GOBUNDLE);\
	chmod +x $(GOBIN);\
	export PATH=$(PWD)/go/bin:$(PATH);\
	export GOROOT=$(PWD)/go;\
	mkdir -p $(GOROOT);\
	echo go version;\
	cd $(UPLINKC_NAME);\
	$(GOBIN) build -o ../$(LIBRARY_NAME_LINUX) -buildmode=c-shared;\
	mv $(LIBRARY_UPLINK) ../;\
	cd ../;\
endif
