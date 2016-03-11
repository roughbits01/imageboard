#!/bin/bash

: ${JWT_SECRET:=MY_SECRET}
export JWT_SECRET

nginx -c $(PWD)/nginx.config
