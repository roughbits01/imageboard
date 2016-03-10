#!/bin/bash

export JWT_SECRET='MY_SECRET'

nginx -c $(PWD)/nginx.config
